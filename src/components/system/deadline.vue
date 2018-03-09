<template>
    <div>
      <el-alert
        title="操作说明"
        type="info"
        show-icon>
        <div>
          <p>
            限时免费按照批次更新，每批固定8本书籍，每批次的限免时长为上一批次截止时间到本批次截止时间；设置当前批次截止时间时必须大于上一批次的截止时间
          </p>
        </div>
      </el-alert>
      <el-row class="mbt20">
        <el-button type="primary" plain @click="addDeadLine">添加</el-button>
        <el-button type="danger" plain @click="delDeadLine()">删除本批</el-button>
        <el-button class="fr" @click="$clearCache()">清除缓存</el-button>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="deadLineList.list"
        border
        select="row"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="selection"
          align="center">
        </el-table-column>
        
        <el-table-column
          label="批次"
          width="60"
          align="center"
        >
          <template slot-scope="scope">
            <span>第{{scope.row.batchNumber+1}}批</span>
          </template>
        </el-table-column>
        
        <el-table-column
          prop="bookId"
          label="书ID"
          width="60"
          align="center">
        </el-table-column>
        
        <el-table-column
          prop="bookName"
          label="书名"
        >
        </el-table-column>
        
        <el-table-column
          prop="writerName"
          label="作者"
        >
        </el-table-column>
  
        <el-table-column
          label="截止时间"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{scope.row.refreshtime | time('long')}}</span>
          </template>
        </el-table-column>
        
        <el-table-column
          align="center"
          label="书籍封面"
        >
          <template slot-scope="scope">
            <img class="bookCover" :src="scope.row.bookImage" :alt="scope.row.bookName">
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-row >
              <a href="javascript:0;">编辑</a>
              <a href="javascript:0;" class="red" @click="delDeadLine(scope.row.id)">删除</a>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        background
        @current-change="pageChange"
        :current-page.sync="deadLineList.pageNum"
        :page-size="deadLineList.pageSize"
        layout="prev, pager, next"
        :total="deadLineList.total">
      </el-pagination>
      
      <el-dialog
        title="修改限时免费"
        class="alertDialog"
        width="420px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogFormVisible">
        <el-form labelWidth="80px">
          <el-form-item label="截止时间" prop="time">
            <el-date-picker
              v-model="formValue.time"
              value-format="yyyy-MM-dd HH:00:00"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="书籍名称">
            <el-select
              v-model="formValue.list"
              multiple
              :multiple-limit="8"
              filterable
              remote
              placeholder="请输入关键词"
              :filter-method="search"
              :remote-method="remoteMethod"
              :loading="loading">
              <el-option
                v-for="(item,$index) in options"
                :key="$index"
                :label="item.bookName"
                :value="item.bookId+','+item.bookName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDeadLine">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
      data(){
          return{
            deadLineList:[],
            dialogFormVisible:false,
            selectValue:'',
            formValue:{
              list:[]
            },
            options:[],
            loading:false
          }
      },
      methods:{
        getDeadLine(page){
          this.$ajax("/admin/sys-getFreetimelimit",{page:page?page:this.$route.params.page},res=>{
            if(res.returnCode===200){
              res.data.list = res.data.list.reverse();
              this.deadLineList = res.data
            }
          })
        },
        editDeadLine(){
          let num = 0,subData;
          let add = (arr)=>{
            this.$ajax("/admin/sys-addfreetimelimit",{
              bookId:arr[0],
              bookName:arr[1],
              batchNumber:this.deadLineList.list?(this.deadLineList.list[0].batchNumber+1):1,
              refreshtime:this.formValue.time
            },res=>{
              if(res.returnCode===200){
                if(num===7){
                  this.dialogFormVisible = false;
                  this.$loading().close();
                  this.getDeadLine();
                  this.$message({message:"添加成功",type:'success'});
                  return false
                }
                num++;
                if(num<=7){
                  add(subData[num].split(','));
                }
              }
            })
          };
          if(this.formValue.time){
            if(this.formValue.list.length!==8){
              this.$message({message:'请添加满8本书籍后提交',type:'warning'})
            }else {
              this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              subData = JSON.parse(JSON.stringify(this.formValue.list));
              add(subData[0].split(','));
            }
          }else {
              this.$message({message:'请先选取时间',type:'warning'})
          }
          
        },
        delDeadLine(id){
              if(!id){
                  let list = [];
                  for(let k=0,len = this.deadLineList.list.length;k<len;k++){
                      if(this.deadLineList.list[0].batchNumber !== this.deadLineList.list[k].batchNumber){
                        this.$message({message:'不同批次，不可一次删除',type:'warning'});
                        return false
                      }
                      list.push(this.deadLineList.list[k].id)
                  }
                  id = list.toString()
              }
              this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).then(() => {
                  this.$ajax("/admin/sys-deltefreetimelimit",{
                      freeTimeLimitid:id
                  },(res)=>{
                    if(res.returnCode===200){
                        this.$message({message:'删除成功',type:'success'});
                        this.getDeadLine(1)
                    }
                  })
              });
          
        },
        remoteMethod(query) {
          if (query !== '') {
            this.loading = true;
            this.$ajax("/stacks-search",{
              keyWord:query,
              isHotWorld:1,
              startPage:1
            },res=>{
              if(res.returnCode===200){
                this.loading = false;
                this.options = res.data.list.filter(item =>{
                    return item.bookName.toLowerCase().indexOf(query.toLowerCase()) > -1;
                });
              }
            });
          } else {
            this.options = [];
          }
        },
        addDeadLine(){
          if(this.$route.params.page!==1){
            this.$router.push({params:{page:1}})
          }
          this.dialogFormVisible = true
        },
        search(){
          console.log("搜索")
        },
        pageChange(page){
          this.$router.push({params:{page:page}})
        }
      },
      created(){
        this.getDeadLine()
      },
      watch:{
          "$route":function () {
            this.getDeadLine()
          }
      },
      computed:{
          time:function () {
            let now = new Date();
            let fut = now.setFullYear(now.getFullYear()+10);
            return  fut + '  -   ' + now
          }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.el-table
  .cell
    .bookCover
      width 60px

</style>
