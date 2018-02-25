<template>
  <div class="user-detail-info">
    <el-alert
      title="操作说明"
      type="info"
      description="请选取推荐位类型，按类型搜索需要修改的推荐位。图片轮播和右侧小图推荐位需要单独上传图片，请编辑完成后点击换图进行图片更换"
      show-icon>
      <div>
        <p><span class="red">注意：</span>修改个人积分时请填写需添加的积分，此值可以是负数，负数即表示减少当前用户的积分</p>
      </div>
    </el-alert>
    <el-row class="mbt20">
  
    </el-row>
    
    <el-form :model="userDetailInfo" status-icon :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="笔名" prop="pseudonym">
            <el-input v-model="userDetailInfo.pseudonym" class="mw220"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="真名" prop="realName">
            <el-input v-model="userDetailInfo.realName" class="mw220"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
  
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="联系地址" prop="userAddress">
            <el-input v-model="userDetailInfo.userAddress" class="mw220"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="邮箱" prop="userEmail">
            <el-input v-model="userDetailInfo.userEmail" class="mw220"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
  
      
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="联系电话" prop="userPhone">
            <el-input v-model="userDetailInfo.userPhone" class="mw220"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="QQ号码" prop="userQQ">
            <el-input v-model="userDetailInfo.userQQ" class="mw220"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
  
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="身份证号" prop="userIdentityCard">
            <el-input v-model="userDetailInfo.userIdentityCard" class="mw220"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="是否锁定" prop="userState">
            <el-select v-model="userDetailInfo.userState" class="mw220" placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
  
  
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="性别" prop="userSex">
            <el-select v-model="userDetailInfo.userSex" class="mw220" placeholder="请选择">
              <el-option label="男" :value="0"></el-option>
              <el-option label="女" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="邮箱" prop="userEmail">
            <el-input v-model="userDetailInfo.userEmail" class="mw220"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
  
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="新浪" prop="userSina">
            <el-input v-model="userDetailInfo.userSina" class="mw220"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="微信" prop="userWeChat">
            <el-input v-model="userDetailInfo.userWeChat" class="mw220"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
  
  
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="积分" prop="integration">
            <el-input v-model="userDetailInfo.integration" class="mw220" :placeholder="'当前积分：'+userDetailInfo.originGrade"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="等级" prop="userGrade">
            <el-input v-model="userDetailInfo.userGrade" class="mw220"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
  
    
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="辣椒" prop="userMoney">
            <el-input v-model="userDetailInfo.userMoney" class="mw220"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="金椒" prop="userGoldenTicket">
            <el-input v-model="userDetailInfo.userGoldenTicket" class="mw220"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
  
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="阅读券" prop="userReadTicket">
            <el-input v-model="userDetailInfo.userReadTicket" class="mw220"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="小米椒" prop="userRecommendTicket">
            <el-input v-model="userDetailInfo.userRecommendTicket" class="mw220"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
  
  
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="VIP等级" prop="vipGrade">
            <el-input v-model="userDetailInfo.vipGrade" class="mw220"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="是否作者" prop="isAuthor">
            <el-select v-model="userDetailInfo.isAuthor" class="mw220" placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
            <!--<el-input v-model="userDetailInfo.isAuthor" class="mw220"></el-input>-->
          </el-form-item>
        </el-col>
      </el-row>
  
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="登录次数" prop="loginCount">
            <el-input v-model="userDetailInfo.loginCount" class="mw220"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="最近登录IP" prop="userIpAddress">
            <el-input v-model="userDetailInfo.userIpAddress" class="mw220"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="出生时间" prop="userBorndate">
            <el-date-picker
              v-model="userDetailInfo.userBorndate"
              type="datetime"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
    
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="注册时间" prop="userCreateDate">
            <el-date-picker
              v-model="userDetailInfo.userCreateDate"
              type="datetime"
              readonly
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="上次登录时间" prop="lastLogTime">
            <el-date-picker
              v-model="userDetailInfo.lastLogTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
    
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="最新登录时间" prop="nowLoginTime">
            <el-date-picker
              v-model="userDetailInfo.nowLoginTime"
              type="datetime"
              readonly
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
  
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="银行名称" prop="bankName">
            <el-input v-model="userDetailInfo.bankName" class="mw220"></el-input>
          </el-form-item>
        </el-col>
    
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="银行账号" prop="bankCardAccount">
            <el-input v-model="userDetailInfo.bankCardAccount" class="mw220"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
  
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="个性签名" prop="userAutograph">
           <el-input type="textarea" v-model="userDetailInfo.userAutograph"></el-input>
            <p><span class="fr">{{userDetailInfo.userAutograph?userDetailInfo.userAutograph.length:0}}/20</span></p>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
  
</template>
<script>
  export default {
    data() {
      var checkAutograph = (rule, value, callback) => {
        if (value && value.length>20) {
          callback(new Error("总长度不可超过20个字符"));
        }else {
          callback()
        }
      };
  
      var checkCradId = (rule, value, callback) => {
        if (value) {
          let state = this.$checkCardId(value);
          if(!state.pass){
            callback(new Error(state.msg))
          }else {
            callback()
          }
        }else {
          callback()
        }
      };
      
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      return {
        rules: {
          userAutograph: [
            { validator: checkAutograph, trigger: 'blur' }
          ],
          userIdentityCard: [
            { validator: checkCradId, trigger: 'blur' }
          ]
        },
        userDetailInfo:{
          userAutograph:'',
          userIdentityCard:''
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let subData = JSON.parse(JSON.stringify(this.userDetailInfo));
            subData.userBorndate = subData.userBorndate + ' 00:00:00';
            this.$ajax("/admin/updateUserInfo",subData,res=>{
              if(res.returnCode===200){
                this.$message({ message:'更新成功',type:'success' });
                this.getUserInfo()
              }
            })
          } else {
            this.$message({message:"请检查信息是否完整",type:'warning'});
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      
      getUserInfo(){
        this.$ajax("/admin/showUserInfo",{userid:this.$route.params.rid},res=>{
            if(res.returnCode===200){
              delete res.data.userPassword;
              res.data.originGrade = JSON.parse(JSON.stringify(res.data.integration));
              res.data.integration = '';
              res.data.lastLogTime = this.$formTime(res.data.lastLogTime,'long');
              res.data.nowLoginTime = this.$formTime(res.data.nowLoginTime,'long');
              res.data.userBorndate = this.$formTime(res.data.userBorndate);
              res.data.userCreateDate = this.$formTime(res.data.userCreateDate,'long');
              this.userDetailInfo = res.data;
            }
        })
      }
    },
    created(){
        this.getUserInfo()
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
p.gray
  line-height 1.5em
  color #666
</style>
