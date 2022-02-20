import TQRequest from "../../service"

// pages/home-video/index.js
Page({
    data: {
        topMVs:[]
    },
    /**
     * 生命周期函数--监听页面加载（相当于vue中create）
     */
    onLoad: function (options) {
        // const _this = this
        // wx.request({
        //     url:'http://123.207.32.32:9001/top/mv',
        //     data:{
        //         offset:0,
        //         limit:10
        //     },
        //     success:function(res){
        //         _this.setData({topMVs:res.data.data})
        //         console.log(res)
        //     },
        //     fail:function(err){
        //         console.log(err)
        //     }
        // })
        TQRequest.get("top/mv",{offset:0,limit:10}).then(res=>{
            this.setData({topMVs:res.data.data})
        })
    },
})