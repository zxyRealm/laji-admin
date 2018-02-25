<template>
  <div class="user-detail-info">
    <el-alert
      title="操作说明"
      type="info"
      show-icon>
      <div>
        <p>
          管理员可对已上架书籍定制月报，也可以对已生成的月报重新调整
        </p>
      </div>
    </el-alert>
    <el-row class="mbt20"></el-row>
    <el-form :model="monthReport" status-icon :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="书籍名称" prop="bookName">
            <el-input v-if="$route.name==='authorEditMonReport'" readonly v-model="monthReport.bookName" class="mw220"></el-input>
            <el-select v-else v-model="bookInfo" placeholder="请选取书籍" class="mw220">
              <template v-for="item in authorBook">
                <el-option :label="item.bookName" :value="item.bookId+','+item.bookName"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="作  者" prop="authorName">
            <el-input readonly v-model.number="monthReport.authorName" class="mw220"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item
            label="打  赏"
            prop="pepper">
            <el-input v-model.number="monthReport.pepper" class="mw220"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="考  勤" prop="checkworkattendance">
            <el-input v-model.number="monthReport.checkworkattendance" class="mw220"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
  
          <el-form-item label="订  阅" prop="bubscribe">
            <el-input v-model.number="monthReport.bubscribe" class="mw220"></el-input>
          </el-form-item>
         
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="第三方" prop="thirdPart">
            <el-input v-model.number="monthReport.thirdPart" class="mw220"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
  
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="小米椒" prop="millet">
            <el-input v-model.number="monthReport.millet" class="mw220"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <!--<el-form-item label="第三方" prop="thirdPart">-->
            <!--<el-input v-model.number="monthReport.thirdPart" class="mw220"></el-input>-->
          <!--</el-form-item>-->
        </el-col>
      </el-row>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">生成</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
  export default {
    data() {
      return {
        rules: {
          bookName: [
            { require:true,message:'请选取书籍', trigger: 'blur' }
          ],
          checkworkattendance: [
            { required:true,message:'请添加考勤金额'},
            { type:'number', message:'金额必需为数字'}
          ],
          pepper: [
            { required:true,message:'请添加打赏金额'},
            { type:'number', message:'金额必需为数字'}
          ],
          bubscribe: [
            { required:true,message:'请添加订阅金额'},
            { type:'number', message:'金额必需为数字'}
          ],
          thirdPart: [
            { required:true,message:'请添加第三方金额'},
            { type:'number', message:'金额必需为数字'}
          ],
          millet: [
            { required:true,message:'请添加小米椒金额'},
            { type:'number', message:'金额必需为数字'}
          ]
        },
        bookInfo:'',
        authorBook:[],
        userInfo:{},
        monthReport:{
          bookid:'',
          bookName:'',
          checkworkattendance:'',
          pepper:'',
          bubscribe:'',
          thirdPart:'',
          millet:''
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let subData = JSON.parse(JSON.stringify(this.monthReport));
            if(this.$route.name==='authorEditMonReport'){
              this.$ajax("/admin/updateAuthorMonthlyreportByAuthormon",subData,res=>{
                if(res.returnCode===200){
                  this.$message({ message:res.msg,type:'success' });
                  this.getBookMonthly()
                }
              })
            }else {
              this.$ajax("/admin/addAuthorMonthlyreportByAuthormon",subData,res=>{
                if(res.returnCode===200){
                  this.$message({ message:'更新成功',type:'success' });
                  this.getAuthorBook()
                }
              })
            }
            
          } else {
            this.$message({message:"请核对信息是否完整",type:'warning'});
            return false;
          }
        });
      },
      getAuthorBook(){
        this.$ajax("/admin/agetAuthorBookLists",{
          authorId:this.$route.params.aid
        },res=>{
            if(res.returnCode===200){
              let list = [];
              res.data.forEach(function(item){
                  if(item.bookCheckStatus){
                      list.push(item);
                  }
              });
              this.authorBook = list
            }
        })
      },
      getUserInfo(){
        this.$ajax("/person-SimplifyUserInfo",{ puserid:this.$route.params.aid },res=>{
          if(res.returnCode===200){
            this.userInfo = res.data;
            this.$set(this.monthReport,'authorid',res.data.userId);
            this.$set(this.monthReport,'authorName',res.data.pseudonym);
          }
        })
      },
      getBookInfo(){
          this.$ajax("/book-showBookInfo",{ bookid:this.$route.params.bid },res=>{
              if(res.returnCode===200){
                this.$set(this.monthReport,"bookid",res.data.bookId);
                this.$set(this.monthReport,"bookName",res.data.bookName);
                this.$set(this.monthReport,"authorid",res.data.bookWriterId);
                this.$set(this.monthReport,"authorName",res.data.writerName);
              }
          })
      },
      getBookMonthly(){
          let time = [];
          if(this.$route.params.time){
              time = this.$route.params.time.split('-');
          }else {
              time = sessionStorage.getItem('monthly_date').split('-')
          }
          this.$ajax("/admin/getAuthorMonthlyreportById",{
             bookid:this.$route.params.bid,
             year:time[0],
             month:time[1],
             type:2
          },res=>{
              if(res.returnCode===200){
                 delete res.data.dataTime;
                 delete  res.data.subTotalCount;
                 this.monthReport = res.data
              }
          })
      }
    },
    created(){
      if(this.$route.params.time){
          sessionStorage.setItem('monthly_date',this.$route.params.time)
      }
      if(this.$route.name==='authorAddMonReport'){
        this.getUserInfo();
        this.getAuthorBook();
      }else {
        this.getBookInfo();
        this.getBookMonthly();
      }
    },
    watch:{
        bookInfo:function (val) {
          this.monthReport.bookid = val.split(",")[0];
          this.monthReport.bookName = val.split(",")[1];
        }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  p.gray
    line-height 1.5em
    color #666
</style>
