// pages/login/login.js
let app = getApp()
import util from '../../utils/util.js'
let Bmob = require('../../utils/bmob.js')
Page({
  data: {
    userInfo: null,
    phoneNo: '18550295581'
  },
  onLoad: function (options) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '水果商城请求获取用户信息，昵称、头像',
      confirmText: '允许',
      cancelText: '拒绝',
      success: function (res) {
        if (res.confirm) {
          wx.login({
            success: function () {
              wx.getUserInfo({
                success: function (res) {
                  that.setData({
                    userInfo: res.userInfo
                  })
                }
              })
            }
          })
        } else {
          wx.navigateBack()
        }
      }
    })
  },
  inputNumber: function (e) {
    let phoneNo = e.detail.value
    this.setData({
      phoneNo: phoneNo
    })
  },
  login: function () {
    let phoneNo = this.data.phoneNo
    if (phoneNo.length >= 11) {
      let userInfo = this.data.userInfo
      let User = Bmob.Object.extend('_User')
      let query = new Bmob.Query(User)
      query.equalTo('phoneNo', phoneNo)
      util.getNetworkType(() => {
        query.find({
          success: function (res) {
            if (res.length) {
              wx.setStorageSync('userInfo', res[0])
              app.globalData.userInfo = wx.getStorageSync('userInfo')
              util.showToast('登录成功')
              setTimeout(() => {
                wx.navigateBack()
              }, 1000)
            } else {
              let user = new User()
              user.set('username', userInfo.nickName)
              user.set('avatarUrl', userInfo.avatarUrl)
              user.set('password', phoneNo)
              user.set('phoneNo', phoneNo)
              user.set('province', userInfo.province)
              user.set('city', userInfo.city)
              user.set('gender', (userInfo.gender === 1) ? '男' : '女')
              user.save(null, {
                success: function (res) {
                  wx.setStorageSync('userInfo', res)
                  app.globalData.userInfo = wx.getStorageSync('userInfo')
                  util.showToast('登录成功')
                  setTimeout(() => {
                    wx.navigateBack()
                  }, 1000)
                },
                error: function (result, error) {
                  util.showMsg('登录失败')
                }
              })
            }
          }
        })
      })
    } else {
      util.showMsg('请输入正确的手机号')
    }
  }
})