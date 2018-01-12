// pages/car/car.js
let Bmob = require('../../utils/bmob.js')
import util from '../../utils/util.js'
let app = getApp()
Page({
  data: {
    shoppingList: null,
    sumPrice: 0
  },
  sumPrice: function () {
    let shoppingList = this.data.shoppingList
    let sumPrice = 0
    for (let food of shoppingList) {
      sumPrice += food.attributes.price
    }
    this.setData({sumPrice})
  },
  toDetail: function (e) {
    let foodId = e.currentTarget.id
    wx.navigateTo({
      url: '../detail/detail?id=' + foodId,
    })
  },
  toOrder: function () {
    let shoppingList = this.data.shoppingList
    let sumPrice = this.data.sumPrice
    wx.navigateTo({
      url: '../order/order?shoppingList=' + shoppingList + '&sumPrice=' + sumPrice,
    })
  },
  changeShopping: function (id, flag) {
    let shoppingList = this.data.shoppingList
    let that = this
    let index = 0
    for (index in shoppingList) {
      if (shoppingList[index].id === id) {
        break;
      }
    }
    let food = shoppingList[index]
    let count = food.attributes.buyCount
    count = flag ? (count + 1) : (count - 1)
    if (count < 1) {
      wx.showModal({
        title: '提示',
        content: '是否移除该商品',
        success: function (res) {
          if (res.confirm) {
            food.destroy({
              success: function () {
                shoppingList.splice(index, 1)
                that.setData({ shoppingList })
                that.sumPrice()
              }
            })
          }
        }
      })
    } else {
      var Shopping = Bmob.Object.extend("shopping");
      var query = new Bmob.Query(Shopping);
      query.get(id, {
        success: function (result) {
          result.set('buyCount', count);
          result.set('price', count * food.attributes.foodPrice);
          result.save();
          shoppingList[index] = result
          that.setData({ shoppingList })
          that.sumPrice()
        }
      });
    }
  },
  add: function (e) {
    let id = e.currentTarget.id
    this.changeShopping(id, true)
  },
  sub: function (e) {
    let id = e.currentTarget.id
    this.changeShopping(id, false)
  },
  onShow: function () {
    if (app.globalData.userInfo) {
      this.getShoppingList()
    } else {
      util.toLogin()
    }
  },
  getShoppingList: function () {
    let Shopping = Bmob.Object.extend('shopping')
    let query = new Bmob.Query(Shopping)
    query.equalTo('userId', app.globalData.userInfo.objectId)
    let that = this
    util.getNetworkType(() => {
      query.find({
        success: function (res) {
          that.setData({
            shoppingList: res
          })
          that.sumPrice()
        },
        error: function () {
          util.showMsg('获取购物车信息失败')
        }
      })
    })
  }
})