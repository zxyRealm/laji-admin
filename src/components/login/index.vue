<template>
    <div class="login-wrap">
      <el-dialog
        custom-class="login-dialog"
        title="登录"
        :close-on-click-modal="false"
        :show-close="false"
        :modal="false"
        :visible.sync="visible"
        width="380px">
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="60px" class="login-ruleForm">
          <el-form-item label="用户名" prop="adminName" class="border">
            <el-input type="text" v-model="ruleForm2.adminName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密  码" prop="adminPassword" class="border">
            <el-input type="password" @keyup.enter.native="submitForm('ruleForm2')" v-model="ruleForm2.adminPassword" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleForm2')">登陆</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
      data(){
        var checkName = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('用户名不能为空'));
          }else {
              return callback()
          }
        };
        var validatePass = (rule, value, callback) => {
          if (!this.$http.trim(value).length) {
            callback(new Error('请输入密码'));
          } else {
            callback();
          }
        };
        return{
          visible:true,
          ruleForm2: {
            adminPassword: '',
            adminName: ''
          },
          rules2: {
            adminPassword: [
              { validator: validatePass, trigger: 'blur' }
            ],
            adminName: [
              { validator: checkName, trigger: 'blur' }
            ]
          }
        }
      },
      methods:{
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              const loading = this.$loading({
                lock: true,
                text: '正在登陆中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              this.$ajax("/admin-Logins",this.ruleForm2,(res)=>{
                  this.$loading().close();
                  if(res.returnCode===200){
                      this.$message({message:"登录成功",type:'success'});
                      this.$store.state.userInfo = res.data;
                      this.$cookie('login_key',res.data.adminInfo.userId);
                      sessionStorage.setItem('user_info',JSON.stringify(res.data));
                      this.$router.push("/index")
                  }
              },'post','json')
            } else {
              this.$message({message:'请完善用户名和密码',type:'warning'});
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
.login-wrap
  .el-dialog
    &.login-dialog
        margin-top 30vh!important
  position relative
  height 100%
  min-width 980px
  background url('login-bg@x1_01.jpg') no-repeat center top
  /*overflow hidden*/
  overflow-y auto
  .login-content
    position absolute
    top 30%
    left 50%
    margin-left -200px
    margin-top -164px
    width 400px
    padding 15px 30px
    text-align right
    border-radius 5px
    box-sizing border-box
    background #fff
    box-shadow 2px 2px 6px #666
    
    h2
      font-size 20px
      line-height 46px
      margin-bottom 20px
    .el-form-item
      input
        /*font-size 20px*/
      &.border
        border 1px solid #ddd
        border-radius 5px
        .el-input__inner
          border none
      .el-form-item__label
        padding 0
      &:last-child
        border none
        background-color transparent
        
        
        
@media screen and (max-width: 750px)
  .el-form-item
    input
       font-size 48px

</style>
