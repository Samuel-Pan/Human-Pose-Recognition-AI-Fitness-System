// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env:env
})

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    if(event.type == "situp"){
      return await cloud.database().collection("situp")
      .where(
        {
          _openid:event._openid
        }
      )
      .field({
        _id:true,
        count:true,
        up_error:true,
        down_error:true,
        time:true
      })
      .orderBy('time', 'desc')//降序
      .skip(event.skip)                 //跳过多少个记录（常用于分页），0表示这里不跳过
      .limit(5)               //限制显示多少条记录，这里为10
      .get({
        success: function (res) {
          this.setData({
            id:res._id
          })
          return res
        }
      });
    }else{
      return await cloud.database().collection("sportRecord")
      .where(
        {
          _openid:event._openid
        }
      )
      .field({
        _id:true,
        count:true,
        hit_error:true,
        up_error:true,
        down_error:true,
        time:true
      })
      .orderBy('time', 'desc')//降序
      .skip(event.skip)                 //跳过多少个记录（常用于分页），0表示这里不跳过
      .limit(5)               //限制显示多少条记录，这里为10
      .get({
        success: function (res) {
          this.setData({
            id:res._id
          })
          return res
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
}