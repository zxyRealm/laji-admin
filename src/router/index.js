import Vue from 'vue'
import Router from 'vue-router'
import http from 'zepto'
Vue.use(Router);

const router = new Router({
  base:'/dominate',
  mode:'history',
  routes: [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path: '/login',
      name: 'login',
      components: require("../components/login/index.vue")
    },
    // 管理后台首页
    {
      path: '/',
      components: require("../components/index.vue"),
      children:[
        {
          path:'index',
          redirect:'book/list/1'
        },
        {
          path:'board',
          name:'Board',
          components:require('../components/system/index.vue')
        }

///////////////////////////////////////////////////////////////////
        // 书籍管理
        //   书籍列表
        ,{
          path:'book/list',
          redirect:'book/list/1'
        }
        ,{
          path:'book/list/:page',
          name:'bookList',
          meta:{keepAlive:true},
          components:require('../components/book/index.vue')
        }
        ,{
          path:'book/info/:bid',
          name:'bookInfo',
          meta:{keepAlive:true},
          components:require('../components/book/index.vue')
        }
        // 书籍详情
        ,{
          path:'book_detail/:bid',
          name:'bookDetail',
          components:require('../components/book/book_detail.vue')
        }
        // 章节列表
        ,{
          path:'book_chapter_list/:bid',
          name:'bookChapterList',
          components:require('../components/book/book_chapter_list.vue')
        }

        // 编辑章节
        ,{
          path:'edit_chapter/:cid',
          name:'editChapter',
          components:require('../components/book/edit_chapter.vue')
        }

        // 新增章节
        ,{
          path:'add_new_chapter/:bid',
          name:'addNewChapter',
          components:require('../components/book/add_new_chapter.vue')
        }

        // 卷列表
        ,{
          path:'book_volume_list/:bid',
          name:'bookVolumeList',
          components:require('../components/book/book_volume_list.vue')
        }

        // 新增书籍
        ,{
          path:'add_new_book',
          name:'addNewBook',
          components:require('../components/book/add_new_book.vue')
        }

        // 定时发布
        ,{
          path:'book/timer',
         redirect:'book/timer/1'
        }
        ,{
          path:'book/timer/:page',
          name:'bookTimer',
          components:require('../components/book/timer_list.vue')
        }
        // 草稿箱
        ,{
          path:'book/draft',
          redirect:'book/draft/1'
        }
        ,{
          path:'book/draft/:page',
          name:'bookDraft',
          components:require('../components/book/draft_list.vue')
        }

///////////////////////////////////////////////////////////////////
        // 用户管理
        ,{
          path:'user/list',
          redirect:'user/list/1'
        }
        ,{
          path:'user/list/:page',
          name:'userList',
          components:require("../components/user/index.vue")
        },
        ,{
          path:'user/info/:uid',
          name:'userInfo',
          components:require("../components/user/index.vue")
        }
        ,{
          path:'author/list',
          redirect:'author/list/1'
        }
        ,{
          path:'author/list/:page',
          name:'authorList',
          components:require("../components/user/index.vue")
        }
        ,{
          path:'author/monthly/:aid',
         redirect:'author/monthly/:aid/1'
        }
        ,{
          path:'author/monthly/:aid/:page',
          name:'authorMonReport',
          components:require("../components/user/monthly.vue")
        }
        ,{
          path:'author/add_monthly/:aid',
          name:'authorAddMonReport',
          components:require("../components/user/add_monthly.vue")
        }

        ,{
          path:'author/edit_monthly/:bid',
          name:'authorEditMonReport',
          components:require("../components/user/add_monthly.vue")
        }
        ,{
          path:'user/detail/:rid',
          name:'userDetail',
          components:require("../components/user/detail.vue")
        }
///////////////////////////////////////////////////////////////////
        // 属性管理
        ,{
          path:'property',
          name:'bookProperty',
          components:require("../components/book/book_property.vue")
        }

///////////////////////////////////////////////////////////////////
        // 评论管理

        // 书评管理
        ,{
          path:'comment/b_comment',
          redirect:'comment/b_comment/1',
        }
        ,{
          path:'comment/b_comment/:page',
          name:'bookComment',
          components:require("../components/comment/book_comment.vue")
        }

        // 书评回复
        ,{
          path:'comment/reply',
          redirect:'comment/reply/1',
        }
        ,{
          path:'comment/reply/:page',
          name:'bookReply',
          components:require("../components/comment/reply_list.vue")
        }

///////////////////////////////////////////////////////////////////
        // 间贴管理
        ,{
          path:'barrage',
          redirect:'barrage/1'
        }
        ,{
          path:'barrage/:page',
          name:'adminBarrage',
          components:require("../components/barrage/index.vue")
        }


///////////////////////////////////////////////////////////////////
        // 章节管理
        ,{
          path:'chapter',
          redirect:'chapter/1'
        }
        ,{
          path:'chapter/:page',
          name:'allChapter',
          components:require("../components/book/all_chapter_list.vue")
        }

///////////////////////////////////////////////////////////////////
        // 消息管理

        // 系统消息
        ,{
          path:'message/system',
          redirect:'message/system/1'
        }
        ,{
          path:'message/system/:page',
          name:'mesSystem',
          components:require("../components/message/system.vue")
        }
        ,{
          path:'message/edit_message/:mid',
          name:'mesEditMessage',
          components:require("../components/message/edit_system.vue")
        }
        ,{
          path:'message/add_message',
          name:'mesAddMessage',
          components:require("../components/message/edit_system.vue")
        }
        // 私信
        ,{
          path:'message/person',
          redirect:'message/person/1'
        }
        ,{
          path:'message/person/:page',
          name:'mesPerson',
          components:require("../components/message/personal.vue")
        }

///////////////////////////////////////////////////////////////////
        // 数据统计

        // 打赏统计
        ,{
          path:'statistics/reward',
          redirect:'statistics/reward/1'
        }
        ,{
          path:'statistics/reward/:page',
          name:'staReward',
          components:require("../components/statistics/reward.vue")
        }

        ,{
          path:'statistics/reward/:uid/:page',
          name:'staUserReward',
          components:require("../components/statistics/reward.vue")
        }

        // 订阅统计
        ,{
          path:'statistics/subscribe',
          redirect:'statistics/subscribe/1'
        }
        ,{
          path:'statistics/subscribe/:page',
          name:'staSubscribe',
          components:require("../components/statistics/subscribe.vue")
        }

        ,{
          path:'statistics/subscribe/:uid/:page',
          name:'staUserSubscribe',
          components:require("../components/statistics/subscribe.vue")
        }
        // 推荐统计
        ,{
          path:'statistics/recommend',
          redirect:'statistics/recommend/1'
        }
        ,{
          path:'statistics/recommend/:page',
          name:'staRecommend',
          components:require("../components/statistics/recommend.vue")
        }
        ,{
          path:'statistics/recommend/:uid/:page',
          name:'staUserRecommend',
          components:require("../components/statistics/recommend.vue")
        }

        //金椒统计
        ,{
          path:'statistics/pepper',
          redirect:'statistics/pepper/1'
        }
        ,{
          path:'statistics/pepper/:page',
          name:'staPepper',
          components:require("../components/statistics/pepper.vue")
        }

        ,{
          path:'statistics/pepper/:uid/:page',
          name:'staUserPepper',
          components:require("../components/statistics/pepper.vue")
        }

        // 充值统计
        ,{
          path:'statistics/charge',
          redirect:'statistics/charge/1'
        }
        ,{
          path:'statistics/charge/:page',
          name:'staCharge',
          components:require("../components/statistics/charge.vue")
        },
        ,{
          path:'statistics/charge/:uid/:page',
          name:'staUserCharge',
          components:require("../components/statistics/charge.vue")
        }

        // 详细数据
        ,{
          path:'statistics/detail',
          redirect:'statistics/detail/1'
        }
        ,{
          path:'statistics/detail/:page',
          name:'staDetail',
          components:require("../components/statistics/detail.vue")
        }

        // 月报管理
        ,{
          path:'statistics/monthly',
          redirect:'statistics/monthly/1'
        }
        ,{
          path:'statistics/monthly/:page',
          name:'staBookMonthly',
          components:require("../components/user/monthly.vue")
        }


///////////////////////////////////////////////////////////////////
        // 权限管理

        // 管理员
        ,{
          path:'authority/administrator',
          redirect:'authority/administrator/1'
        }
        ,{
          path:'authority/administrator/:page',
          name:'autAdministrator',
          components:require("../components/authority/admin.vue")
        }

        // 角色管理
        ,{
          path:'authority/role',
          redirect:'authority/role/1'
        }
        ,{
          path:'authority/role/:page',
          name:'autRole',
          components:require("../components/authority/role_list.vue")
        }
        // 资源管理
        ,{
          path:'authority/resource',
          name:'autResource',
          components:require("../components/authority/resource.vue")
        }

///////////////////////////////////////////////////////////////////
        // 系统管理

        // 推荐管理
        ,{
          path:'system/recommend',
          redirect:'system/recommend/1'
        }
        ,{
          path:'system/recommend/:page',
          name:'sysRecommend',
          components:require("../components/system/recommend.vue")
        }
        // 系统公告
        ,{
          path:'system/notice',
          redirect:'system/notice/1'
        }
        ,{
          path:'system/notice/:page',
          name:'sysNotice',
          components:require("../components/system/notice.vue")
        }
        ,{
          path:'system/edit_notice/:id',
          name:'sysEditNotice',
          components:require("../components/system/add_notice.vue")
        }
        ,{
          path:'system/add_notice',
          name:'sysAddNotice',
          components:require("../components/system/add_notice.vue")
        }
        // 发布邮件
        ,{
          path:'system/email',
          redirect:'system/email/1'
        }
        ,{
          path:'system/email/:page',
          name:'sysEmail',
          components:require("../components/system/email.vue")
        }
        // 限时免费

        ,{
          path:'system/deadline',
          redirect:'system/deadline/1'
        }
        ,{
          path:'system/deadline/:page',
          name:'sysDeadline',
          components:require("../components/system/deadline.vue")
        }

        // 活动推荐
        ,{
          path:'system/actives',
          name:'sysActives',
          components:require("../components/system/actives.vue")
        }

        // 数据导出
        ,{
          path:'system/export',
          name:'sysExport',
          components:require("../components/system/export.vue")
        }

        // 数据字典
        ,{
          path:'system/dictionary',
          name:'sysDictionary',
          components:require("../components/system/dictionary.vue")
        }

        // 数据备份
        ,{
          path:'system/backups',
          name:'sysBackups',
          components:require("../components/system/backups.vue")
        }

        // 清理缓存
        ,{
          path:'system/cache',
          name:'sysCache',
          components:require("../components/system/cache.vue")
        }

        // 屏蔽词管理
        ,{
          path:'system/shield',
          redirect:'system/shield/1'
        }
        ,{
          path:'system/shield/:page',
          name:'sysShield',
          components:require("../components/system/shield.vue")
        }

        // 友情链接
        ,{
          path:'system/blogroll',
          redirect:'system/blogroll/1'
        }
        ,{
          path:'system/blogroll/:page',
          name:'sysBlogroll',
          components:require("../components/system/blogroll.vue")
        }

        // 版本更新
        ,{
          path:'system/version',
          redirect:'system/version/1'
        }
        ,{
          path:'system/version/:page',
          name:'sysVersion',
          components:require("../components/system/version.vue")
        }
///////////////////////////////////////////////////////////////////
        // 日志管理

        // 登录日志
        ,{
          path:'record/login',
          redirect:'record/login/1'
        }
        ,{
          path:'record/login/:page',
          name:'recLogin',
          components:require("../components/record/login_log.vue")
        }
        // 操作日志
        ,{
          path:'record/operate',
          redirect:'record/operate/1'
        }
        ,{
          path:'record/operate/:page',
          name:'recOperate',
          components:require("../components/record/operate_log.vue")
        }


///////////////////////////////////////////////////////////////////
        // 运行监控

        // Tomcat监控
        ,{
          path:'monitor/tomcat',
          name:'monTomcat',
          components:require("../components/monitor/tomcat.vue")
        }

        // Nginx监控
        ,{
          path:'monitor/nginx',
          name:'monNginx',
          components:require("../components/monitor/nginx.vue")
        }

        // 系统监控
        ,{
          path:'monitor/system',
          name:'monSystem',
          components:require("../components/monitor/system.vue")
        }

        // druid监控
        ,{
          path:'monitor/druid',
          name:'monDruid',
          components:require("../components/monitor/druid.vue")
        }

        // 数据库监控
        ,{
          path:'monitor/mysql',
          name:'monMyspl',
          components:require("../components/monitor/mysql.vue")
        }

        // Redits 监控
        ,{
          path:'monitor/redis',
          name:'monRedis',
          components:require("../components/monitor/redis.vue")
        }

///////////////////////////////////////////////////////////////////
        // 图片管理

        // 头像 管理
        ,{
          path:'image/avatar',
          redirect:'image/avatar/1'
        }
        ,{
          path:'image/avatar/:page',
          name:'imgAvatar',
          components:require("../components/image/avatar.vue")
        }

        // 封面管理
        ,{
          path:'image/cover',
          redirect:'image/cover/1'
        }
        ,{
          path:'image/cover/:page',
          name:'imgCover',
          components:require("../components/image/cover.vue")
        }


///////////////////////////////////////////////////////////////////
        // 任务调度
        ,{
          path:'task',
          name:'adminTask',
          components:require("../components/other/task.vue")
        }
      ]
    }

  ],
  linkActiveClass:'layui-this'
});

router.beforeEach((to,form,next)=>{
  if(Number(router.app.$cookie('login_key'))){
      http.ajax({
        type:'post',
        url:'https://www.lajixs.com/api/admin-isLogin',
        xhrFields: {withCredentials: true},
        crossDomain: true,
        data:{},
        success:(res)=>{
          if(res.returnCode===200){
            if(to.name==='login'){
              next({
                path:"/index"
              })
            }else {
              next()
            }
          }else if(res.returnCode===503){
            window.location.reload()
          }else{
            router.app.$cookie('login_key','',-1);
            sessionStorage.removeItem('user_info');
            next({
              path:'/login'
            })
          }
        },
        error:(err)=>{
        }
      })
  }else {
    if(to.name==='login'){
      next()
    }else {
      next({
        path:"/login"
      })
    }
    //
  }
  // console.log()
});
router.afterEach(()=>{
  // console.log(this.app.$nextTick(()=>{
  //   // console.log(document.getElementById('laji-admin-body'))
  // }))
  window.scrollTo(0,0)
})
export default router
