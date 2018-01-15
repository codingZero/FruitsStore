let app = getApp()
import util from '../../utils/util.js'
import Bmob from '../../utils/bmob.js'
Page({
  data: {
    addressList: null
  },
  onShow: function () {
    let userId = app.globalData.userInfo.objectId
    let Address = Bmob.Object.extend('address')
    let query = new Bmob.Query(Address)
    query.equalTo('userId', userId)
    let that = this
    query.find({
      success: function (result) {
        that.setData({
          addressList: result
        })
      }
    })
  },
  setDefault: function (e) {
    let index = e.currentTarget.id
    let addressList = this.data.addressList
    let address = addressList[index]
    let userId = app.globalData.userInfo.objectId
    let that = this
    if (!address.is_def) {
      let Address = Bmob.Object.extend('address')
      let query = new Bmob.Query(Address)
      query.equalTo('is_def', true)
      query.equalTo('userId', userId)
      query.find({
        success: function (res) {
          if (res.length > 0) {
            res[0].set('is_def', false)
            res[0].save()
            for (let ad of addressList) {
              if (ad.id === res[0].id) {
                ad.set('is_def', false)
                break;
              }
            }
            that.changeDefault(index)
          } else {
            that.changeDefault(index)
          }
        }
      })
    }
  },
  changeDefault: function(index) {
    let addressList = this.data.addressList
    let address = addressList[index]
    address.set('is_def', true)
    address.save()
    addressList[index] = address
    this.setData({ addressList })
  },
  editAddress: function (e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '../editAddress/editAddress?id=' + id,
    })
  }
})