// miniprogram/pages/about/about.js
var app = getApp()
var count = 0;
Page({
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/Star_Unslected.png',
    selectedSrc: '../../images/Star_Slected.png',
    halfSrc: '../../images/Star_Half_Slected.png',
    key: 5, //评分
    status: '', //0未评 1已评
    name: '',
    version: '1.0.0'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.status)
  },
  ToFeedBack: function (e) {
    wx.navigateTo({
      url: '../FeedBack/FeedBack'
    })
  },
  /**
   * 点击左边,半颗星
   */
  selectLeft: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    count = key
    this.setData({
      key: key
    })

  },
  /**
   * 点击右边,整颗星
   */
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    count = key
    this.setData({
      key: key
    })
  },
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 0)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 0)
  },
  // 确定按钮
  startRating: function (e) {
    const db = wx.cloud.database()
    if (this.data.key % 1 == 0) {
      if (this.data.key <= 1) {
        this.setData({
          name: this.data.key + '' + 'Star'
        })
      } else {
        this.setData({
          name: this.data.key + '' + 'Stars'
        })
      }
    } else {
      if (this.data.key == 0.5) {
        this.setData({
          name: 'Half_Star'
        })
      } else if (this.data.key == 1.5) {
        this.setData({
          name: 'One_Half_Stars'
        })
      } else if (this.data.key == 2.5) {
        this.setData({
          name: 'Two_Half_Stars'
        })
      } else if (this.data.key == 3.5) {
        this.setData({
          name: 'Three_Half_Stars'
        })
      } else if (this.data.key == 4.5) {
        this.setData({
          name: 'Four_Half_Stars'
        })
      }
    }
    db.collection(this.data.name).add({
      data: {
        data: this.data.key
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '评分提交成功',
        })
        console.log('[数据库' + this.data.name + '] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '评分提交失败'
        })
        console.error('[数据库' + this.data.name + '][新增记录] 失败：', err)
      }
    })


    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 0)
  }
})