// pages/Discover/Discover.js
//获取应用实例
var app = getApp();
const page_size = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    yooyo_sessid: '',
    partner_id: '',
    page_no: 1,
    isRefresh: false,//下拉刷新中
    isLoadingMore: false,//正在加载更多
    isNoMore: false,
    isNoData: false,
    activityList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isHideRefresh: true,
      isHideLoadMore: true
    });

    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.data.yooyo_sessid = res.data.yooyo_sessid;
        that.data.partner_id = res.data.member.partner_id;
        that.getActivityList(false);
      },
      fail: function (res) {
        that.getActivityList(false);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom:" + this.data.isLoadingMore);
    if (!this.data.isLoadingMore && !this.data.isNoMore) {
      this.data.isLoadingMore = true;
      this.data.page_no++;
      this.getActivityList(true);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  getActivityList: function (isLoadMore) {
    // var url = "http://open.yooyo.com/rtapi/outer/router.json?app_key=yooyo_weekend&method=emall.activity.list";
    // partner_id = 100 & yooyo_sessid=51f7d45c- a377 - 4c61- 83a8- 406a5ee16174& page_no=1 & version=5 & app_id=2 & timestamp=1521171995536 & page_size=12 & partner_id=16

    var that = this;
    wx.request({
      url: app.globalData.urlBase,
      data: {
        app_key: 'yooyo_weekend',
        method: 'emall.activity.list',
        version: '5',
        app_id: '2',
        timestamp: Date.now(),
        yooyo_sessid: that.data.yooyo_sessid,
        page_no: that.data.page_no,
        page_size: page_size,
        partner_id: '100',//that.data.partner_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        // success
        wx.hideLoading();
        console.log("getActivityList成功请求数据");
        console.log(res);
        if (that.data.page_no === 1) {
          that.data.isRefresh = false;
          that.data.activityList.splice(0, that.data.activityList.length);
          //停止刷新
          wx.stopPullDownRefresh();
          that.setData({
            isHideRefresh: true,
          });
          if (res.data.data.length < 1) {
            console.log("没有数据");
            that.data.isNoData = true;
            that.setData({
              isNoData: true,
            });
            return;
          }
          that.setData({
            isHideLoadMore: false
          });
        }
        that.processActivityListData(res.data, isLoadMore);
      },
      fail: function (res) {
        // fail

      },
      complete: function (res) {
        // complete

      }
    })
  },

  processActivityListData: function (res, isLoadMore) {

    console.log("size:" + res.data.length);
    var activityList_item_temp = {};

    for (var idx in res.data) {
      var item = res.data[idx];
      activityList_item_temp = {
        id: item.id,
        banner_rsurl: "https://" + item.banner_rsurl,
        index_url: item.index_url,
        // file_rsurl: "https:" + item.file_rsurl,
        // content: item.content,
        // describe: item.describe
        // click_url:item.click_url
      }
      this.data.activityList.push(activityList_item_temp);
    }

    this.setData({
      activityList: this.data.activityList
    });

    if (isLoadMore) {
      this.data.isLoadingMore = false;
    }

    if (res.data.length < 5) {
      this.data.isNoMore = true;
      this.setData({
        isHideLoadMore: true
      });
    }

  },

  openUrl: function(e) {
    var url = e.currentTarget.dataset.url.replace("http", "https");
    console.log(url);
    // const a = JSON.stringify(url)
    wx.setStorage({
      key: 'url',
      data: url,
    })
    wx.navigateTo({
      url: '../WebView/WebView',
    })
  }
})