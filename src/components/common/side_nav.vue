<template>
  <ul class="layui-nav layui-nav-tree layui-inline" lay-filter="test">
    <!-- 侧边导航: <ul class="layui-nav layui-nav-tree layui-nav-side"> -->
    <li v-for="(item,$index) in sideNavList" class="layui-nav-item" :class="{'layui-nav-itemed':item.show}">
      <a v-if="!item.menuURL" href="javascript:;" @click="flexNav($index)">{{item.menuName}} <i class="layui-nav-more">&#xe602;</i></a>
      <router-link v-else :to="item.menuURL">{{item.menuName}}</router-link>
      <span class="side-nav-bar"></span>
      <dl v-if="item.ChildMenu && item.ChildMenu.length" class="layui-nav-child">
        <dd v-for="(item2,$index2) in item.ChildMenu">
          <a v-if="!item2.menuURL" href="javascript:;">{{item2.menuName}}</a>
          <router-link v-else :to="item2.menuURL">{{item2.menuName}}</router-link>
        </dd>
      </dl>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
    export default{
      name:'lay-nav',
      data(){
        return{
          CurrentHref:0,
          sideNavList:[]
        }
      },
      methods:{
        getNavList(){
            this.$ajax("/admin-Logins",{
              adminNanme:'张三',
              adminPassword:'zhangshanadmin'
            },json=>{
              console.log(json);
              let navList = JSON.parse(JSON.stringify(json.data.roleMenuList))
                ,newNav = [];
              navList.forEach((item,$index)=>{
                if(item.pid===0){
                  navList[$index].show = false;
                  newNav.push(item)
                }
              });
              newNav.forEach((item1)=>{
                navList.forEach((item2,$index2)=>{
                  if(item1.id===item2.pid){
                    if(!item1.ChildMenu){item1.ChildMenu=[];}
                    item1.ChildMenu.push(item2)
                  }
                })
              });
              this.sideNavList = newNav;
              // 顶部左侧菜单生成 [请求地址,过滤ID,是否展开,携带参数]
//          vipNav.top_left(newNav,'side-top-left',false);
              // 主体菜单生成 [请求地址,过滤ID,是否展开,携带参数]
//          vipNav.main(this.sideNavList,'side-main',false);
              console.log(this.sideNavList)
            })
          },
        flexNav(index){
            if(this.sideNavList[index].show){
                this.sideNavList[index].show = false
            }else {
              this.sideNavList[index].show = true
            }
        }
      },
      created(){
        this.getNavList()
      },
      watch:{
          $route:function (val) {
            console.log(document.body.classList);
            if(document.body.className==='site-mobile'){
               document.body.classList.remove('site-mobile')
            }
          }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
