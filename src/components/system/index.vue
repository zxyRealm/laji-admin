<template>
    <div class="admin-index-wrap">
        <el-row :gutter="40">
          <template v-for="(_obj,key) in webBaseData">
            <el-col :xs="12" :sm="10" :md="8" :lg="6" :xl="4">
              <div class="color-item">
                <p>{{key | disc}}</p>
                <p>{{_obj}}</p>
              </div>
            </el-col>
          </template>
        </el-row>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
      data(){
          return{
              webBaseData:{}
          }
      },
      methods:{
         getBaseData(){
            this.$ajax("/admin/getControlPanel",'',res=>{
                if(res.returnCode===200){
                    this.webBaseData = res.data;
                }
            })
         }
      },
      created(){
        this.getBaseData()
      },
      filters:{
          disc:function (val) {
            let msg = '';
            switch (val){
              case 'AndroidClickCount':
                  msg = '安卓点击';
                  break;
              case 'ExceptionRecordCount':
                  msg = '异常数量';
                  break;
              case 'IosClickCount':
                msg = 'IOS点击';
                break;
              case 'LoginCount':
                msg = '登录';
                break;
              case 'MessageRecordCount':
                msg = '私信条数';
                break;
              case 'NewSaveRecordCount':
                msg = '收藏';
                break;
              case 'ReadRecordCount':
                msg = '阅读记录';
                break;
              case 'SignCount':
                msg = '签到人数';
                break;
              case 'androidLoginCount':
                msg = '安卓登录次数';
                break;
              case 'iosLoginCount':
                msg = 'IOS登录次数';
                break;
              
              case 'pcLoginCount':
                msg = 'PC端登录次数';
                break;
            
              case 'wapLoginCount':
                msg = 'wap站登录次数';
                break;
              case 'nowRersionNum':
                msg = '登录人次';
                break;
              case 'IllegalIpAddressList':
                msg = '独立IP';
                break;
              case 'laJiao':
                msg = '总打赏';
                break;
              case 'dinYue':
                msg = '总订阅';
                break;
              case 'tuiJianPiao':
                msg = '总推荐';
                break;
              case 'pingLun':
                msg = '总评论';
                break;
              case 'jinPiao':
                msg = '总金票';
                break;
              case 'jianTie':
                msg = '总间帖';
                break;
              case 'pingLunHuiFu':
                msg = '评论回复';
                break;
  
              case 'AndroidDownLoadCount':
                msg = '安卓下载次数';
                break;
  
              case 'IosDownLoadCount':
                msg = 'IOS下载次数';
                break;
              case 'NewBookRecordCount':
                msg = '新增小说';
                break;
              case 'NewChapterRecordCount':
                msg = '新增章节';
                break;
              case 'NewUserRecordCount':
                msg = '新增用户';
                break;
              case 'NewAuthorRecordCount':
                msg = '新增作者';
                break;
              case 'updateBookCount':
                  msg = '更新书籍数量';
                  break;
              default:
                msg = '未知'
            }
            return msg
          }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">

.color-item
  border-radius 5px
  padding 15px 20px
  background #f56c6c
  color #fff
  margin 20px auto
  max-width 120px
  font-size 16px
  
.img-container
    float left
    max-width 600px
    height 400px
</style>
