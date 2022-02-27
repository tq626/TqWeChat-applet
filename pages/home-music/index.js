// pages/home-music/index.js
import {rankingStore,rankingMap, playerStore} from '../../store/index'

import { getBanners, getSongMenu} from '../../service/api-music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'
// trailing:true表示轮播图到最后一次也要执行
const throttleQueryRect = throttle(queryRect,1000,{ trailing: true})
Page({
    data: {
        banners:[],
        swiperHeight:0,
        recommendSongs:[],
        hotSongMenu:[],
        recommendSongMenu:[],
        rankings:{ 0:{}, 2:{}, 3:{} },

        currentSong:{},
        isPlaying:false,
        playAnimState:"paused"
    },
    onLoad: function (options) {
        // 获取页面数据
        this.getPageData()

        // 发起共享数据的请求
        rankingStore.dispatch("getRankingDataAction")

        // 从store获取共享数据
        this.setupPlayerStoreListener()
    },

    // 网络请求
    getPageData: function(){
        getBanners().then(res =>{
            // setData是同步的还是异步的
            // setadata在设置data数据上，是同步的
            // 通过最新的数据对wxml进行渲染，渲染的过程是异步的
           this.setData({banners: res.banners})
        // react中
        // react->setState是异步的
        })

        getSongMenu().then(res=>{
            this.setData({hotSongMenu:res.playlists})
            console.log(res)
        })

        getSongMenu("华语").then(res=>{
            this.setData({recommendSongMenu:res.playlists})
        })
    },

    handleSwiperImageLoaded: function(){
        // 获取图片的高度(如何去获取某一个组件的高度)
        throttleQueryRect(".swiper-image").then(res=>{
            console.log("------")
            const rect = res[0]
            this.setData({swiperHeight:rect.height})
        })
    },

    // 事件处理
    handleSearchClick:function(){
        wx.navigateTo({
          url: '/pages/detail-search/index',
        })
    },

    getRankingHandler: function (idx){
        return (res)=>{
            if(Object.keys(res).length === 0 ) return
            const name = res.name
            const coverImgUrl = res.coverImgUrl
            const playCount = res.playCount
            const songList = res.tracks.slice(0,3)
            const rankingObj = {name,coverImgUrl,playCount,songList}
            const newRankings = {...this.data.rankings, [idx]:rankingObj}
            this.setData({
                rankings:newRankings
            })
        }
    },

    handleMoreClick:function(){
      this.navigateToDetailSongsPage("hotRanking")
    },
    handleRankingItemClick:function(event){
       const idx = event.currentTarget.dataset.idx
       const rankingName = rankingMap[idx]
       this.navigateToDetailSongsPage(rankingName)
    },
    handleSongItemClick(event){
        const index = event.currentTarget.dataset.index
        playerStore.setState("playListSongs", this.data.recommendSongs)
        playerStore.setState("playListIndex", index)
    },
    handlePlayBtnClick(){
        playerStore.dispatch("changeMusicPlayStatusAction",!this.data.isPlaying)
    },
    handlePlayBarClick(){
        wx.navigateTo({
          url: `/pages/music-player/index?id=${this.data.currentSong.id}`,
        })
    },
    navigateToDetailSongsPage(rankingName){
        wx.navigateTo({
          url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
        })
    },
    setupPlayerStoreListener(){
        // 1.排行榜的监听
        rankingStore.onState("hotRanking" ,(res)=>{
            if(!res.tracks) return
            const recommendSongs = res.tracks.slice(0,6)
            // console.log(recommendSongs)
            this.setData({recommendSongs:recommendSongs})
        })
        rankingStore.onState("newRanking",this.getRankingHandler(0))
        rankingStore.onState("originRanking",this.getRankingHandler(2))
        rankingStore.onState("upRanking",this.getRankingHandler(3))

        // 2.播放器的监听
        playerStore.onStates(["currentSong","isPlaying"],({currentSong,isPlaying})=>{
            if(currentSong) this.setData({currentSong})
            // console.log(isPlaying)
            if(isPlaying !==undefined) this.setData({isPlaying:isPlaying ,playAnimState: isPlaying ? "running":"paused"}) 
        })
    }
})

