// components/song-item-v1/index.js
import { playerStore } from '../../store/player-store'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        item:{
            type:Object,
            value:{}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleSongItemClick(event){
            const id = event.currentTarget.dataset.id
            // 页面跳转
            // console.log(id)
            wx.navigateTo({
              url: `/pages/music-player/index?id=${id}` ,
            })
            // 对歌曲的数据请求和其他操作
            playerStore.dispatch("playMusicWithSongIdAction" ,{id})

            // 3.获取到播放列表/当前歌曲的索引
            
        }
    }
})
