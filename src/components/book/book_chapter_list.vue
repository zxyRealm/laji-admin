<template>
  <div class="admin-book-wrap">
    <el-breadcrumb class="mbt20" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>书籍管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/book/list">书籍列表</el-breadcrumb-item>
      <el-breadcrumb-item >章节列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-alert
      title="操作说明"
      type="info"
      show-icon>
      <div>
        <p>此表为 <span class="blue">《{{bookInfo.bookName}}》</span>的全部章节列表</p>
        <p>
          操作：通过拖拽可以直接进行卷内章节调序，不同分卷之间章节不可调序；需要修改分卷名或调整分卷顺序请进入
          <router-link v-if="authority.adds" class="red" :to="{name:'bookVolumeList'}">分卷管理</router-link>
        </p>
        <p>
          <span class="red">注意事项：</span>
          <i class="el-icon-edit danger"></i>表示草稿,草稿箱内容不可调序；
          <i class="el-icon-time danger"></i>表示定时发布，超过当前服务器时间的章节内容会被自动发布；也可以直接
          <router-link v-if="authority.adds" class="red" :to="'/add_new_chapter/'+$route.params.bid">新建章节</router-link>
        </p>
      </div>
    </el-alert>
    <el-row class="mbt20">
      <el-button v-if="authority.deletes" type="danger" plain @click="toggleRowSelection">批量删除</el-button>
    </el-row>
    <el-row>
      <div class="table-wrap">
        <table class="chapter-list" border="0" cellspacing="10" cellpadding="0" width="100%">
          <thead>
          <tr>
            <th>
              <el-checkbox @change="selectAll"></el-checkbox>
            </th>
            <th>ID</th>
            <th>分卷</th>
            <th align="left">章节名</th>
            <th>VIP状态</th>
            <th>全部</th>
            <th>发布时间</th>
            <th>字数</th>
            <th>操作</th>
          </tr>
          </thead>
          <draggable v-model="chapterList" :options="{draggable:'.drag-item'}" element="tbody" :move="dragState" @start="dragStart" @update="dragEnd">
            <tr class="drag-item" v-for="(item,$index) in chapterList" @click="selected($index)" :key="item.id">
              <td>
                <el-checkbox v-model="item.check"></el-checkbox>
              </td>
              <td>{{item.id}}</td>
              <td>{{item.volumeName}}</td>
              <td align="left">
                {{item.chapterTitle}}
                <i v-if="item.whetherPublic" class="el-icon-edit danger"></i>
                <i v-else-if="nowTime<item.releaseTime" class="el-icon-time danger"></i>
              </td>
              <td>
                <span v-if="item.chapterIsvip" class="danger">VIP</span>
                <span v-else class="safe">普通</span>
              </td>
              <td>
                <span v-if="!item.chapterState" class="safe">已审核</span>
                <span v-else class="danger">未审核</span>
              </td>
              <td>
                {{ item.releaseTime | time('long') }}
              </td>
              <td>{{item.chapterLength}}</td>
              <td>
                <router-link class="blue" :to="'/edit_chapter/'+item.id">编辑</router-link>
              </td>
            </tr>
          </draggable>
        </table>
      </div>
      <el-pagination
        v-if="chapterList.length"
        class="mbt20"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="100"
        layout="total, prev, pager, next, jumper"
        :total="chapterList.length">
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
        chapterList:[],
        cloneList:[],
        updateData:{},
        page:1,
        multipleSelection:[],
        newDrag:true,
        bookInfo:{},
        $routeParams:''
      }
    },
    methods:{
      getChapterList(){
        this.$ajax("/books-adminChapterList/"+this.$route.params.bid,'',res=>{
          let arr = [];
          if(res.returnCode===200){
            res.data.reverse().forEach((item)=>{
              if(item.resultList.length>0){
                arr = arr.concat(item.resultList)
              }
            });
            this.chapterList = arr
          }
        },'get')
      },
      getBookInfo(){
          this.$ajax("/book-showBookInfo",{bookid:this.$route.params.bid},res=>{
              if(res.returnCode===200){
                  this.bookInfo = res.data
              }
          })
      },
      dragState(evt){
        let val = evt.draggedContext;
        let moveState =  this.cloneList[val.index].volumeId===this.cloneList[val.futureIndex].volumeId && !this.cloneList[val.index].whetherPublic;
        if(!moveState){
          if(this.newDrag){
            if(!this.cloneList[val.index].whetherPublic){
              this.$message({message:'不同分卷不可调整顺序！',type:'warning',showClose:true});
            }
            this.newDrag = false;
          }
        }
        return moveState;
      },
//      拖拽开始
      dragStart(evt){
         this.cloneList = JSON.parse(JSON.stringify(this.chapterList));
         this.newDrag = true;
         if(this.cloneList[evt.oldIndex].whetherPublic){
           this.$message({ message:'草稿箱内容不可调序',type:'warning',showClose:true});
           return false
         }
      },
      dragEnd(evt){
        let oldNum = this.cloneList[evt.oldIndex];
        let newNum = this.cloneList[evt.newIndex];
          this.$myLoad();
          this.$ajax("/sys-chapteOrderUpdate",{
            startNum:oldNum.chapterOrder,
            endNum:newNum.chapterOrder,
            bookid:oldNum.bookId,
            volumeid:oldNum.volumeId,
            startChapterid:oldNum.id
          },res=>{
            this.$loading().close();
            if(res.returnCode===200){
              this.getChapterList();
              this.$message({ message:'调整成功',type:'success',duration:2000,showClose:true})
            }
          });
      },
//      批量删除
      toggleRowSelection(){
        let idList = [];
        this.chapterList.forEach((item)=>{
          if(item.check){
            idList.push(item.id)
          }
        });
          if(idList.length){
            this.$confirm('此操作将永久删除所选的 '+idList.length+' 个章节, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax("/admin/deletechapter",{
                    chapterid:idList.toString()
                },res=>{
                    if(res.returnCode===200){
                        this.$message({message:'删除成功',type:'success'});
                        this.getChapterList();
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
      selected(index){
          let val = this.chapterList[index];
          if(val.check){
            this.$set(val,'check',false)
          }else {
            this.$set(val,'check',true)
          }
      },
      selectAll(event){
          if(event){
            this.chapterList.forEach((item)=>{
              this.$set(item,'check',true)
            })
          }else{
            this.chapterList.forEach((item)=>{
              this.$set(item,'check',false)
            })
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
        this.$ajax("/admin/sysbookupdate",{
          bookId:data.bookId,
          bookCheckStatus:state,
          bookAuthorization:data.bookAuthorization,
          bookStatus:status
        },res=>{
          if(res.returnCode===200){
            this.$message(res.msg);
            this.getBookList()
          }
        })
      }
    },
    created(){
      this.getBookInfo();
      this.getChapterList()
    },
    watch:{
      $route:function () {
        this.getChapterList()
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
      },
      authority:function () {
        return this.$store.state.userInfo.adminRolemenuanduserrole?this.$store.state.userInfo.adminRolemenuanduserrole:{}
      }
    },
    filters:{
        checkState:function (val) {
//          for(let k=0,len=this.checkList.length;k<len;k++){
//            if(val==this.checkList[i]){
//                return true
//            }
//          }
        }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .cover
    width 100%
 .drag-item:hover
    background #fafafa
</style>
