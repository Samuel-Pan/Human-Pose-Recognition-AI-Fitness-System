// pages/knowledge/knowledge.js

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    "array":["none","none","none","none","none"],
    "list":[
      { 
        "key":0,
        "question":"错误的俯卧撑带来的后果",
        "answer":"腕关节、肘关节、肩关节损伤且训练效率低下。",
      },
      { 
        "key":1,
        "question":"正确的俯卧撑姿势",
        "answer":"1.俯身，双手与肩同宽支撑身体，肘关节伸直（肘关节不要锁死）。 2.双腿并拢向后伸直，背部挺直，核心收紧，身体与地面呈一条直线。 3.大臂与身体角度在45度左右，吸气向下俯身，至胸部几乎接触地面以后，呼气伸直手臂起身还原"
      },
      { 
        "key":2,
        "question":"俯卧撑的好处",
        "answer":"有规律的锻炼能使肌肉纤维变粗，从而让剩余的肌肉更加有力，减少人体生理老化。"
      },
      { 
        "key":3,
        "question":"榻腰以及臀部抬高的危害",
        "answer":"如果在俯卧撑训练当中，有榻腰的情况，就会导致我们的腰部以及背部肌肉成为了主要的受力目标，那么长时间的锻炼的话就会增加腰部的劳损。而且臀部抬得过高的话，在俯卧撑过程当中对肩部的压力就会增强。"
      },
      { 
        "key":4,
        "question":"臀部过高的解决方法",
        "answer":"通过核心力量的增强训练就可以纠正这个在俯卧撑训练时经常出现的错误，如果做等距训练效果会更好，比如平板支撑和空心保持等动作。对于臀部肌肉力量，可以进行臀腿和臀桥的锻炼，也可以在进行俯卧撑锻炼时，在两腿之间夹上一个瑜伽砖或瑜伽巾，帮助收紧臀部肌肉。"
      }
    ],
  },

  tapQuestion : function(event) {
      var index = event.currentTarget.dataset.index;
      var ans=this.data.array[index];
      if(ans=="block"){
        this.setData({
          ['array['+ index + ']'] :"none"
        });
      }else{
        
        this.setData({
          ['array['+ index + ']']:"block"
        });
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