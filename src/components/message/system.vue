<template>
  <div class="sys-notice-wrap">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/message/system">消息管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/message/system">系统消息</el-breadcrumb-item>
      <el-breadcrumb-item>消息列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="操作说明"
      type="info"
      show-icon>
      <div>
        <p>
          此表包括网站、APP所有消息通知
        </p>
      </div>
    </el-alert>
    <el-row class="mbt20">
      <el-button type="primary" @click="$router.push({path:'/message/add_message'})">添加</el-button>
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
          prop="title"
          label="标题"
        >
        </el-table-column>
        <el-table-column
          prop="userName"
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
            <router-link :to="'/message/edit_message/'+scope.row.id">编辑</router-link>
            <a href="javascript:0;" class="red" @click="delMessage(scope.row.id)">删除</a>
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
          {name:'系统公告',value:1},
          {name:'滚动公告',value:2},
          {name:'福利公告',value:3}
        ],
        currentType:1,
        tableList:{}
      };
    },
    methods:{
      getSysMessage(){
        this.$ajax("/admin/getsystemmsg",{startpage:this.$route.params.page},res=>{
          if(res.returnCode===200){
            this.tableList = res.data
          }
        })
      },
      delMessage(id){
        this.$confirm('此操作将永久删除该系统消息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax("/admin/sys-deletesystemmsg",{messageid:id},res=>{
              if(res.returnCode===200){
                  this.$message({ message:'删除成功',type:'success' });
                  this.getSysMessage()
              }
          })
        })
      }
    },
    created(){
      this.getSysMessage()
    },
    mounted(){
    },
    watch:{
      'currentType':function (val) {
        this.getSysMessage()
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
