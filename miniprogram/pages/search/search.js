//var network = require("../../utils/network.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    inputValue: null,
    resultList: [],
    sercherStorage: [],
    StorageFlag: false, //显示搜索记录标志位
    showView: false, //是否显示完善界面
    //以下为垃圾完善数据
    litter: "",
    type: "",
    typename: "",
    index: 0,
    array: ["有害垃圾", "可回收物", "湿垃圾", "干垃圾", "不属于垃圾，可能有害", "不属于垃圾，可以回收", "不属于日常生活垃圾", "装修垃圾", "大件垃圾"],
    createTime: "",
    flag: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    wx.getStorage({
      key: 'historySearch',
      success(res) {
        _this.setData({
          list: res.data
        })
      }
    })
  },
  blur: function(e) {
    this.setData({
      inputValue: e.detail.value,
      showView: false
    })
    this.res();
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value,
      showView: false
    })
  },
  onChangeShowState: function(e) {
    this.setData({
      showView: true
    })
  },
  save: function() {
    var list = this.data.list;
    if (list.indexOf(this.data.inputValue) == -1 & this.data.inputValue != '') {
      list.push(this.data.inputValue);
      this.setData({
        list: list
      })
      wx.setStorage({
        key: 'historySearch',
        data: list
      })
    }
  },
  searchName: function(e) {
    this.setData({
      inputValue: e.currentTarget.dataset.value,
      showView: false
    })
    this.res_history();
  },
  remove: function() {
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '确认清空所有记录?',
      success(res) {
        if (res.confirm) {
          wx.removeStorage({
            key: 'historySearch',
            success() {
              _this.setData({
                list: []
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  clean: function() {
    var _this = this
    setTimeout(function() {
      _this.setData({
        inputValue: '',
      })
    }, 100)
  },
  detail: function(e) {
    wx.showModal({
      title: '提示',
      content: e.currentTarget.dataset.id,
      showCancel: false, //不显示取消按钮
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
    this.save();
  },
  res: function(e) {
    //初始化数据
    this.setData({
      inputValue: e.detail.value,
      resultList: [],
      showView: false
    })

    //连接数据库
    const db = wx.cloud.database()
    db.collection('Litter').where({
      //使用正则查询，实现对搜索的模糊查询
      "litter": db.RegExp({
        regexp: e.detail.value,
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      })
    }).get({
      success: res => {
        var temp = []
        for (let i in res.data) {
          temp.push(res.data[i].litter + "     " + res.data[i].type);
        }
        console.log(res)
        this.setData({
          resultList: temp
        })
      }
    })
  },
  res_history: function() {
    //初始化数据
    this.setData({
      resultList: []
    })
    const db = wx.cloud.database() //连接数据库
    db.collection('Litter').where({
      //使用正则查询，实现对搜索的模糊查询
      "litter": db.RegExp({
        regexp: this.data.inputValue,
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      })
    }).get({
      success: res => {
        var temp = []
        for (let i in res.data) {
          temp.push(res.data[i].litter + "     " + res.data[i].type);
        }
        console.log(res)
        this.setData({
          resultList: temp
        })
      }
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
  check: function(e) {
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
  },
  onShareAppMessage: function() {
    return {}
  }
})