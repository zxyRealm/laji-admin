<template>
  <div class="wrapper">
    
    <el-breadcrumb class="mbt20" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>书籍管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/book/list">书籍列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="'/book_chapter_list/'+$route.params.bid">章节列表</el-breadcrumb-item>
      <el-breadcrumb-item>新建章节</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="form-wrapper">
      <el-form :model="ruleForm" :rules="rules" ref="ChapterForm" :label-width="labelWidth" labelPosition="left" class="chapter-ruleForm">
        <el-form-item label="书籍名称" prop="bookTitle">
          <el-input style="width: 260px" readonly v-model="ruleForm.bookTitle"></el-input>
        </el-form-item>
        <el-form-item label="分卷名称" prop="volumeId">
          <el-select style="width: 260px;" v-model="ruleForm.volumeId" placeholder="请选择分卷">
            <template>
              <el-option
                v-for="item in volumeList"
                :key="item.id"
                :label="item.volumeName"
                :value="item.id">
              </el-option>
              <el-option @click.native="dialogFormVisible = true" label="" value="">+新增分卷</el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="章节名称" prop="chapterTitle">
          <el-input style="width: 260px" @blur="checkChapterName($event)" v-model="ruleForm.chapterTitle"></el-input>
        </el-form-item>
        <el-form-item label="章节内容" class="contentBox" prop="chapterContent">
          <el-form-item >
            <el-input class="context" type="textarea" :rows="15"  v-model="ruleForm.chapterContent"></el-input>
          </el-form-item>
          <el-form-item prop="authorWords">
            <el-input class="authorSay-wrap" type="textarea" v-model="ruleForm.authorWords" placeholder="作者的话（不可超过100字）"></el-input>
          </el-form-item>
          <span class="words">共 {{length}} 字</span>
        </el-form-item>
        
        <el-form-item :label-width="labelWidth" label="发布时间" style="margin-top:50px" prop="releaseTime">
          <el-col :span="12">
            <el-date-picker type="datetime" :disabled="!isAutoPublish" placeholder="选择时间" v-model="ruleForm.releaseTime"></el-date-picker>
            <el-checkbox  class="ml20" label="定时发布" @change="ruleForm.releaseTime=isAutoPublish?ruleForm.releaseTime:''" v-model="isAutoPublish"></el-checkbox>
          </el-col>
          <el-col :span="12">
            <!--<el-checkbox v-model="ruleForm.whetherPublic">加入草稿箱</el-checkbox>-->
          </el-col>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="是否VIP" prop="chapterIsvip">
          <el-radio class="radio" v-model="ruleForm.chapterIsvip" :label="0">普通</el-radio>
          <el-radio class="radio" v-if="isVip===2" v-model="ruleForm.chapterIsvip" :label="1">VIP</el-radio>
        </el-form-item>
        <el-form-item :label-width="labelWidth" style="width: 820px" class="tc">
          <el-button class="fl" type="primary" @click="submitForm('create')">立即创建</el-button>
          <el-button class="fr save-draft" @click="submitForm('draft')">保存草稿</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <el-dialog
      class="alertDialog"
      @open="volumeForm.volumeName=''"
      top="45%"
      title="新增分卷"
      :visible.sync="dialogFormVisible">
      <el-form :model="volumeForm" :rules="rule" ref="volumeForm" label-position="left">
        <el-form-item label="分卷名称" prop="volumeName" :label-width="'80px'">
          <el-input v-model="volumeForm.volumeName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewVolume('volumeForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data() {
      let validateContent = (rule,value,callback) =>{
        if(this.ruleForm.chapterLength){
          if(this.ruleForm.chapterLength>20000){
            callback(new Error("总长度不可超过20000字！"))
          }else {
            callback()
          }
        }else {
          callback(new Error("请添加章节内容"))
        }
      };
      let validateVolume = (rule,value,callback) => {
        if(!value||this.$http.trim(value).length<1){
          this.volumeForm.volumeName = '';
          callback(new Error("卷名不能为空"))
        }else {
          this.$ajax("/books-getCheckVolume",{
            volumeName:value,
            bookid:this.ruleForm.bookId
          },json => {
            if (json.returnCode===200) {
              callback()
            } else {
              callback(new Error(json.msg))
            }
          });
        }
      };
      let validateCheckCn = (rule,value,callback) => {
        value = this.$http.trim(value);
        if(!value||this.$http.trim(value).length<1){
          this.ruleForm.chapterTitle = '';
          callback(new Error('请输入章节名称'))
        }else{
          this.$ajax('/chapter-checkName',{
            chapterName:value,
            bookId:this.$route.params.bid
          },json=> {
            if(json.returnCode===200){
              callback()
            }else{
              callback(new Error('章节名重复，请重新填写！'))
            }
          })
        }
      };
      return {
        loading:'',
        isPending:false, //避免网络不良时造成重复提交
        dialogSize:'tiny',
        volumeList:[],
        isAutoPublish:false,
        labelWidth:'136px',
        dialogFormVisible:false,
        isVip:0,
        volumeForm:{
          volumeName:''
        },
        ruleForm: {
          bookTitle: '',
          chapterTitle:'',
          volumeId: null,
          releaseTime: '',
          chapterContent: '',
          whetherPublic:0,
          chapterLength:0,
          chapterIsvip:0,
          authorWords:''
        },
        rule:{
          volumeName: [
            { required: true,validator:validateVolume , trigger: 'blur' }
          ]
        },
        rules: {
          chapterTitle: [
            { required: true,validator:validateCheckCn , trigger: 'blur' }
          ],
          volumeId: [
            { required: true,type:'number', message: '请选择分卷', trigger: 'change' }
          ],
          bookTitle: [
            { required: true, message: '请输入书籍名称', trigger: 'blur' }
          ],
          chapterContent: [
            { required: true,validator:validateContent,trigger:'change' }
          ]
        }
      };
    },
    methods: {
//        添加新章节
      submitForm(type) {
        this.loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$refs['ChapterForm'].validate((valid) => {
          if (valid) {
            if(type==='draft'){
              this.ruleForm.whetherPublic = 1
            }
            if(this.ruleForm.chapterIsvip){
              this.$nextTick(()=>{
                this.$loading().close();
              });
              this.$alert('', '确认设置为收费章节？', {
                confirmButtonText: '是',
                showCancelButton:true,
                customClass:'small confirm-msg-box',
                cancelButtonText:'否',
                callback: (action) => {
                  if(action==='confirm'){
                    this.loading = this.$loading({
                      lock: true,
                      text: 'Loading',
                      spinner: 'el-icon-loading',
                      background: 'rgba(0, 0, 0, 0.7)'
                    });
                    this.createChapter()
                  }
                }
              });
            }else {
              this.createChapter()
            }
          } else {
            this.$nextTick(()=>{
              this.loading.close();
            });
            this.$message({message:"请完善必填信息！",type:'warning'});
            return false;
          }
        });
      },
      createChapter(){
        //          首先获取网络时间
        let cloneData = JSON.parse(JSON.stringify(this.ruleForm));
        cloneData.chapterContent = this.$http.trim(cloneData.chapterContent).replace(/\n+\s+/g,'<H><LG>')+"<H><LG>";
        this.$ajax("/sys-getNetWorkDateTime",'',time=>{
          if(time.returnCode===200){
            if(cloneData.releaseTime){
              cloneData.releaseTime = this.$formTime(cloneData.releaseTime,"long")
            }else {
              cloneData.releaseTime = this.$formTime(time.data.beijing,'long')
            }
            this.$ajax("/admin/addAdminCreates",cloneData,json=>{
              this.$nextTick(()=>{
                this.loading.close();
              });
              if(json.returnCode===200){
                this.$confirm(cloneData.whetherPublic?"草稿保存成功":'发布成功', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  window.scrollTo(0,0);
                  this.resetForm('ChapterForm');
                  this.getChapterInfo();
                }).catch(()=>{
                  window.scrollTo(0,0);
                  this.resetForm('ChapterForm');
                  this.getChapterInfo();
                });
              }
            })
          }else {
              this.$nextTick(()=>{
                this.loading.close();
              });
          }
        },'get','json',true)
        
      },
//      新增分卷
      addNewVolume(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$ajax("/books-addvolume",{
              volumeName:this.volumeForm.volumeName,
              bookName:this.ruleForm.bookTitle,
              bookid:this.$route.params.bid
            },json => {
              if (json.returnCode === 200) {
                this.dialogFormVisible = false;
                this.$message("添加成功");
                this.getChapterInfo()
              }
            })
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
//      章节信息回显
      getChapterInfo(){
        this.$ajax("/book-showBookInfo",{
          bookid:this.$route.params.bid
        },json => {
          if(json.returnCode===200){
            this.ruleForm.bookTitle = json.data.bookName;
            this.ruleForm.bookId = json.data.bookId;
            this.ruleForm.bookWriterId = json.data.bookWriterId;
            
            this.isVip = json.data.bookCheckStatus;
            this.$ajax("/books-getvolume",{bookId:this.$route.params.bid},json => {
              if(json.returnCode===200){
                this.volumeList = json.data;
              }
            });
          }
        })
      },
      //      校验章节名是否重复
      checkChapterName(event){
        if(event.target.value.length>0){
        }
      }
    },
    created (){
      let windowWidth = document.body.clientWidth;
      if(windowWidth<1020){
        this.dialogSize = 'small'
      }else{
        this.dialogSize = 'tiny'
      }
      this.getChapterInfo()
    },
    watch:{
      "ruleForm.chapterContent":function (val) {
        this.ruleForm.chapterContent = val.replace(/^\s*\n+\s*/,'').replace(/\s*\n+\s*/g,'\n\n　　');
      },
      "ruleForm.authorWords":function (val) {
        if (this.$http.trim(val).length > 100) {
          val = val.substr(0,100);
        }
        this.ruleForm.authorWords = val.replace(/^\s*\n+\s*/,'').replace(/\s*\n+\s*/g,'\n\n　　');
      }
    },
    computed:{
      'length':function () {
        let  sLen = 0;
        let str = this.ruleForm.chapterContent;
        try{
          //先将回车换行符做特殊处理
          str = str.replace(/(\r\n+|\s+| )+/g,"龘");
          //处理英文字符数字，连续字母、数字、英文符号视为一个单词
//          str = str.replace(/[\x00-\xff]/g,"m");
          //合并字符m，连续字母、数字、英文符号视为一个单词
//          str = str.replace(/m+/g,"*");
          //去掉回车换行符
          str = str.replace(/龘+/g,"");
          //返回字数
          sLen += str.length;
        }catch(e){
          console.log(e)
        }
        this.ruleForm.chapterLength = sLen;
        if(sLen>20000){
          this.$message({message:"字数长度不可超过20000！",type:'error'})
        }
        return sLen
      }
    },
    mounted(){
      window.onresize = () => {
        let width = document.body.clientWidth;
        if(width<1020){
          this.dialogSize = 'small'
        }else {
          this.dialogSize = 'tiny'
        }
      }
    }
  }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

</style>
