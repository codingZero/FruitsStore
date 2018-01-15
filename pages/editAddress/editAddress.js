let app = getApp()
import Bmob from '../../utils/bmob.js'
import util from '../../utils/util.js'
Page({
  data: {
    gender: [
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
    chooseAddress: '请选择收货地址',
    address: null
  },
  onLoad: function (options) {
    let id = options.id
    let Address = Bmob.Object.extend('address')
    let query = new Bmob.Query(Address)
    let that = this
    query.get(id, {
      success: function (result) {
        that.setData({
          address:result,
          chooseAddress: result.get('address')
        })
      }
    })
  },
  delAddress:function () {
    let address = this.data.address
    util.showOperationMsg('删除提示', '是否确定删除？', ()=>{
      util.getNetworkType(()=>{
        util.showLoading()
        address.destroy({
          success: function () {
            wx.navigateBack()
          }
        })
      })
    })
  },
  updateAddress: function (info) {
    let address = this.data.address
    address.set('name', info.name)
    address.set('phone', info.phone)
    address.set('address', this.data.chooseAddress)
    address.set('is_def', info.is_def)
    address.set('gender', info.gender)
    util.getNetworkType(() => {
      util.showLoading()
      address.save()
      wx.navigateBack()
    })
  },
  submit: function (e) {
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
              that.updateAddress(info)
            } else {
              that.updateAddress(info)
            }
          }
        })
      } else {
        this.updateAddress(info)
      }
    }
  },
  chooseLocation: function () {
    let that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          chooseAddress: res.address
        })
      },
    })
  }
})