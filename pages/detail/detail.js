// pages/detail/detail.js
let Bmob = require('../../utils/bmob.js')
import util from '../../utils/util.js'
let app = getApp()
Page({
  data: {
    food: null,
    count: 1,
    foodId: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    this.setData({
      foodId: id
    })
    let food = Bmob.Object.extend('Food')
    let query = new Bmob.Query(food)
    let that = this
    util.getNetworkType(function () {
      util.showLoading()
      query.get(id, {
        success: function (result) {
          that.setData({
            food: result.attributes
          })
          wx.hideLoading()
        }
      })
    })
  },
  changeCount: function (e) {
    let id = e.currentTarget.id
    let count = this.data.count
    if (id === 'add') {
      count++
    } else {
      count = count > 1 ? count - 1 : 1
    }
    this.setData({
      count: count
    })
  },
  addToCar: function () {
    if (app.globalData.userInfo) {
      let food = this.data.food
      let buyCount = this.data.count
      let Shopping = Bmob.Object.extend('shopping')
      let query = new Bmob.Query(Shopping)
      let that = this
      query.equalTo('userId', app.globalData.userInfo.objectId)
      query.equalTo('foodId', this.data.foodId)
      query.find({
        success: function (result) {
          if (result.length > 0) {
            result[0].set('price', result[0].get('price') + food.price * buyCount)
            result[0].set('buyCount', result[0].get('buyCount') + buyCount)
            result[0].save()
            util.showToast('添加成功')
            setTimeout(() => {
              wx.navigateBack()
            }, 1000)
          } else {
            let shopping = new Shopping()
            shopping.set('userId', app.globalData.userInfo.objectId)
            shopping.set('foodImage', food.image)
            shopping.set('foodPrice', food.price)
            shopping.set('buyCount', that.data.count)
            shopping.set('price', food.price * that.data.count)
            shopping.set('foodId', that.data.foodId)
            shopping.set('summary', food.summary)
            shopping.save(null, {
              success: function () {
                util.showToast('添加成功')
                setTimeout(() => {
                  wx.navigateBack()
                }, 1000)
              },
              error: function () {
                util.showMsg('添加失败')
              }
            })
          }
        }
      })
    } else {
      util.toLogin()
    }
  },
  buyNow: function () {
    if (app.globalData.userInfo) {
      let food = this.data.food
      let sumPrice = food.price * this.data.count
      let shoppingList = [{
        'foodImage': food.image,
        'summary': food.summary,
        'buyCount': this.data.count,
        'foodPrice': food.price,
        'foodId': this.data.foodId
      }]
      app.globalData.shoppingList = shoppingList
      wx.redirectTo({
        url: '../order/order?sumPrice=' + sumPrice + '&flag=0',
      })
    } else {
      util.toLogin()
    }
  }
})