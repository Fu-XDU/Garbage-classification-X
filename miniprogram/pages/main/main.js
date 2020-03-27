//input.js
Page({
  data: {
  },
  ToSearch: function(e) {
    wx.navigateTo({
      url: '../search/search'
    })
    console.log('用户进入搜索界面')
  },
  onShareAppMessage: function() {
    return {}
  }
})