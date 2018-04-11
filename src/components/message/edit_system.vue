<template>
  <div class="sys-notice-wrap">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/message/system">消息管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/message/system">系统消息</el-breadcrumb-item>
      <el-breadcrumb-item >{{$route.name=='mesEditMessage'?'编辑消息':'新增消息'}}</el-breadcrumb-item>
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
        <el-form-item label="标    题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="发布人" prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="内容详情" prop="messageContent">
         <el-input class="mc-wrap" type="textarea" :rows="5" v-model="ruleForm.messageContent"></el-input>
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
      let validateContent = (rule, value, callback) => {
        if (this.$http.trim(value).length<1) {
          callback(new Error('请添加详情内容！'));
        } else {
          callback();
        }
      };
      return{
        ruleForm: {
          userId:'',
          userName: '', //发布人
          title:'', //标题
          messageContent: '' //公告内容
        },
        rules: {
          title: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, message: '长度不可少于3个字符', trigger: 'blur' }
          ],
          userName:[
            { required:true ,message:'请填写发布人' , trigger:'blur' }
          ],
          messageContent: [
            { required:true,message: '请填写内容', trigger: 'blur' }
          ]
        }
      };
    },
    methods:{
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          let url = '/admin/sys-addsMessage';
          if(this.$route.name==='mesEditMessage'){
            url = '/admin/updatePublishanotice'
          }
          if (valid) {
            let copy = JSON.parse(JSON.stringify(this.ruleForm));
            copy.messageContent = copy.messageContent.replace(/ +|　+/g,'');
            this.$ajax(url,copy,res=>{
              if(res.returnCode===200){
                this.$message({message:res.msg,type:'success'});
                if(this.$route.name==='mesEditMessage'){
                  this.getMessageById()
                }
              }
            })
          } else {
            this.$message({message:'请完善信息后提交！',type:'warning'});
            return false;
          }
        });
      },
      getMessageById(){
        this.$ajax("/admin/sys-getMessageById",{
          noticeid:this.$route.params.id
        },res=>{
          if(res.returnCode===200){
            delete res.data.releaseDate;
            this.ruleForm = res.data;
          }
        },'get')
      },
      resetForm() {
        this.getMessageById()
      }
    },
    created(){
      this.ruleForm.userId = this.$store.state.userInfo.adminInfo.userId;
      if(this.$route.name==='mesEditMessage'){
        this.getMessageById();
      }
    },
    watch:{
        "ruleForm.messageContent":function (val) {
          this.ruleForm.messageContent = val.replace(/\s*\n\s*/g,'\n　　')
        }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .sys-notice-wrap
    .mc-wrap
      >textarea
        text-indent 2em
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
