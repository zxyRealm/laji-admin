<template>
  <div class="para-comment-wrap">
    <el-alert
      title="操作说明"
      type="info"
      show-icon>
      <div>
        <p>
          此表为本站全部书籍章节吐槽，您可以通过相应评论ID来批量管理；通过内容可以模糊搜索，其他类型均为精确搜索
        </p>
        <p>
          <span class="red">注意：</span>删除吐槽时
        </p>
      </div>
    </el-alert>
    <el-row class="mbt20">
      <el-button v-if="$store.state.userInfo && $store.state.userInfo.adminRolemenuanduserrole.deletes" type="danger" plain @click="toggleSelection()">批量删除</el-button>
    </el-row>
    
    <el-row class="mbt20">
      <el-col :xs="20" :sm="16" :md="12" :lg="9" :xl="6">
        <el-input placeholder="请输入内容" v-model="keywords" class="input-with-select" @keyup.enter.native="searchChapterCom">
          <el-select v-model="selectType" slot="prepend" placeholder="请选择">
            <el-option label="内 容" value="commentContext"></el-option>
            <el-option label="书  名" value="bookName"></el-option>
            <el-option label="昵 称" value="userName"></el-option>
            <el-option label="章节名" value="chapterName"></el-option>
            <el-option label="书籍ID" value="bookId"></el-option>
            <el-option label="章节ID" value="chapterId"></el-option>
            <el-option label="用户IP" value="userAddressIP"></el-option>
          
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchChapterCom"></el-button>
        </el-input>
      </el-col>
    </el-row>
    
    <el-table
      ref="multipleTable"
      :data="pcommentList.list"
      border
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        width="80">
      </el-table-column>
      
      <el-table-column
        prop="bookName"
        label="书名"
        width="180">
      </el-table-column>
      
      
      <el-table-column
        prop="bookId"
        label="书籍ID"
        width="70">
      </el-table-column>
      
      <el-table-column
        prop="chapterName"
        label="章节名">
      </el-table-column>
      
      <el-table-column
        prop="chapterId"
        label="章ID"
        width="80">
      </el-table-column>
      
      <el-table-column
        prop="commentContext"
        label="内容">
      </el-table-column>
      
      <el-table-column
        label="更多"
        type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用户IP：">
              <span>{{ props.row.userAddressIP }}</span>
            </el-form-item>
            
            <el-form-item label="时间">
              <span>{{ props.row.commentDateTime | time('long') }}</span>
            </el-form-item>
            
            <el-form-item label="段落ID：">
              <span>{{ props.row.pid }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
  
      <el-table-column
        v-if="$store.state.userInfo && $store.state.userInfo.adminRolemenuanduserrole.updates"
        label="删除评论"
        width="150">
        <template slot-scope="scope">
          <span class="red" @click="toggleSelection('book', scope.row)">全书</span>
          <span class="red" @click="toggleSelection('user', scope.row)">用户</span>
          <span class="red" @click="toggleSelection('cid', scope.row)">章节</span>
          <span class="red" @click="toggleSelection('pid', scope.row)">段落</span>
        </template>
      </el-table-column>
      
    </el-table>
    
    <el-pagination
      class="mbt20"
      background
      @current-change="handleCurrentChange"
      :current-page="pcommentList.pageNum"
      :page-size="pcommentList.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pcommentList.total">
    </el-pagination>
  
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    data(){
      return{
        searchForm:{
        
        },
        pcommentList:{},
        keywords:'',
        selectType:'',
        multipleSelection:[]
      }
    },
    methods:{
        getPcommentList(){
            this.searchForm.page = this.$route.params.page;
            if(this.selectType){
                if((this.selectType==='bookId' || this.selectType==='userId') && !Number(this.keywords)){
                  this.$message({message:'ID必需为数字',type:'warning'});
                  return false
                }
                this.searchForm[this.selectType] = this.keywords
            }
            this.$ajax("/admin/BookParagraphCommentInfoList",this.searchForm,res=>{
                if(res.returnCode===200){
                    this.pcommentList = res.data
                }else if(!res.data){
                    this.pcommentList = {}
                }
            })
        },
        searchChapterCom(){
            if(Number(this.$route.params.page)===1){
                this.getPcommentList()
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
                let url,tip,subData;
                if(dType==='book'){
                    url = '/pcomm-delParagraphcommentBookId';
                    tip = '此操作将永久删除书籍<span class="red">'+item.bookName+'</span>的全部吐槽, 是否继续?';
                    subData = {
                      bookid:idList.toString()
                    }
                }else if(dType==='user'){
                    url = '/pcomm-delParagraphcommentUser';
                    tip = '此操作将永久删除用户<span class="red">'+item.userName+'</span>的全部吐槽, 是否继续?';
                    subData = {
                      userid:idList.toString()
                    }
                }else if(dType==='cid'){
                    url = '/pcomm-delParagraphcommentChapter';
                    tip = '此操作将永久删除本章节<span class="red">'+item.chapterName+'</span>的全部吐槽, 是否继续?';
                    subData = {
                      chapterid:idList.toString()
                    }
                }else if(dType==='pid'){
                    url = '/pcomm-delParagraphcommentPid';
                    tip = '此操作将永久删除本段落的全部吐槽, 是否继续?';
                    subData = {
                      pid:idList.toString()
                    }
                }else {
                    tip = '此操作将永久删除'+idList.length+'条吐槽, 是否继续?';
                    url = '/pcomm-delParagraphcomment';
                    subData = {
                      id:idList.toString()
                    }
                }
                this.$confirm(tip , '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString:true,
                    type: 'warning'
                }).then(() => {
                    this.$ajax(url,subData,res=>{
                        if(res.returnCode===200){
                            this.$message({message:'删除成功',type:'success'});
                            this.getPcommentList()
                        }
                    })
                })
              
            };
        
            if(item){
                if(dType==='book'){
                    idList.push(item.bookId)
                }else if(dType==='user') {
                    idList.push(item.userId)
                }else if(dType==='cid'){
                    idList.push(item.chapterId)
                }else {
                    idList.push(item.pid)
                }
            }else if(this.multipleSelection.length){
                this.multipleSelection.forEach((item)=>{
                    idList.push(item.id)
                });
            }
            
            if(idList.length){
                delData()
            }else {
                this.$message({message:'请选取要删除的内容',type:'warning'});
                return false
            }
            
        },
        
        handleSelectionChange(val){
            this.multipleSelection = val
        }


    },
    created(){
      this.getPcommentList()
    },
    watch:{
      "$route":function (val) {
        this.getPcommentList()
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
span.red
  cursor pointer
  
</style>
