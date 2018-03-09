<template>
  <div class="reply-comment-wrap">
    <el-alert
      title="操作说明"
      type="info"
      show-icon>
      <div>
        <p>
          此表为
          <span class="red">{{$route.name=='staUserCharge'?userInfo.pseudonym:'全站'}}</span>
          的辣椒打赏统计，您可以通过相应类型进行精确搜索，更多搜索条件可以直接 <a href="javascript:0;" @click="fold?fold=false:fold=true">{{fold?'收起':'展开'}}</a> 查看
        </p>
      </div>
    </el-alert>
   
    <el-row v-show="fold" class="mbt20 fitler-search">
      <div>
        支付类型：
        <el-radio-group v-model="filterForm.rechargeType">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="110">支付宝</el-radio-button>
          <el-radio-button label="111">微信</el-radio-button>
          <el-radio-button label="112">IOS</el-radio-button>
        </el-radio-group>
      </div>
      <div>
        终&emsp;&emsp;端：
        <el-radio-group v-model="filterForm.client">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="PC">PC</el-radio-button>
          <el-radio-button label="安卓">Android</el-radio-button>
          <el-radio-button label="苹果支付">IOS</el-radio-button>
        </el-radio-group>
      </div>
      <div>
        状&emsp;&emsp;态：
        <el-radio-group v-model="filterForm.isOK">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="1">成功</el-radio-button>
          <el-radio-button label="0">失败</el-radio-button>
        </el-radio-group>
      </div>
    </el-row>
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
          <el-select v-if="$route.name=='staUserCharge'" v-model="selectType" slot="prepend" placeholder="请选择">
            <el-option label="订单号" value="orderNo"></el-option>
          </el-select>
          <el-select v-else v-model="selectType" slot="prepend" placeholder="请选择">
            <el-option label="订单号" value="orderNo"></el-option>
            <el-option label="用户名" value="userName"></el-option>
            <el-option label="用户ID" value="userId"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchReplyCom"></el-button>
        </el-input>
      </el-col>
    </el-row>
    
    <el-table
      ref="multipleTable"
      :data="chargeCommentList.list"
      border
      style="width: 100%">
      <el-table-column
        type="selection">
      </el-table-column>
      
      <el-table-column
        prop="userId"
        width="70"
        align="center"
        label="用户ID">
      </el-table-column>
  
      <el-table-column
        prop="userName"
        label="用户名">
      </el-table-column>
      
      <el-table-column
        align="center"
        width="80"
        label="类型">
        <template slot-scope="scope">
          {{scope.row.rechargeType | type}}
        </template>
      </el-table-column>
      
      <el-table-column
        prop="money"
        align="center"
        label="金额"
        width="60"
      >
      </el-table-column>
  
      <el-table-column
        prop="orderNo"
        label="订单号"
      >
      </el-table-column>
  
      <el-table-column
        width="60"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <span class="green" v-if="scope.row.isOK">成功</span>
          <span class="red" v-else>失败</span>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="client"
        width="60"
        align="center"
        label="终端">
      </el-table-column>
      
      <el-table-column
        prop="replyCommentsContent"
        width="145"
        align="center"
        label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.dateTimes |time('long')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="mbt20"
      background
      @current-change="handleCurrentChange"
      :current-page="chargeCommentList.pageNum"
      :page-size="chargeCommentList.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="chargeCommentList.total">
    </el-pagination>
  
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    data(){
      return{
        fold:false,
        filterForm:{
          rechargeType:'',
          client:'',
          isOK:''
        },
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
        chargeCommentList:{},
        keywords:'',
        selectType:'userName',
        multipleSelection:[],
        userInfo:{},
        date:''
      }
    },
    methods:{
      getChargeStatisticList(){
        this.searchForm = {};
        this.searchForm.page = this.$route.params.page;
        if(this.$route.params.uid){
          this.searchForm.userId = this.$route.params.uid
        }
        if(this.selectType && this.keywords){
          if((this.selectType==='userId') && !Number(this.keywords)){
            this.$message({message:'ID必需为数字',type:'warning'});
            return false
          }
          this.searchForm[this.selectType] = this.keywords
        }
        for(let i in this.filterForm){
          if(this.filterForm[i]!==''){
            this.searchForm[i] = this.filterForm[i]
          }
        }
        if(this.date){
          this.searchForm.startdate	 = this.date[0] + ' 00:00:00';
          this.searchForm.enddate	 = this.date[1] + ' 23:59:59'
        }
        this.$ajax("/sys-RechargeRecordStatistics",this.searchForm,res=>{
          if(res.returnCode===200){
            this.chargeCommentList = res.data
          }else if(!res.data){
            this.chargeCommentList = {}
          }
        })
      },
      searchReplyCom(){
        if(this.$route.params.page==1){
          this.getChargeStatisticList()
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
      if(this.$route.name==='staUserCharge'){
        this.date = [this.$formTime(new Date(new Date().setDate(1)),'sort'),this.$formTime(new Date(),'sort')]
      }
      this.getChargeStatisticList();
      this.getUserInfo()
    },
    watch:{
      "$route":function () {
        this.getChargeStatisticList()
      },
      "date":function (val,old) {
        if(old!==''){
          this.getChargeStatisticList()
        }
      },
      filterForm:{
        handler() {
          this.getChargeStatisticList()
        },
        deep: true
      }
    },
    filters:{
        type:function (val) {
          let text = '';
          switch (val){
            case 110:
                text = '支付宝';
                break;
            case 111:
                text = '微信';
                break;
            case 112:
                text = 'IOS';
                break;
            default:
                text = '其他'
          }
          return text;
        }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>
