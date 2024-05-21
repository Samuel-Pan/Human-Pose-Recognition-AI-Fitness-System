// app.js
App({
  onLaunch() {
   if(!wx.cloud){
     console.error('请使用2.2.3或以上的基础库以使用云能力');
   }else{
     wx.cloud.init({
       env:env,
       traceUser:true
     })
   }
  },
  globalData: {
      hasLogin: false,
      avatarUrl:null,
      nickName:"点击头像登录",
      openid:null,
      historyUpdate:false,
      infoUpdate:false
  },
})
