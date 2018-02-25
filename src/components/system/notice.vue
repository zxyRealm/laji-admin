<template>
    <div class="sys-notice-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/system/notice">新闻公告</el-breadcrumb-item>
        <el-breadcrumb-item >公告列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-alert
        title="操作说明"
        type="info"
        description="请选取推荐位类型，按类型搜索需要修改的推荐位。图片轮播和右侧小图推荐位需要单独上传图片，请编辑完成后点击换图进行图片更换"
        show-icon>
        <div>
          <p>
            此表包括网站、APP所有公告通知，当新增完所有公告后请使用
            <a href="javascript:0;" @click="$clearCache()">清除缓存</a>
            使网站首页公告列表立即更新
          </p>
        </div>
      </el-alert>
      <el-row class="mbt20">
        <el-button type="primary" @click="$router.push({path:'/system/add_notice'})">添加</el-button>
        <el-button type="primary" class="fr" @click="$clearCache()">清除缓存</el-button>
      </el-row>
      <el-row :gutter="10" class="mbt20">
        <el-col :xs="18" :sm="12" :md="9" :lg="6" :xl="3">
          <el-select v-model="currentType" placeholder="请选择类型">
            <el-option
              v-for="(item,index) in noticeType"
              :key="index"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        
      </el-row>
      <el-row class="mbt20">
        <el-table
          ref="multipleTable"
          :data="tableList.list"
          border
          select="row"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            type="selection"
            align="center">
          </el-table-column>
          <el-table-column
            prop="id"
            label="ID"
            width="60"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="menuName"
            label="类型"
            width="82"
            align="center">
          </el-table-column>
    
          <el-table-column
            prop="title"
            label="标题"
          >
          </el-table-column>
          <el-table-column
            prop="adminName"
            label="发布者"
          >
          </el-table-column>
          <el-table-column
            label="时间"
          >
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.releaseDate | time('long') }}</span>
            </template>
          </el-table-column>
         
          <el-table-column
            label="操作"
            width="60"
            align="center">
            <template slot-scope="scope">
              <a href="javascript:0;"  @click="handleClick(scope.row,'edit')">编辑</a>
              <a href="javascript:0;" class="red" @click="delNotice(scope.row.id)">删除</a>
            </template>
          </el-table-column>
        </el-table>
        
      </el-row>
    </div>
</template>
<script type="text/ecmascript-6">
    export default{
      data(){
            return{
              noticeType:[
                {name:'首页公告',value:1},
                {name:'滚动公告',value:2},
                {name:'福利公告',value:3}
              ],
              currentType:1,
              tableList:{}
            };
        },
      methods:{
        getNotice(){
          this.$ajax("/admin/sys-getNotice",{menuId:this.currentType,page:this.$route.params.page},res=>{
            if(res.returnCode===200){
              this.tableList = res.data
            }
          },'get')
        },
        delNotice(id){
          this.$confirm('此操作将永久删除该公告, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$ajax('/admin/sys-deleteNotice',{ id:id },res=>{
              if(res.returnCode===200){
                this.$message({message:'删除成功',type:'success'});
                this.getNotice();
              }
            })
          })
          
        },
        handleClick(val){
          this.$router.push({path:'/system/edit_notice/'+val.id})
        }
      },
      created(){
        this.getNotice()
      },
      mounted(){
      },
      watch:{
        'currentType':function (val) {
          this.getNotice()
        }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
