<template>
    <div class="book-volume-list-wrap">
      <el-alert
        title="操作说明"
        type="info"
        description="分卷顺序默认按照序列号的大小依次排列，修改卷序列号时请使用连续的数字"
        show-icon>
      </el-alert>
      <el-row class="mbt20">
        <el-button type="primary" plain @click="handleVolume('add')">新建分卷</el-button>
      </el-row>
     
      <el-table
          ref="multipleTable"
          :data="volumeList"
          border
          style="width: 100%">
          <el-table-column
            align="center"
            type="selection"
            width="40">
          </el-table-column>
          <el-table-column
            align="center"
            prop="id"
            label="ID"
            width="50">
          </el-table-column>
      
         
          <el-table-column
            prop="bookName"
            :show-overflow-tooltip="true"
            label="书名"
            width="200">
          </el-table-column>
          <el-table-column
            prop="volumeName"
            :show-overflow-tooltip="true"
            label="分卷名">
          </el-table-column>
    
          <el-table-column
            prop="volumeOrder"
            align="center"
            label="序列号"
            width="100">
          </el-table-column>
        
          <el-table-column
            label="操作"
            width="150">
            
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleVolume('edit', scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
  
      <el-dialog
          class="alertDialog"
          :title="dialogType=='add'?'新建分卷':'编辑分卷'"
          :visible.sync="centerDialogVisible"
          top="45vh"
          width="30%"
          center>
        <el-form :model="subData" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item prop="volumeName">
            <el-input type="text" v-model="subData.volumeName" placeholder="请输入分卷名"></el-input>
          </el-form-item>
          <el-form-item prop="volumeOrder">
            <el-input type="text" :disabled="dialogType=='add'" v-model.number="subData.volumeOrder" placeholder="请输卷序列"></el-input>
          </el-form-item>
        </el-form>
        
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script type="text/ecmascript-6">
    export default{
      data(){
        let validateVolume =(rule, value, callback)=>{
          if(!this.$http.trim(value).length){
              return callback(new Error('请填写分卷名'))
          }else {
              return callback()
          }
        };
        return{
          dialogType:'add',
          bookInfo:{},
          centerDialogVisible:false,
          volumeList:[],
          subData:{
            volumeName:'',
            bookName:'',
            bookid:''
          },
          page:1,
          multipleSelection:[],
          rules:{
            volumeName:[
                {validator: validateVolume, trigger: 'blur' }
            ],
            volumeOrder:[
              {required:true,type:'number',message:'卷序列号不能为空'},
              {type:'number',message:'序列号必须为数字'}
            ]
          }
        }
      },
      methods:{
        getBookInfo(){
         this.$ajax("/book-showBookInfo",{ bookid:this.$route.params.bid },res=>{
           if(res.returnCode===200){
             this.bookInfo = res.data;
             this.getVolumeList()
           }
         })
        },
        getVolumeList(){
          this.$ajax("/books-getvolume",{ bookId:this.$route.params.bid },res=>{
            if(res.returnCode===200){
              this.volumeList = res.data
            }
          })
        },
//        新建分卷/编辑分卷
        submitForm(formName){
          this.$refs[formName].validate((valid) => {
            this.subData.volumeName = this.$http.trim(this.subData.volumeName);
            if(Math.floor(this.subData.volumeOrder)<1 || this.subData.volumeOrder!==Math.floor(this.subData.volumeOrder)){this.$message({message:'序列号必须用大于0的正整数！',type:'error'});return false}
            if (valid) {
              if(this.dialogType==='edit'){
                
                this.$ajax("/books-updatevolume",this.subData,res=>{
                  this.centerDialogVisible = false;
                  if(res.returnCode===200){
                    this.getVolumeList();
                    this.$message({message:'修改成功',type:'success'})
                  }
                })
              }else {
                this.$ajax('/books-getCheckVolume',{
                  bookid:this.subData.bookid,
                  volumeName:this.subData.volumeName
                },res=>{
                  if(res.returnCode===200){
                    this.$ajax("/books-addvolume",this.subData,res2=>{
                      this.centerDialogVisible = false;
                      if(res2.returnCode===200){
                        this.getVolumeList();
                        this.$message({ message:'创建成功！',type:'success' })
                      }
                    })
                  }else {
                    this.centerDialogVisible = false
                  }
                })
              }
            } else {
              this.$message({message:'请完善信息后提交！',type:'warning'});
              return false;
            }
          });
        },

//        调用弹窗
        handleVolume(type,row){
          this.dialogType = type;
          this.centerDialogVisible = true;
          if(row){
            this.subData = row
          }else {
            this.subData = {
              volumeName:'',
              bookName:this.bookInfo.bookName,
              bookid:this.bookInfo.bookId,
              volumeOrder:this.maxOrder+1
            }
          }
        },
//        删除分卷
        handleDelete(row){
          this.$ajax("/books-deletevolume",{volumeId:row.id},res=>{
              if(res.returnCode===200){
                  this.getVolumeList();
                  this.$message({message:'删除成功',type:'success'})
              }
          })
        }
      },
      created(){
        this.getBookInfo()
      },
      watch:{
        $route:function () {
          this.getVolumeList()
        }
      },
      computed:{
          maxOrder:function () {
            let arr = [];
            this.volumeList.forEach((item)=>{
              arr.push(item.volumeOrder)
            });
            let order = Math.max.apply(null,arr);
            return order
          }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
