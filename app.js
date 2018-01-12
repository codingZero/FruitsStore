//app.js
var Bmob = require('utils/bmob.js');
import util from 'utils/util.js'
Bmob.initialize("f5a9937a1d6ba7def4a40970a4554000", "cf1f7b46b787fed2c4f586b0da7fb4f7");

let food, query
App({
  onLaunch: function () {
    this.globalData.fruitsList = wx.getStorageSync('fruitsList')
    food = Bmob.Object.extend("Food")
    query = new Bmob.Query(food)
    let that = this
    util.getNetworkType(function() {
      query.count({
        success: function (count) {
          that.globalData.count = count
        }
      })
    })
    this.globalData.userInfo = wx.getStorageSync('userInfo')
  },
  getFruitsList: function (cb) {
    if (this.globalData.fruitsList) {
      typeof cb === "function" && cb(this.globalData.fruitsList)
      return
    }
    const that = this
    query.limit(this.globalData.limit)
    query.ascending('createdAt')
    util.getNetworkType(function(){
      util.showLoading()
      query.find({
        success: function (results) {
          that.globalData.fruitsList = results
          typeof cb === "function" && cb(that.globalData.fruitsList)
          wx.setStorageSync('fruitsList', results)
          wx.hideLoading()
        },
        error: function (error) {
          util.showMsg('查询数据失败')
        }
      })
    })
  },
  globalData: {
    count: null,
    limit: 6,
    fruitsList:null,
    userInfo: null
  }
})