// pages/classify/classify.js
Page({
  data: {
    classify: [
      {
        "_id": "0", "name": "预定"
      },
      {
        "_id": "1", "name": "热卖"
      },
      {
        "_id": "2", "name": "新品"
      }
    ]
  },
  navigateTo: function (e){
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '../classifyDetail/classifyDetail?id=' + id,
    })
  }
})