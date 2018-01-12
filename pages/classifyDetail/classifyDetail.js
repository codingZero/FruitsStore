let Bmob = require('../../utils/bmob.js')
let app = getApp()
import util from '../../utils/util.js'
Page({
  data: {
    fruitsList: null
  },
  onLoad: function (options) {
    let id = options.id
    let title = ''

    if (id === '0') title = '预定'
    else if (id === '1') title = '热卖'
    else title = '新品'
    wx.setNavigationBarTitle({title})

    let Food = Bmob.Object.extend('Food')
    let query = new Bmob.Query(Food)
    let that = this 
    query.equalTo('classify', id)
    query.find({
      success: function (result) {
        that.setData({
          fruitsList: result
        })
      }
    })
  },
  toDetail: function (e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  }
})