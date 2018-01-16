let app = getApp()
import util from '../../utils/util.js'
Page({
  data: {
    userInfo: null,
    cacheSize: 0,
    itemList: [
      [
        {
          title: '我的订单',
          icon: '../../assets/images/iconfont-order.png',
          url: '../myOrder/myOrder'
        },
        {
          title: '收货地址',
          icon: '../../assets/images/iconfont-addr.png',
          url: '../address/address'
        },
        {
          title: '清除缓存',
          icon: '../../assets/images/iconfont-clear.png',
          url: 'clearCache'
        }, {
          title: '意见反馈',
          icon: '../../assets/images/iconfont-help.png',
          url: '../feedback/feedback'
        }
      ], [
        {
          title: '关于我们',
          icon: '../../assets/images/iconfont-about.png',
          url: '../abount/abount'
        }, {
          title: '退出登录',
          icon: '../../assets/images/iconfont-kefu.png',
          url: 'logout'
        }
      ]
    ]
  },
  btnClick: function (e) {
    let that = this
    let url = e.currentTarget.id
    if (url === 'logout') {
      util.showOperationMsg('退出登录', '是否确定退出登录', () => {
        app.globalData.userInfo = null
        that.setData({
          userInfo: null
        })
        wx.removeStorageSync('userInfo')
      })
    } else if (url === 'clearCache') {
      util.showOperationMsg('提示', '是否确定清除缓存', () => {
        wx.clearStorage()
        that.setData({
          cacheSize: 0
        })
      })
    } else {
      if (this.data.userInfo) {
        wx.navigateTo({
          url: url,
        })
      } else {
        util.toLogin()
      }
    }
  },
  onShow: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    let that = this
    wx.getStorageInfo({
      success: function(res) {
        that.setData({
          cacheSize: res.currentSize
        })
      },
    })
  },
})