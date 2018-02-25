<template>
    <div class="add-new-book-wrap">
  
      <el-breadcrumb class="mbt20" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>书籍管理</el-breadcrumb-item>
        <el-breadcrumb-item to="/book/list">书籍列表</el-breadcrumb-item>
        <el-breadcrumb-item >新建书籍</el-breadcrumb-item>
      </el-breadcrumb>
  
  
      <el-alert
        title="操作说明"
        type="info"
        show-icon>
        <div>
          新建书籍的作者必需已经存在，否则无法创建新书；书籍标签至少2个，最多不超过5个;且书籍简介不可超过字数上限
        </div>
      </el-alert>
      
      <el-form class="mbt20" ref="detailForm1" :rules="rules1" :model="bookDetail" label-width="80px">
        <el-form-item label="书籍名称" prop="bookName">
          <el-col :xs="20" :sm="16" :md="12" :lg="9" :xl="4">
            <el-input v-model="bookDetail.bookName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="作者笔名" prop="writerName">
          <el-col :xs="20" :sm="16" :md="12" :lg="9" :xl="4">
            <el-select
              v-model="selectValue"
              filterable
              remote
              :loading="reloading"
              :remote-method="remoteMethod"
              placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.pseudonym"
                :value="{id:item.userId,name:item.pseudonym}"
                >
                <span style="float: left">{{ item.pseudonym }}({{item.userId}})</span>
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="作品分类" prop="bookClassificationId">
          <el-select v-model="bookDetail.bookClassificationId" placeholder="请选择活动区域">
            <el-option v-for="(item,$index) in baseData.classificationList" :key="$index" :label="item.classificationName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
    
        <el-form-item label="书籍标签" prop="bookLabId">
          <el-checkbox-group v-model="bookDetail.bookLabId">
            <el-checkbox v-for="(item,$index) in baseData.booklablesList" :label="item.id" name="bookLabId" :key="$index">{{item.bookLableName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="发布状态" prop="bookAuthorization">
          <el-radio-group v-model="bookDetail.bookAuthorization">
            <el-radio :label="0">网站首发</el-radio>
            <el-radio :label="1">授权发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="作品简介" prop="bookIntroduction">
          <el-input type="textarea" class="book-intro" v-model="bookDetail.bookIntroduction"></el-input>
          <span class="fr">{{bookDetail.bookIntroduction.length}}/400</span>
        </el-form-item>
    
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit('detailForm1')">
            保存提交
          </el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
      data() {
        let checkBookName = (rule, value, callback) => {
          let txt = this.$http.trim(value);
          if (txt.length<1) {
            return callback(new Error('作品名称不能为空'));
          }else{
//            添加新书时校验书籍名称是否存在
            let reg = /^[a-zA-Z0-9\u4e00-\u9fa5:：]{1,20}$/;
            if(!reg.test(txt)){callback(new Error("书籍名称只能包含中文、数字、字母和冒号"));return false;}
            this.$ajax("/book-checkName",
              { bookName:txt},json=> {
                if(json.returnCode!==200){
                  callback(new Error('作品名称已存在，请重新填写'))
                }else{
                  callback()
                }
            })
          }
        };
        return {
          fullLoading:false,
          activeName:'base',
          reloading:true,
          baseData:{},
          userList:[],
          selectValue:{},
          bookDetail: {
            bookName:'',
            writerName:'',
            bookWriterId:'',
            bookClassificationId:null,
            bookLabId:[],
            bookAuthorization:null,
            bookIntroduction:''
          },
          rules1: {
            bookName: [
              { required: true,validator: checkBookName, message: '请输入书名', trigger: 'blur' },
            ],
            writerName: [
              { required: true, message: '请填写作者', trigger: 'blur' }
            ],
            bookClassificationId: [
              { required: true,type:'number', message: '请选择作品分类', trigger: 'change' }
            ],
            bookLabId: [
              { type: 'array',required: true,message: '至少选取2个标签',trigger: 'change' },
              { type: 'array',min:2,max:5,message: '请选择2-5个标签',trigger: 'change'}
            ],
            bookAuthorization: [
              { required: true,type:'number', message: '请选择发布状态', trigger: 'change' }
            ],
            bookIntroduction: [
              { required: true, message: '请填写作品简介', trigger: 'blur' },
              { min: 1, max: 400, message: '长度在 1 到 400 个字符', trigger: 'blur' }
            ]
          }
          
        }
      },
      methods: {
        onSubmit(formName) {
          this.fullLoading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let formData = JSON.parse(JSON.stringify(this.bookDetail));
          formData.bookLabId = formData.bookLabId.toString();
          formData.bookIntroduction = this.$http.trim(formData.bookIntroduction).replace(/\s*\n+\s*/g,'\n');
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$ajax("/admin/addBookInfo",formData,res=>{
                this.$nextTick(()=>{
                  this.fullLoading.close();
                });
                if(res.returnCode===200){
                  this.$confirm('创建成功, 可直接发布章节！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.$router.push({path:'/add_new_chapter/'+res.data})
                  });
                }
              });
            } else {
              this.$nextTick(()=>{
                this.fullLoading.close();
              });
              this.$message({ message:'请完善信息后提交！',type:'warning'});
            }
          });
        },
        remoteMethod(query){
          if (query !== '') {
            this.reloading = true;
            this.$ajax("/getAuthorIdByAuthorName",{key:this.$http.trim(query)},res=>{
              if(res.returnCode===200){
                this.reloading = false;
                this.userList = res.data.filter(item => {
                  return item.pseudonym.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1;
                });
              }
            });
          } else {
            this.userList = [];
          }
        },
        
        getBaseInfo(){
          this.$ajax("/book-EditBookEcho",'',res=>{
            if(res.returnCode===200){
              this.baseData = res.data;
            }
          },'get')
        },
        getBookDetail(){
          this.$ajax("/book-showBookInfo",{bookid:this.$route.params.bid},res=>{
            if(res.returnCode===200){
              res.data.bookLabId =(()=>{
                let arr = [];
                res.data.bookLabId.split(",").forEach((item)=>{
                  arr.push(parseInt(item))
                });
                return arr
              })();
              res.data.bookClassificationId = parseInt(res.data.bookClassificationId);
              this.bookDetail = res.data;
            }
          })
        }
      },
      created(){
        this.getBaseInfo()
      },
      watch:{
        "bookDetail.bookIntroduction":function (val) {
          this.bookDetail.bookIntroduction = val.replace(/\s*\n+\s*/g,'\n\n')
        },
        "selectValue":function (val) {
           if(val.name){
             this.bookDetail.writerName = val.name;
             this.bookDetail.bookWriterId = val.id;
           }
          
        }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
