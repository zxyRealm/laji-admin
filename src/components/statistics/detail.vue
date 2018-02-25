<template>
  <div class="admin-book-wrap">
    <el-alert
      title="操作说明"
      type="info"
      show-icon>
      <div>
        <p>
          此表为本站全部书籍列表，您可以通过相应书籍ID来批量管理，也可以通过
          <router-link class="red" :to="{name:'addNewBook'}">新建书籍</router-link>来添加新书
        </p>
      </div>
    </el-alert>
   
    <el-row class="mbt20">
      <el-col :xs="20" :sm="16" :md="12" :lg="9" :xl="6">
        <el-input placeholder="请输入内容" v-model="keywords" class="input-with-select" @keyup.enter.native="searchBook">
          <el-select v-model="selectType" slot="prepend" placeholder="请选择">
            <el-option label="书  名" value="bookName"></el-option>
            <el-option label="作 者" value="writerName"></el-option>
            <el-option label="书籍ID" value="bookId"></el-option>
            <el-option label="作者ID" value="bookWriterId"></el-option>
            <el-option label="手机号" value="userPhone"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchBook"></el-button>
        </el-input>
      </el-col>
    </el-row>
    
    <el-row>
      <el-table
        ref="multipleTable"
        :data="bookList.list"
        border
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          aligin="center">
        </el-table-column>
        <el-table-column
          align="center"
          prop="bookId"
          label="ID">
        </el-table-column>
        
        <el-table-column
          prop="bookName"
          label="书名">
        </el-table-column>
        
        <el-table-column
          prop="writerName"
          label="作者">
        </el-table-column>
        
        <el-table-column
          align="center"
          prop="bookStatus"
          label="连载">
          <template slot-scope="scope">
            <span class="el-dropdown-link" :class="!scope.row.bookStatus?'success':'primary'">
              {{!scope.row.bookStatus?'连载中':'已完结'}}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column
          align="center"
          prop="bookCheckStatus"
          label="审核">
          <template slot-scope="scope">
            <span class="el-dropdown-link" :class="scope.row.bookCheckStatus?'success':'primary'">
              {{scope.row.bookCheckStatus?"已审核":"未审核"}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="bookStatus"
          label="上架">
          <template slot-scope="scope">
            <span class="el-dropdown-link" :class="scope.row.bookCheckStatus===2?'success':'primary'">
              {{scope.row.bookCheckStatus==2?"已上架":"未上架"}}
            </span>
           
          </template>
        </el-table-column>
        
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            <span >{{ scope.row.bookCreatedTime | time('long') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.lastUpdateTime | time('long') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="bookWorldCount"
          label="字数"
          align="center">
        </el-table-column>
        
        <el-table-column
          class="last-column"
          v-if="$store.state.userInfo && $store.state.userInfo.adminRolemenuanduserrole.updates"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <a href="javascript:0;">详情</a>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        class="mbt20"
        background
        @current-change="handleCurrentChange"
        :current-page="bookList.pageNum"
        :page-size="bookList.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="bookList.total">
      </el-pagination>
    </el-row>
    
  </div>
</template>

<script type="text/ecmascript-6">
  import Cropper from '../common/img_upload.vue'
  export default{
    components:{
      'pic-cropper':Cropper
    },
    data(){
      return{
        dialogTableVisible:false,
        bookList:{},
        updateData:{},
        multipleSelection:[],
        keywords:'',
        selectType:'bookName'
      }
    },
    methods:{
      getBookList(){
        let searchValue = {
          page:this.$route.params.page,
          orderParemeter:'bookId'
        };
        let val = this.$http.trim(this.keywords);
        if(this.selectType && val){
          if((this.selectType==='bookId' || this.selectType==='bookWriterId') && !Number(val)){
            this.$message({message:'ID必需为数字',type:'warning'});
            return false
          }
          searchValue[this.selectType] = val;
          this.bookList = {}
        }
        this.$ajax("/admin/getBooInfoList",searchValue,res=>{
          if(res.returnCode===200){
            this.bookList = res.data
          }
        })
      },
      searchBook(){
        if(Number(this.$route.params.page)!==1){
          this.$router.push({params:{page:1}})
        }else {
          this.getBookList()
        }
      },
//        批量删除书籍
      toggleSelection(){
        if(this.multipleSelection.length){
          let id = [];
          this.multipleSelection.forEach((item)=>{
            id.push(item.bookId)
          });
          this.$confirm('此操作将永久删除所选的'+id.length+'书籍, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$ajax('/admin/bookBatchDelete',{
              bookid:id.toString()
            },res=>{
              if(res.returnCode===200){
                this.$message({message:'删除成功！',type:'success'});
                this.getBookList()
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
          
        }else {
          this.$message({message:' 请选择要删除的书籍！',type:'warning'})
        }
      },
      handleRowClick(row, event, column){
        if(column.label!=='操作'){
          this.$refs.multipleTable.toggleRowSelection(row);
        }
        
      },
      
      handleSelectionChange(val){
        this.multipleSelection = val
      },
      handleClick(val,data){
        if(val==='a'){
          //              章节列表
          this.$router.push({path:'/book_chapter_list/'+data.bookId})
        }else if(val==='b'){
          //              编辑书籍详情
          this.$router.push({path:'/book_detail/'+data.bookId})
          
        }else if(val==='c'){
          //              添加章节
          this.$router.push({path:'/add_new_chapter/'+data.bookId})
          
        }else if(val==='d'){
          this.toggleSelection();
          //              删除书籍
//            this.$router.push({path:'/admin/book_list/'+data.bookId})
        
        }
      },
      handleCurrentChange(page){
        this.$router.push({params:{page:page}})
      },

//        书籍上架下架
      bookChangeState(val,data){
        let state = data.bookCheckStatus,status = data.bookStatus;
        if(val==='a'){
//              书籍审核
          state = 1
        }else if(val==='b'){
//              书籍上架
          if(data.bookCheckStatus===0){
            this.$message({message:'书籍暂未审核，请先审核通过！',type:'warning'});
            return false
          }else {
            state = 2
          }
        }else if(val==='c'){
//              书籍下架
          if(data.bookCheckStatus<=1){
            this.$message({message:'书籍已下架！',type:'warning'});
            return false;
          }else {
            state = 1
          }
        }else if(val==='d'){
          status = 1
        }else if(val==='e'){
          status = 0
        }else if(val==='f'){
          state = 0
        }
        this.$ajax("/admin/sysbookupdate",{bookId:data.bookId,bookCheckStatus:state,bookAuthorization:data.bookAuthorization,bookStatus:status},res=>{
          if(res.returnCode===200){
            this.$message(res.msg);
            this.getBookList()
          }
        })
      },
      
    },
    created(){
      this.getBookList()
    },
    watch:{
      $route:function () {
        this.getBookList()
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .cover
    width 100%
    cursor pointer
  .cover-preview
    border 1px solid #ddd
    .avatar
      width 200px
      height 200px
</style>
