var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');

Page({
  data: {
    orderId: 0,
    actualPrice: 0.00
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.orderId,
      actualPrice: options.actual_price
    })
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  //向服务请求支付参数
  requestPayParam() {
    let that = this;
    //util.request(api.PayPrepayId, { orderId: that.data.orderId, payType: 1 }).then(function (res) {
    util.request(api.PayPrepayId, { orderId: that.data.orderId }).then(function (res) {
      if (res.errno === 0) {
        let payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.timeStamp,
          'package': payParam.nonceStr,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            wx.redirectTo({
              url: '/pages/payResult/payResult?status=true&orderId=' + that.data.orderId,
            })
          },
          'fail': function (res) {
            wx.redirectTo({
              url: '/pages/payResult/payResult?status=false&orderId=' + that.data.orderId,
            })
          }
        })
      }
    });
  },
  startPay() {
    //this.requestPayParam(); //提示缺少 total_fee 参数
    let orderId = this.data.orderId;
    console.log(orderId);
    pay.payOrder(parseInt(orderId)).then(res => {
      util.request(api.StatusChange, { orderId: orderId }, 'POST').then(res => {
        console.log(res);
        wx.redirectTo({
          url: '/pages/payResult/payResult?status=1&orderId=' + orderId
        });
      })
  
    }).catch(res => {
      wx.redirectTo({
        url: '/pages/payResult/payResult?status=0&orderId=' + orderId
      });
    });

  }
})