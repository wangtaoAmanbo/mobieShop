var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    id: 0,
    topic: {},
    topicList: [],
    commentCount: 0,
    commentList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      id: parseInt(options.id)
    });

    util.request(api.TopicDetail, { id: that.data.id}).then(function (res) {
      if (res.errno === 0) {

        that.setData({
          topic: res.data,
        });

        WxParse.wxParse('topicDetail', 'html', res.data.content, that);
      }
    });

    util.request(api.TopicRelated, { id: that.data.id}).then(function (res) {
      if (res.errno === 0) {

        that.setData({
          topicList: res.data
        });
      }
    });
  },
  getCommentList(){
    let that = this;
    util.request(api.CommentList, { valueId: that.data.id, typeId: 1, size: 5 }).then(function (res) {
      if (res.errno === 0) {

        that.setData({
          commentList: res.data.data,
          commentCount: res.data.count
        });
      }
    });
  },
  postComment (){
    wx.navigateTo({
      url: '/pages/commentPost/commentPost?valueId='+this.data.id + '&typeId=1',
    })
  },
  wxParseTagATap(event) {
    //console.log(event)
    wx.navigateTo({
    //wx.redirectTo({       
      url: '/' + event.currentTarget.dataset.src
    })
  },
  onShareAppMessage: function (res) {
    let that = this;
    // var goods_id = that.data.goods_id;//获取产品id
    // var goods_title = that.data.goods_title;//获取产品标题
    // var goods_img = that.data.goods_img;//产品图片
    // if (res.from === 'button') {
    //   来自页面内转发按钮
    //   return {
    //     title: goods_title,
    //     path: '/page/details?id=' + goods_id,
    //     imageUrl: goods_img //不设置则默认为当前页面的截图
    //   }
    // }
    return {
      title: that.data.topic.title,
      desc: '原汁原味的非洲商品',
      path: '/pages/topicDetail/topicDetail?id=' + that.data.id,
      success: function (res) { }
    }
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
    this.getCommentList();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})