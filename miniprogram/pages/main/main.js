//input.js
Page({
  data: {
    litter: "",
    type: "",
    typename: "",
    index: 0,
    array: ["有害垃圾", "可回收物", "湿垃圾", "干垃圾", "不属于垃圾，可能有害", "不属于垃圾，可以回收", "不属于日常生活垃圾", "装修垃圾", "大件垃圾"],
    createTime: "",
    imgUrls: [
      '../../images/1.jpg',
    ],
    flag: true
  },
  ToSearch: function(e) {
    wx.navigateTo({
      url: '../search/search'
    })
    /*wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowWidth);
        console.log(res.windowHeight);
      },
    })*/ //获取屏幕分辨率
  },
  ToRecyclable: function(e) {
    wx.navigateTo({
      url: '../recyclableWaste/recyclableWaste'
    })
  },
  ToHarmful: function(e) {
    wx.navigateTo({
      url: '../harmfulWaste/harmfulWaste'
    })
  },
  ToWet: function(e) {
    wx.navigateTo({
      url: '../wetWaste/wetWaste'
    })
  },
  ToDry: function(e) {
    wx.navigateTo({
      url: '../dryWaste/dryWaste'
    })
  },
  bindKeyInput: function(e) {
    this.setData({
      litter: e.detail.value
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
    })
  },
  res: function(e) {
    const db = wx.cloud.database()
    db.collection('Litter').add({
      data: {
        litter: e.detail.value.litter,
        type: e.detail.value.type,
        createTime: db.serverDate()
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库Litter] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库Litter] [新增记录] 失败：', err)
      }
    })
    if (e.detail.value.type == "有害垃圾") {
      this.setData({
        typename: 'harmfulLitter'
      })
    } else if (e.detail.value.type == "可回收物") {
      this.setData({
        typename: 'recyclableLitter'
      })
    } else if (e.detail.value.type == "干垃圾") {
      this.setData({
        typename: 'dryLitter'
      })
    } else if (e.detail.value.type == "湿垃圾") {
      this.setData({
        typename: 'wetLitter'
      })
    } else if (e.detail.value.type == "不属于垃圾，可能有害") {
      this.setData({
        typename: 'notLitter_mayHarmful'
      })
    } else if (e.detail.value.type == "不属于垃圾，可以回收") {
      this.setData({
        typename: 'notLitter_canRecycled'
      })
    } else if (e.detail.value.type == "不属于日常生活垃圾") {
      this.setData({
        typename: 'notDailylitter'
      })
    } else if (e.detail.value.type == "装修垃圾") {
      this.setData({
        typename: 'buildingLitter'
      })
    } else if (e.detail.value.type == "大件垃圾") {
      this.setData({
        typename: 'largeLitter'
      })
    }
    db.collection(this.data.typename).add({
      data: {
        litter: e.detail.value.litter,
        createTime: db.serverDate()
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库' + this.data.typename + '] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库' + this.data.typename + '] [新增记录] 失败：', err)
      }
    })
  },
  onShareAppMessage: function() {
    return {}
  },
  check: function (e) {
    const db = wx.cloud.database() //连接数据库
    //查找数据库或者临时数据库是否存在此垃圾
    db.collection('Litter').where({
      litter: e.detail.value.litter,
      type: e.detail.value.type
    }).get({
      success: res => {
        wx.showToast({
          icon: 'none',
          title: '此垃圾已被提交，请勿重复操作',
        })
        console.log('此垃圾已被提交')
        this.setData({
          flag: false
        })
      }
    })
    if (this.data.flag == true) {
      db.collection('unregistedLitter').where({
        litter: e.detail.value.litter,
        type: e.detail.value.type
      }).get({
        success: res => {
          wx.showToast({
            icon: 'none',
            title: '此垃圾已被提交，请勿重复操作',
          })
          console.log('此垃圾已被提交')
          this.setData({
            flag: false
          })
        }
      })
    }
    //将垃圾添加至临时数据库待审
    if (this.data.flag == true) {
      db.collection('unregistedLitter').add({
        data: {
          litter: e.detail.value.litter,
          type: e.detail.value.type,
          createTime: db.serverDate()
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          wx.showToast({
            title: '已提交审核',
          })
          console.log('[数据库unregistedLitter] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '提交审核失败'
          })
          console.error('[数据库unregistedLitter] [新增记录] 失败：', err)
        }
      })
    }
    this.setData({
      flag: true
    })
  }
})