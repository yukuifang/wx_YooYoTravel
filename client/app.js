//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("code:"+res.code);
        // that.getOpenId(res.code);
      }
    })
  },

  getOpenId: function(code) {
    // var url = "https://api.weixin.qq.com/sns/jscode2session?appid="
    //   + this.globalData.appID + "&secret=" + this.globalData.appID + "&js_code=" + code + "&grant_type=authorization_code";
    wx.request({
      url: this.globalData.urlBase,
      data: {
        version: '5',
        app_key: 'yooyo_weekend',
        method: 'emall.wx.user.openid',
        code: code
        // timestamp: Date.now()
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      }, // 设置请求的 header
      success: function (res) {
        console.log("getOpenId成功请求数据");
        console.log(res);
        var msg = res.data.ret_msg;
        wx.showToast({
          title: msg,
        })

      },
      fail: function (res) {
        // fail

      },
      complete: function (res) {
        // complete

      }
    })

  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    urlBase: "https://open.yooyo.com/rtapi/outer/router.json",
    urlBase_test: "https://open.yooyo.cc/api/outer/router.json",
    // appID: "wxc614c3a31909d173",
    // appSecret: "272502c03c0f4420d208bb579dbcda28"
  }
})