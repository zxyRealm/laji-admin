<template>
  <div class="wrapper">
    <el-breadcrumb class="mbt20" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>书籍管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/book/list">书籍列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="'/book_chapter_list/'+original.bookId">章节列表</el-breadcrumb-item>
      <el-breadcrumb-item>编辑章节</el-breadcrumb-item>
    </el-breadcrumb>
  
    <el-alert
      class="mbt20"
      title="操作说明"
      type="info"
      show-icon>
      <div slot>
        文字说明文字说明文字说明文字说明文字说明文字说明
      </div>
    </el-alert>
    
    <div class="form-wrapper">
      <el-form :model="ruleForm" :rules="rules" ref="editChapterForm" :label-width="labelWidth" labelPosition="left" class="chapter-ruleForm">
        <el-form-item label="书籍名称" prop="bookTitle">
          <el-input style="width: 260px" readonly v-model="ruleForm.bookTitle"></el-input>
        </el-form-item>
        <el-form-item label="分卷名称" prop="volumeId">
          <el-select :disabled="!authority.updates" style="width: 260px;" v-model="ruleForm.volumeId" placeholder="请选择分卷" @change="changeVolume">
            <template>
              <el-option
                v-for="item in volumeList"
                :key="item.id"
                :label="item.volumeName"
                :value="item.id">
              </el-option>
              <el-option @click.native="dialogFormVisible = true" label="" value="">+新增分卷</el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="章节名称" prop="chapterTitle">
          <el-input style="width: 260px" v-model="ruleForm.chapterTitle"></el-input>
        </el-form-item>
        <el-form-item label="章节内容" class="contentBox" prop="chapterContent">
          <el-input v-show="ruleForm.whetherPublic==1" type="textarea" class="context" v-model="ruleForm.chapterContent"></el-input>
          <div v-show="ruleForm.whetherPublic!=1" class="iframe-wrap">
            <div id="content_edit_sole" unselectable="on" @keydown.native="preventCopy" v-if="isRload" :contenteditable="true" v-model="editContent" @input="editChange" >
              <template v-for="(item,$index) in initial">
                <p :uuid="item.uuid">
                  {{item.content}}
                </p>
              </template>
            </div>
          </div>
          <el-input class="authorSay-wrap" type="textarea" v-model="ruleForm.authorWords" placeholder="作者的话（不超过100字）"></el-input>
          <!--<div class="authorSay-wrap">-->
          <!--<textarea class="authorSay" v-model="ruleForm.authorWords" placeholder="作者的话（不超过100字）"></textarea>-->
          <!--</div>-->
          <span class="words">共 {{length}} 字</span>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="发布时间" style="margin-top:50px" prop="releaseTime">
          <el-col :span="8">
            <el-date-picker
              type="datetime"
              placeholder="选择时间"
              :picker-options="pickerOptions"
              v-model="ruleForm.releaseTime">
            </el-date-picker>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="ruleForm.whetherPublic" :label-width="'0px'" prop="issue">
              <el-checkbox v-model="ruleForm.issue">立即发布</el-checkbox>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="是否VIP">
          <el-radio class="radio" v-model="ruleForm.chapterIsvip" :label="0">普通</el-radio>
          <el-radio class="radio" v-model="ruleForm.chapterIsvip" :label="1" >VIP</el-radio>
        </el-form-item>
        
        <el-form-item v-if="authority.updates" :label-width="labelWidth" style="width: 820px" class="tc">
          <el-button type="primary" @click="submitForm('create')">确认编辑</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <el-dialog
      class="alertDialog"
      @open="volumeForm.volumeName=''"
      top="45%"
      title="新增分卷"
      :visible.sync="dialogFormVisible">
      <el-form :model="volumeForm" :rules="rule" ref="volumeForm" label-position="left">
        <el-form-item label="分卷名称" prop="volumeName" :label-width="'80px'">
          <el-input v-model="volumeForm.volumeName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewVolume('volumeForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  
  export default {
    data() {
      let validateVolume = (rule,value,callback) => {
        if(!value||this.$http.trim(value).length<1){
          this.volumeForm.volumeName = '';
          callback(new Error("卷名不能为空"))
        }else {
          this.$ajax("/books-getCheckVolume",{
            volumeName:value,
            bookid:this.ruleForm.bookId
          },json => {
            if (json.returnCode===200) {
              callback()
            } else {
              callback(new Error(json.msg))
            }
          });
        }
      };
      let validateCheckCn = (rule,value,callback) => {
        value = this.$http.trim(value);
        if(!value||this.$http.trim(value).length<1){
          this.ruleForm.chapterTitle = '';
          callback(new Error('请输入章节名称'))
        }else{
          if(this.$http.trim(value)===this.oldChapterName){
            callback()
          }else {
            this.$ajax('/chapter-checkName',{
              chapterName:value,
              bookId:this.ruleForm.bookId
            },json=> {
              if(json.returnCode===200){
                callback()
              }else{
                this.$message('章节名重复，请重新填写！');
                callback(new Error('章节名重复，请重新填写！'));
              }
            })
          }
        }
      };
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        isLoading:undefined,
        isRload:true,
        iframeShow:'hidden',
        dialogSize:'tiny',
        original:{}, //原始数据
        volumeList:[], //书籍卷列表
        isAutoPublish:false,
        labelWidth:'136px',
        dialogFormVisible:false,
        editContent:'',
        initial:[],
        cidList:[], //章节段ID列表
        volumeForm:{
          volumeName:''
        },
        oldChapterName:'',
        ruleForm: {  //章节信息
          bookTitle: '',
          chapterTitle:'',
          volumeId: null,
          releaseTime: null,
          chapterContent: '',
          whetherPublic:0,
          chapterLength:0,
          chapterIsvip:0,
          authorWords:'',
          issue:false,
          update:false
        },
        rule:{
          volumeName: [
            { required: true,validator:validateVolume , trigger: 'blur' }
          ]
        },
        rules: {
          chapterTitle: [
            { required: true,validator:validateCheckCn , trigger: 'blur' }
          ],
          volumeId: [
            { required: true,type:'number', message: '请选择分卷', trigger: 'change' }
          ],
          bookTitle: [
            { required: true, message: '请输入书籍名称', trigger: 'blur' }
          ],
          chapterContent: [
            { required: true, message: '请添加章节内容', trigger: 'blur' }
          ],
          releaseTime: [
            { required: true, type:'date', message: '请选取时间', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
//        添加新章节
      submitForm(type) {
         this.isLoading = this.$loading({
           lock: true,
           text: 'Loading',
           spinner: 'el-icon-loading',
           background: 'rgba(0, 0, 0, 0.7)'
         });
        this.$refs['editChapterForm'].validate((valid) => {
          if (valid) {
            if(type==='draft'){
              this.ruleForm.whetherPublic = 1
            }
            this.editChapter()
          } else {
            this.$nextTick(()=>{
                this.isLoading.close()
            });
            this.$message({message:'请完善信息后提交！',type:'warning'});
            return false;
          }
        });
      },
      editChapter(){
//          首先获取网络时间
        if(this.ruleForm.chapterLength>20000){
          this.isLoading.close();
          this.$confirm('文章内容超出字数长度限制，请保证字数长度在20000以内！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
          return false;
        }
        let cloneData = JSON.parse(JSON.stringify(this.ruleForm));
        let release = () =>{
          this.$ajax("/admin/updateChapterInfo",cloneData,json=>{
             this.isLoading.close();
            if(json.returnCode===200){
              this.$confirm(!cloneData.whetherPublic?'编辑成功':(cloneData.whetherPublic===1?'保存草稿成功':'发布成功'), '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.getChapterInfo()
              }).catch(()=>{
                  this.getChapterInfo()
              });
              
            }
          })
        };
//        草稿
        if(this.ruleForm.whetherPublic===1){
//            发布草稿
          cloneData.chapterContent = this.$http.trim(cloneData.chapterContent).replace(/\n+\s+/g,'<H><LG>')+"<H><LG>";
          cloneData.whetherPublic = cloneData.issue?2:1;
          this.$ajax("/sys-getNetWorkDateTime",'',time=>{
            if(time.returnCode===200){
              cloneData.releaseTime = this.$formTime(time.data.beijing,"long");
              release()
            }else {
                this.isLoading.close()
            }
          },'get')
        }else {
//        非草稿
          let nodeList = document.getElementById('content_edit_sole').childNodes;
          cloneData.chapterContent = '';
          for(let i=0,len=nodeList.length;i<len;i++){
            if(this.$http.trim(nodeList[i].innerText).length>0){
              cloneData.chapterContent += this.$http.trim(nodeList[i].innerText)+nodeList[i].getAttribute('uuid')
            }
          }
          cloneData.releaseTime = this.$formTime(cloneData.releaseTime,"long");
          release()
        }
      },
//      新增分卷
      addNewVolume(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$ajax("/books-addvolume",{
              volumeName:this.volumeForm.volumeName,
              bookName:this.ruleForm.bookTitle,
              bookid:this.$route.params.bid
            },json => {
              if(json.returnCode === 200) {
                this.dialogFormVisible = false;
                this.$message("添加成功");
                this.getChapterInfo()
              }
            })
          }else {
            this.$message({message:'请填写卷名！',type:'warning'})
          }
        });
      },
//      章节信息回显
      getChapterInfo(){
        let reg1 = /<LG>[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}<\/?LG ?\/?>/;
        let reg2 = /<LG>[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}<\/?LG ?\/?>/g;
        this.$ajax("/sys-getNetWorkDateTime",'',time=>{
          if(time.returnCode===200){
            
            this.$ajax("/admin/getChapterInfoShow",{chapterid:this.$route.params.cid},json=>{
              this.update = false;
              if(json.returnCode===200){
                this.isRload = false;
                this.original = JSON.parse(JSON.stringify(json.data));
                this.initial = [];
                delete json.data.createChapterTime;
                json.data.releaseTime =  new Date(json.data.releaseTime);
                this.oldChapterName = json.data.chapterTitle;
                if(json.data.whetherPublic===1){
                  json.data.chapterContent = json.data.chapterContent.replace(/<H><LG>/g,'\n\n  ');
                }else {
                  let idList = json.data.chapterContent.match(reg2);
                  let txtList = json.data.chapterContent.split(reg1);
                  json.data.chapterContent = json.data.chapterContent.replace(reg2,'\n');
                  idList.forEach((item,index)=>{
                    this.initial.push({
                      uuid:item,
                      content:this.$http.trim(txtList[index])
                    })
                  });
                }
                this.ruleForm = json.data;
                this.getVolume();
                setTimeout(()=>{
                  this.isRload = true
                },100)
              }
            });
            let count = 0;
            setInterval(()=>{
              count++;
              this.$set(this.original,'nowTime',time.data.beijing+count*1000)
            },1000)
          }
        },'get')
      },
      //      获取分卷列表
      getVolume(){
        this.$ajax("/books-getvolume",{bookId:this.ruleForm.bookId},json => {
          if(json.returnCode===200){
            this.volumeList = json.data;
            this.update = true
          }
        });
      },
//      校验章节名是否重复
      checkChapterName(event){
        if(event.target.value.length>0){
        }
      },
      editChange(e){
        let parents = document.getElementById('content_edit_sole');
        let pList = parents.childNodes;
        this.ruleForm.chapterContent = this.$http.trim(parents.innerText);
        if(pList.length>0){
          for(let i=0,len=pList.length;i<len;i++){
//            重置样式,防止粘贴复制带来过来的内联样式
            pList[i].style = null;
            if(this.$http.trim(pList[i].innerText).length){
              if(!pList[i].getAttribute("uuid")){
                pList[i].setAttribute("uuid","<X><XG>")
              }else {
                if(i>0 && pList[i].getAttribute("uuid").length > 7 && pList[(i-1)].getAttribute('uuid')===pList[i].getAttribute("uuid")){
                  pList[i].setAttribute("uuid","<X><XG>")
                }
              }
              if(pList[i].childNodes.length>1){
                pList[i].innerHTML = pList[i].innerText;
              }
            }else {
              pList[i].setAttribute('uuid','<X><XG>');
            }
          }
        }
        if(e.target.innerHTML.length<1){
//        保证父元素中至少存在一个p标签，以此确保换行后新增的标签为p
          let p = document.createElement('p');
          p.innerHTML='<br>';
          p.style = null;
          parents.insertBefore(p,parents.childNodes[0])
        }
      },
      changeVolume(val){
        if(this.volumeList.length && val && this.update){
          this.$confirm('确认调整本章分卷?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$ajax("/chapterToVolume",{
              chapterid:this.ruleForm.id,
              volumeid:val,
              bookid:this.ruleForm.bookId,
            },json=>{
              if(json.returnCode===200){
                this.$message({
                  type: 'success',
                  message: '调整成功!'
                });
              }
            })
          }).catch(() => {
            this.$message({message: '已取消调整'});
            this.getChapterInfo()
          });
        }
      },
      preventCopy(e){
        if(e.keyCode===17 && e.keyCode===72){
          e.returnValue = false;
          return false
        }
      }
    },
    created (){
      let windowWidth = document.body.clientWidth;
      if(windowWidth<1024){
        this.dialogSize = 'small'
      }else{
        this.dialogSize = 'tiny'
      }
      this.getChapterInfo();
    },
    watch:{
      "ruleForm.chapterContent":function (val) {
        if(this.ruleForm.whetherPublic===1){
          this.ruleForm.chapterContent = val.replace(/^\s*\n+\s*/,'').replace(/\s*\n+\s*/g,'\n\n　　');
        }
      },
      "editContent":function (val)  {
        let parents = document.getElementById('content_edit_sole');
        let pList = parents.childNodes;
        this.ruleForm.chapterContent = this.$http.trim(parents.innerText);
        if(pList.length > 0 && this.isUpDate){
          for(let i=0,len=pList.length;i<len;i++){
//            重置样式,防止粘贴复制带来过来的内联样式
            pList[i].style = null;
            if(this.$http.trim(pList[i].innerText).length){
              pList[i].innerHTML = this.$http.trim(pList[i].innerHTML);
              if(pList[i].childNodes.length>1){
                pList[i].innerHTML = pList[i].innerText;
              }
            }else {
              pList[i].setAttribute('uuid','<X><XG>');
            }
          }
        }
      },
      "ruleForm.authorWords":function (val) {
        if (this.$http.trim(val).length > 100) {
          val = val.substr(0,100);
        }
        this.ruleForm.authorWords = val.replace(/^\s*\n+\s*/, '').replace(/\s*\n+\s*/g, '\n\n　　');
      }
    },
    computed:{
      'length':function () {
        let  sLen = 0;
        let str = this.ruleForm.chapterContent;
        try{
          //先将回车换行符做特殊处理
          str = str.replace(/(\r\n+|\s+| )+/g,"龘");
          //处理英文字符数字，连续字母、数字、英文符号视为一个单词
//          str = str.replace(/[\x00-\xff]/g,"m");
          //合并字符m，连续字母、数字、英文符号视为一个单词
//          str = str.replace(/m+/g,"*");
          //去掉回车换行符
          str = str.replace(/龘+/g,"");
          //返回字数
          sLen += str.length;
        }catch(e){
          console.log(e)
        }
        this.ruleForm.chapterLength = sLen;
        if(sLen>20000){
          this.$message({message:"字数长度不可超过20000！",type:'error'})
        }
        return sLen
      },
      'isChange':function () {
        let state = false;
        if(this.original){
          if(this.original.whetherPublic){
            state = true
          }else {
            if(this.original.releaseTime && this.original.releaseTime > this.original.nowTime){
              state = false
            }else {
              state = true
            }
          }
        }
//        console.log(this.original.nowTime,this.original.releaseTime,state)
        return state
      },
      authority:function () {
        return this.$store.state.userInfo.adminRolemenuanduserrole?this.$store.state.userInfo.adminRolemenuanduserrole:{}
      }
    },
    mounted(){
      window.onresize = () => {
        let width = document.body.clientWidth;
        if(width<1020){
          this.dialogSize = 'small'
        }else {
          this.dialogSize = 'tiny'
        }
      };
    }
  }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  .chapter-ruleForm
    .iframe-wrap
      #content_edit_sole
        width 100%
        height 100%
        outline none
        padding 15px
        user-select none
        overflow auto
        box-sizing border-box
        >p
          text-indent 2em
          padding-bottom 1em
          font-size 16px
          user-select none
</style>
