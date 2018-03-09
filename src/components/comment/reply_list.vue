<template>
  <div class="reply-comment-wrap">
    <el-alert
      title="操作说明"
      type="info"
      show-icon>
      <div>
        <p>
          此表为本站全部书籍书评回复，您可以通过相应评论ID来批量管理；通过内容可以模糊搜索，其他类型均为精确搜索
        </p>
      </div>
    </el-alert>
    <el-row class="mbt20">
      <el-button type="danger" v-if="$store.state.userInfo && $store.state.userInfo.adminRolemenuanduserrole.deletes" plain @click="toggleSelection()">批量删除</el-button>
    </el-row>
    
    <el-row class="mbt20">
      <el-col :xs="20" :sm="16" :md="12" :lg="9" :xl="6">
        <el-input placeholder="请输入内容" v-model="keywords" class="input-with-select" @keyup.enter.native="searchReplyCom">
          <el-select v-model="selectType" slot="prepend" placeholder="请选择">
            <el-option label="内  容" value="replyCommentsContent"></el-option>
            <el-option label="书  名" value="bookName"></el-option>
            <el-option label="昵  称" value="userName"></el-option>
            <el-option label="书籍ID" value="bookId"></el-option>
            <el-option label="用户ID" value="userId"></el-option>
            <el-option label="评论ID" value="commentId"></el-option>
            <el-option label="用户IP" value="userAddressIP"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchReplyCom"></el-button>
        </el-input>
      </el-col>
    </el-row>
    
    <el-table
       ref="multipleTable"
      :data="replyCommentList.list"
      border
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="id"
        width="80"
        align="center"
        label="ID"
        >
      </el-table-column>
      
      <el-table-column
        prop="bookName"
        label="书名">
      </el-table-column>
      
      <el-table-column
        prop="bookid"
        width="80"
        align="center"
        label="书籍ID">
      </el-table-column>
      
      <el-table-column
        prop="commentId"
        width="80"
        align="center"
        label="父评论ID">
      </el-table-column>
      
      <el-table-column
        prop="userName"
        label="用户昵称"
        >
      </el-table-column>
      
      <el-table-column
        prop="replyCommentsContent"
        minWidth="240"
        label="内容">
      </el-table-column>
      
      <el-table-column
        label="更多"
        type="expand">
        <template slot-scope="props">
          <el-form label-position="right" labelWidth="110px" inline class="demo-table-expand">
            <el-form-item label="父评论用户ID：">
              <span>{{ props.row.puserId }}</span>
            </el-form-item>
            
            <el-form-item label="时间：">
              <span>{{ props.row.commentDateTime | time('long') }}</span>
            </el-form-item>
            
            <el-form-item label="评论用户ID：">
              <span>{{ props.row.userId }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    
    </el-table>
    
    <el-pagination
      class="mbt20"
      background
      @current-change="handleCurrentChange"
      :current-page="replyCommentList.pageNum"
      :page-size="replyCommentList.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="replyCommentList.total">
    </el-pagination>
  
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    data(){
      return{
        searchForm:{
        
        },
        replyCommentList:{},
        keywords:'',
        selectType:'',
        multipleSelection:[]
      }
    },
    methods:{
      getReplyCommentList(){
        this.searchForm = {};
        this.searchForm.page = this.$route.params.page;
        if(this.selectType){
          if((this.selectType==='bookId' || this.selectType==='userId' || this.selectType==='commentId') && !Number(this.keywords)){
            this.$message({message:'ID必需为数字',type:'warning'});
            return false
          }
          this.searchForm[this.selectType] = this.keywords
        }
        this.$ajax("/admin/bookCommentReplyList",this.searchForm,res=>{
          if(res.returnCode===200){
            this.replyCommentList = res.data
          }else if(!res.data){
            this.replyCommentList = {}
          }
        })
      },
      searchReplyCom(){
        if(this.$route.params.page==1){
          this.getReplyCommentList()
        }else {
          this.$router.push({params:{page:1}})
        }
      },
      handleCurrentChange(page){
        this.$router.push({params:{page:page}})
      },
      
      handleRowClick(row){
        this.$refs.multipleTable.toggleRowSelection(row);
      },
//          批量处理
      toggleSelection(dType,item){
        let idList = [];
        let delData = ()=>{
          let code = 0,tip;
          if(dType==='book'){
            code = 2;
            tip = '此操作将永久删除书籍<span class="red">'+item.bookName+'</span>的全部书评回复, 是否继续?';
          }else if(dType==='user'){
            code = 4;
            tip = '此操作将永久删除用户<span class="red">'+item.userName+'</span>的全部书评回复, 是否继续?';
          }else {
            tip = '此操作将永久删除'+idList.length+'条书评回复, 是否继续?';
            if(idList.length>1){
              code = 1
            }else {
              code = 0
            }
          }
          this.$confirm(tip , '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString:true,
            type: 'warning'
          }).then(() => {
            this.$ajax("/comm-deletereplyInfo",{
              commentid:idList.toString(),
              type:code
            },res=>{
              if(res.returnCode===200){
                this.$message({message:'删除成功',type:'success'});
                this.getReplyCommentList()
              }
            })
          })
      
      
        };
    
        if(item){
          if(dType==='book'){
            idList.push(item.bookid)
          }else {
            idList.push(item.userId)
          }
        }else if(this.multipleSelection.length){
          this.multipleSelection.forEach((item)=>{
            idList.push(item.id)
          });
        }else {
          this.$message({message:'请选取要删除的内容',type:'warning'});
          return false
        }
        delData()
      },
      handleSelectionChange(val){
        this.multipleSelection = val
      }
      
    },
    created(){
      this.getReplyCommentList()
    },
    watch:{
      "$route":function (val) {
        this.getReplyCommentList()
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
