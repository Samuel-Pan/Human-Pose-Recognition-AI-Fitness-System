// pages/home/index.js
var app=getApp();
var openid;
var end=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasData:false,
    hasData2:false,
    num:0,
    num2:0,
    dataList:[],
    dataList2:[]
  },
  beginEx: function(param){
    var app = getApp();
    if(!app.globalData.hasLogin){
      wx.showToast({
        title: '请先登录！',
        icon: 'error',
        duration: 2000//持续的时间
      })
    }else{
      wx.navigateTo({   //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）后续可以使用wx.navigateBack 可以返回;
        url:"/pages/sport/sport"
      })
    }
  },
  beginEx2: function(param){
    var app = getApp();
    if(!app.globalData.hasLogin){
      wx.showToast({
        title: '请先登录！',
        icon: 'error',
        duration: 2000//持续的时间
      })
    }else{
      wx.navigateTo({   //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）后续可以使用wx.navigateBack 可以返回;
        url:"/pages/sportTwo/sportTwo"
      })
    }
  },
  toAll(){
    var app=getApp();
    if(app.globalData.hasLogin){
      wx.navigateTo({   //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）后续可以使用wx.navigateBack 可以返回;
        url:"/pages/history/history"
      })
    }else{
      wx.showToast({
        title: '请先登录！',
        icon: 'error',
        duration: 2000//持续的时间
      })
    }
  },
  checkHistory(){
    let that=this;
    openid=app.globalData.openid;
    console.log("查找历史的openid:"+openid);
    //调用云函数 俯卧撑
    wx.cloud.callFunction({
      // 自己定义的云函数名称
      name: 'sportHistory',
      // 传给云函数的参数
      data: {
        _openid: openid,
        type:"pushup",
        skip:0
      },
      success(res)
      {
        that.data.dataList=[];
        console.log("history页面成功获取俯卧撑云函数返回值",res);
        if(res.result != null){
          if(res.result.data.length != 0){
            let i=0;
            if(res.result.data.length != 0){
              let newArray = [{
              "count":res.result.data[i].count,
              "hit_error":res.result.data[i].hit_error,
              "up_error":res.result.data[i].up_error,
              "down_error":res.result.data[i].down_error,
              "time":res.result.data[i].time
              }]
              that.setData({
                dataList:that.data.dataList.concat(newArray),
                hasData:true,
              })
            }else{
              console.log("没有取到俯卧撑数据");
            }
          }else{
            console.log("首页checkHistory 没有获取到俯卧撑数据");
          }
        }
        //调用云函数，仰卧起坐
        that.checkHistory2();
      },
      fail(res)
      {
        that.setData({
          hasData:false,
        })
        console.log("俯卧撑读取数据失败，接下来查询仰卧起坐",res);
        that.checkHistory2();
      }
    })
  },
  checkHistory2(){
    let that = this;
    //调用云函数，仰卧起坐
    wx.cloud.callFunction({
    // 自己定义的云函数名称
    name: 'sportHistory',
    // 传给云函数的参数
    data: {
      _openid: openid,
      type:"situp",
      skip:0
    },
    success(res)
    {
      that.data.dataList2=[];
      console.log("history页面成功获取仰卧起坐云函数返回值",res);
      let i=0
      if(res.result != null){
        if(res.result.data.length != 0){
          let newArray = [{
          "count":res.result.data[i].count,
          "hit_error":res.result.data[i].hit_error,
          "up_error":res.result.data[i].up_error,
          "down_error":res.result.data[i].down_error,
          "time":res.result.data[i].time
          }]
          that.setData({
            dataList2:that.data.dataList2.concat(newArray),
            hasData2:true,
          })
        }else{
          console.log("首页checkHistory2 没有获取到仰卧起坐数据")
        }
      }
      if(that.data.dataList.length == 0){
        that.data.hasData=false;
      }
      if(that.data.dataList2.length == 0){
        that.data.hasData2=false;
      }
      console.log(that.data);
    },
    fail(res)
    {
      that.setData({
        hasData2:false,
      })
      console.log("读取仰卧起坐数据失败",res);
    }
  }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.hasLogin){
      this.checkHistory();
      console.log("运行了onLoad的if");
    }else{
      wx.getStorage({
        key:'userInfo',
        success:(res)=> {        
          console.log("首页成功获取缓存数据");
          console.log(res);
          app.globalData.hasLogin=true;
          app.globalData.avatarUrl=res.data.avatarUrl;
          app.globalData.nickName=res.data.nickName;
          app.globalData.openid=res.data.openid;
          this.checkHistory();
        }
      })
      console.log("运行了onload的else")
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log("onShow页面,this.data:")
    console.log(this.data);
    console.log("login:"+app.globalData.hasLogin+"historyUpdate:"+app.globalData.historyUpdate);
    if(app.globalData.hasLogin && app.globalData.historyUpdate){
      this.checkHistory();
      app.globalData.historyUpdate = false;
    }
    //退出登录后到这个页面
    if(app.globalData.hasLogin){
  
    }else{
      this.setData({
        hasData:false,
        hasData2:false
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})