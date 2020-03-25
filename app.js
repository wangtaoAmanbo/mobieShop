App({
  onLaunch: function () {
    try {
      // this.globalData.userInfo = JSON.parse(wx.getStorageSync('userInfo'));
      // this.globalData.token = wx.getStorageSync('token');
      console.log(wx.getStorageSync('userInfo'));
      if (wx.getStorageSync('userInfo')){
        this.globalData.userInfo = JSON.parse(wx.getStorageSync('userInfo'));
      }
      console.log(wx.getStorageSync('token'));
      if (wx.getStorageSync('token')) {
        this.globalData.token = wx.getStorageSync('token');
      }
    } catch (e) {
      console.log(e);
    }
  },

  globalData: {
    userInfo: {
      nickname: '点击登录',
      //avatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
      avatar: '/static/images/p.png'
    },
    token: '',
  }
})