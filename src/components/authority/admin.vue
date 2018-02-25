<template>
  <div class="admin-user-wrap">
    <el-alert
      title="操作说明"
      type="info"
      show-icon>
      <p>
        此表是本站全部管理员信息
      </p>
      <p>
        <span class="red">ps：</span>添加新用户时第一次设置权限是初始化用户权限，设置用户权限是需要进行第二次操作
      </p>
    </el-alert>
    
    <el-row class="mbt20">
      <el-button size="medium" @click="dialogSync('add')">添加</el-button>
    </el-row>
    
    <el-row class="mbt20">
      <el-table
        ref="multipleTable"
        :data="adminMemberList.list"
        border
        select="row"
        style="width: 100%">
        <el-table-column
          type="selection"
          align="center">
        </el-table-column>
        
        <el-table-column
          prop="userId"
          label="ID"
          width="50"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户名"
          align="center">
        </el-table-column>
        
        <el-table-column
          prop="lastLogTime"
          label="最近登录"
        >
          <template slot-scope="scope">
            <span>{{scope.row.loginTime | time('long')}}</span>
          </template>
        </el-table-column>
        
        <el-table-column
          prop="loginIP"
          label="最新登录IP"
        >
        </el-table-column>
        
        <el-table-column
          align="center"
          label="状态"
          width="50"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.userState" class="red">锁定</span>
            <span v-else class="green">正常</span>
          </template>
        </el-table-column>
       
        <el-table-column
          v-if="$store.state.userInfo && $store.state.userInfo.adminRolemenuanduserrole.updates"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <a class="btn" @click="editMemberInfo(scope.row)">
              修改密码
            </a><br>
            <a class="btn" @click="dialogSync('edit',scope.row)">
              权限
            </a>
            <a href="javascript:0;" @click="delMember(scope.row)" class="btn red">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="adminMemberList.list"
        class="mbt20"
        background
        @current-change="pageChange"
        :pageSize="adminMemberList.pageSize"
        layout="prev, pager, next, jumper"
        :total="adminMemberList.total">
      </el-pagination>
    </el-row>
    
    <el-dialog
      :title="dialogType==='add'?'添加新用户':'权限管理'"
      class="dialog-submit-form"
      :visible.sync="dialogVisible"
      :width="dialogType==='add'?'380px':'680px'">
      <el-form
        ref="addMember"
        v-if="dialogType==='add'"
        label-width="80px"
        size="medium"
        :model="memberInfo">
        <el-form-item
          label="用户名"
          :rules="[{required:true,message:'请填写用户名'}]">
          <el-input v-model="memberInfo.userName"></el-input>
        </el-form-item>
        <el-form-item
          :rules="[{required:true,message:'请填写密码'}]"
          label="密  码">
          <el-input v-model="memberInfo.userPassword"></el-input>
        </el-form-item>
        <el-form-item class="submit-item">
          <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="addAdminMember('addMember')">添 加</el-button>
        </el-form-item>
      </el-form>
  
      <el-form v-if="dialogType==='edit'" label-width="50px" ref="droitInfoForm" size="medium" :model="droitInfo">
        <el-row :gutter="10" class="mb20">
          <el-col :span="12">
            <el-form-item label="用 户">
              <el-input readonly v-model="droitInfo.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审 核">
              <el-select v-model="droitInfo.toExamine" placeholder="请选择">
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="10" class="mb20">
          <el-col :span="12">
            <el-form-item label="添 加">
              <el-select v-model="droitInfo.adds" placeholder="请选择">
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="删 除">
              <el-select v-model="droitInfo.deletes" placeholder="请选择">
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
  
        <el-row :gutter="10" class="mb20">
          <el-col :span="12">
            <el-form-item label="查 看">
              <el-select v-model="droitInfo.shows" placeholder="请选择">
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修 改">
              <el-select v-model="droitInfo.updates" placeholder="请选择">
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row class="mb20">
          <el-form-item label="菜 单">
            <el-select v-model="droitInfo.menuList" multiple placeholder="请选择">
                <el-option v-for="item in droitList" :label="item.menuName" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
  
        <el-form-item class="submit-item">
            <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="editDroitInfo('edit')">更 新</el-button>
        </el-form-item>
      </el-form>
      
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">

  export default{
    data(){
      return{
        dialogType:'add',
        dialogVisible:false,
        adminMemberList:{},
        keywords:'',
        selectType:'',
        centerDialogVisible:false,
        fileList:[],
        file:[],
        uploadData:{},
        memberInfo:{
          userName:'',
          userPassword:''
        },
        droitInfo:{
            shows:1,
            deletes:0,
            updates:0,
            adds:0,
            toExamine:1,
            menuList:[]
        },
        typeList:[],
        droitList:[]
      }
    },
    methods:{
      getMemberList(){
        let searchValue = {
          page:this.$route.params.page
        };
        this.$ajax("/admin/getAdminInfoList",searchValue,res=>{
          if(res.returnCode===200){
            this.adminMemberList = res.data
          }else if(!res.data) {
            this.adminMemberList = {}
          }
        })
      },
      delMember(row){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax("/admin/deleteAdminInfo",{id:row.userId},res=>{
             this.dialogVisible = false;
            if(res.returnCode===200){
              this.getMemberList();
              this.$message({message:res.msg,type:'success'})
            }
          })
        });
      },
      addAdminMember(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$ajax("/admin/addAdminInfo",this.memberInfo,res=>{
                this.dialogVisible = false;
                if(res.returnCode===200){
                    this.getMemberList();
                    this.$message({ message:res.msg,type:'success'})
                }
              })
          } else {
            return false;
          }
        });
      },
      editDroitInfo(type,val){
          let sub;
          if(type==='edit'){
              let subData = JSON.parse(JSON.stringify(this.droitInfo));
              subData.menuList = subData.menuList.toString();
              subData.type = 2;
              sub = subData
          }else {
              sub = {
                  userId:val.userId,
                  type:type==='search'?1:3
              }
          }
          this.$ajax('/admin/getAdminRolemenuanduserrole',sub ,res=>{
              if(type!=='search'){
                this.dialogVisible =false;
              }
              if(res.returnCode===200){
                  if(type==='search'){
                    res.data.menuList = JSON.parse('[' + String(res.data.menuList.split(",")) + ']');
                    this.droitInfo = res.data;
                    this.$set(this.droitInfo,'userName',val.userName);
                  }else {
                      this.$message({ message:res.msg,type:'success' })
                  }
              }else if(!res.data && type==='search'){
                  this.droitInfo.menuList = [];
              }
          })
      },
      editMemberInfo(row){
        this.$prompt('请输入新密码', '修改密码', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[a-zA-Z\d_]{6,18}/,
          inputErrorMessage: '密码只能包含数字、字母和_，长度6-18位'
        }).then(({ value }) => {
          this.$ajax('/admin/updateAdminInfo',{
              id:row.id,
              userPassword:value
          },res=>{
              if(res.returnCode===200){
                this.$message({
                  type: 'success',
                  message: res.msg
                });
              }
          });
          
        }).catch(() => {
        });
      },
      getDroitList(){
          this.$ajax("/admin-RefreshRoleMenu",'',res=>{
              if(res.returnCode===200){
                  this.droitList = JSON.parse(sessionStorage.getItem('user_info')).roleMenuList
              }
          })
      },
      pageChange(page){
        this.$router.push({ params:{ page:page } })
      },
      dialogSync(type,row){
        this.dialogType = type;
        this.dialogVisible = true;
        if(type==='edit'){
            this.$set(this.droitInfo,'userName',row.userName);
            this.$set(this.droitInfo,'userId',row.userId);
            console.log(this.droitInfo);
            this.getDroitList();
            this.editDroitInfo('search',row)
        }
      }
    },
    created(){
      this.getMemberList()
    },
    watch:{
      '$route':function () {
        this.getMemberList()
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
