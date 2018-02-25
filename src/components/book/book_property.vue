<template>
    <div class="book-property-wrap">
      <el-alert
        title="操作说明"
        type="info"
        show-icon>
        <div>
          <p>
            您可以通过点击标签名或分类名来修改相关信息，也可以直接删除。
          </p>
          <p>
            <span class="red">提示：</span>删除标签或分类会导致原来书籍标签或分类丢失，请谨慎使用！
          </p>
          <p>
            <span>注意事项：</span>1.分类图标上传大图尺寸414X180、小图尺寸70X70，请严格按照尺寸要求操作
          </p>
        </div>
      </el-alert>
      
      <el-row class="mbt20 book-property-list">
        <h2 class="tab-title">书籍标签</h2>
        <el-button
          v-for="item in baseInfo.booklablesList"
          :key="item.id"
          :style="{borderColor:item.bookColor,color:item.bookColor}"
          size="small"
          @click="handleEdit('label',item)"
        >{{item.bookLableName}}</el-button>
        <el-button size="small" @click="handleEdit('label')" >+ 新建标签</el-button>
      </el-row>
      
      <el-row class="mbt20 book-property-list">
        <h2 class="tab-title">书籍分类</h2>
        <el-button
          v-for="item in baseInfo.classificationList"
          :key="item.id"
          size="small"
          type="primary"
          plain
          @click="handleEdit('class',item)"
        >{{item.classificationName}}</el-button>
        
        <el-button size="small" @click="handleEdit('class')">+ 新建分类</el-button>
      </el-row>
      <!--书籍属性设置管理-->
      
      <el-dialog
        class="alertDialog"
        title="编辑标签"
        :visible.sync="dialogVisible">
        <el-form :model="subData" ref="propertyForm" :rules="rules" label-width="66px" class="property-ruleForm">
          <template v-if="currentType==='label'">
            <el-form-item label="颜  色" prop="bookColor">
              <el-color-picker v-model="subData.bookColor"></el-color-picker>
            </el-form-item>
            <el-form-item label="标签名" prop="bookLableName">
              <el-input type="text" v-model="subData.bookLableName" placeholder="请输入标签名"></el-input>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="图  标">
              <img class="class-icon" v-if="subData.classificationmaxlco" :src="subData.classificationmaxlco" alt="">
              <el-upload
                v-if="dialogType=='edit'"
                class="upload-demo"
                :show-file-list="false"
                :on-success="uploadEnd1"
                :on-error="uploadEnd1"
                :on-progress="uploadProgress1"
                action="/api/admin/updateClassification"
                :data="{id:subData.id,type:1}">
                <el-button size="small" type="primary">
                  <span v-if="load.max">上传大图</span>
                  <span v-else><i class="el-icon-loading"></i> 正在上传中...</span>
                </el-button>
              </el-upload>
  
              <img class="class-icon" v-if="subData.classificationIco" :src="subData.classificationIco" alt="">
              <el-upload
                v-if="dialogType=='edit'"
                class="upload-demo"
                :show-file-list="false"
                :on-success="uploadEnd2"
                :on-error="uploadEnd2"
                :on-progress="uploadProgress2"
                action="/api/admin/updateClassification"
                :data="{id:subData.id,type:2}">
                <el-button size="small" type="primary">
                  <span v-if="load.min">上传小图</span>
                  <span v-else><i class="el-icon-loading"></i> 正在上传中...</span>
                </el-button>
              </el-upload>
              
            </el-form-item>
            <el-form-item label="序列号" prop="orders">
              <el-input type="text" v-model="subData.orders" placeholder="请输入序列号"></el-input>
            </el-form-item>
            <el-form-item label="分类名" prop="classificationName">
              <el-input type="text" v-model="subData.classificationName" placeholder="请输入分类名"></el-input>
            </el-form-item>
          </template>
        </el-form>
        
        <span slot="footer" class="dialog-footer">
          <template v-if="dialogType==='edit'">
            <el-button type="danger" @click="handleDel('del')">删 除</el-button>
            <el-button type="primary" @click="handleDel('update')">更 新</el-button>
          </template>
          <el-button v-else type="primary" @click="handleDel('add')">添 加</el-button>
        </span>
      </el-dialog>
      
    </div>
</template>

<script>
  export default {
    data() {
      return {
        dialogType:'edit',
        currentType:'label',
        baseInfo:{},
        load:{
          max:true,
          min:true
        },
        dialogVisible:false,
        subData:{
          bookColor:'',
          bookLableName:''
        },
        rules: {
           bookColor: [
            { required: true, message: '请选取颜色', trigger: 'blur' }
          ],
           bookLableName: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ],
          classificationName:[
            { required: true, message: '请输入分类名', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      getBookBaseInfo(){
        this.$ajax("/book-EditBookEcho",'',res=>{
          if(res.returnCode===200){
            this.baseInfo = res.data;
          }
        },'get')
      },
      handleEdit(type,item){
        this.dialogVisible = true;
        this.currentType = type;
        this.$nextTick(()=>{
          if(item){
            this.dialogType = 'edit';
            this.subData = JSON.parse(JSON.stringify(item));
          }else {
            this.dialogType = 'add';
            if(type==='label'){
              this.subData = {
                bookColor:'',
                bookLableName:''
              }
            }else {
              this.subData = {
                classificationName:'',
                classificationmaxlco:'',
                classificationIco:'',
                orders:this.baseInfo.classificationList.length+1
              }
            }
          }
        });
      },
      handleDel(type) {
        let edit = (url,id)=>{
          this.$refs['propertyForm'].validate((valid) => {
            if (valid) {
              this.$myLoad(type==='del'?'正在删除中...':'正在更新中...');
              this.$ajax(url,id,res=>{
                this.dialogVisible = false;
                this.$loading().close();
                if(res.returnCode===200){
                  this.$message({message:type==='del'?'删除成功':'更新成功',type:'success'});
                  this.getBookBaseInfo()
                }
              });
            }
          });
          
        };
        
       
        if(this.currentType==='label'){
            if(type==='del'){
              edit('/admin/deleteAttributeLable',{id:this.subData.id})
            }else if(type==='update') {
              edit('/admin/updateAttributeLable',this.subData)
            }else {
              edit('/admin/addAttributeLable',this.subData)
            }
        }else if(this.currentType==='class'){
            if(type==='del'){
              edit('/admin/deleteClassification',{id:this.subData.id})
            }else if(type==='update') {
              edit('/admin/updateClassificationData',this.subData)
            }else {
              edit('/admin/addClassification',this.subData)
            }
        }
      },
      uploadProgress1(event){
        console.log(event);
        this.load.max = false;
      },
      uploadEnd1(res){
          this.load.max = true;
          if(res.returnCode===200){
            this.subData.classificationmaxlco = res.data;
            this.getBookBaseInfo();
          }else {
              this.$message({message:res.msg,type:'warning'})
          }
      },
      uploadProgress2(){
        this.load.min = false;
      },
      uploadEnd2(res){
        this.load.min = true;
        if(res.returnCode===200){
          this.subData.classificationIco = res.data;
          this.getBookBaseInfo();
        }else {
          this.$message({message:res.msg,type:'warning'})
        }
      },
    },
    created(){
      this.getBookBaseInfo();
     
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.book-property-wrap
  .class-icon
    max-width 100%
    margin-bottom 15px
  .book-property-list
    .el-button
      margin-left 0!important
      margin-right: 15px;
      margin-bottom 15px
      .el-tag__close:hover
        background #ff4d51
        color #fff
  .property-ruleForm
     img
        max-height 100px
        margin-bottom 0
.tab-title
  font-size 22px
  line-height 40px
  margin-bottom  20px
  

.button-new-tag
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;

.input-new-tag
  display inline-block
  width: 90px;
  margin-left: 10px;
  
</style>
