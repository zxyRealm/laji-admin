<template>
    <div>
      <el-alert
        title="操作说明"
        type="info"
        description="限时免费按照批次更新，每批固定8本书籍，每批次的限免时长为上一批次截止时间到本批次截止时间；设置当前批次截止时间时必须大于上一批次的截止时间"
        show-icon>
      </el-alert>
      <el-row class="mbt20">
        <el-button type="primary" plain @click="addDeadLine">添加</el-button>
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
              <el-button size="mini" >编辑</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        background
        @current-change="pageChange"
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
              reserve-keyword
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
        getDeadLine(){
          this.$ajax("/admin/sys-getFreetimelimit",{page:this.$route.params.page},res=>{
            if(res.returnCode===200){
              this.deadLineList = res.data
            }
          })
        },
        editDeadLine(){
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
              this.formValue.list.forEach((item,index)=>{
                let arr = item.split(",");
                this.$ajax("/admin/sys-addfreetimelimit",{
                  bookId:arr[0],
                  bookName:arr[1],
                  batchNumber:this.deadLineList.list?(this.deadLineList.list[0].batchNumber+1):1,
                  refreshtime:this.formValue.time
                },res=>{
                  if(res.returnCode===200 && index===7){
                    this.$loading().close();
                    this.$message({message:"添加成功",type:'success'})
                  }
                })
              })
            }
          }else {
              this.$message({message:'请先选取时间',type:'warning'})
          }
          
       
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
