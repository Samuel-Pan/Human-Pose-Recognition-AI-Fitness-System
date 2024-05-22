// pages/sportTwo/sportTwo.js
var type = null;
var time = null;
var mycanvas = null;
// var windowHeight, windowWidth;
var count = 0;
var down_error = 0;
var up_error = 0;
// var ne = 0;
// var dir = 0;
var camera = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    countt:0,
    up_errorr:0,
    down_errorr:0,
    beginPointer:"auto",
    endPointer:"none",
    aShow:true,
    num:10,
    btn1_color:"#1f72df",
    btn12_color:"#a35e5e"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      ctx: wx.createCameraContext(),
      // device: this.data.device,
    })
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
    this.setData({
      countt:0,
      up_errorr:0,
      down_errorr:0,
      beginPointer:"auto",
      endPointer:"none",
      aShow:true,
      num:10
    })
  },
  start_time(){
    var that=this;
    let num=11;
    var timerID;
    timerID = setInterval(() => {
      if (num > 0) {
        num--;
        that.setData({
          num:num,
          aShow:false,
          beginPointer:"none",
          endPointer:"none",
          btn1_color:"#6c88ad",
          btn2_color:"#a35e5e"
        })
      } else {
        that.setData({
          "num":0,
          "aShow":true,
          camera:true,
          countt:0,
          up_errorr:0,
          down_errorr:0,
          beginPointer:"none",
          endPointer:"auto",
          btn2_color:"#fa5151"
        })
        clearInterval(timerID);
        that.start();
      }
    }, 1000) //每隔1s调用一次timer函数
  },
  start(){
    type = "takePhoto";
    let ctx = wx.createCameraContext(this)
    let that = this
    let ne = 0;
    let dir = 0;
    time = setInterval(function(){
      if (type == "takePhoto"){
        console.log("begin takephoto")
        ctx.takePhoto({
          quality:"high",
          success:(res) =>{
            console.log(res.tempImagePath);
            var tempImagePath = res.tempImagePath
            wx.uploadFile({
              url: 'http://127.0.0.1:90/upload',
              filePath: tempImagePath,
              name: 'file',
              header:{"Content-type":"multipart/form-data"},
              success:function(res){
                var im_path = res.data
                console.log(im_path)
                wx.request({
                  //url: 'http://127.0.0.1:90/situp?url=' + im_path, 
                  url: 'http://www.farvuav.cc:90/situp?url=' + im_path,
                  method:"GET",
                  header:{"Content-type":"application/json"},
                  success:function(res){
                    var pos = res.data
                    console.log(pos)
                    var angle1 = (pos[0])
                    var angle2 = (pos[1])
                    if (parseFloat(angle2) > parseFloat(270)){
                      if (parseFloat(angle1) <= parseFloat(55)){
                        if (dir == 0){
                          count = count + 0.5
                          dir = 1
                        }
                        if (ne == -1){
                          down_error += 1
                          ne = 1
                        }
                      }
                      if (parseFloat(angle1) >= parseFloat(110)){
                        if (dir == 1){
                          count = count + 0.5
                          dir = 0
                        }
                        if (ne == 1){
                          up_error += 1
                          ne = -1
                        }
                      }
                      if (parseFloat(angle1) > parseFloat(65) && parseFloat(angle1) < parseFloat(100)){
                        if (dir == 0){
                          ne = 1
                        }
                        else{
                          ne = -1
                        }
                      }
                    }
                    that.setData({
                      countt:parseInt(count),
                      up_errorr: up_error,
                      down_errorr:down_error,
                    })
                  }
                })
              },
              // fail:function(res){
              //   console.log('fail',res)
              // },
            })
          }
        });
      }
    }, 500)
  },
  close(){
    console.log('close camera');
    type = "endPhoto"
    this.setData({
      camera:false,
      beginPointer:"auto",
      endPointer:"none",
      btn1_color:"#1f72df",
      btn2_color:"#a35e5e"
    })
    var app=getApp();
    app.globalData.historyUpdate = true;
    //把数据存入数据库
    const db = wx.cloud.database({
      env:env
    });
    const collections = db.collection('situp');
    collections.add({
      data: {
        count:this.data.countt,
        up_error:this.data.up_errorr,
        down_error:this.data.down_errorr,
        time: new Date().toJSON().substring(0, 10) + ' ' + new Date().toTimeString().substring(0,8)
      },
      success(result) {
        console.log('add成功')
        wx.showToast({
          title: '完成运动',
          icon: 'success',
          duration: 1000//持续的时间
        })
        that.postbillsuccess();
      }
    })
    count=0;
    up_error=0;
    down_error=0;
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
    type = "endPhoto"
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
