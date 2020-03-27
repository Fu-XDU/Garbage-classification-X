//app.js
App({
  onLaunch: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env:"xdu-fl-wfmlh"
      })
      wx.cloud.callFunction({
        name: "login",
        data: {},
        success: res => {
          console.log("用户登录成功!", res)
          this.globalData.openid = res.result.openid
        }
      })
    }
  },
  // 权限询问
  getRecordAuth: function () {
    wx.getSetting({
      success(res) {
        console.log("获取用户的当前设置成功！", res)
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              console.log("权限申请成功，已获取麦克风权限")
            }, fail() {
              console.error("权限申请失败，未获取麦克风权限")
            }
          })
        } else {
          console.log("已经获取麦克风权限，无需再次申请")
        }
      }, fail(res) {
        console.error("获取用户的当前设置失败！", res)
      }
    })
  },
  onHide: function () {
    wx.stopBackgroundAudio()
  },
  globalData: {
    openid: "",
    harmful:"",
    recyclable:"",
    wet:"",
    dry:""
  }
})