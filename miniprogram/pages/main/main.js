//input.js
Page({
  data: {
    litter: "",
    type:"",
    index: 0,
    array: ["有害垃圾","可回收物","湿垃圾","干垃圾"]
  },
  ToSearch: function (e) {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      litter: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
    })
  },
  res: function (e) {
    const db = wx.cloud.database()
    db.collection('Litter').add({
      data: {
        litter: e.detail.value.litter,
        type: e.detail.value.type
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          litter: e.detail.value.litter,
          type: e.detail.value.type
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
})