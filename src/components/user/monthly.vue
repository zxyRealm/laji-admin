<template>
  <div class="reply-comment-wrap">
    <el-alert
      title=""
      type="info"
      show-icon>
      <div>
        <p>
          此表为
          <span class="red">{{$route.params.aid?userInfo.pseudonym:'全站'}}</span>
          的月报列表，您可以通过相应类型进行精确搜索
          <span v-if="$route.params.aid">,您也可以直接<router-link :to="'/author/add_monthly/'+userInfo.userId">添加月报</router-link></span>
        </p>
        <p>
          <span class="red">说明：</span>每月15号后台会自动生成上一个月的月报，如果出现异常管理员可以进行手动生成；月报会根据最新上传的excel表格里的书单进行生成，请及时更新模板及时更新excel表单
        </p>
        <p>
          <span class="red">ps：</span>发布时间是指全站可以让作者查看最新月报的时间
        </p>
      </div>
    </el-alert>
    <el-row v-if="isAuthor" class="mbt20">
      发布时间：
      <el-date-picker
        placeholder="选择月"
        type="month"
        value-format="yyyy-MM"
        v-model="setTime"
        style="width: 140px"
        class="input-with-select"
      >
      </el-date-picker>
      <el-button @click="setPublishTime">更新</el-button>
      <el-button v-if="isAuthor" class="fr" size="medium" @click="oneKeyMonthly">一键月报</el-button>
      <el-button v-if="isAuthor" class="fr" size="medium" @click="delMoak">删除测试</el-button>
    </el-row>
    <el-row class="mbt20">
      <el-date-picker
        style="width: 120px"
        class="fl"
        v-model="date"
        type="month"
        value-format="yyyy-MM"
        placeholder="选择月">
      </el-date-picker>
      <el-col v-if="isAuthor" :xs="20" :sm="16" :md="12" :lg="9" :xl="6">
        <el-input placeholder="请输入内容" v-model="keywords" class="input-with-select" @keyup.enter.native="searchReplyCom">
          <el-select v-if="$route.name=='authorMonReport'" v-model="selectType" slot="prepend" placeholder="请选择">
            <el-option label="书  名" value="bookName"></el-option>
            <el-option label="书籍ID" value="bookid"></el-option>
          </el-select>
          <el-select v-else v-model="selectType" slot="prepend" placeholder="请选择">
            <el-option label="书  名" value="bookName"></el-option>
            <el-option label="作者名" value="authorName"></el-option>
            <el-option label="作者ID" value="authorid"></el-option>
            <el-option label="书籍ID" value="bookid"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchReplyCom"></el-button>
        </el-input>
      </el-col>
      <el-upload
        v-if="isAuthor"
        style="display: inline-block"
        class="upload-demo fr"
        :show-file-list="false"
        :on-progress="excelProgress"
        :on-success="progressEnd"
        :on-error="progressEnd"
        action="/api/uploadExcel">
        <el-button size="medium" type="primary">上传</el-button>
      </el-upload>
    </el-row>
    
    <el-table
      ref="multipleTable"
      :data="reportCommentList.list"
      border
      style="width: 100%">
      <el-table-column
        type="selection">
      </el-table-column>
      
      <el-table-column
        prop="bookid"
        label="书籍ID">
      </el-table-column>
      
      <el-table-column
        prop="bookName"
        label="书名">
      </el-table-column>
  
      <el-table-column
        prop="bookName"
        label="作者">
        <template slot-scope="scope">
          {{scope.row.authorName}}(id:{{scope.row.authorid}})
        </template>
      </el-table-column>
      
      <el-table-column
        prop="thirdPart"
        label="第三方">
      </el-table-column>
  
      <el-table-column
        prop="checkworkattendance"
        label="考勤">
      </el-table-column>
      
      <el-table-column
        prop="bubscribe"
        label="订阅">
      </el-table-column>
  
      <el-table-column
        prop="pepper"
        label="打赏">
      </el-table-column>
      
      <el-table-column
        prop="millet"
        label="小米椒"
      >
      </el-table-column>
      
      <el-table-column
        v-if="isAuthor"
        prop="replyCommentsContent"
        label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.dataTime|time('sort')}}</span>
        </template>
      </el-table-column>
  
      <el-table-column
        v-if="isAuthor"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <a href="javascript:0;" @click="editMonthly(scope.row)">编辑</a>
        </template>
      </el-table-column>
      
    </el-table>
    <el-pagination
      class="mbt20"
      background
      v-show="reportCommentList.total>reportCommentList.pageSize"
      @current-change="handleCurrentChange"
      :current-page="reportCommentList.pageNum"
      :page-size="reportCommentList.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="reportCommentList.total">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    data(){
      return{
        dialogVisible:false,
        searchForm:{
        },
        defaultValue:null,
        pickerOptions:{
          disabledDate(time){
            return time.getTime() > Date.now()
          }
        },
        reportCommentList:{},
        keywords:'',
        selectType:'bookName',
        multipleSelection:[],
        userInfo:{},
        date:'',
        setTime:''
      }
    },
    methods:{
      getReportStatisticList(){
        let url = '/admin/getAuthorMonthlyreportAdminList'
        this.searchForm = {};
        this.searchForm.page = this.$route.params.page;
        if(this.$route.params.aid){
          this.searchForm.authorid = this.$route.params.aid
        }
        if(this.selectType && this.keywords){
          if((this.selectType==='bookId' || this.selectType==='userId') && !Number(this.keywords)){
            this.$message({message:'ID必需为数字',type:'warning'});
            return false
          }
          this.searchForm[this.selectType] = this.keywords
        }
        if(this.date){
          this.searchForm.year = this.date.split("-")[0];
          this.searchForm.month = this.date.split("-")[1];
        }
        if(this.$route.name==='authorMonReport'){
            url = '/admin/getAuthorMonthlyreportByAuthormon'
        }
        this.$ajax(url,this.searchForm,res=>{
          if(res.returnCode===200){
            if(this.$route.name==='authorMonReport'){
                this.$set(this.reportCommentList,'list',[res.data])
            } else {
                this.reportCommentList = res.data
            }
          }else if(!res.data){
            this.reportCommentList = {}
          }
        })
      },
      searchReplyCom(){
        if(Number(this.$route.params.page)===1){
          this.getReportStatisticList()
        }else {
          this.$router.push({params:{page:1}})
        }
      },
      handleCurrentChange(page){
        this.$router.push({params:{page:page}})
      },
      getUserInfo(){
        if(this.$route.params.aid){
          this.$ajax("/person-SimplifyUserInfo",{ puserid:this.$route.params.aid },res=>{
            if(res.returnCode===200){
              this.userInfo = res.data
            }
          })
        }
      },
      excelProgress(res){
          this.$myLoad('正在上传中...');
      },
      progressEnd(callback,file){
          if(callback.returnCode===200){
              this.$message({ message:callback.msg ,type:'success' })
          }
          this.$loading().close();
      },
      getPublishTime(){
          this.$ajax('/sys-getDataPosition','',res=>{
              if(res.returnCode===200){
                  this.date = res.data;
                  this.setTime = res.data;
                  this.getReportStatisticList();
              }
          },'get')
      },
      setPublishTime(){
          if(this.setTime){
            this.$ajax("/sys-setDataPosition",{date:this.setTime},res=>{
              if(res.returnCode===200){
                this.$message({message:res.msg,type:'success'});
                this.getPublishTime()
              }
            },'get')
          }else {
              this.$message({message:"请选取月份",type:'warning'})
          }
        
      },
      oneKeyMonthly(){
          if(this.date){
            let date = this.date.split('-');
            let endtime = this.date + '-' + new Date(date[0],date[1],0).getDate() + ' 23:59:59';
            let starttime = this.date + '-' + '01 00:00:00';
            this.$ajax("/generateMonthlyreport",{
              startdate:starttime,
              enddate:endtime
            },res=>{
              if(res.returnCode===200){
                this.$message({ message:res.msg,type:'success'});
                this.getReportStatisticList();
              }
            },'get')
          }else {
              this.$message({message:'请选取时间',type:'warning'})
          }
         
      },
      editMonthly(row){
          if(this.date){
              this.$router.push({ name:'authorEditMonReport',params:{ bid:row.bookid ,time:this.date }})
          }else {
              this.$message({ message:'请选取时间',type:'warning'})
          }
      },
//      删除月报测试数据
      delMoak(){
          this.$ajax("/deleteYueBao",'',res=>{
            this.getReportStatisticList();
            this.$message(res.msg)
          },'get')
      },
      
    },
    created(){
      this.getPublishTime();
      this.getUserInfo()
    },
    watch:{
      "$route":function () {
        this.getReportStatisticList()
      },
      "date":function (val,old) {
        if(old!==''){
          this.getReportStatisticList()
        }
      }
    },
    computed:{
      isAuthor:function () {
        return this.$route.name!=='authorMonReport'
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
