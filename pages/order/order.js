let app = getApp()
import Bmob from '../../utils/bmob.js'
import util from '../../utils/util.js'
Page({
  data: {
    shoppingList: null,
    sumPrice: 0,
    address: null,
    flag: null
  },
  getAddress: function () {
    let Address = Bmob.Object.extend('address')
    let query = new Bmob.Query(Address)
    let that = this
    query.equalTo('is_def', true)
    query.equalTo('userId', app.globalData.userInfo.objectId)
    query.find({
      success: function (result) {
        if (result.length) {
          that.setData({
            address: result[0]
          })
        } else {
          let Address = Bmob.Object.extend('address')
          let query = new Bmob.Query(Address)
          query.find({
            success: function (res) {
              if (res.length) {
                that.setData({
                  address: res[0]
                })
              } else {

              }
            }
          })
        }
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      sumPrice: options.sumPrice,
      shoppingList: app.globalData.shoppingList,
      flag: options.flag
    })
    this.getAddress()
  },
  submitOrder: function () {
    let shoppingList = this.data.shoppingList
    let foods = []
    let flag = this.data.flag
    if (flag === '0') {
      let food = shoppingList[0]
      foods.push({
        'foodImage': food.foodImage,
        'summary': food.summary,
        'buyCount': food.buyCount,
        'foodPrice': food.foodPrice,
      })
    } else {
      for (let food of shoppingList) {
        foods.push({
          'foodImage': food.get('foodImage'),
          'summary': food.get('summary'),
          'buyCount': food.get('buyCount'),
          'foodPrice': food.get('foodPrice'),
        })
      }
    }
    
    let Order = Bmob.Object.extend('Order')
    let order = new Order()
    
    order.set('address', this.data.address)
    order.set('price', parseFloat(this.data.sumPrice))
    order.set('userId', app.globalData.userInfo.objectId)
    order.set('flag', '1')
    order.set('foods', foods)
    order.save(null, {
      success: function (res) {
        let Food = Bmob.Object.extend('Food')
        let query = new Bmob.Query(Food)
        for (let food of shoppingList) {
          if (flag === '0') {
            query.get(food.foodId, {
              success: function (res) {
                let count = res.get('count') - food.buyCount
                res.set('count', count)
                res.save()
                util.showToast('提交成功')
                setTimeout(() => {
                  wx.navigateBack()
                })
              }
            })
          } else {
            food.destroy({
              success: function () {
                query.get(food.get('foodId'), {
                  success: function (res) {
                    let count = res.get('count') - food.get('buyCount')
                    res.set('count', count)
                    res.save()
                    util.showToast('提交成功')
                    setTimeout(() => {
                      wx.navigateBack()
                    })
                  }
                })
              }
            })
          }
        }
      },
    })
  }
})