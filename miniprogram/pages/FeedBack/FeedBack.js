// miniprogram/pages/FeedBack/FeedBack.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentLen: 0,
    emailLen: 0,
    contentResult: '',
    emailResult: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  sendEmail(){
    if (this.data.contentLen == 0) {
      wx.showToast({
          icon: 'none',
          title: '请填写补充描述'
        }),
        console.error('用户未填写补充描述')
    } else {
      wx.cloud.callFunction({
        name: "sendEmail",
        data: {
          feedbackContent: this.data.contentResult,
          emailContent: this.data.emailResult
        },
        success(res) {
          wx.showToast({
              title: '反馈提交成功',
            }),
            console.log("发送成功", res)
        },
        fail(res) {
          wx.showToast({
              icon: 'none',
              title: '反馈提交失败'
            }),
            console.log("发送失败", res)
        }
      }),
      wx.cloud.callFunction({
        name: "sendEmail2",
        data: {
          feedbackContent: this.data.contentResult,
          emailContent: this.data.emailResult
        },
        success(res) {
            console.log("发送成功2", res)
        },
        fail(res) {
            console.log("发送失败2", res)
        }
      })
    }
  },
  wordStaticContent: function(e) {
    // 获取反馈内容的长度
    this.setData({
      contentResult: e.detail.value,
      contentLen: parseInt(e.detail.value.length)
    })
    console.log(this.data.contentResult + ' 长度：' + this.data.contentLen)
  },
  wordStaticemail: function(e) {
    // 获取联系方式的长度
    this.setData({
      emailResult: e.detail.value,
      emailLen: parseInt(e.detail.value.length)
    })
    console.log(this.data.emailResult + ' 长度：' + this.data.emailLen)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})