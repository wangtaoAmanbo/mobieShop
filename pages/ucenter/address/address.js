var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    addressList: [],
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getAddressList();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示

  },
  getAddressList (){
    let that = this;
    util.request(api.AddressList).then(function (res) {
      //let has_default = 0;
      //alert('11');
      //util.showErrorToast('opko oi');
      let d = res.data;
      for (var p in d) {  //遍历json数组时，这么写p为索引，0,1
        //console.log(d[p]);
        //console.log(d[p].is_default);
        if (d[p].is_default == 1) {

          //has_default = 1;
          wx.setStorageSync('address_default', 1);
          break;
        }
        //alert(packJson[p].name + " " + packJson[p].password);

      }
      console.log(res.data);
      if (res.errno === 0) {
        that.setData({
          addressList: res.data
        });
      }
    });
  },
  addressAddOrUpdate (event) {
    console.log(event)
    // wx.navigateTo({
    //   url: '/pages/ucenter/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
    // })
    wx.redirectTo({
      url: '/pages/ucenter/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
    })
  },
  deleteAddress(event){
    console.log(event.target)
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除地址？',
      success: function (res) {
        if (res.confirm) {
          let addressId = event.target.dataset.addressId;
          util.request(api.AddressDelete, { id: addressId }, 'POST').then(function (res) {
            if (res.errno === 0) {
              that.getAddressList();
            }
          });
          //console.log('用户点击确定')
        }
      }
    })
    return false;
    
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})