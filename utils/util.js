const showLoading = () => {
  wx.showLoading({
    title: '正在加载',
    mask: true
  })
}

const toLogin = () => {
  wx.showModal({
    title: '请登录',
    content: '您还未登录，请先登录',
    success: function (result) {
      if (result.confirm) {
        wx.navigateTo({
          url: '../login/login',
        })
      }
    }
  })
}

const getNetworkType = (cb) => {
  let that = this
  wx.getNetworkType({
    success: function (res) {
      if (res.networkType === 'none') {
        that.showMsg('网络异常，请检查网络')
      } else {
        typeof cb === 'function' && cb()
      }
    },
  })
}

const showMsg = (msg) => {
  wx.showModal({
    title: '提示',
    content: msg,
    showCancel: false,
    confirmColor: '#4ba0e4',
  })
}

const showOperationMsg = (title, msg, cb) => {
  wx.showModal({
    title: title,
    content: msg,
    confirmColor: '#4ba0e4',
    success: function (res) {
      if (res.confirm) {
        typeof cb === 'function' && cb()
      }
    }
  })
}

const showToast = (title) => {
  wx.showToast({
    title: title,
    duration: 1000
  })
}

module.exports = {
  showLoading,
  toLogin,
  getNetworkType,
  showMsg,
  showToast,
  showOperationMsg
}