const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const app = getApp();

Page({
  data: {
    userInfo: {},
    showLoginDialog: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function() {

  },
  onShow: function() {
    this.setData({
      userInfo: app.globalData.userInfo,
    });
    //console.log(this.data.userInfo);
  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
  },
  needLogin(e) {
    //return util.needLogin()
    util.needLogin();
    //console.log(util.needLogin());
    var urlLink = e.currentTarget.dataset.url;
    if(util.needLogin() != false){ 
      wx.navigateTo({
        url: urlLink
      })
    }
    //console.log(util.needLogin());
    // if (!wx.getStorageSync('userInfo')) {
    //   util.showErrorToast('请先登录');
    //   return false;
    // }
  },
  onUserInfoClick: function() {
    if (wx.getStorageSync('token') && wx.getStorageSync('userInfo')) {

    } else {
      this.showLoginDialog();
    }
  },

  showLoginDialog() {
    this.setData({
      showLoginDialog: true
    })
  },

  onCloseLoginDialog () {
    this.setData({
      showLoginDialog: false
    })
  },

  onDialogBody () {
    // 阻止冒泡
  },

  onWechatLogin(e) {
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        return false
      }
      wx.showToast({
        title: '微信登录失败',
      })
      return false
    }
    util.login().then((res) => {
      return util.request(api.AuthLoginByWeixin, {
        code: res,
        userInfo: e.detail
      }, 'POST');
    }).then((res) => {
      console.log(res)
      if (res.errno !== 0) {
        wx.showToast({
          title: '微信登录失败',
        })
        return false;
      }
      // 设置用户信息
      this.setData({
        userInfo: res.data.userInfo,
        showLoginDialog: false
      });
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
      wx.setStorageSync('userInfo', JSON.stringify(res.data.userInfo));
      wx.setStorageSync('token', res.data.token);
      //new add
      wx.showToast({
        title: '登录成功',
      })
    }).catch((err) => {
      console.log(err)
    })
  },

  onOrderInfoClick: function(event) {
    wx.navigateTo({
      url: '/pages/ucenter/order/order',
    })
  },

  onSectionItemClick: function(event) {

  },

  // TODO 移到个人信息页面
  exitLogin: function() {
    // if (!wx.getStorageSync('token') && !wx.getStorageSync('userInfo')) {
    //   showErrorToast('请先登录');
    //   return
    // }

    let that = this;
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');

          // new add
          that.setData({
            userInfo: {
              nickname: '点击登录',
              avatar:'/static/images/p.png'
            },
          });
          console.log(that.data.userInfo); 
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })

  }
})