var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    handleOption: {},
    //orderStatus:0,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },
  getOrderDetail() {
    let that = this;
    util.request(api.OrderDetail, {
      orderId: that.data.orderId
    }).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          orderInfo: res.data.orderInfo,
          orderGoods: res.data.orderGoods,
          handleOption: res.data.handleOption
        });
        //that.payTimer();
      }
    });
  },
  payTimer() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    setInterval(() => {
      console.log(orderInfo);
      orderInfo.add_time -= 1;
      that.setData({
        orderInfo: orderInfo,
      });
    }, 1000);
  },
  cancelOrder() {
    let that = this;
    util.request(api.OrderCancel, {
      orderId: that.data.orderId 
    }).then(function (res) {
      if (res.errno === 0) {
        // that.data.orderStatus = res.data.orderStatus
        // that.setData({
        //   'orderStatus': res.data.orderStatus
        // });
        //console.log(that.data.orderStatus)
        let info = that.data.orderInfo;
        info.order_status = res.data.orderStatus
        that.setData({
          orderInfo: info,
        });
        console.log(that.data.orderInfo)
      }
    });
  },
  // confirmReceipt(event) {
  //   let that = this;
  //   let dataset = event.target.dataset;
  //   util.request(api.OrderReceipt, { orderId: dataset.id }).then(function (res) {
  //     if (res.errno === 0) {
  //       wx.showToast({
  //         title: '已确认收货',
  //       });
  //       let l = that.data.orderInfo;
  //       //l.order_status = 301;
  //       l.order_status_text = '已完成';  

  //       that.setData({
  //         orderInfo: l
  //       });
  //     }

  //   });
  // },

  payOrder() {
    let that = this;
    util.request(api.PayPrepayId, {
      orderId: that.data.orderId || 15
    }).then(function (res) {
      if (res.errno === 0) {
        const payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            console.log(res)
          },
          'fail': function (res) {
            console.log(res)
          }
        });
      }
    });

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})