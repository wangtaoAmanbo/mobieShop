var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');
Page({
  data:{
    orderList: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    this.getOrderList();
  },
  getOrderList(){
    let that = this;
    util.request(api.OrderList).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          orderList: res.data.data
        });
      }
    });
  },
  //payOrder(){
  payOrder: function (event) {
    let dataset = event.target.dataset
    //console.log(event.target.dataset);
    console.log(dataset.id);
    wx.redirectTo({
      //url: '/pages/pay/pay',
      url: '/pages/pay/pay?actual_price=' + dataset.actual_price+
      '&orderId=' + dataset.id,
    })


    // pay.payOrder(parseInt(orderId)).then(res => {
    //   wx.redirectTo({
    //     url: '/pages/payResult/payResult?status=1&orderId=' + orderId
    //   });
    // }).catch(res => {
    //   wx.redirectTo({
    //     url: '/pages/payResult/payResult?status=0&orderId=' + orderId
    //   });
    // });
  },
  confirmReceipt(event) {
    let that = this;
    let dataset = event.target.dataset;
    util.request(api.OrderReceipt, { orderId: dataset.id}).then(function (res) {
      if (res.errno === 0) {
        wx.showToast({
          title: '已确认收货',
        });
        //let item = that.data.orderList.filter((c) => { return c == dataset.id })
        let l = that.data.orderList;
        l.map(x => {
          if (x.id == dataset.id) {
            x.order_status = 301;
            x.order_status_text = '已完成';
            return x ;
          }
        });
        console.log(that.data.orderList);
        that.setData({
          orderList: l
        });

      }
    });
  },
  buyAgain:function(event) {
    let dataset = event.target.dataset
    //console.log(event.target.dataset);
    wx.navigateTo({
      url: '/pages/goods/goods?id=' + dataset.goods_id
    })
     
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})