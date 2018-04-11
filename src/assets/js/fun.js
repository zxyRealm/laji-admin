/**
 * Created by Administrator on 2017/9/15.
 */
let ERR_OK = 200;
let ERR_NO = 400;
exports.install = function (Vue, options) {
  // 异步请求统一设置
  Vue.prototype.$ajax = function (url,data,callBack,type,dataType,show,text) {
    if (this.$http.isFunction(data)) {
      callBack = data;
    }
    let update = [
      '/admin/updateAdminInfo',
      '/admin/addPublishanotice',
      '/admin/updatePublishanotice'
    ]

    let tip = [
      '/admin/getChapterCount'
    ]

    let load = false,tipMsg = true
    for(let j=0,len=update.length;j<len;j++){
      if(url.indexOf(update[j])>-1){
        load = true
        break;
      }
    }
    for(let j=0,len = tip.length;j<len;j++){
      if(url.indexOf(tip[j])>-1){
        tipMsg = false
        break;
      }
    }
      if(load){
        this.$myLoad('正在加载中...');
      }
      this.$http.ajax({
        type:!type?'post':type,
        url:'https://www.lajixs.com/api'+url,
        data:data,
        dataType:!dataType?'json':dataType,
        xhrFields: {withCredentials: true},
        crossDomain: true,
        success:(res)=>{
          if(load){
            this.$loading().close();
          }
          if (callBack) {
            if (this.$http.isFunction(callBack)) {
              callBack(res);
            } else {
              console.log("callBack is not a function");
            }
          }
          if(res.returnCode===400){
            this.$router.push('/login')
          }else if(res.returnCode!==200) {
            if(res.msg.indexOf('暂无数据')<0 && tipMsg){
              this.$message({message:res.msg,type:'warning'})
            }
          }
        },
        error:(err)=>{
          callBack(err);
          if(load){
            this.$loading().close()
          }
          if(err.status===404){
            this.$message({message:'请求失败，请求方法不存在！',type:'error'})
          }else if(err.status===503){
            this.$message({message:'请求失败，服务器内部错误！',type:'error'})
          }else {
            this.$message({message:'请求失败，网络请求超时！',type:'error'})
          }
        }
      });

  };

  Vue.prototype.$formTime = function (date,type,separator) {
    separator = separator===undefined?"-":separator;
    let time = new Date(date) || new Date();
    let now = new Date(date).getFullYear() || new Date().getFullYear();
    let days = 0;
    let Time,T;
    T = time
    let year = T.getFullYear();
    let mon  = T.getMonth()+1<10?'0'+(T.getMonth()+1):T.getMonth()+1;
    let Date1 = T.getDate()<10?'0' + T.getDate():T.getDate();
    let hour = T.getHours()<10?'0' + T.getHours():T.getHours();
    let min  = T.getMinutes()<10?'0'+T.getMinutes():T.getMinutes();
    let sec  = T.getSeconds()<10?'0'+T.getSeconds():T.getSeconds();
    if(type==='long'){
      Time = year + separator + mon + separator + Date1 + ' ' + hour + ':' + min +':' + sec
    }
    if(type==='middle'){
      Time = year + separator + mon + separator + Date1 + ' ' + hour + ':' + min
    }
    if(type==='sort'||type===undefined){
      Time = year + separator + mon + separator + Date1
    }
    if(type==='mon'){
      Time = year + separator + mon
    }
    return Time
  };
  // 个人信息刷新
  Vue.prototype.$freshen = function () {
    this.$ajax("/person-info",{token:localStorage.login_token},false,json=>{
      if(json.returnCode===ERR_OK){
        this.$store.state.userInfo = json.data
      }else if(json.returnCode===ERR_NO){
        this.$router.push('/login')
      }
    })
  };
  // 更新用户信息通知
  Vue.prototype.$updateCount = function () {
    this.$ajax("/person-messageCount",'',false,json=>{
      if(json.returnCode===200){
        json.data.total = json.data.userMessageCount + json.data.userCommentReplyCount + json.data.userCommentCount;
        json.data.total = json.data.total>99?'99+':json.data.total;
        this.$store.state.message = json.data
      }
    })
  };
  // 退出登录
  Vue.prototype.$exit = function (type) {
    this.$ajax("/person-ClearUserInfo",{token:localStorage.login_token},!type,json=>{
      if(json.returnCode===ERR_OK){
        this.$cookie('login_key','',-1);
        this.$store.state.userInfo = {};
        if(!type){
          if(this.$route.name==='modifyPage' || this.$route.name==='findPage'){
            this.$message("修改成功！");
            this.$router.push("/login?redirect=/index")
          }else {
            this.$message("退出成功！");
            this.$router.push('/');
          }
        }
      }else{
        this.$message(json.msg);
      }

    })
  };
  // cookies 设置、获取、删除
  Vue.prototype.$cookie = (key,value,expiredays)=>{
    if(typeof value !== "undefined"){//write
      let exdate = new Date();
      exdate.setDate(exdate.getDate()+expiredays);
      document.cookie = key + "=" +escape(value)+';path=/;'+((!expiredays)?"":(";expires="+exdate.toGMTString()));
      // console.log(document.cookie)
    }else{//read
      if (document.cookie.length > 0)
        {
          let c_start = document.cookie.indexOf(key+"=");
          if (c_start!==-1)
          {
            c_start=c_start + key.length+1;
            let c_end=document.cookie.indexOf(";",c_start);
            if (c_end===-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end))
          }
        }
        return null;
    }
  };

  Vue.prototype.$myLoad = function(text){
    this.$loading({
      lock: true,
      text:text?text:'数据提交中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
  }
  Vue.prototype.$isLogin = function(){
    let state;
    this.$ajax("/person-checkLoginState",'',false,json=>{
      state = json
    });
    setTimeout(function () {
      console.log(state)
    },2000);
  };
  // 用户发送私信
  Vue.prototype.$send = function (type, data) {
    console.log(this.$route.name);
    this.$consume({
      type:type,
      closeOnClickModal: false,
      value:data,
      beforeClose:(action,instance,done) => {
        if(action==='confirm' && type==='letter'){
          let len = this.$http.trim(instance.messageContent).length;
          if(len<200 && len>0){
            this.$ajax("/person-sendmessage",{
              userName:this.$store.state.userInfo.pseudonym,
              sendName:data.name,
              sendUserId:data.id,
              messageContent:instance.messageContent
            },json => {
              done();
              if(json.returnCode===ERR_OK){
                this.$message({message:"操作成功"});
                if(this.$route.name==='messageHarvest'){
                  this.$ajax("/sys-updateArewardmessageState",{arewardId:data.aid},false,json=>{
                    if(json.returnCode===200){
                      this.harvest(this.harvestList.pageNum)
                    }
                  })
                }
              }
            })
          }
        }else {
          done()
        }
      }
    })
  };
  // 检测浏览器是否为IE
  Vue.prototype.$isIE = function () {
    if (!!window.ActiveXObject || "ActiveXObject" in window){
      return true;
    }else{
      return false;
    }
  };

  Vue.prototype.$enableCookie = function () {
   if(window.navigator.cookieEnabled){
      console.log('可用')
   }else {
     console.log("不可用")
   }
  }

  Vue.prototype.$checkCardId = function (code) {
    let city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    let row={
      'pass':true,
      'msg':'验证成功'
    };
    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(code)){
      row={
        'pass':false,
        'msg':'身份证号格式错误'
      };
    }else if(!city[code.substr(0,2)]){
      row={
        'pass':false,
        'msg':'身份证号地址编码错误'
      };
    }else{
      //18位身份证需要验证最后一位校验位
      if(code.length === 18){
        code = code.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
        //校验位
        let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
        let sum = 0;
        let ai = 0;
        let wi = 0;
        for (let i = 0; i < 17; i++)
        {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        if(parity[sum % 11].toString() !== code[17].toUpperCase()){
          row={
            'pass':false,
            'msg':'身份证号校验位错误'
          };
        }
      }
    }
    return row;
  }

  Vue.prototype.$clearCache = function() {
    this.$ajax("/admin/deleteCache",'',res=>{
        if(res.returnCode===200){
          this.$message({message:res.msg,type:'success'})
        }
    },'get')
  }

};
