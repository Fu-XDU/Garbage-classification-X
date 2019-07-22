//var network = require("../../utils/network.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    inputValue: null,
    resultList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  blur: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
    this.search();
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  save: function () {
    var list = this.data.list;
    if (list.indexOf(this.data.inputValue) == -1 & this.data.inputValue != '') {
      list.push(this.data.inputValue);
    }
    this.setData({
      list: list
    })
    wx.setStorage({
      key: 'historySearch',
      data: list
    })

  },
  searchName: function (e) {
    this.setData({
      inputValue: e.currentTarget.dataset.value
    })
    this.search();
  },
  remove: function () {
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
  clean: function () {
    var _this = this
    setTimeout(function () {
      _this.setData({
        inputValue: '',
      })
    }, 100)
  },
  detail: function (e) {
    
  },

res: function(e) {
  this.setData({
    inputValue: e.detail.value,
    resultList:[]
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
        temp.push(res.data[i].litter);
      }
      console.log(res)
      this.setData({
        resultList:temp
      })
    }
  })
}})