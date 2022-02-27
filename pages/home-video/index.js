import {getTopMV} from "../../service/api_video"
// pages/home-video/index.js
Page({
    data: {
        topMVs:[],
        hasMore:true
    },
    /**
     * 生命周期函数--监听页面加载（相当于vue中create）
     */
    onLoad: async function (options) {
        // 1.未封装过的网络请求
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

        // 2.初步封装过的网络请求
        // tqRequest.get("/top/mv",{offset:0,limit:10}).then(res=>{
        //     this.setData({topMVs:res.data.data})
        // })

        //3. 终极封装的网络请求
        //    const res = await getTopMV(0)
        //    this.setData({topMVs:res.data})
        this.getTopMVData(0)
    },
 
    // 封装网络请求的方法
    getTopMVData: async function(offset){
        // 判断是否可以请求
        if(!this.data.hasMore && offset !== 0)return

        // 展示加载动画
        wx.showNavigationBarLoading()

        // 真正请求数据
        const res = await getTopMV(offset)
        let newData = this.data.topMVs
        if(offset === 0){
            newData = res.data
        }else{
            newData = newData.concat(res.data)
        }
        // 设置数据
        this.setData({topMVs: newData})
        this.setData({hasMore:res.hasMore})
        wx.hideNavigationBarLoading()
        if(offset === 0){
            wx.stopPullDownRefresh()
        }
    },

    // 封装事件处理的方法
    handleVideoItemClick: function(event){
        // 获取id
        const id = event.currentTarget.dataset.item.id
        // 页面跳转
        wx.navigateTo({
            url:`/pages/detail-video/index?id=${id}`
        })
        console.log(id)
    },

    onReachBottom: async function(){
        // if(!this.data.hasMore)return
        // const res = await getTopMV(this.data.topMVs.length)
        // this.setData({topMVs:this.data.topMVs.concat(res.data)})
        // this.setData({hasMore:res.hasMore})
        // console.log("-------")
        this.getTopMVData(this.data.topMVs.length)
    },

    onPullDownRefresh:async function(){
        // const res = await getTopMV(0)
        // this.setData({topMVs:res.data})
        this.getTopMVData(0)
    }
})