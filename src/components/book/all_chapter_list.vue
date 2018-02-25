<template>
  <div class="admin-book-wrap">
    <el-breadcrumb class="mbt20" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>书籍管理</el-breadcrumb-item>
      <el-breadcrumb-item >全站章节列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="操作说明"
      type="info"
      show-icon>
      <div>
        <p>
          此表是本站全部发布章节，您可通过ID进行批量管理
        </p>
      </div>
    </el-alert>
    
    <el-row class="mbt20">
      <el-button type="danger" plain @click="toggleRowSelection">批量删除</el-button>
    </el-row>
    
    <el-row class="mbt20">
      <el-col :xs="20" :sm="16" :md="12" :lg="9" :xl="6">
        <el-input placeholder="请输入书籍id、书名或章节名" v-model="keywords" class="input-with-select" @keyup.enter.native="getAllChapterList">
          <el-button slot="append" icon="el-icon-search" @click="getAllChapterList"></el-button>
        </el-input>
      </el-col>
    </el-row>
    
    <el-row>
      <!--<div class="table-wrap">-->
      <el-table
        ref="multipleTable"
        border
        :data="draftList.list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          prop="id"
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
          align="center">
          <template slot-scope="scope">
            <span class="red" v-if="scope.row.chapterIsvip">VIP</span>
            <span v-else class="green">普通</span>
          </template>
        </el-table-column>
        
        <el-table-column
          prop="chapterState"
          label="审核状态"
          align="center">
          <template slot-scope="scope">
            <span class="red" v-if="scope.row.chapterState">未审核</span>
            <span v-else class="green">已审核</span>
          </template>
        </el-table-column>
        
        <el-table-column
          label="发布时间">
          <template slot-scope="scope">
            {{scope.row.releaseTime | time('long')}}
          </template>
        </el-table-column>
        
        <el-table-column
          prop="chapterLength"
          align="center"
          label="字数">
        </el-table-column>
        
        <el-table-column
          v-if="$store.state.userInfo && $store.state.userInfo.adminRolemenuanduserrole.updates"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-dropdown trigger="click" placement="bottom" @command="handleClick($event,scope.row)">
              <a href="javascript:0;">更多</a>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">编辑</el-dropdown-item>
                <el-dropdown-item command="b">审核</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!--</div>-->
      <el-pagination
        v-if="draftList.list && draftList.total>draftList.pageSize"
        class="mbt20"
        @current-change="handleCurrentChange"
        :current-page="Number($route.params.page)"
        :page-size="draftList.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="draftList.total">
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
        draftList:[],
        cloneList:[],
        updateData:{},
        page:1,
        multipleSelection:[],
        newDrag:true,
        keywords:''
      }
    },
    methods:{
      getAllChapterList(){
        
        this.$ajax("/admin/getAdminChapterList",{
          page:this.$route.params.page,
          searchCondition:this.keywords
        },res=>{
          if(res.returnCode===200){
            this.draftList = res.data
          }
        })
      },

//      批量删除
      toggleRowSelection(){
        if(this.multipleSelection.length){
          let cid = [];
          this.multipleSelection.forEach((item)=>{
              cid.push(item.id)
          });
          this.$confirm('此操作将永久删除所选'+cid.length+'个章节, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              this.$ajax('/chapter-deletechapter',{
                  chapterid:cid.toString()
              },res=>{
                  if(res.returnCode===200){
                      this.getAllChapterList();
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                  }
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
        
        }
      },
      
      handleCurrentChange(page){
        this.page = page;
        this.$router.push({params:{page:page}})
      }
    },
    created(){
      this.getAllChapterList()
    },
    watch:{
      $route:function () {
        this.getAllChapterList()
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
