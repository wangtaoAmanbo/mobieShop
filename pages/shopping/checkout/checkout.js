var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0,
    openAttr:false,
  },
  onLoad: function (options) {

    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    try {
      let addressId = wx.getStorageSync('addressId');
      //console.log(addressId)
      //console.log(addressId == '')

      if (addressId!='') {
      //if (addressId) {
        this.setData({
          'addressId': addressId
        });
        //console.log(that.data.addressId)
      }
      console.log(that.data.addressId)
      var couponId = wx.getStorageSync('couponId');
      if (couponId) {
        this.setData({
          'couponId': couponId
        });
      }
    } catch (e) {
      // Do something when catch error
    }


  },
  getCheckoutInfo: function () {
    let that = this;
    util.request(api.CartCheckout, { addressId: that.data.addressId, couponId: that.data.couponId }).then(function (res) {
      if (res.errno === 0) {
        //console.log(res.data);
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          checkedCoupon: res.data.checkedCoupon,
          //couponList: res.data.couponList,
          couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice,
          addressId: res.data.checkedAddress.id   //add
        });
      }
      wx.hideLoading();
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo()
    // this.getCheckoutInfo().then(()=>{
    //   if (this.data.addressId <= 0) {
    //     util.showErrorToast('请选择收货地址');
    //     return false;
    //   }
    // });

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
   // console.log(this.data.addressId);
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    util.request(api.OrderSubmit, { addressId: this.data.addressId, couponId: this.data.couponId }, 'POST').then(res => {
      if (res.errno === 0) {
        const orderId = res.data.orderInfo.id;
        pay.payOrder(parseInt(orderId)).then(res => {
          util.request(api.StatusChange, { orderId: orderId}, 'POST').then(res => {
            console.log(res);
            wx.redirectTo({
              url: '/pages/payResult/payResult?status=1&orderId=' + orderId
            });
            
          })
          // wx.redirectTo({
          //   url: '/pages/payResult/payResult?status=1&orderId=' + orderId
          // });
        }).catch(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
        });
      } else {
        util.showErrorToast('下单失败');
      }
    });
  }
})