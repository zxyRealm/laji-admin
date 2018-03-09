<template>
    <div class="admin-user-wrap">
      <el-alert
        title=" "
        type="info"
        show-icon>
        <div>
          <p>
           <span>说明：</span> 此表展示的是本站全部{{$route.name==='authorList'?'作者':'普通用户'}}
          </p>
        </div>
      </el-alert>
      <el-row class="mbt20">
      
      </el-row>
      
      <el-row class="mbt20">
        <el-col :xs="20" :sm="16" :md="12" :lg="9" :xl="6">
          <el-input placeholder="请输入内容" v-model="keywords" class="input-with-select" @keyup.enter.native="searchUser">
            <el-select v-model="selectType" slot="prepend" placeholder="请选择">
              <el-option label="笔  名" value="pseudonym"></el-option>
              <el-option label="用户名" value="userName"></el-option>
              <el-option label="真  名" value="realName"></el-option>
              <el-option label="用户ID" value="userId"></el-option>
              <el-option label="手机号" value="userPhone"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
      </el-row>
      
      <el-row class="mbt20">
        <el-table
          ref="multipleTable"
          :data="userList.list"
          border
          select="row"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            type="selection"
            align="center">
          </el-table-column>
          
          <el-table-column
            prop="userId"
            label="ID"
            align="center">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="用户名"
            align="center">
          </el-table-column>
    
          <el-table-column
            prop="pseudonym"
            label="笔名">
          </el-table-column>
          
          <el-table-column
            prop="userMoney"
            label="辣椒"
          >
          </el-table-column>
          
          <el-table-column
            prop="userRecommendTicket"
            label="小米椒"
          >
          </el-table-column>
  
          <el-table-column
            prop="userGoldenTicket"
            label="金椒"
          >
          </el-table-column>
          
          <el-table-column
            prop="userReadTicket"
            label="阅读券"
          >
          </el-table-column>
  
          <el-table-column
            prop="integration"
            label="积分"
          >
          </el-table-column>
          
          <el-table-column
            prop="lastLogTime"
            label="最近登录"
          >
            <template slot-scope="scope">
              <span>{{scope.row.lastLogTime | time('long')}}</span>
            </template>
          </el-table-column>
          
          <el-table-column
            prop="userIpAddress"
            label="最新登录IP"
          >
          </el-table-column>
          
          <el-table-column
            align="center"
            label="状态"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.userState" class="red">锁定</span>
              <span v-else class="green">正常</span>
            </template>
          </el-table-column>
          
          <el-table-column
            prop="userQQ"
            label="QQ号码"
          >
            <template slot-scope="scope">
              {{scope.row.userQQ==0?'':scope.row.userQQ}}
            </template>
          </el-table-column>
          
          <el-table-column
            label="头像"
          >
            <template slot-scope="scope">
              <div class="cover-wrap" @click="dialogShow(scope.row)">
                <a href="javascipt:;">
                  <img class="avatar" :src="scope.row.userHeadPortraitURL" alt="">
                </a>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column
            v-if="$store.state.userInfo && $store.state.userInfo.adminRolemenuanduserrole.updates"
            label="操作"
            align="center">
            <template slot-scope="scope">
              <router-link class="btn" :to="'/user/detail/'+scope.row.userId">
                编辑
              </router-link>
              <el-dropdown
                size="medium"
                @command="handleCommand($event,scope.row)"
                trigger="click">
                <a href="javascript:0;" class="btn">更多</a>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">充值记录</el-dropdown-item>
                  <el-dropdown-item command="b">打赏记录</el-dropdown-item>
                  <el-dropdown-item command="c">订阅记录</el-dropdown-item>
                  <el-dropdown-item command="d">小米椒记录</el-dropdown-item>
                  <template v-if="$route.name==='authorList'">
                    <el-dropdown-item command="e">金椒记录</el-dropdown-item>
                    <el-dropdown-item command="f">月报</el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="mbt20"
          background
          @current-change="pageChange"
          :pageSize="userList.pageSize"
          layout="prev, pager, next, jumper"
          :total="userList.total">
        </el-pagination>
      </el-row>
  
      <pic-cropper
        ref="avatarUpdate"
        action="/api/admin/updateUserAvatarimgUpload"
        :visible.sync="dialogTableVisible"
        @close="closeIt"
        @success="successBack"
        :maxWidth="400"
        :data="{puserid:uploadData.userId}"
        url="/static/img/defaultavatarimg.jpg"
        :aspectRatio="1/1">
      </pic-cropper>
      
    </div>
</template>

<script type="text/ecmascript-6">
  import Cropper from '../common/img_upload.vue'
    export default{
      components:{
        'pic-cropper':Cropper
      },
       data(){
           return{
             dialogTableVisible:false,
             userList:{},
             keywords:'',
             selectType:'pseudonym',
             centerDialogVisible:false,
             fileList:[],
             file:[],
             uploadData:{}
           }
       },
      methods:{
        getUserList(){
          let searchValue = {
            page:this.$route.params.page,
            isAuthor:0
          };
          if(this.$route.name==='userInfo'){
            searchValue = {
              page:1
            };
            this.keywords = this.$route.params.uid;
            this.selectType = 'userId'
          }
          let val = this.$http.trim(this.keywords);
          if(this.selectType && val){
            if((this.selectType==='userId' && this.selectType==='') && Number(val)){
                this.$message({message:'ID必需为数字',type:'warning'});
                return false
            }
            searchValue[this.selectType] = val
          }
          if(this.$route.name==='authorList'){
            searchValue.isAuthor = 1
          }
          searchValue['orderParemeter'] = 'userId';
          this.$ajax("/admin/getUserList",searchValue,res=>{
            if(res.returnCode===200){
              this.userList = res.data
            }else if(res.returnCode===800) {
              this.userList = {}
            }
          })
        },
        searchUser(){
          if(this.$route.params.page!=1){
            this.$router.push({params:{page:1}})
          }else {
              this.getUserList()
          }
          
        },
        pageChange(page){
          this.$router.push({params:{page:page}})
        },
        handleClick(event,val){
          if(event!=='f'){
            let desc = '';
            let subData = {
              userId:val.userId
            };
            let upState = (data)=>{
              this.$ajax("/admin/updateUserInfo",data,res=>{
                if(res.returnCode===200){
                  this.$message({message:'更新成功',type:'success'});
                  this.getUserList()
                }
              })
            };
            switch (event){
              case 'a':
                desc = '辣椒';
                break;
              case 'b':
                desc = '小米椒';
                break;
              case 'c':
                desc = '金椒';
                break;
              case 'd':
                desc = '阅读券';
                break;
              case 'e':
                desc = '积分';
                break;
              case 'f':
                desc = '等级';
                break;
            }
  
            if(event!=='g' ){
              this.$prompt('请输入修改后'+desc,'修改'+desc, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /[0-9]/,
                inputErrorMessage: '请输入数字'
              }).then(({ value }) => {
                if(event!=='g'){
                  switch (event){
                    case 'a':
                      subData.userMoney = value;
                      break;
                    case 'b':
                      subData.userRecommendTicket = value;
                      break;
                    case 'c':
                      subData.userGoldenTicket = value;
                      break;
                    case 'd':
                      subData.userReadTicket = value;
                      break;
                    case 'e':
                      subData.integration = value;
                      break;
                  }
                  upState(subData)
                }
              })
            }else {
              subData.userState = Number(!val.userState);
              upState(subData)
            }
          }else {
              this.$router.push('/user/detail/'+val.userId)
          }
          
        },
        isShow(val){
            if(val){
                this.centerDialogVisible = false
            }else {
                this.centerDialogVisible = true
            }
        },
        
        dialogShow(value){
          this.dialogTableVisible = true;
          this.$set(this.uploadData,'userId',value.userId);
          this.$set(this.uploadData,'userAvatar',value.userHeadPortraitURL)
        },
//        上传封面
        submitUpload(){
          this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.slice(-1);
          this.$myLoad('正在上传中...');
          this.$refs.upload.submit();
        },
//        上传成功回调
        successBack(val){
          if(val.returnCode===200){
            this.getUserList()
          }
        },
//        上传错误回调
        fileError(err) {
          this.$loading().close();
          this.centerDialogVisible =false;
          this.$message({message:err,type:'error'});
        },
        handlePictureCard(file,filelist){
          this.uploadData.userAvatar = file.url;
        },
        closeIt(){
            this.dialogTableVisible = false
        },
        handleCommand(com,row){
          switch (com){
            case 'a':
              this.$router.push({ path:'/statistics/charge/'+row.userId+'/1' }); // 充值
              break;
            case 'b':
                this.$router.push({path:'/statistics/reward/'+row.userId+'/1'}); //打赏
                  break;
            case 'c':
                this.$router.push({ path:'/statistics/subscribe/'+row.userId+'/1' }); //订阅
                break;
            case 'd':
              this.$router.push({ path:'/statistics/recommend/'+row.userId+'/1' }); // 小米椒
              break;
            case 'e':
              this.$router.push({ path:'/statistics/pepper/'+row.userId+'/1' }); // 金椒
              break;
            case 'f':
              this.$router.push({ path:'/author/monthly/'+row.userId }); //月报
              break;
          }
        }
      },
      created(){
         this.getUserList()
      },
      watch:{
        '$route':function () {
          this.getUserList()
        }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.cover-wrap
  .avatar
    width 100%
    max-width 150px
    min-width 30px
    border-radius 50%
.avatar-upload
  .el-dialog__body
    padding 10px 20px 30px!important
  .cover-preview
    .avatar
      width 200px
      height 200px
</style>
