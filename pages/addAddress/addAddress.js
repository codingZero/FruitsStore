let app = getApp()
import Bmob from '../../utils/bmob.js'
import util from '../../utils/util.js'
Page({
  data: {
    gender:[
      {
        value: '1',
        name: '先生',
        checked: true
      }, {
        value: '2',
        name: '女士',
        checked: false
      }
    ],
    address: '请选择收货地址'
  },
  addAddress: function (info) {
    let Address = Bmob.Object.extend('address')
    let address = new Address()
    address.set('userId', app.globalData.userInfo.objectId)
    address.set('name', info.name)
    address.set('phone', info.phone)
    address.set('address', this.data.address)
    address.set('is_def', info.is_def)
    address.set('gender', info.gender)
    util.getNetworkType(() => {
      util.showLoading()
      address.save(null, {
        success: function (res) {
          wx.hideLoading()
          wx.navigateBack()
        }
      })
    })
  },
  submit:function (e) {
    let info = e.detail.value
    if (info.name == '' || info.phone == '' || this.data.address == '请选择收货地址') {
      util.showMsg('请填写完整的信息')
    } else {
      if (info.is_def) {
        let that = this
        let Address = Bmob.Object.extend('address')
        let query = new Bmob.Query(Address)
        let userInfo = app.globalData.userInfo
        query.equalTo('userId', userInfo.objectId)
        query.equalTo('is_def', true)
        query.find({
          success: function (res) {
            if (res.length) {
              res[0].set('is_def', false)
              res[0].save()
              that.addAddress(info)
            } else {
              that.addAddress(info)
            }
          }
        })
      } else {
        this.addAddress(info)
      }
    }
  },
  chooseLocation: function () {
    let that = this
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          address: res.address
        })
      },
    })
  }
})