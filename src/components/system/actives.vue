<template>
  <div class="book-recommend-actives">
    <el-alert
      title="操作说明"
      type="info"
      show-icon>
      <div>
        <p>此表为本站活动推荐位，通过编辑即可修改相应的推荐位信息</p>
        <p class="tip">
          <span class="red">操作提示：</span>
          推荐小图为App或网站首页展示
        </p>
      </div>
    </el-alert>
    <el-row :gutter="10" class="mbt20">
      
      <el-col :xs="18" :sm="12" :md="9" :lg="6" :xl="3">
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
          prop="id"
          label="Id"
          width="34"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="终端"
          width="50"
          align="center">
          <template slot-scope="scope">
            {{scope.row.type?'PC':'App'}}
          </template>
        </el-table-column>
  
        <el-table-column
          label="小图"
          align="center"
          minWidth="300"
        >
          <template slot-scope="scope">
            <img class="mw-auto" :src="scope.row.activityImgURL" alt="" @click="handleClick(scope.row,'small')">
          </template>
        </el-table-column>
        
        <el-table-column
          label="大图"
          minWidth="400"
          align="center"
        >
          <template slot-scope="scope">
            <div class="img-wrap" @click="handleClick(scope.row,'big')">
              
               <template v-if="!scope.row.bookId">
                 <img class="active-big-img mw-auto" :src="scope.row.detailsImgAndPageURL" alt="">
               </template>
              <span v-else>{{scope.row.bookId}}</span>
             
            </div>
          </template>
        </el-table-column>
        
        <el-table-column
          label="详情链接"
          align="center"
        >
          <template slot-scope="scope">
            <el-dropdown
              size="medium"
              @command="handleCommand($event,scope.row)"
              trigger="click">
              <a href="javascript:0;" class="el-dropdown-link">
                <span class="red" v-if="!scope.row.showHide">显示</span>
                <span class="green" v-else>隐藏</span>
              </a>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item >{{scope.row.showHide?'显示':'隐藏'}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
       
        <el-table-column
          align="center"
          label="时间"
        >
          <template slot-scope="scope">
           {{scope.row.dateTime|time('long')}}
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    
    <el-dialog
      title="修改推荐位"
      width="420px"
      :before-close="beforeClose"
      :close-on-press-escape="false"
      :visible.sync="dialogFormVisible">
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      <el-form >
        <el-form-item>
          <el-upload
            v-if="(formValue.diaType=='big' && !custom) || formValue.diaType=='small'"
            ref="upload"
            name="file"
            listType="picture"
            :show-file-list="false"
            :on-change="handlePictureCard"
            :on-progress="onUploading"
            :on-success="successBack"
            :on-error="successBack"
            action="/api/admin/uploadActivityRecommendedPositionImg"
            :auto-upload="true">
            <el-button slot="trigger" size="small"  type="primary">{{ formValue.diaType==='small'?'上传小图':'上传大图'}}</el-button>
            <a href="javascript:0;" v-if="formValue.diaType=='big' && !custom" @click="custom=true">添加书籍ID</a>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="custom" labelWidth="90px" label="添加书籍ID">
          <el-input type="text" v-model="formValue.bookId"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editActiveRecommend(formValue.diaType)">更新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
  export default{
    components: {ElForm},
    data(){
      return{
        custom:false,
        currentType:'',
        typeList:[],
        searchValue:'', //推荐位类型ID
        tableList:[],
        dialogFormVisible:false,
        formValue:{},
        restaurant:[],
        timeout:null,
        dialogImageUrl:'',
        dialogVisible:false
      }
    },
    methods:{
      getRecommendList(){
        this.$ajax('/sys-getRecommendedPosition',{},res=>{
          if(res.returnCode===200){
            this.typeList = res.data;
          }
        })
      },
      getActivesRecommend(){
          this.$ajax("/admin/sys-getActivityRecommendedPosition",res=>{
              if(res.returnCode===200){
                  this.tableList = res.data.app.concat(res.data.pc)
              }
          })
      },
      handleClick(val,type){
        this.formValue = {};
        this.$set(this.formValue,'showHide',val.showHide);
        this.$set(this.formValue,'id',val.id);
        this.$set(this.formValue,'diaType',type);
        if(type==='small'){
          this.$set(this.formValue,'activityImgURL','');
        }else {
          this.$set(this.formValue,'detailsImgAndPageURL','');
        }
        this.$nextTick(()=>{
          this.dialogFormVisible = true;
        });
      },
      handleCommand(e,row){
          this.$ajax("/admin/HDupdateActivityRecommendedPosition",{
              id:row.id,
              showHide:row.showHide?0:1
          },res=>{
              if(res.returnCode===200){
                  this.$message({message:res.msg,type:'success'});
                  this.getActivesRecommend()
              }
          })
      },
//      编辑推荐位信息
      editActiveRecommend(){
        let subData = ()=>{
          delete this.formValue.diaType;
          this.$ajax("/admin/HDupdateActivityRecommendedPosition",this.formValue,res=>{
            this.dialogFormVisible = false;
            if(res.returnCode===200){
              this.$message({message:res.msg,type:'success'});
              this.getActivesRecommend();
            }
          })
        };
        if(this.formValue.diaType==='small'){
          if(!this.formValue.activityImgURL ){
            this.$message({message:'请先上传图片',type:'warning'});
          }else {
            subData()
          }
        }else {
          if(!this.custom){
              if(this.formValue.detailsImgAndPageURL){
                subData()
              }else {
                this.$message({message:'请先上传图片',type:'warning'});
              }
          }else {
              if(!this.formValue.bookId){
                this.$message({message:'请填写书籍ID',type:'warning'});
                return false
              }
              subData()
          }
        }
      },
      onUploading(){
          this.$loading({
            lock: true,
            text:'图片上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
      },
      beforeClose(){
        this.custom = false;
        this.dialogFormVisible = false
      },
      handlePictureCard(file,filelist) {
      
      },
      
//        上传成功后回调
      successBack(res,file,filelist){
        this.$loading().close();
        if(res.returnCode===200){
            if(this.formValue.diaType==='small'){
                this.formValue.activityImgURL = res.data
            }else {
                this.formValue.detailsImgAndPageURL = res.data
            }
            this.$message({ message:'上传成功',type:"success" })
        }
      }
    }
    ,created(){
      this.getActivesRecommend()
    }
    ,watch:{
      "searchValue":function () {
        this.search()
      }
    }
    
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.book-actives-recommend
  .el-select
    width 100%
  .el-dialog__body
    padding 10px 20px 30px
    min-height 100px
  .el-table
    .cell
      .bookCover
        width 60px
  .cover-preview
    text-align center
    margin-bottom 20px
    img
      max-height 100px
      max-width 100%
      margin 0 auto
  .ua-footer
    padding-top 10px
    overflow hidden
</style>
