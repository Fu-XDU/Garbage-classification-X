var app = getApp()
Page({
  //stuid.charAt(1)
  /**
   * 页面的初始数据
   */
  data: {
    harmfullist: [],
    recyclablelist: [],
    wetlist: [],
    drylist: [],
    arrType: 'begin',
    arrResults: null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (t) {
    if (this.data.arrResults == null) {
      this.setData({
        arrResults: this.data.harmfullist
      })
    }
    //有害垃圾
    if (app.globalData.harmful == "") {
      wx.cloud.callFunction({
        name: "checkall",
        data: {
          collectionName: 'harmfulLitter'
        },
        success: res => {
          this.setData({
            harmfullist: res.result.data
          })
          console.log("[数据库harmfulLitter]信息获取成功");
          this.setData({
            harmfullist: this.data.harmfullist
          })
          app.globalData.harmful = this.data.harmfullist
        }
      })
    } else {
      this.setData({
        harmfullist: app.globalData.harmful
      })
    }
    //可回收物
    if (app.globalData.recyclable == "") {
      wx.cloud.callFunction({
        name: "checkall",
        data: {
          collectionName: 'recyclableLitter'
        },
        success: res => {
          this.setData({
            recyclablelist: res.result.data
          })
          console.log("[数据库recyclableLitter]信息获取成功");
          this.setData({
            recyclablelist: this.data.recyclablelist
          })
          app.globalData.recyclable = this.data.recyclablelist
        }
      })
    } else {
      this.setData({
        recyclablelist: app.globalData.recyclable
      })
    }
    //湿垃圾
    if (app.globalData.wet == "") {
      wx.cloud.callFunction({
        name: "checkall",
        data: {
          collectionName: 'wetLitter'
        },
        success: res => {
          this.setData({
            wetlist: res.result.data
          })
          
          console.log("[数据库wetLitter]信息获取成功");
          this.setData({
            wetlist: this.data.wetlist
          })
          app.globalData.wet = this.data.wetlist
        }
      })
    } else {
      this.setData({
        wetlist: app.globalData.wet
      })
    }
    //干垃圾
    if (app.globalData.dry == "") {
      wx.cloud.callFunction({
        name: "checkall",
        data: {
          collectionName: 'dryLitter'
        },
        success: res => {
          this.setData({
            drylist: res.result.data
          })
          app.globalData.dry = this.data.drylist
          this.setData({
            drylist: this.data.drylist
          })
          console.log("[数据库dryLitter]信息获取成功");
          console.log("21",res)
        }
      })
    } else {
      this.setData({
        drylist: app.globalData.dry
      })
    }
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          //6.7不准改
          winHeight: res.windowHeight * (15 / 6)
        });
      }
    });
    footerTap: app.footerTap
  },
  detail: function (e) { },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 3) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
})