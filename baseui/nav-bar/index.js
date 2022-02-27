import { NavBarHeight } from "../../constans/device_const";

// components/navigation-bar/index.js
Component({
    // 使用多个插槽时必须定义这个属性
    options:{
        multipleSlots:true
    },
    properties: {
        // 动态设置导航栏的内容
        // left:{
        //     type:Number,
        //     value:0
        // }
        title:{
            type:String,
            value:"默认标题"
        }
    },
    data: {
        statusBarHeight:getApp().globalData.statusBarHeight,
        NavBarHeight:getApp().globalData.NavBarHeight
    },
    // 组件的生命周期
    lifetimes:{
        // ready:function(){
        //     const info = wx.getSystemInfoSync()
            
        // }
    },
    methods: {
        handleLeftClick(){
            // 发出事件
            this.triggerEvent('click')
        }
    }
})
