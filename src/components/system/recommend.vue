<template>
   <div class="book-recommend">
     <el-alert
       title="操作说明"
       type="info"
       show-icon>
       <p>
         请选取推荐位类型，按类型搜索需要修改的推荐位。图片轮播和右侧小图推荐位需要单独上传图片，请编辑完成后点击换图进行图片更换
       </p>
       <p>
         <span class="red">特别提示：</span>更换网站分类推荐时请添加当前分类下的书籍，否则将无法添加成功
       </p>
     </el-alert>
     <el-row :gutter="10" class="mbt20">
       <el-col :xs="18" :sm="12" :md="9" :lg="6" :xl="3">
         <el-select v-model="searchValue" @change="search" placeholder="请选择" :filter-method="search">
           <el-option
             v-for="(item,index) in typeList"
             :key="index"
             :label="item.recommendName"
             :value="index">
           </el-option>
         </el-select>
       </el-col>
       <el-button class="fr" @click="$clearCache()">清除缓存</el-button>
     </el-row>
     <el-row >
       <el-table
          ref="multipleTable"
         :data="tableList"
         border
         select="row"
         tooltip-effect="dark"
         style="width: 100%">
         
         <el-table-column
           type="selection"
           align="center">
         </el-table-column>
         
         <el-table-column
          prop="recommendOrder"
          label="序列号"
          width="60"
          align="center"
         >
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
           prop="recommendName"
           label="推荐类型"
           >
         </el-table-column>
         
         <el-table-column
           align="center"
           label="书籍封面"
           >
           <template slot-scope="scope">
             <img class="bookCover"
                  :class="(scope.row.recommendType==5 || scope.row.recommendType==4 || scope.row.recommendType==3)?'mw-auto':''"
                  :src="scope.row.bookImage"
                  :alt="scope.row.bookName">
           </template>
         </el-table-column>
         
         <el-table-column
           label="操作"
           width="80"
           align="center">
           <template slot-scope="scope">
             <el-row class="mb10" v-if="typeList[searchValue].recommendType==3 || typeList[searchValue].recommendType==4 || typeList[searchValue].recommendType==5">
               <el-button  size="mini" @click="handleClick(scope.row,'pic')">换图</el-button>
             </el-row>
             <el-row >
               <el-button size="mini" @click="handleClick(scope.row,'edit')" >编辑</el-button>
             </el-row>
           </template>
         </el-table-column>
       </el-table>
     </el-row>
     
     <el-dialog
       :title="formValue.type=='edit'?'修改推荐位':'上传图片'"
       width="420px"
       :close-on-press-escape="false"
       :visible.sync="dialogFormVisible">
       <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
       <div class="cover-wrap"  v-if="formValue.type=='pic'">
         <div class="cover-preview">
           <img :src="formValue.bookImage" alt="">
         </div>
         <el-upload
           class="upload-recommend"
           ref="upload"
           name="file"
           :data="{ recommendid:formValue.id }"
           :show-file-list="false"
           :on-change="handlePictureCard"
           :on-success="successBack"
           action="/api/admin/updateimgUpload"
           :auto-upload="false">
           <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
           <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传图片</el-button>
         </el-upload>
       </div>
      
       <el-form label-width="70px" v-else>
         <el-form-item label="书籍名称" >
           <el-select
             v-model="completeValue"
             filterable
             remote
             clearable
             @change="handleSelect"
             :remote-method="remoteMethod"
             placeholder="请输入书名"
             :loading="loading">
             <el-option
               v-for="(item,$index) in restaurant"
               :key="item.id"
               :label="item.bookName"
               :value="item">
             </el-option>
           </el-select>
         </el-form-item>
         <el-form-item v-if="formValue.recommendName && formValue.recommendName.indexOf('分类推荐')>-1" label="分类名称" prop="recommendName">
           <el-input v-model="formValue.recommendName"></el-input>
         </el-form-item>
       </el-form>
       <div v-if="formValue.type=='edit'" slot="footer" class="dialog-footer">
         <el-button @click="dialogFormVisible = false">取 消</el-button>
         <el-button type="primary" @click="editRecommend">确 定</el-button>
       </div>
     </el-dialog>
   </div>
</template>

<script type="text/ecmascript-6">
    export default{
      data(){
        return{
          loading:false,
          currentType:'',
          typeList:[],
          searchValue:'', //推荐位类型ID
          tableList:[],
          dialogFormVisible:false,
          formValue:{},
          completeValue:'',
          restaurant:[],
          timeout:null,
          dialogImageUrl:'',
          dialogVisible:false,
          bookclassid:'',
          bookClassList:''
        }
      },
      methods:{
        getRecommendList(){
          this.$ajax('/sys-getRecommendedPosition',{},res=>{
            if(res.returnCode===200){
              this.typeList = res.data;
              this.searchValue = 0;
              this.search()
            }
          })
        },
        getBookClass(){
            this.$ajax("/ranking-classification",{},res=>{
              if(res.returnCode===200){
                  this.bookClassList = res.data
              }
            },'get')
        },
        search(){
          this.$ajax("/sys-getRecommendedPositionByType",{
            RecommendpositionTypeid:this.typeList[this.searchValue].recommendType
          },res=>{
              if(res.returnCode===200){
                this.tableList = this.typeList[this.searchValue].recommendType===7?res.data.reverse():res.data
              }
          })
        },
        remoteMethod(query) {
          let str = this.$http.trim(query);
          if (str.length>0) {
            this.loading = true;
            let data = {
              keyWord:str,
              isHotWorld:1,
              startPage:1
            };
            if(this.typeList[this.searchValue].recommendName.indexOf("分类推荐")>-1){
              data.bookClassificationId = this.typeList[this.searchValue].bookClassificationId
            }
            this.$ajax("/stacks-search",data,res=>{
              this.loading = false;
              if(res.returnCode===200){
                res.data.list.forEach((item)=>{
                  item.value = item.bookName + " (" +item.bookId+")"
                });
                this.restaurant = res.data.list.filter(item => {
                  return item.bookName.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1;
                });
              }
            });
          } else {
            this.restaurant = [];
          }
        },
        handleClick(val,type){
          let calssid = this.typeList[this.searchValue].bookClassificationId;
          
          this.formValue = {};
//          for(let k=0,len=this.bookClassList.length;k<len;k++){
//              if(Number(calssid)===this.bookClassList[k].id){
//                console.log(val.recommendName.slice(0,val.recommendName.lastIndexOf("-")) + "-" + this.bookClassList[k].classificationName);
////              this.$set(this.formValue,'recommendName',val.recommendName);
//                break;
//              }
//          }
          this.$set(this.formValue,'type',type);
          this.$set(this.formValue,'bookImage',val.bookImage);
          this.$set(this.formValue,'id',val.id);
          this.dialogImageUrl = '';
          this.dialogFormVisible = true;
        },
        handleSelect(k){
          this.formValue.bookimg = k.bookImage;
          this.formValue.bookWriterId = k.bookWriterId;
          this.formValue.bookId = k.bookId;
        },
//      编辑推荐位信息
        editRecommend(){
           if(this.formValue.bookId){
               this.$ajax("/admin/updateActivityRecommendedPosition",this.formValue,res=>{
                 this.dialogFormVisible = false;
                 if(res.returnCode===200){
                   this.completeValue = '';
                   this.formValue = {};
                   this.search();
                 }
               })
           }else {
              console.log(this.formValue)
           }
        },
        handlePictureCard(file) {
          this.formValue.bookImage = file.url;
        },
//        手动上传图片
        submitUpload() {
          this.$refs.upload.submit();
        },
//        上传成功后回调
        successBack(res,file){
            this.$message(res.msg);
            this.search();
            this.dialogFormVisible = false;
        }
      }
      ,created(){
        this.getBookClass();
        this.getRecommendList()
      }
      
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.book-recommend
  .el-select
    width 100%
  .el-dialog__body
    padding 10px 20px 30px
.el-table
  .cell
    .bookCover
      width 60px
      /*height 140px*/

</style>
