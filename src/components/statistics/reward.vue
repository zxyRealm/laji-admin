<template>
  <div class="reply-comment-wrap">
    <el-alert
      title="操作说明"
      type="info"
      show-icon>
      <div>
        <p>
          此表为
          <span class="red">{{$route.name=='staUserReward'?userInfo.pseudonym:'全站'}}</span>
          的辣椒打赏统计，您可以通过相应类型进行精确搜索
        </p>
      </div>
    </el-alert>
    <el-row class="mbt20">
      <el-col>
        <el-date-picker
          v-model="date"
          type="daterange"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
    </el-row>
    
    <el-row class="mbt20">
      <el-col :xs="20" :sm="16" :md="12" :lg="9" :xl="6">
        <el-input placeholder="请输入内容" v-model="keywords" class="input-with-select" @keyup.enter.native="searchReplyCom">
          <el-select v-if="$route.name=='staUserReward'" v-model="selectType" slot="prepend" placeholder="请选择">
            <el-option label="书  名" value="bookName"></el-option>
            <el-option label="书籍ID" value="bookid"></el-option>
          </el-select>
          <el-select v-else v-model="selectType" slot="prepend" placeholder="请选择">
            <el-option label="书  名" value="bookName"></el-option>
            <el-option label="用户名" value="userName"></el-option>
            <el-option label="用户ID" value="userId"></el-option>
            <el-option label="书籍ID" value="bookid"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchReplyCom"></el-button>
        </el-input>
      </el-col>
    </el-row>
    
    <el-table
      ref="multipleTable"
      :data="rewardCommentList.list"
      border
      style="width: 100%">
      <el-table-column
        type="selection">
      </el-table-column>
      
      <el-table-column
        prop="bookid"
        width="70"
        align="center"
        label="书籍ID">
      </el-table-column>
  
      <el-table-column
        prop="bookName"
        label="书名">
      </el-table-column>
      
      
      
      <el-table-column
        prop="userId"
        
        label="用户ID">
      </el-table-column>
      
      <el-table-column
        prop="spicyiTicketCount"
        width="70"
        align="center"
        label="辣椒"
      >
      </el-table-column>
      
      <el-table-column
        prop="replyCommentsContent"
        label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.giveDateTime|time('long')}}</span>
        </template>
      </el-table-column>
      
    </el-table>
    
    <el-pagination
      class="mbt20"
      background
      @current-change="handleCurrentChange"
      :current-page="rewardCommentList.pageNum"
      :page-size="rewardCommentList.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="rewardCommentList.total">
    </el-pagination>
  
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    data(){
      return{
        searchForm:{
        },
        defaultValue:null,
        pickerOptions:{
          shortcuts: [{
            text: '本月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setDate(1);
              picker.$emit('pick', [start,end]);
            }
          }],
          disabledDate(time){
            return time.getTime() > Date.now()
          }
        },
        rewardCommentList:{},
        keywords:'',
        selectType:'bookName',
        multipleSelection:[],
        userInfo:{},
        date:''
      }
    },
    methods:{
      getRewardStatisticList(){
        this.searchForm = {};
        this.searchForm.page = this.$route.params.page;
        if(this.$route.params.uid){
            this.searchForm.userId = this.$route.params.uid
        }
        if(this.selectType && this.keywords){
          if((this.selectType==='bookId' || this.selectType==='userId') && !Number(this.keywords)){
            this.$message({message:'ID必需为数字',type:'warning'});
            return false
          }
          this.searchForm[this.selectType] = this.keywords
        }
        if(this.date){
          this.searchForm.startdate	 = this.date[0] + ' 00:00:00';
          this.searchForm.enddate	 = this.date[1] + ' 23:59:59'
        }
        this.$ajax("/admin/getAdminSpicyirewardticketList",this.searchForm,res=>{
          if(res.returnCode===200){
            this.rewardCommentList = res.data
          }else if(!res.data){
            this.rewardCommentList = {}
          }
        })
      },
      searchReplyCom(){
        if(this.$route.params.page==1){
          this.getRewardStatisticList()
        }else {
          this.$router.push({params:{page:1}})
        }
      },
      handleCurrentChange(page){
        this.$router.push({params:{page:page}})
      },
      getUserInfo(){
          if(this.$route.params.uid){
            this.$ajax("/person-SimplifyUserInfo",{puserid:this.$route.params.uid},res=>{
                if(res.returnCode===200){
                    this.userInfo = res.data
                }
            })
          }
      }
    },
    created(){
      if(this.$route.name==='staUserReward'){
        this.date = [this.$formTime(new Date(new Date().setDate(1)),'sort'),this.$formTime(new Date(),'sort')]
      }
      this.getRewardStatisticList();
      this.getUserInfo()
    },
    watch:{
      "$route":function () {
        this.getRewardStatisticList()
      },
      "date":function (val,old) {
          if(old!==''){
            this.getRewardStatisticList()
          }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
