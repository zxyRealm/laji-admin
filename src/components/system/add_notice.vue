<template>
  <div class="sys-notice-wrap">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/system/notice">新闻公告</el-breadcrumb-item>
      <el-breadcrumb-item >{{$route.name=='sysEditNotice'?'编辑公告':'新增公告'}}</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-alert
      title="操作说明"
      type="info"
      show-icon>
      <div>
        可根据需求添加相应类型的公告通知
      </div>
    </el-alert>
    <el-row class="mbt20">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="所属类型" prop="region">
          <el-select v-model="ruleForm.menuId" placeholder="请选择活动区域">
            <el-option label="首页公告" :value="1"></el-option>
            <el-option label="滚动公告" :value="2"></el-option>
            <el-option label="福利公告" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标    题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="发布人" prop="adminName">
          <el-input v-model="ruleForm.adminName"></el-input>
        </el-form-item>
        <el-form-item label="内容详情" prop="content">
         <pre>
           <quill-editor
               ref="myTextEditor"
               v-model="ruleForm.content"
               :options="editorOption"
               @change="onEditorChange($event)"
               @ready="onEditorReady($event)">
           </quill-editor>
         </pre>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
         
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>
<script type="text/ecmascript-6">
  export default{
    data(){
      var validateContent = (rule, value, callback) => {
        if (this.$http.trim(value).length<1) {
          callback(new Error('请添加详情内容！'));
        } else {
          callback();
        }
      };
      return{
        ruleForm: {
          adminName: '', //发布人
          title:'', //标题
          menuId:'',
//          date1: new Date(), //发布时间
          delivery: false,
          type: [],
          order:1,
          content: '' //公告内容
        },
        editorOption:{
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image']
            ]
          },
          keyboard:{
            bindings:{
              tab: {
                key: 9,
                handler: function(val) {
                }
              },
              custom: {
                key: 'B',
                shiftKey: true,
                handler: function(range, context) {
                }
              },
            }
          }
        },
        editKey:null,
        layedit:null,
        rules: {
          menuId:{ required:true ,message:'请选取类型', trigger:'blur' },
          title: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, message: '长度不可少于3个字符', trigger: 'blur' }
          ],
          adminName:[
            { required:true ,message:'请填写发布人' , trigger:'blur' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          content: [
            { required:true,message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      };
    },
    methods:{
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            let url = '/admin/addPublishanotice';
            if(this.$route.name==='sysEditNotice'){
                url = '/admin/updatePublishanotice'
            }
          if (valid) {
            this.$ajax(url,this.ruleForm,res=>{
              if(res.returnCode===200){
                this.$message({message:res.msg,type:'success'});
                if(this.$route.name==='sysEditNotice'){
                  this.getNoticeById()
                }
              }
            })
          } else {
            this.$message({message:'请完善信息后提交！',type:'warning'});
            return false;
          }
        });
      },
      
      getNoticeById(){
        this.$ajax("/admin/sys-getNoticeById",{
            noticeid:this.$route.params.id
        },res=>{
          if(res.returnCode===200){
            delete res.data.releaseDate;
            this.ruleForm = res.data;
          }
        },'get')
      },
      resetForm() {
        this.getNoticeById()
      },
      onEditorChange(editor,html,text){
//
      },
      onEditorReady(editor){
//
      }
    },
    created(){
        if(this.$route.name==='sysEditNotice'){
          this.getNoticeById();
        }
    },
    
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.sys-notice-wrap
  pre
    line-height 0
.ql-editor
  height 600px!important
.ql-toolbar
  line-height 1.2
  
.ql-toolbar
  .ql-picker
    &.ql-expanded
      .ql-picker-options
        margin-top 1px!important
</style>
