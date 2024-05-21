// pages/myself/myself.js
var get=false;
var app=getApp();
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
      hasLogin: false,
      openid: null,
      avatarUrl:null,
      nickName:"点击头像登录",
      display:false,
      height:null,
      weight:null,
      hasCheck:false,
      isDisabled:true,
      isUpdate:false,
      click:"auto"
  },
  //登录， 获取code、userInfo等信息
  getUserProfile () {
    let picUrl;
    let name;
    wx.getUserProfile({
      desc: '必须授权才能继续使用', // 必填 声明获取用户个人信息后的用途，后续会展示在弹窗中
      success:(res)=> { 
        console.log('授权成功', res);
        console.log("userInfo:");
        console.log(res.userInfo);
        this.setData({ 
          'hasLogin': true,
        })
        picUrl=res.userInfo.avatarUrl;
        name=res.userInfo.nickName;
        //换取openid
        wx.login({
          //成功放回
          success:(res)=>{
            console.log(res);
            let code=res.code
            // 通过code换取openId
            wx.request({
              url: `https://api.weixin.qq.com/sns/jscode2session?appid={appid}&secret={secret}&js_code=${code}&grant_type=authorization_code`,
              success:(res)=>{
                console.log(res);
                this.data.openid=res.data.openid
                console.log("openid=="+this.data.openid);
                //查询数据库是否存在用户
                let db = wx.cloud.database({
                  env:env
                });
                let userCollection = db.collection('user')
                userCollection.where({
                  _openid:this.data.openid
                })
                .get({
                  success:(res)=>{
                    if(res.data.length == 0){
                      console.log("新用户，数据库没有该用户数据")
                      //上传数据到数据库
                      userCollection.add({
                        data:{
                          avatarUrl:picUrl,
                          nickName:name
                        },
                      })
                      this.setData({
                        avatarUrl:picUrl,
                        nickName:name
                      })
                      //提示新用户修改头像、昵称
                      wx.showModal({
                        title: '登录成功',
                        content: '请填写您的头像昵称，否则将设为默认',
                        success: function (res) {
                          if (res.confirm) {//这里是点击了确定以后
                            console.log('用户点击确定')
                            wx.navigateTo({   //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）后续可以使用wx.navigateBack 可以返回;
                              url:"/pages/index/index"
                            })
                          } else {//这里是点击了取消以后
                            console.log('用户点击取消')
                          }
                        }
                      })
                    }else{
                      console.log("数据库里有这个用户")
                      console.log(res);
                      this.setData({
                        avatarUrl:res.data[0].avatarUrl,
                        nickName:res.data[0].nickName
                      })
                      console.log("设置当前页面头像昵称后：")
                      console.log(this.data);
                    }
                    app.globalData.hasLogin=true;
                    app.globalData.avatarUrl=this.data.avatarUrl;
                    app.globalData.nickName=this.data.nickName;
                    app.globalData.openid=this.data.openid;
                    app.globalData.historyUpdate=true;//让首页的记录更新
                    console.log("app.globalData(成功换取openid版):");
                    console.log(app.globalData);
                  },
                  fail(res){
                    console.log("查询用户失败")
                  }
                })
                // .then(res=>{
                //   console.log("头像昵称修改成功");
                // })
                // .catch(err=>{
                //   console.log("头像昵称修改失败");
                // })
                 //临时存储
                wx.setStorage({
                  key:'userInfo',
                  data:{
                    hasLogin:true,
                    avatarUrl:this.data.avatarUrl,
                    nickName:this.data.nickName, 
                    openid:this.data.openid
                  },
                  success:function(){
                    console.log("我的页面 设置数据缓存成功")
                  }
                })
              }
            })
          }
        })
      },
      fail:(err)=> {
          console.log('授权失败', err);
      }
    })
  },
  update(){
    wx.navigateTo({   //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）后续可以使用wx.navigateBack 可以返回;
      url:"/pages/index/index"
    })
  },
  exitLogin(){
    this.setData({ 
      'hasLogin': false,
      'avatarUrl':null,
      'nickName':"点击头像登录",
      "opemid":null
    })
    app.globalData.hasLogin=false;
    app.globalData.avatarUrl=null;
    app.globalData.nickName=null;
    app.globalData.openid=null;
    wx.removeStorage({
      key: 'userInfo',
      success (res) {
        console.log("退出登录，临时存储库删除成功");
        console.log(res);
        wx.showToast({
          title: '退出成功',
          icon: 'success',
          duration: 1500//持续的时间
        })
      }
    })
  },
  history(){
    if(!app.globalData.hasLogin){
      wx.showToast({
        title: '请先登录！',
        icon: 'error',
        duration: 2000//持续的时间
      })
    }else{
      //跳转到显示历史记录页面
      wx.navigateTo({   //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）后续可以使用wx.navigateBack 可以返回;
      url:"/pages/history/history"
    })
    }
  },
  inputHeight(e){
    this.setData({
      height:e.detail.value,
    })
  },
  inputWeight(e){
    this.setData({
      weight:e.detail.value
    })
  },
  info(){
    console.log(this.data);
    console.log("已经从数据库查数据了吗？hascheck:"+this.data.hasCheck);
    if(!app.globalData.hasLogin){
      wx.showToast({
        title: '请先登录！',
        icon: 'error',
        duration: 2000//持续的时间
      })
    }else if(this.data.hasCheck && !this.data.display){//如果已经从数据库找过数据并且个人信息栏是未展开状态，则把个人信息栏展开
      this.setData({
        display:true
      })
    }
    else if(!this.data.display){//还没从数据库查过数据，并且个人信息栏未展开
      //连接数据库获取用户的身高体重
      let db = wx.cloud.database({
        env:env
      });
      let collections = db.collection('user');
      console.log("onshow:openid:"+this.data.openid);
      collections.where({
        _openid:this.data.openid
      }).get().then(res => {
        console.log('数据查询成功',res)//将返回值存到res里
        this.setData({
          height:res.data[0].height,
          weight:res.data[0].weight,
          hasCheck:true,
          display:true
        })
      }).catch(err => {
        console.log('查询失败',err)//失败提示错误信息
        this.setData({
          hasCheck:false,
          display:true
        })
      })
    }else{
      this.setData({
        display:false
      })
    }
  },
  infoUpdate(){
    //点击了完成按钮，修改完成了
    if(this.data.isUpdate){
      this.setData({
        isDisabled:true,
        isUpdate:false,
        click:"auto",
        hasCheck:false
      })
      //上传数据到数据库
      let db = wx.cloud.database({
        env:env
      });
      let userCollection = db.collection('user')
      //先查询有没有数据
      userCollection.where({
        _openid: this.data.openid
      }).get()
      .then(res=>{
        console.log("查询中，有数据");
        console.log(res);
        //没数据，要增加
        if(res.data.length == 0){
          userCollection.add({
            data:{
              height:this.data.height,
              weight:this.data.weight
            }
          })
          .then(res=>{
            console.log("增加成功");
          })
          .catch(err=>{
            console.log("增加失败");
          })
        }
        else{
          userCollection.where({
            _openid:this.data.openid
          }).update({
            data:{
              height:this.data.height,
              weight:this.data.weight,
            }
          })
          .then(res=>{
            console.log("修改成功");
          })
          .catch(err=>{
            console.log("修改失败");
          })
        }
      })//error，查询失败了
      .catch(err=>{
        console.log("查询失败，直接加数据")
        userCollection.add({
          data:{
            height:this.data.height,
            weight:this.data.weight
          }
        })
        .then(res=>{
          console.log("增加成功");
        })
        .catch(err=>{
          console.log("增加失败");
        })
      })

    }else{
      this.setData({
        isDisabled:false,//可以输入了
        isUpdate:true,//update状态，文字显示变为完成
        click:"none"
      })
      console.log("点击的是修改")
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
    console.log("get:"+get+",this.data.hasLogin:"+this.data.hasLogin);
    //如果还没登录，并且还没从临时存储库里获取过信息
    //如果登录了或者已经获取过信息了，那页面都会有数据了，不需要再存储
    if(!get && !this.data.hasLogin){
      console.log("onshow页面获取缓存数据")
      wx.getStorage({
        key:'userInfo',
        success:(res)=>{
          app.globalData.hasLogin=true;
          app.globalData.avatarUrl=res.data.avatarUrl;
          app.globalData.nickName=res.data.nickName;
          app.globalData.openid=res.data.openid;
          this.setData({
            hasLogin:true,
            avatarUrl:res.data.avatarUrl,
            nickName:res.data.nickName,
            openid:res.data.openid
          }),
          get=true;
          console.log("我的页面 成功获取缓存数据")
          console.log(app.globalData)
        }
      })
    }
    //登陆后修改了个人信息
    if(app.globalData.infoUpdate){
      this.setData({
        avatarUrl:app.globalData.avatarUrl,
        nickName:app.globalData.nickName,
      })
    }
    // if(get==0){
    //   that.setData({
    //     'hasLogin': app.globalData.hasLogin,
    //     'avatarUrl':app.globalData.avatarUrl,
    //     'nickName':app.globalData.nickName,
    //   })
    // }
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