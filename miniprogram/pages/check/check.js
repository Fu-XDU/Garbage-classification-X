// miniprogram/pages/check/check.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ["有害垃圾", "可回收物", "湿垃圾", "干垃圾", "不属于垃圾，可能有害", "不属于垃圾，可以回收", "不属于日常生活垃圾", "装修垃圾", "大件垃圾", ""],
    list: [1],
    name: '正在获取数据，请稍候......',
    type: '',
    count: 0,
    typename: '',
    collectionName: 'unregistedLitter',
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //初始化数据
    this.setData({
      list: []
    })
    wx.cloud.callFunction({
      name: "checkall",
      data: {
        collectionName: this.data.collectionName
      },
      complete: res => {
        try {
          this.data.list = res.result.data;
        } catch (e) {
          this.setData({
            name: '无待审项目',
            type: ''
          })
        }
        console.log("[数据库unregistedLitter]信息获取成功");
        if (this.data.list.length == this.data.count) {
          this.setData({
            name: '无待审项目',
            index: 9
          })
        } else {
          var typeIndex = 0;
          /*"有害垃圾", "可回收物", "湿垃圾", "干垃圾", "不属于垃圾，可能有害", "不属于垃圾，可以回收", "不属于日常生活垃圾", "装修垃圾", "大件垃圾"*/
          if (this.data.list[this.data.count].type == '有害垃圾') {
            typeIndex = 0;
          } else if (this.data.list[this.data.count].type == '可回收物') {
            typeIndex = 1;
          } else if (this.data.list[this.data.count].type == '湿垃圾') {
            typeIndex = 2;
          } else if (this.data.list[this.data.count].type == '干垃圾') {
            typeIndex = 3;
          } else if (this.data.list[this.data.count].type == '不属于垃圾，可能有害') {
            typeIndex = 4;
          } else if (this.data.list[this.data.count].type == '不属于垃圾，可以回收') {
            typeIndex = 5;
          } else if (this.data.list[this.data.count].type == '不属于日常生活垃圾') {
            typeIndex = 6;
          } else if (this.data.list[this.data.count].type == '装修垃圾') {
            typeIndex = 7;
          } else if (this.data.list[this.data.count].type == '大件垃圾') {
            typeIndex = 8;
          }
          this.setData({
            name: this.data.list[this.data.count].litter,
            index: typeIndex
          })
        }
      }
    })
  },
  pick: function() {

  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
    })
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

  },
  right: function() {
    if (this.data.list.length == this.data.count) {
      this.setData({
        name: '无待审项目',
        index: 9
      })
    } else {
      const db = wx.cloud.database()
      db.collection('Litter').add({
        data: {
          litter: this.data.list[this.data.count].litter,
          type: this.data.array[this.data.index],
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
      if (this.data.array[this.data.index] == "有害垃圾") {
        this.setData({
          typename: 'harmfulLitter'
        })
      } else if (this.data.array[this.data.index] == "可回收物") {
        this.setData({
          typename: 'recyclableLitter'
        })
      } else if (this.data.array[this.data.index] == "干垃圾") {
        this.setData({
          typename: 'dryLitter'
        })
      } else if (this.data.array[this.data.index] == "湿垃圾") {
        this.setData({
          typename: 'wetLitter'
        })
      } else if (this.data.array[this.data.index] == "不属于垃圾，可能有害") {
        this.setData({
          typename: 'notLitter_mayHarmful'
        })
      } else if (this.data.array[this.data.index] == "不属于垃圾，可以回收") {
        this.setData({
          typename: 'notLitter_canRecycled'
        })
      } else if (this.data.array[this.data.index] == "不属于日常生活垃圾") {
        this.setData({
          typename: 'notDailylitter'
        })
      } else if (this.data.array[this.data.index] == "装修垃圾") {
        this.setData({
          typename: 'buildingLitter'
        })
      } else if (this.data.array[this.data.index] == "大件垃圾") {
        this.setData({
          typename: 'largeLitter'
        })
      }
      db.collection(this.data.typename).add({
        data: {
          litter: this.data.list[this.data.count].litter,
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
      wx.cloud.callFunction({
        name: "remove",
        data: {
          collectionName: this.data.collectionName,
          litter: this.data.list[this.data.count].litter
        },
        complete: res => {
          console.log("[数据库unregistedLitter]信息删除成功");
        }
      })
      if (this.data.list.length == this.data.count + 1) {
        this.setData({
          name: '无待审项目',
          index: 9
        })
      } else {
        ++this.data.count;
        var typeIndex = 0;
        /*"有害垃圾", "可回收物", "湿垃圾", "干垃圾", "不属于垃圾，可能有害", "不属于垃圾，可以回收", "不属于日常生活垃圾", "装修垃圾", "大件垃圾"*/
        if (this.data.array[this.data.index] == '有害垃圾') {
          typeIndex = 0;
        } else if (this.data.array[this.data.index] == '可回收物') {
          typeIndex = 1;
        } else if (this.data.array[this.data.index] == '湿垃圾') {
          typeIndex = 2;
        } else if (this.data.array[this.data.index] == '干垃圾') {
          typeIndex = 3;
        } else if (this.data.array[this.data.index] == '不属于垃圾，可能有害') {
          typeIndex = 4;
        } else if (this.data.array[this.data.index] == '不属于垃圾，可以回收') {
          typeIndex = 5;
        } else if (this.data.array[this.data.index] == '不属于日常生活垃圾') {
          typeIndex = 6;
        } else if (this.data.array[this.data.index] == '装修垃圾') {
          typeIndex = 7;
        } else if (this.data.array[this.data.index] == '大件垃圾') {
          typeIndex = 8;
        }
        this.setData({
          name: this.data.list[this.data.count].litter,
          index: typeIndex
        })
      }
    }
  },
  wrong: function() {
    if (this.data.list.length == this.data.count) {
      this.setData({
        name: '无待审项目',
        index: 9
      })
    } else {
      wx.cloud.callFunction({
        name: "remove",
        data: {
          litter: this.data.list[this.data.count].litter,
          collectionName: this.data.collectionName
        },
        success(res) {
          console.log("审核成功", res)
        },
        fail(res) {
          console.log("审核失败", res)
        }
      })
      if (this.data.list.length == this.data.count + 1) {
        this.setData({
          name: '无待审项目',
          index: 9
        })
      } else {
        ++this.data.count;
        var typeIndex = 0;
        /*"有害垃圾", "可回收物", "湿垃圾", "干垃圾", "不属于垃圾，可能有害", "不属于垃圾，可以回收", "不属于日常生活垃圾", "装修垃圾", "大件垃圾"*/
        if (this.data.array[this.data.index] == '有害垃圾') {
          typeIndex = 0;
        } else if (this.data.array[this.data.index] == '可回收物') {
          typeIndex = 1;
        } else if (this.data.array[this.data.index] == '湿垃圾') {
          typeIndex = 2;
        } else if (this.data.array[this.data.index] == '干垃圾') {
          typeIndex = 3;
        } else if (this.data.array[this.data.index] == '不属于垃圾，可能有害') {
          typeIndex = 4;
        } else if (this.data.array[this.data.index] == '不属于垃圾，可以回收') {
          typeIndex = 5;
        } else if (this.data.array[this.data.index] == '不属于日常生活垃圾') {
          typeIndex = 6;
        } else if (this.data.array[this.data.index] == '装修垃圾') {
          typeIndex = 7;
        } else if (this.data.array[this.data.index] == '大件垃圾') {
          typeIndex = 8;
        }
        this.setData({
          name: this.data.list[this.data.count].litter,
          type: typeIndex
        })
      }
    }
  },
})