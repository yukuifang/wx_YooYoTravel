// pages/Profile/order/orderList.js
//获取应用实例
var app = getApp();
const page_size = 5;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: '',
    yooyo_sessid: '',
    partner_id: '',
    page_no: 1,
    orderList: [],
    isRefresh: false,//下拉刷新中
    isLoadingMore: false,//正在加载更多
    isNoMore: false,
    isNoData: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("state:" + options.state);
    if (options.state === "undefined") {
      console.log("options.state === undefined");
    }else {
      this.data.state = options.state;
    }

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
        that.getOrderList(false);
      },
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
  
    console.log("onPullDownRefresh:" + this.data.isRefresh);
    if (!this.data.isRefresh) {
      this.data.isRefresh = true;
      this.data.isNoMore = false;
      this.setData({
        isHideRefresh: false,
      });
      this.data.page_no = 1;
      this.getOrderList(false);
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom:" + this.data.isLoadingMore);
    if (!this.data.isLoadingMore && !this.data.isNoMore) {
      this.data.isLoadingMore = true;
      this.data.page_no++;
      this.getOrderList(true);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

/**
 * 加载更多
 */
  lower: function (e) {
    
    console.log("lower,isLoadingMore:" + this.data.isLoadingMore);
    if (!this.data.isLoadingMore && !this.data.isNoMore) {
      this.data.isLoadingMore = true;
      this.data.page_no++;
      this.getOrderList(true);
    }
    
  },

/**
 * 下拉刷新
 */
  upper: function (e) {
    console.log("upper...isRefresh:" + this.data.isRefresh);
    if (!this.data.isRefresh) {
      this.data.isRefresh = true;
      this.setData({
        isHideRefresh: false,
      });
      this.data.page_no = 1;
      this.getOrderList(false);
    }
    
  },

  getOrderList: function (isLoadMore) {
    // String[] state = { "", "2", "1", "3" };{ "订单", "待出行订单", "待付款订单", "退款单" };
    /**
     * "":全部订单
     * 2:待出行
     * 1:待付款
     * 3:退款单
     */
    // var url = "http://open.yooyo.com/rtapi/outer/router.json?app_key=yooyo_weekend&method=emall.order.list&state_classify=&yooyo_sessid=51f7d45c-a377-4c61-83a8-406a5ee16174&page_no=1&version=5&app_id=2&timestamp=1520327655553&page_size=10&partner_id=16";
    if (!isLoadMore && !this.data.isRefresh) {
      wx.showLoading({
        title: '请稍等',
      });
    }
    
    var that = this;
    wx.request({
      url: app.globalData.urlBase,
      data: {
        app_key: 'yooyo_weekend',
        method: 'emall.order.list',
        version: '5',
        app_id: '2',
        timestamp: Date.now(),
        state_classify: that.data.state,
        yooyo_sessid: that.data.yooyo_sessid,
        page_no: that.data.page_no,
        page_size: page_size,
        partner_id: that.data.partner_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        // success
        wx.hideLoading();
        console.log("getOrderList成功请求数据");
        console.log(res);
        if (that.data.page_no === 1) {
          that.data.isRefresh=false;
          that.data.orderList.splice(0, that.data.orderList.length);
          //停止刷新
          wx.stopPullDownRefresh();
          that.setData({
            isHideRefresh: true,
          });
          if(res.data.data.length < 1) {
            console.log("没有数据");
            that.data.isNoData=true;
            that.setData({
              isNoData: true,
            });
            return;
          }
          that.setData({
            isHideLoadMore: false
          });
        }
        that.processOrderListData(res.data, isLoadMore);
      },
      fail: function (res) {
        // fail

      },
      complete: function (res) {
        // complete

      }
    })

  },

  processOrderListData: function (res, isLoadMore) {

    console.log("size:"+res.data.length);
    // var orderList_temps = [];
    var orderList_item_temp = {};

    for (var idx in res.data) {
      var item = res.data[idx];
      orderList_item_temp = {
        id: item.id,
        order_no: item.order_no,
        logo_rsurl: "https://" + item.logo_rsurl,
        order_name: item.order_name,
        base_type_label: item.base_type_label,
        pay_price: item.pay_price,
        state_label: item.state_label,
        state: item.state
        // file_rsurl: "https:" + item.file_rsurl,
        // content: item.content,
        // describe: item.describe
        // click_url:item.click_url
      }
      this.data.orderList.push(orderList_item_temp); 
    }

    this.setData({
      orderList: this.data.orderList
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

  toOrderDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'orderDetail?id='+id,
    })
  },

  getPaySignData: function (e) {
    // var url = "http://open.yooyo.com/rtapi/outer/router.json?app_key=yooyo_weekend&method=emall.order.pay&app_id=2&partner_id=16&partner_id=16&pid=5&version=5&oid=302359&channel=wechatpay&service=WECHATPAY_APP";
    
    const oid = e.currentTarget.dataset.id;
    var that = this;
    wx.showLoading({
      title: '请稍等',
    })
    wx.request({
      url: app.globalData.urlBase,
      data: {
        app_key: 'yooyo_weekend',
        method: 'emall.order.pay',
        version: '5',
        app_id: '2',
        pid: '5',//合作者id
        channel: 'wechatpay',
        service: 'WECHATPAY_APP',
        oid: oid,
        partner_id: that.data.partner_id,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        // success
        console.log("getPaySignData成功请求数据");
        console.log(res);
        wx.hideLoading();
        that.pay(res.data);
      },
      fail: function (res) {
        // fail

      },
      complete: function (res) {
        // complete

      }
    })
  },

  pay: function(res) {

    // var rs = "{"package":"Sign= WXPay","appid":"wxb7c5049c5b77acb8","sign":"33A12B035B164DFF8F5BDC1CB2A0097F","partnerid":"1460210802","prepayid":"wx2018031417123676b84983d20508672029","noncestr":"1c25b60e124eeabf466607520344617d","timestamp":"1521018756"}"/

    var mData = JSON.parse(res.data);
    const nonceStr = mData.noncestr;
    const prepayid = mData.prepayid;
    const paySign = mData.sign;

    var that = this;
    wx.requestPayment({
      'timeStamp': Date.now().toString(),
      'nonceStr': nonceStr,
      'package': 'prepay_id=' + prepayid,
      'signType': 'MD5',
      'paySign': paySign,
      'success': function (res) {
        wx.showToast({
          title: 'success',
        })
        //刷新页面
        that.data.isRefresh = true;
        that.data.isNoMore = false;
        that.setData({
          isHideRefresh: false,
        });
        that.data.page_no = 1;
        that.getOrderList(false);

      },
      'fail': function (res) {
        console.log(res);
        wx.showToast({
          title: '支付失败',
        })
      }
    })
  }

})