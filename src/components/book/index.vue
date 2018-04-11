<template>
    <div class="admin-book-wrap">
      <el-alert
        title="操作说明"
        type="info"
        show-icon>
        <div>
          <p>
            此表为本站全部书籍列表，您可以通过相应书籍ID来批量管理，也可以通过
            <router-link v-if="authority.adds" class="red" :to="{name:'addNewBook'}">新建书籍</router-link>来添加新书
          </p>
          <p>
            <span class="red">提示：</span>需要更多详细筛选条件请直接点击 <a href="javascript:0;" @click="fold?fold=false:fold=true">展开</a>；双击书名可进行修改
          </p>
        </div>
      </el-alert>
      <el-row v-show="fold" class="mbt20 fitler-search">
        <div>
          排序类型：
          <el-radio-group v-model="filterList.orderParemeter">
            <el-radio-button :label="-1">全部</el-radio-button>
            <el-radio-button label="bookCreatedTime">创建时间</el-radio-button>
            <el-radio-button label="bookWorldCount">字数</el-radio-button>
            <el-radio-button label="lastUpdateTime">更新时间</el-radio-button>
          </el-radio-group>
        </div>
        <div>
          书籍状态：
          <el-radio-group v-model="filterList.bookCheckStatus">
            <el-radio-button :label="-1">全部</el-radio-button>
            <el-radio-button :label="0">未审核</el-radio-button>
            <el-radio-button :label="1">已审核</el-radio-button>
            <el-radio-button :label="2">已上架</el-radio-button>
          </el-radio-group>
        </div>
  
        <div>
          连载状态：
          <el-radio-group v-model="filterList.bookStatus">
            <el-radio-button :label="-1">全部</el-radio-button>
            <el-radio-button :label="0">连载中</el-radio-button>
            <el-radio-button :label="1">已完结</el-radio-button>
          </el-radio-group>
        </div>
      </el-row>
      <el-row class="mbt20">
        <el-button type="danger" v-if="authority.deletes" plain @click="toggleSelection()">批量删除</el-button>
      </el-row>
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
          @cell-dblclick="dblClick"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="30"
            aligin="center">
          </el-table-column>
          <el-table-column
            align="center"
            prop="bookId"
            width="80"
            label="ID">
          </el-table-column>
          
          <el-table-column
            prop="bookName"
            label="书名">
            <template slot-scope="scope">
              <textarea
                :class="!scope.row.edit?'edit':''"
                :disabled="!scope.row.edit"
                v-model="scope.row.bookName"
                @blur="updateBookTitle(scope.row)">
              </textarea>
            </template>
          </el-table-column>
  
          <el-table-column
            prop="writerName"
            label="作者">
            <template slot-scope="scope">
              {{scope.row.writerName}}(id:{{scope.row.bookWriterId}})
            </template>
          </el-table-column>
          
          <el-table-column
            align="center"
            prop="bookStatus"
            width="74"
            label="连载">
            <template slot-scope="scope">
              <el-dropdown size="medium" v-if="authority.updates" trigger="click" placement="bottom" @command="bookChangeState($event,scope.row)">
                <span class="el-dropdown-link" :class="!scope.row.bookStatus?'success':'primary'">
                  {{!scope.row.bookStatus?'连载中':'已完结'}}
                </span>
                <el-dropdown-menu  slot="dropdown">
                  <el-dropdown-item v-if="!scope.row.bookStatus" command="d">设置完结</el-dropdown-item>
                  <el-dropdown-item v-else command="e">设置连载</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <span v-else class="el-dropdown-link" :class="!scope.row.bookStatus?'success':'primary'">
                  {{!scope.row.bookStatus?'连载中':'已完结'}}
              </span>
            </template>
          </el-table-column>
  
          <el-table-column
            align="center"
            prop="bookCheckStatus"
            width="74"
            label="审核">
            <template slot-scope="scope">
              <el-dropdown v-if="authority.toExamine" size="medium" trigger="click" placement="bottom" @command="bookChangeState($event,scope.row)">
                <span class="el-dropdown-link" :class="scope.row.bookCheckStatus?'success':'primary'">
                  {{scope.row.bookCheckStatus?"已审核":"未审核"}}
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="!scope.row.bookCheckStatus" command="a">设置已审核</el-dropdown-item>
                  <el-dropdown-item v-else command="f">设置未审核</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <span v-else class="el-dropdown-link" :class="scope.row.bookCheckStatus?'success':'primary'">
                  {{scope.row.bookCheckStatus?"已审核":"未审核"}}
              </span>
            </template>
          </el-table-column>
          
          <el-table-column
            align="center"
            prop="bookStatus"
            width="74"
            label="上架">
            <template slot-scope="scope">
              <el-dropdown v-if="authority.updates" size="medium" trigger="click" placement="bottom" @command="bookChangeState($event,scope.row)">
                <span class="el-dropdown-link" :class="scope.row.bookCheckStatus===2?'success':'primary'">
                  {{scope.row.bookCheckStatus==2?"已上架":"未上架"}}
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="scope.row.bookCheckStatus!==2" command="b">上架</el-dropdown-item>
                  <el-dropdown-item v-else command="c">下架</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <span v-else class="el-dropdown-link" :class="scope.row.bookCheckStatus===2?'success':'primary'">
                  {{scope.row.bookCheckStatus==2?"已上架":"未上架"}}
              </span>
            </template>
          </el-table-column>
          
          <el-table-column
            width="140"
            label="创建时间">
            <template slot-scope="scope">
              <span >{{ scope.row.bookCreatedTime | time('long') }}</span>
            </template>
          </el-table-column>
          
          <el-table-column
            width="140"
            label="更新时间">
            <template slot-scope="scope">
              <span>{{ scope.row.lastUpdateTime | time('long') }}</span>
            </template>
          </el-table-column>
          
          <el-table-column
            prop="bookWorldCount"
            width="100"
            label="字数"
            align="center">
          </el-table-column>
         
          <el-table-column
            prop=""
            width="80"
            label="封面">
            <template slot-scope="scope">
              <div class="cover-wrap" @click="dialogShow(scope.row)">
                <img class="cover" :src="scope.row.bookImage" alt="">
              </div>
            </template>
          </el-table-column>
          
          <el-table-column
            class="last-column"
            label="操作"
            width="70"
            align="center">
            <template slot-scope="scope">
              <el-dropdown
                trigger="click"
                size="medium"
                placement="bottom"
                @command="handleClick($event,scope.row)">
                <a href="javascript:0;" class="btn">更多</a>
                <el-dropdown-menu slot="dropdown">
                   <el-dropdown-item command="a" v-if="authority.shows">章节列表</el-dropdown-item>
                   <el-dropdown-item command="b" v-if="authority.updates">编辑详情</el-dropdown-item>
                   <el-dropdown-item command="c" v-if="authority.adds">添加章节</el-dropdown-item>
                   <el-dropdown-item class="danger" v-if="authority.deletes" command="d">删除书籍</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
  
    <!--书籍封面上传-->
      <pic-cropper
        ref="avatarUpdate"
        action="/api/admin/updateBookCoverAvatarimgUpload"
        :visible.sync="dialogTableVisible"
        @close="closeIt"
        @success="successBack"
        :maxWidth="400"
        :data="{bookid:updateData.bookId}"
        url="/static/img/defaultcoverimg.jpg"
        :aspectRatio="3/4">
      </pic-cropper>
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
            currentTitle:'',
            dialogTableVisible:false,
            bookList:{},
            updateData:{},
            multipleSelection:[],
            keywords:'',
            selectType:'bookName',
            fold:false,
            filterList:{
                orderParemeter:-1,
                bookCheckStatus:-1,
                bookStatus:-1
            },
            $routeParams:'',
            keepAlive:false,
            firstOne:true,
            editTitle:false,  //修改书籍标题状态
          }
        },
      methods:{
        getBookList(){
          let searchValue = {
            page:this.$routeParams.page,
            orderParemeter:'bookId'
          };
          if(this.$route.name==='bookInfo'){
            searchValue = {
              page:1,
              orderParemeter:'bookId'
            };
            this.selectType = "bookId";
            this.keywords = this.$route.params.bid;
          }
          let val = this.$http.trim(this.keywords);
          if(this.selectType && val){
            if((this.selectType==='bookId' || this.selectType==='bookWriterId') && !Number(val)){
                this.$message({message:'ID必需为数字',type:'warning'});
                return false
            }
            searchValue[this.selectType] = val;
            this.bookList = {}
          }
          for(let k in this.filterList){
              if((typeof this.filterList[k]==='number'&& this.filterList[k]>-1) || typeof this.filterList[k]==='string'){
                  searchValue[k] = this.filterList[k];
              }
          }
          if(this.$route.name==='bookList' || this.$route.name==='bookInfo'){
            this.$ajax("/admin/getBooInfoList",searchValue,res=>{
              if(res.returnCode===200){
                this.bookList = res.data
              }else if(!res.data){
                this.bookList = {}
              }
            })
          }
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
            if(column.label!=='操作'&&column.label!=='书名'){
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
        dblClick(row,colmon,cell){
          if( colmon.id === 'el-table_1_column_3' && !this.editTitle && this.authority.updates){
            this.bookList.list.forEach((item,i)=>{
                if(item.edit){
                    this.$set(this.bookList.list[i],'edit',false)
                }
            });
            this.currentTitle = row.bookName;
            this.$set(row,'edit',true);
            this.$nextTick(()=>{
                cell.childNodes[0].childNodes[0].focus()
            });
            this.editTitle = true
          }
          
        },
        updateBookTitle(row){
          if(this.editTitle){
            this.bookList.list.forEach((item,i)=>{
              if(item.edit){
                this.$set(this.bookList.list[i],'edit',false)
              }
            });
          }
          if(this.currentTitle!==row.bookName){
            this.$myLoad();
            this.$ajax("/admin/updateBookName",{bookId:row.bookId,bookName:row.bookName},res=>{
                this.editTitle = false;
                this.$nextTick(()=>{
                    this.$loading().close()
                });
                this.getBookList();
                if(res.returnCode===200){
                    this.$message({message:res.msg,type:'success'})
                }
            })
          }else {
            this.editTitle = false;
          }
        },
        
//        书籍上架下架
        bookChangeState(val,data){
          let state = data.bookCheckStatus,status = data.bookStatus;
          if(val==='a'){
//              书籍审核
            state = 1;
          }else if(val==='b'){
//              书籍上架
            if(data.bookCheckStatus===0){
              this.$message({message:'书籍暂未审核，请先审核通过！',type:'warning'});
              return false
            }else {
                state = 2;
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
          let updateInfo = ()=>{
            this.$ajax("/admin/sysbookupdate",{bookId:data.bookId,bookCheckStatus:state,bookAuthorization:data.bookAuthorization,bookStatus:status},res=>{
              if(res.returnCode===200){
                this.$message(res.msg);
                this.getBookList()
              }
            })
          };
          if(val!=='a'){
              updateInfo();
          }else {
            this.$ajax("/admin/getChapterCount",{bookId:data.bookId},res=>{
              if(res.returnCode===200 && res.data>1){
                  updateInfo();
              }else {
                  this.$message({ message:'已发布章节不足两章，不可通过审核！',type:'warning'})
              }
              
            },'post','json',true);
          }
        },
        
        dialogShow(value){
          this.dialogTableVisible = true;
          this.$set(this.updateData,'bookId',value.bookId);
          this.$set(this.updateData,'bookImage',value.bookImage)
        },
//        上传封面
        closeIt(){
            this.dialogTableVisible = false
        },
//        上传成功回调
        successBack(val){
           if(val.returnCode===200){
             this.getBookList()
           }
        }
      },
      created(){
        if(this.firstOne){
          this.$routeParams =this.$route.params;
          this.getBookList();
          this.firstOne = false
        }
      },
      activated(val){
        if(!this.firstOne){
          this.$routeParams = this.$route.params;
          this.getBookList()
        }
      },
      deactivated(){
      },
      watch:{
        $route:function (val) {
          this.$routeParams = val.params;
          this.getBookList()
        },
        filterList:{
          handler() {
              this.getBookList();
          },
          deep: true
        }
      },
      computed:{
          authority:function (){
              return this.$store.state.userInfo.adminRolemenuanduserrole?this.$store.state.userInfo.adminRolemenuanduserrole:{};
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
.cell
  >textarea
     padding 5px
     resize none
     border 1px transparent
     background #fff
.edit
  border none
  .el-textarea__inner
      border none!important
      cursor inherit!important
      color #333!important
</style>
