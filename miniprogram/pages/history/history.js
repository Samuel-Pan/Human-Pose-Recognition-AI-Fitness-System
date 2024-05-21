// pages/history/history.js
var app=getApp();
var openid;
var skipNum=0;
var skipNum2=0
var tip=false;
var tip2=false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasData:false,
    hasData2:false,
    num:0,
    num2:0,
    lastNum:0,
    dataList:[],
    dataList2:[],
    bar1Class:"bar1",
    bar2Class:"bar2-n",
    pushUp_dis:"block",
    sitUp_dis:"none",
    isLoading:false,
    isLoading2:false
  },

  checkPushUpList(){
    let that = this;
    console.log(app.globalData);
    console.log("俯卧撑目前dataList:");
    console.log(this.data.dataList);
    if(!this.data.isLoading && skipNum!=-1){
      that.data.isLoading=true;
      //调用云函数
      wx.cloud.callFunction({
        // 自己定义的云函数名称
        name: 'sportHistory',
        // 传给云函数的参数
        data: {
          _openid: openid,
          type:"pushup",
          skip:skipNum
        },
        success(res)
        {
          console.log("history页面成功获取俯卧撑云函数返回值:",res);
          if(res.result != null){
            if(res.result.data.length != 0){
              let length = res.result.data.length;
              console.log("length:"+length);
              if(length<5){
                skipNum = -1;
              }else{
                skipNum+=length;
              }
              console.log("skipNum:"+skipNum);
              for(var i=0 ; i<length;i++){
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
                  num:that.data.num+length,
                  isLoading:false
                })
              }
              wx.hideLoading({
                success: (res) => {},
              })
            }else{
              console.log("已经没有数据了");
            }
          }
        },
        fail(res)
        {
          console.log("失败",res);
        }
      })
    }
  },
  checkSitUpList(){
    let that = this;
    console.log(app.globalData)
    if(!this.data.isLoading2 && skipNum2 != -1){
      that.data.isLoading2=true;
      //调用云函数 
      wx.cloud.callFunction({
        // 自己定义的云函数名称
        name: 'sportHistory',
        // 传给云函数的参数
        data: {
          _openid: openid,
          type:"situp",
          skip:skipNum2
        },
        success(res)
        {
          console.log("history页面成功获取仰卧起坐云函数返回值",res);
          if(res.result!=null){
            if(res.result.data.length != 0){
              let length = res.result.data.length;
              console.log("length:"+length);
              if(length<5){
                skipNum2 = -1;
              }else{
                skipNum2+=length;
              }
              console.log("skipNum2:"+skipNum2);
              for(var i=0 ; i<length;i++){
                  let newArray = [{
                  "count":res.result.data[i].count,
                  "up_error":res.result.data[i].up_error,
                  "down_error":res.result.data[i].down_error,
                  "time":res.result.data[i].time
                }]
                that.setData({
                  dataList2:that.data.dataList2.concat(newArray),
                  hasData2:true,
                  num2:length,
                  isLoading2:false
                })
                console.log("仰卧起坐新数组：")
                console.log(newArray)
                console.log("dataList2");
                console.log(that.data.dataList2);
              }
              wx.hideLoading({
                success: (res) => {},
              })
            }else{
              console.log("仰卧起坐已经没有数据了")
            }
          }
        },
        fail(res)
        {
          console.log("失败",res);
        }
      })
    }

  },
  showPushUp(){
    if(this.data.pushUp_dis == "none"){
      this.setData({
        pushUp_dis:"block",
        sitUp_dis:"none",
        bar1Class:"bar1",
        bar2Class:"bar2-n"
      })
      
    }
  },
  showSitUp(){
    if(this.data.sitUp_dis == "none"){
      this.setData({
        pushUp_dis:"none",
        sitUp_dis:"block",
        bar1Class:"bar1-n",
        bar2Class:"bar2"
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    openid =app.globalData.openid;
    console.log("histoty页面获取globaldata.openid:" + openid);
    skipNum=0;
    skipNum2=0;
    tip=false;
    tip2=false;
    this.checkPushUpList();
    this.checkSitUpList();
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
    if(this.data.pushUp_dis == "block"){
      console.log("触底刷新skipNum:"+skipNum)
      if(skipNum != -1){
        wx.showLoading({
          title: '数据加载中',
        })
        this.checkPushUpList();
      }else{
        if(!tip){
          wx.showToast({
            title: '数据加载完毕',
            icon: 'success',
            duration: 1000//持续的时间
          })
          tip=true;
        }
      }
    }
    else{
      console.log("触底刷新skipNum2:"+skipNum2)
      if(skipNum2 != -1){
        wx.showLoading({
          title: '数据加载中',
        })
        this.checkSitUpList();
      }else{
        if(!tip2){
          wx.showToast({
            title: '数据加载完毕',
            icon: 'success',
            duration: 1000//持续的时间
          })
          tip2=true;
        }
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})