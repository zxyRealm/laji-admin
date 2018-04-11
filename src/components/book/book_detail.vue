<template>
    <div class="book-detail-wrap">
  
      <el-breadcrumb class="mbt20" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>书籍管理</el-breadcrumb-item>
        <el-breadcrumb-item to="/book/list">书籍列表</el-breadcrumb-item>
        <el-breadcrumb-item >书籍详情</el-breadcrumb-item>
      </el-breadcrumb>
      <el-alert
        title="操作说明"
        type="info"
        class="mbt20"
        show-icon>
        <div>
          <p>
            新建书籍的作者必需已经存在，否则无法创建新书；书籍标签至少2个，最多不超过5个；且书籍简介不可超过字数上限
          </p>
          <p>
            未创建过章节的书籍暂无扩展信息，
          </p>
        </div>
      </el-alert>
      
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane name="base" label="基本信息">
          <el-form ref="detailForm1" :rules="rules1" :model="bookDetail" label-width="80px">
            <el-form-item label="书籍名称" prop="bookName">
              <el-input readonly v-model="bookDetail.bookName" class="mw320"></el-input>
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
            <el-row :gutter="40">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="千字单价" prop="bookPrice">
                  <el-input v-model="bookDetail.bookPrice" class="mw220"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="创建时间" prop="bookCreatedTime">
                  <el-date-picker
                    v-model="bookDetail.bookCreatedTime"
                    type="datetime"
                    readonly
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
      
                </el-form-item>
              </el-col>
            </el-row>
  
            <el-row :gutter="40">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="最新更新" prop="lastUpdateTime">
                  <el-date-picker
                    v-model="bookDetail.lastUpdateTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
    
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="上架时间" prop="topFrameTime">
                  <el-date-picker
                    v-model="bookDetail.topFrameTime"
                    type="datetime"
                    readonly
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
  
            <el-row :gutter="40">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="签约时间" prop="signTime">
                  <el-date-picker
                    v-model="bookDetail.signTime"
                    type="datetime"
                    readonly
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
    
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="字母索引" prop="initials">
                  <el-input v-model="bookDetail.initials" class="mw220"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="发布状态" prop="bookAuthorization">
              <el-radio-group v-model="bookDetail.bookAuthorization">
                <el-radio :label="0">网站首发</el-radio>
                <el-radio :label="3">授权发布</el-radio>
                <el-radio :label="2">首发签约</el-radio>
                <el-radio :label="1">授权签约</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="作品简介" prop="bookIntroduction">
              <el-input type="textarea" class="book-intro" v-model="bookDetail.bookIntroduction"></el-input>
              <p><span class="fr">字数{{bookDetail.bookIntroduction.length}}/400</span></p>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('detailForm1')">保存提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="extend" v-if="bookData" label="扩展信息">
          <el-form ref="detailForm2" :rules="rules2" :model="bookDetail" label-width="80px">
            <el-row :gutter="40">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="金椒" prop="goldenTicket">
                  <el-input v-model="bookData.goldenTicket" class="mw220"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="总收藏" prop="bookCollection">
                  <el-input v-model="bookData.bookCollection" class="mw220"></el-input>
      
                </el-form-item>
              </el-col>
            </el-row>
  
            <el-row :gutter="40">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="打赏" prop="areward">
                  <el-input v-model="bookData.areward" class="mw220"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="总点击" prop="bookClickCount">
                  <el-input v-model="bookData.bookClickCount" class="mw220"></el-input>
                </el-form-item>
              </el-col>
             
            </el-row>
            
            <el-row :gutter="40">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="小米椒" prop="bookRecommend">
                  <el-input v-model="bookData.bookRecommend" class="mw220"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="月点击" prop="monthChick">
                  <el-input v-model="bookData.monthChick" class="mw220"></el-input>
                </el-form-item>
              </el-col>
            
            </el-row>
            
            <el-row :gutter="40">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="订阅" prop="shareds">
                  <el-input v-model="bookData.shareds" class="mw220"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="周点击" prop="weekChick">
                  <el-input v-model="bookData.weekChick" class="mw220"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="40">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="第三方" prop="threePartyIncome">
                  <el-input v-model="bookData.threePartyIncome" class="mw220"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="分享次数" prop="shareds">
                  <el-input v-model="bookData.shareds" class="mw220"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="40">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="月报" prop="monthlyAttendance">
                  <el-input v-model="bookData.monthlyAttendance" class="mw220"></el-input>
                </el-form-item>
              </el-col>
  
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="回访次数" prop="bookVisit">
                  <el-input v-model="bookData.bookVisit" class="mw220"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
  
            <el-row :gutter="40">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="评分" prop="bookIntegrals">
                  <el-input v-model="bookData.bookIntegrals" class="mw220"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="吐槽次数" prop="tucaoIndex">
                  <el-input v-model="bookData.tucaoIndex" class="mw220"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
  
            <el-row :gutter="40">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="订阅" prop="shareds">
                  <el-input v-model="bookData.shareds" class="mw220"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="评分次数" prop="integralnum">
                  <el-input v-model="bookData.integralnum" class="mw220"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
  
            <el-form-item>
              <el-button type="primary" @click="onSubmit('detailForm2')">保存提交</el-button>
            </el-form-item>
            
          </el-form>
          
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
      data() {
        return {
          activeName:'base',
          baseData:{},
          DataChange:false,
          bookDetail: {
            bookName:'',
            bookClassificationId:null,
            bookLabId:null,
            bookAuthorization:null,
            bookIntroduction:''
          },
          bookData:{},
          rules1: {
            bookName: [
              { required: true, message: '请输入活动名称', trigger: 'blur' },
              { min: 1, max: 20, message: '长度在 20 个字符以内', trigger: 'blur' }
            ],
            bookClassificationId: [
              { required: true,type:'number', message: '请选择作品分类', trigger: 'change' }
            ],
            bookLabId: [
              { type: 'array',required: true,trigger: 'change' },
              { type: 'array',min:2,max:5,message: '请选择2-5个标签',trigger: 'change'}
            ],
            bookAuthorization: [
              { required: true,type:'number', message: '请选择发布状态', trigger: 'change' }
            ],
            bookIntroduction: [
              { required: true, message: '作品简介', trigger: 'blur' },
              { min: 10, max: 400, message: '长度在 10 到 400 个字符', trigger: 'blur' }
            ]
          },
          rules2: {
            bookName: [
              { required: true, message: '请输入活动名称', trigger: 'blur' },
              { min: 1, max: 20, message: '长度在 20 个字符以内', trigger: 'blur' }
            ],
            bookClassificationId: [
              { required: true,type:'number', message: '请选择作品分类', trigger: 'change' }
            ],
            bookLabId: [
              { type: 'array',required: true,trigger: 'change' },
              { type: 'array',min:2,max:5,message: '请选择2-5个标签',trigger: 'change'}
            ],
            bookAuthorization: [
              { required: true,type:'number', message: '请选择发布状态', trigger: 'change' }
            ],
            bookIntroduction: [
              { required: true, message: '作品简介', trigger: 'blur' },
              { min: 1, max: 400, message: '长度在 1 到 400 个字符', trigger: 'blur' }
            ]
          }
        }
      },
      methods: {
        onSubmit(formName) {
          let formData = JSON.parse(JSON.stringify(this.bookDetail));
          formData.bookLabId = formData.bookLabId.toString();
          formData.bookIntroduction = this.$http.trim(formData.bookIntroduction).replace(/\s*\n+\s*/g,'\n');
          if(!formData.signTime){
              delete formData.signTime
          }
          if(!formData.topFrameTime){
            delete formData.topFrameTime
          }
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$myLoad();
              this.$ajax("/admin/sysbookupdate",formData,res=>{
                this.$loading().close();
                if(res.returnCode===200){
                    if(this.bookData && this.DataChange){
                      this.$ajax("/admin/updateBookData",this.bookData,res=>{
                        
                        if(res.returnCode===200){
                          this.$message({message:'修改成功',type:'success'});
                          this.getBaseInfo()
                        }
                      });
                    }else {
                      this.$message({message:"修改成功",type:'success'});
                    }
                }
              });
            } else {
              this.$message({message:"请完善表单信息！",type:'warning'});
              return false;
            }
          });
//
        },
        getBaseInfo(){
          this.$ajax("/book-EditBookEcho",'',res=>{
            if(res.returnCode===200){
              this.baseData = res.data;
              this.getBookDetail()
            }
          },'get');
          
        },
        getBookDetail(){
          this.$ajax("/book-showBookInfo",{bookid:this.$route.params.bid},res=>{
            if(res.returnCode===200){
              delete res.data.booklableList;
              delete res.data.bookImage;
              res.data.bookLabId =(()=>{
                  let arr = [];
                  res.data.bookLabId.split(",").forEach((item)=>{
                      arr.push(parseInt(item))
                  });
                return arr
              })();
              res.data.lastUpdateTime = this.$formTime(res.data.lastUpdateTime,'long');
              res.data.bookCreatedTime = this.$formTime(res.data.bookCreatedTime,'long');
              if(res.data.topFrameTime){
                res.data.topFrameTime = this.$formTime(res.data.topFrameTime,'long');
              }
              if(res.data.signTime){
                res.data.signTime = this.$formTime(res.data.signTime,'long');
              }
              res.data.bookClassificationId = parseInt(res.data.bookClassificationId);
              this.bookDetail = res.data;
            }
          });
          this.$ajax("/admin/getBookDataView",{bookid:this.$route.params.bid},res=>{
            this.bookData = res.data;
           
          },'post','json')
        }
      },
      created(){
        this.getBaseInfo()
      },
      watch:{
        "bookDetail.bookIntroduction":function (val) {
           this.bookDetail.bookIntroduction = val.replace(/\s*\n+\s*/g,'\n\n')
        },
        "bookData":function (val) {
          this.DataChange = true
        }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
