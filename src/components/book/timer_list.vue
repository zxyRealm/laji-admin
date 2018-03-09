<template>
  <div class="admin-book-wrap">
    <el-breadcrumb class="mbt20" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>书籍管理</el-breadcrumb-item>
      <el-breadcrumb-item >草稿箱列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="操作说明"
      type="info"
      show-icon>
      <div>
        <p>
          此表是本站全部定时章节，您可通过ID进行批量管理
        </p>
      </div>
    </el-alert>
    
    <el-row class="mbt20">
      <el-button type="danger" plain @click="toggleRowSelection">批量删除</el-button>
    </el-row>
    
    <el-row class="mbt20">
      <el-col :xs="20" :sm="16" :md="12" :lg="9" :xl="6">
        <el-input placeholder="请输入书籍id或者书籍名称" v-model="keywords" class="input-with-select" @keyup.enter.native="getTimerList">
          <el-button slot="append" icon="el-icon-search" @click="getTimerList"></el-button>
        </el-input>
      </el-col>
    </el-row>
    
    <el-row>
      <div class="table-wrap">
        <el-table
          ref="multipleTable"
          :data="timerList.list"
          tooltip-effect="dark"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            prop="id"
            width="100"
            label="章节ID">
          </el-table-column>
          <el-table-column
            prop="bookTitle"
            label="书名">
            <template slot-scope="scope">
              (id:{{scope.row.bookId}}){{scope.row.bookTitle}}
            </template>
          </el-table-column>
          <el-table-column
            prop="chapterTitle"
            label="章节名">
          </el-table-column>
          
          <el-table-column
            prop="chapterIsvip"
            label="VIP状态"
            width="80"
            align="center">
            <template slot-scope="scope">
              <span class="red" v-if="scope.row.chapterIsvip">VIP</span>
              <span v-else class="green">普通</span>
            </template>
          </el-table-column>
          
          <el-table-column
            prop="chapterState"
            width="80"
            label="审核状态"
            align="center">
            <template slot-scope="scope">
              <span class="red" v-if="scope.row.chapterState">未审核</span>
              <span v-else class="green">已审核</span>
            </template>
          </el-table-column>
          
          <el-table-column
            width="140"
            label="发布时间">
            <template slot-scope="scope">
              {{scope.row.releaseTime | time('long')}}
            </template>
          </el-table-column>
          
          <el-table-column
            prop="chapterLength"
            width="100"
            align="center"
            label="字数">
          </el-table-column>
          
          <el-table-column
            width="80"
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-dropdown trigger="click" placement="bottom" @command="handleClick($event,scope.row)">
                <a href="javascript:0;">更多菜单</a>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">编辑</el-dropdown-item>
                  <el-dropdown-item command="b">审核</el-dropdown-item>
                  <el-dropdown-item class="danger" command="c">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      
      </div>
      <el-pagination
        v-if="timerList.list && timerList.total>timerList.pageSize"
        class="mbt20"
        @current-change="handleCurrentChange"
        :current-page="Number($route.params.page)"
        :page-size="timerList.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="timerList.total">
      </el-pagination>
    </el-row>
    
    <!--书籍封面上传-->
  </div>
</template>

<script type="text/ecmascript-6">
  import draggable from 'vuedraggable'
  export default{
    components:{
      draggable
    },
    data(){
      return{
        checkList:[],
        centerDialogVisible:false,
        timerList:[],
        cloneList:[],
        updateData:{},
        page:1,
        multipleSelection:[],
        newDrag:true,
        keywords:''
      }
    },
    methods:{
      getTimerList(){
        this.$ajax("/admin/getAdminChapterTimingRelease",{
          page:this.$route.params.page,
          searchCondition:this.keywords
        },res=>{
          if(res.returnCode===200){
            this.timerList = res.data
          }
        })
      },

//      批量删除
      toggleRowSelection(){
        if(this.multipleSelection.length){
          this.$confirm('此操作将永久删除所选章节, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.getChapterList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }else {
          this.$message({message:'请选取要删除的章节！',type:'warning',showClose:true})
        }
      },
      
      handleSelectionChange(val){
        this.multipleSelection = val
      },
//      点击行选中
      handleRowClick(row){
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      
      handleClick(val,data){
        if(val==='a'){
          this.$router.push({path:'/edit_chapter/'+data.id})
        }else if(val==='b'){
        
        }else if(val==='c'){
        
        }
      },
      
      handleCurrentChange(page){
        this.page = page;
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
            this.$message({message:'书籍暂未审核，请先审核通过！',type:'warning'})
          }else {
            state = 2
          }
        }else if(val==='c'){
//              书籍下架
          if(data.bookCheckStatus<=1){
            this.$message({message:'书籍已下架！',type:'warning'})
          }else {
            state = 1
          }
        }else if(val==='d'){
          status = 1
        }
        this.$ajax("/admin/sysbookupdate",{bookId:data.bookId,bookCheckStatus:state,bookAuthorization:data.bookAuthorization,bookStatus:status},res=>{
          if(res.returnCode===200){
            this.$message(res.msg);
            this.getBookList()
          }
        })
      }
    },
    created(){
      this.getTimerList()
    },
    watch:{
      $route:function () {
        this.getTimerList()
      }
    },
    computed:{
      nowTime:function () {
        let time = new Date().getTime();
        this.$ajax("/sys-getNetWorkDateTime",'',res=>{
          if(res.returnCode===200){
            time = res.data.beijing
          }
        },'get');
        return time;
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .cover
    width 100%

</style>
