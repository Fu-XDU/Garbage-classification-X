Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    inputValue: null,
    resultList: ["sa","saa"]
  },
  add:function(e){
    this.setData({
      resultList: this.data.resultList.concat("newarray")
    })
  }
})