//index.js
var Bmob = require('../../utils/bmob.js');
import util from '../../utils/util.js'
const app = getApp()

Page({
  data: {
   fruitsList:null,
   imageUrls: [
     'http://bpic.588ku.com/back_pic/02/66/81/56578b826c90b2b.jpg',
     'http://qpic.588ku.com/58pic/13/18/16/45I58PICg7v.jpg',
     'http://qpic.588ku.com/58pic/16/69/90/90X58PICtwI.jpg'
   ],
   indicator: true,
   interval: 3000,
   duration: 500,
   autoplay: true
  },
  toDetail: function(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  },
  onReachBottom: function () {
    if (this.data.fruitsList.length >= app.globalData.count) {
      util.showMsg('没有更多数据')
    } else {
      let that = this
      let food = Bmob.Object.extend('Food')
      let query = new Bmob.Query(food)
      query.limit(this.data.fruitsList.length += app.globalData.limit)
      util.getNetworkType(function(){
        util.showLoading()
        query.find({
          success: function (results) {
            app.globalData.fruitsList = results
            wx.setStorageSync('fruitsList', results)
            that.setData({
              fruitsList: results
            })
            wx.hideLoading()
          }
        })
      })
    }
  },
  onLoad: function () {
    const that = this
    app.getFruitsList(function(fruitList){
        that.setData({
          fruitsList: fruitList
        })
    })
  }
})
