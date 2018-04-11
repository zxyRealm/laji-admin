<template>
  <div class="layui-layout-admin-wrapper">
    <div class="layui-layout layui-layout-admin" style="">
    <div class="layui-header">
      <div class="layui-logo">辣鸡小说 后台管理</div>
      <!-- 头部区域（可配合layui已有的水平导航） -->
      <ul class="layui-nav layui-layout-right">
        <li class="layui-nav-item">
          <a href="javascript:;">
            <img src="/static/img/avatar.jpg" class="layui-nav-img">
            {{$store.state.userInfo.userName}}
          </a>
          <dl class="layui-nav-child">
            <dd><a href="">基本资料</a></dd>
            <dd><a href="">安全设置</a></dd>
          </dl>
        </li>
        <li class="layui-nav-item"><a @click="exit" >退出</a></li>
      </ul>
    </div>
    <div class="layui-side layui-bg-black">
      <div class="layui-side-scroll">
        <el-menu
          :default-active="currentUrl"
          class="el-menu-vertical-side"
          background-color="#393D49"
          text-color="#fff"
          router
        >
          <template v-for="(item,$index) in sideNavList">
            <el-submenu v-if="item.ChildMenu && item.ChildMenu.length>0" :index="'0'+$index">
              <template slot="title">
                <img :src="item.icoURL" alt="">
                <span slot="title">{{item.menuName}}</span>
              </template>
              <el-menu-item
                v-for="(item2,index2) in item.ChildMenu"
                :key="index2"
                :index="item2.menuURL"
                :route="{path:item2.menuURL}">
                {{item2.menuName}}
              </el-menu-item>
            </el-submenu>
            
            <el-menu-item
              :index="item.menuURL"
              :route="{path:item.menuURL}"
              v-else>
              <img :src="item.icoURL" alt="">
              <span slot="title">{{item.menuName}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </div>
    
    <div class="layui-body" id="laji-admin-body">
      <!-- 内容主体区域 -->
        <!--<transition>-->
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
        <!--</transition>-->
          <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <!--移动端侧边栏呼出按钮-->
    <div class="site-tree-mobile layui-hide" @click="isShow">
      <i class="layui-icon">&#xe602;</i>
    </div>
    <div class="site-mobile-shade" @click="isShow"></div>
      <ul class="layui-fixbar" style="right: 50px; bottom: 100px;">
        <li class="layui-icon layui-fixbar-top" lay-type="top" style="background-color:#393D49">&#xe604;</li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    export default{
      data(){
        return{
          sideNavList:[]
        }
      },
      methods:{
        isShow(){
          if(document.body.className==='site-mobile'){
            document.body.classList.remove('site-mobile')
          }else {
            document.body.className = 'site-mobile'
          }
        },
        getNavList(){
           let setList = ()=>{
             let info = JSON.parse(sessionStorage.getItem('user_info')),
               navList = JSON.parse(JSON.stringify(info.roleMenuList)),
               newNav = [];
  
             this.$store.state.userInfo = info;
             navList.forEach((item,$index)=>{
               if(item.pid===0){
                 navList[$index].show = false;
                 newNav.push(item)
               }
             });
             newNav.forEach((item1)=>{
               navList.forEach((item2)=>{
                 if(item1.id===item2.pid){
                   if(!item1.ChildMenu){item1.ChildMenu=[];}
                   item1.ChildMenu.push(item2)
                 }
               })
             });
             this.sideNavList = newNav;
           };
          
          if(!sessionStorage.getItem('user_info')){
              this.$ajax("/admin-RefreshRoleMenu",'',res=>{
                  if(res.returnCode===200){
                      sessionStorage.setItem('user_info',JSON.stringify(res.data));
                      setList()
                  }else {
                    this.$cookie('login_key','',-1);
                    this.$router.push('/login');
                  }
              });
          }else {
             setList()
          }
          
        },
        exit(){
          this.$cookie('login_key','',-1);
          sessionStorage.removeItem('user_info');
          this.$router.push('/login')
        }
      },
      created(){
        this.getNavList();
      },
      computed:{
        currentUrl:function () {
            let href = this.$route.path;
            if(this.$route.params.page){
               href = href.substring(0,href.lastIndexOf('/'))
            }
            return href;
        }
      },
      watch:{
          $route:function () {
            document.getElementById('laji-admin-body').scrollTop =0;
          }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.lj-container
  width 100%
  .lj-header
    height 50px
    line-height 50px
    background #01AAED
  .lj-aside
    float left
    width 200px
    height 200px
    line-height 200px
    background #2c3e50
    &+.lj-container
      overflow hidden
      height 100%
      background #5FB878
  
.el-menu-vertical-side
  width 217px
  overflow-y scroll
  margin-right 17px
  .el-menu-item
    &.is-active
      background #222d32!important
      color #fff
  .el-submenu
    .el-menu-item
      padding-left 50px!important
  .el-header, .el-footer
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  .el-aside
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  .el-submenu__title
    >img
      margin-right 5px
    
  .el-main
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
    
  body > .el-container
    margin-bottom: 40px;

.layui-layout-admin-wrapper
    transform transitionZ(0)
.layui-layout-admin
  width: 100%!important;
  min-width: 1024px!important;
  margin: 0 auto!important;
 
</style>
