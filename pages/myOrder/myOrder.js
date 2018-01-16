// pages/myOrder/myOrder.js
let app = getApp()
import Bmob from '../../utils/bmob.js'
import util from '../../utils/util.js'
Page({
  data: {
    orderList: null
  },
  onLoad: function (options) {
    let Order = Bmob.Object.extend('Order')
    let query = new Bmob.Query(Order)
    let that = this
    query.find({
      success: function (res) {
        that.setData({
          orderList: res
        })
      }
    })
  }
})