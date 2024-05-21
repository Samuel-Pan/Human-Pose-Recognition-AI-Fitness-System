
var type = null;
var time = null;
var mycanvas = null;
// var windowHeight, windowWidth;
var count = 0;
var hip_error = 0;
var down_error = 0;
var up_error = 0;
// var form = 0;
// var ne = 0;
// var direction = 0;
var camera = false;
Page({
  data:{
    countt:0,
    hit_errorr:0,
    up_errorr:0,
    down_errorr:0,
    beginPointer:"auto",
    endPointer:"none",
    aShow:true,
    num:10,
    btn1_color:"#1f72df",
    btn12_color:"#a35e5e"
  },
  onLoad(){
    this.setData({
      ctx: wx.createCameraContext(),
      // device: this.data.device,
    })
  },
  onShow() {
    this.setData({
      countt:0,
      hit_errorr:0,
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
          hit_errorr:0,
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
      let form = 0;
      let ne = 0;
      let direction = 0;
      time = setInterval(function(){
        if (type == "takePhoto"){
          console.log("begin takephoto")
          ctx.takePhoto({
            quality:"high",
            success:(res) =>{
              console.log(res.tempImagePath);
              var tempImagePath = res.tempImagePath
              wx.uploadFile({
                //url: 'http://127.0.0.1:90/upload', 
                url: 'http://www.farvuav.cc:90/upload',
                filePath: tempImagePath,
                name: 'file',
                header:{"Content-type":"multipart/form-data"},
                success:function(res){
                  var im_path = res.data
                  console.log(im_path)
                  wx.request({
                    //url: 'http://127.0.0.1:90/detect?url=' + im_path,  //换成当前的ip地址
                    url: 'http://www.farvuav.cc:90/detect?url=' + im_path,
                    method:"GET",
                    header:{"Content-type":"application/json"},
                    success:function(res){
                      var pos = res.data
                      console.log(pos)
                      var elbow = (pos[0])
                      var shoulder = (pos[1])
                      var hip = (pos[2])
                      var per = (pos[3])
                      if(parseFloat(elbow)>parseFloat(160) && parseFloat(shoulder)>parseFloat(40) && parseFloat(hip)>parseFloat(160)){
                        form = 1;
                      }
                      console.log("ne",ne)
                      console.log("direction",direction)
                      if(form==1){
                        if(per==100){
                          if(parseFloat(elbow)<=parseFloat(90) && parseFloat(hip)>parseFloat(160)){
                            if(direction==0){
                              count = count + 0.5
                              direction = 1;
                              console.log("direction",direction)
                            }
                            if(ne==1){
                              up_error = up_error + 1
                              ne = 2;
                              console.log("ne",ne)
                            }
                          }
                        }
                        if(per==0){
                          if(parseFloat(elbow)>parseFloat(160) && parseFloat(shoulder)>parseFloat(40) && parseFloat(hip)>parseFloat(160)){
                            if(direction==1){
                              count = count + 0.5;
                              direction = 0;
                            }
                            if(ne==2){
                              down_error = down_error + 1;
                              ne = 1;
                            }
                          }
                        }
                        if(parseFloat(per)>parseFloat(5) && parseFloat(per)<parseFloat(95)){
                          if(direction==0){
                            ne = 2;
                          }
                          else{
                            ne = 1;
                          }
                        }
                      }
                      if(parseFloat(hip) < parseFloat(160)){
                        if(per==0){
                          if(direction==1){
                            hip_error = hip_error + 1;
                            direction = 0;
                          }
                        }
                        if(parseFloat(per)>parseFloat(0)){
                          if(direction==0){
                            direction = 1;
                          }
                        }
                      }
                      that.setData({
                        countt:parseInt(count),
                        hit_errorr:hip_error,
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
    const collections = db.collection('sportRecord');
    collections.add({
      data: {
        count:this.data.countt,
        hit_error:this.data.hit_errorr,
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
        that.postbillsuccess()
      }
    })
    count=0;
    hip_error=0;
    up_error=0;
    down_error=0;
    console.log("historyUpdate:"+app.globalData.historyUpdate);
  },
  onUnload(){
    type = "endPhoto"
  }
})
