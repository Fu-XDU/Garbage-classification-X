//var network = require("../../utils/network.js");
const app = getApp()
const util = require('../../utils/util.js')
const plugin = requirePlugin("WechatSI")
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()
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
    wx.showLoading({
      title: '正在查询',
    })
    if (e.detail.value == '') {
      this.setData({
        inputValue: e.detail.value,
        resultList: []
      })
      wx.hideLoading();
    } else if (e.detail.value != '') {
      //初始化数据
      this.setData({
        inputValue: e.detail.value,
        resultList: [],
        showView: false
      })
      //访问云函数
      wx.cloud.callFunction({
        name: "search",
        data: {
          litter: this.data.inputValue
        },
        complete: res => {
          try {
            var temp = [],
              temp2 = [],
              len = res.result.data.length,
              data = res.result.data
            console.log(data)
            console.log(len)
            for (let i = 0; i < len; ++i) {
              if (data[i].type == '干垃圾')
                data[i].type = '干垃圾 其它垃圾'
              else if (data[i].type == '湿垃圾')
                data[i].type = '湿垃圾 餐厨垃圾'
              temp.push([data[i].litter, data[i].type]);
              temp2.push(data[i].litter)
              //console.log('temp:',temp)
            }
          } catch (e) {}

          //访问云函数
          wx.cloud.callFunction({
            name: "searchPy",
            data: {
              litter: this.data.inputValue
            },
            complete: res => {
              try {
                for (let i = 0; i < res.result.data.length; ++i) {
                  if (res.result.data[i].type == '干垃圾')
                    res.result.data[i].type = '干垃圾 其它垃圾'
                  else if (res.result.data[i].type == '湿垃圾')
                    res.result.data[i].type = '湿垃圾 餐厨垃圾'
                  if (!temp2.includes(res.result.data[i].litter)) {
                    temp.push([res.result.data[i].litter, res.result.data[i].type])
                    temp2.push(res.result.data[i].litter)
                  }
                }
                temp.sort(function(x, y) {
                  //console.log(x[1])
                  return x[1].localeCompare(y[1]);
                });
                console.log(temp)
                this.setData({
                  resultList: temp
                })
                wx.hideLoading();
              } catch (e) {
                this.setData({
                  resultList: temp
                })
                wx.hideLoading();
              }
            }
          })
        }
      })
    }
  },
  res_history: function() {
    wx.showLoading({
      title: '正在查询',
    })
    //初始化数据
    this.setData({
      resultList: []
    })
    //访问云函数
    wx.cloud.callFunction({
      name: "search",
      data: {
        litter: this.data.inputValue
      },
      complete: res => {
        try {
          var temp = [],
            temp2 = []
          for (let i = 0; i < res.result.data.length; ++i) {
            if (res.result.data[i].type == '干垃圾')
              res.result.data[i].type = '干垃圾 其它垃圾'
            else if (res.result.data[i].type == '湿垃圾')
              res.result.data[i].type = '湿垃圾 餐厨垃圾'
            temp.push([res.result.data[i].litter, res.result.data[i].type]);
            temp2.push(res.result.data[i].litter)
          }
          console.log("历史查询", temp);
        } catch (e) {
          console.log(e)
        }
        this.setData({
          resultList: temp
        })
        //访问云函数
        wx.cloud.callFunction({
          name: "searchPy",
          data: {
            litter: this.data.inputValue
          },
          complete: res => {
            try {
              for (let i = 0; i < res.result.data.length; ++i) {
                if (res.result.data[i].type == '干垃圾')
                  res.result.data[i].type = '干垃圾 其它垃圾'
                else if (res.result.data[i].type == '湿垃圾')
                  res.result.data[i].type = '湿垃圾 餐厨垃圾'
                if (!temp2.includes(res.result.data[i].litter)) {
                  temp.push([res.result.data[i].litter, res.result.data[i].type])
                  temp2.push(res.result.data[i].litter)
                }
              }
              temp.sort(function(x, y) {
                //console.log(x[1])
                return x[1].localeCompare(y[1]);
              });
              console.log(temp)
              this.setData({
                resultList: temp
              })
              wx.hideLoading();
            } catch (e) {
              wx.hideLoading();
            }
          }
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
    try {
      if (e.detail.value.litter == "") {
        wx.showToast({
          icon: 'none',
          title: '请输入内容',
        })
        console.log('用户未输入内容')
        this.setData({
          flag: false
        })
      }
      if (e.detail.value.litter == "zxcvbnm") {
        wx.navigateTo({
          url: '../check/check'
        })
        this.setData({
          flag: false
        })
      }
      if (e.detail.value.litter == "asdzxc") {
        wx.navigateTo({
          url: '../database/database'
        })
        this.setData({
          flag: false
        })
      }
      //将垃圾添加至临时数据库待审
      if (this.data.flag == true) {
        const db = wx.cloud.database()
        db.collection('Litter').where({
            litter: e.detail.value.litter
          })
          .get({
            success: function(res) {
              if (res.data.length == 0) {
                const db = wx.cloud.database()
                db.collection('unregistedLitter').where({
                    litter: e.detail.value.litter
                  })
                  .get({
                    success: function(res) {
                      if (res.data.length == 0) {
                        const db = wx.cloud.database() //连接数据库
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
                      } else {
                        wx.showToast({
                          icon: 'none',
                          title: '此词条已在审核中'
                        })
                        console.log(e.detail.value.litter + ' has been Existed in [unregistedLitter]')
                      }
                    },
                    fail: function(res) {
                      wx.showToast({
                        icon: 'none',
                        title: '提交审核失败'
                      })
                    }
                  })
                this.setData({
                  flag: true
                })
              } else {
                wx.showToast({
                  icon: 'none',
                  title: '已有此词条数据'
                })
                console.log(e.detail.value.litter + ' has been Existed in [Litter]')
              }
            },
            fail: function(res) {
              wx.showToast({
                icon: 'none',
                title: '提交审核失败'
              })
            }
          })
      }
    } catch (e) {}
  },
  onShareAppMessage: function() {
    return {}
  },
  //以下为语音识别所需函数
  streamRecord: function() {
    manager.start({
      lang: 'zh_CN',
    })
  },
  streamRecordEnd: function() {
    manager.stop()
  },
  initRecord: function() {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      let text = res.result
      this.setData({
        inputValue: text,
      })
    }
    // 识别结束事件
    manager.onStop = (res) => {
      let text = res.result
      if (text == '') {
        // 用户没有说话，可以做一下提示处理...
        wx.showToast({
          title: '请说话',
          icon: 'none'
        })
        return
      }
      var newtext='';
      for (let i = 0; i < text.length; ++i) {
        console.log(text[i])
        if (text[i] != '.' && text[i] != ',' && text[i] != '!' && text[i] != '?' && text[i] != ';' && text[i] != ':' && text[i] != '"' && text[i] != "'" && text[i] != '。' && text[i] != '，' && text[i] != '！' && text[i] != '？' && text[i] != '；' && text[i] != '‘' && text[i] != '“' && text[i] != '什' && text[i] != '么' && text[i] != '垃' && text[i] != '圾' && text[i] != '是' && text[i] != '啥')
          newtext += text[i];
      }
      this.setData({
        inputValue: newtext,
      })
      // 得到完整识别内容就可以去搜索了
      this.res_history()
    }
  },

  onShow: function() {
    if (this.data.recordStatus == 2) {
      wx.showLoading({
        // title: '',
        mask: true,
      })
    }
  },

  onLoad: function() {
    app.getRecordAuth();
    this.initRecord();
  },

  onHide: function() {

  },
})