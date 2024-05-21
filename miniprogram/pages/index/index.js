// pages/index/index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
    nickName:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onChooseAvatar(e) {
    let avatarUrl=e.detail.avatarUrl;
    this.setData({
      avatarUrl,
    })
    this.data.avatarUrl = 'data:image/jpeg;base64,' + wx.getFileSystemManager().readFileSync(e.detail.avatarUrl,'base64')
    console.log(this.data.avatarUrl)
  },
  getNickName(e){
   
  },
  gotNickName(e){
    this.data.nickName = e.detail.value;
    console.log("e:",e);
  },
  confirmClick(){
    if(this.data.nickName == null || this.data.nickName == "" || this.data.nickName.length ==0){
      wx.showToast({
        title: '昵称不得为空！',
        icon: 'error',
        duration: 1000//持续的时间
      })
    }else{
      console.log("确认后的数据")
      console.log(this.data);
      app.globalData.avatarUrl=this.data.avatarUrl;
      app.globalData.nickName=this.data.nickName;
      app.globalData.infoUpdate=true;
      wx.setStorage({
        key:'userInfo',
        data:{
          hasLogin:true,
          avatarUrl:this.data.avatarUrl,
          nickName:this.data.nickName, 
          openid:app.globalData.openid,
        },
        success:function(){
          console.log("修改信息后，设置数据缓存成功");
          //返回上层页面
          wx.navigateBack({
            delta: 1
          })
        }
      })
      //上传数据到数据库
      let db = wx.cloud.database({
        env:env
      });
      let userCollection = db.collection('user')
      userCollection.where({
        _openid:app.globalData.openid
      })
      .update({
        data:{
          avatarUrl:this.data.avatarUrl,
          nickName:this.data.nickName, 
        }
      })
      .then(res=>{
        console.log("头像昵称修改成功");
      })
      .catch(err=>{
        console.log("头像昵称修改失败");
      })
     
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
    console.log(app.globalData);
    let that = this;
    that.setData({
      avatarUrl:app.globalData.avatarUrl,
      nickName:app.globalData.nickName
    })
    console.log(that.data);
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