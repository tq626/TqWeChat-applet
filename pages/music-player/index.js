// pages/music-player/index.js
// import { getSongDetail, getSongLyric } from '../../service/api_player'
import { audioContext,  playerStore } from '../../store/index'
// import { parseLyric } from '../../utils/parse-lyric'
const playModeNames = ["order","repeat","random"]
Page({
    data: {
        id:0,
        currentSong:{},
        durationTime:0,
        lyricInfos:[],
        
        currentLyricText:[],
        currentLyricIndex:0,
        currentTime:0,
        textHeight:0,
       
        playModeIndex:0,
        playModeName:"order",
        isPlaying:false,
        playingName:"pause",

        contentHeight:0,
        isMusicLyric:true,
        currentPage:0,
        sliderValue:0,
        isSliderChanging:false,
        lyricScrollTop:0
    },
    onLoad: function (options) {
        // 1.获取传入的id
        const id = options.id
        // console.log(id)
        this.setData({id:id})

        // 2.根据id获取歌曲信息
        // this.getPageData(id)
        this.setupPlayerStoreListener()

        // 3.动态计算内容的高度
        const screenHeight = getApp().globalData.screenHeight
        const statusBarHeight = getApp().globalData.statusBarHeight
        const navBarHeight =getApp().globalData.navBarHeight
        const contentHeight = screenHeight-statusBarHeight-navBarHeight
        const deviceRadio = getApp().globalData.deviceRadio
        const textHeight = getApp().globalData.textHeight
        // 判断deviceRadio如果大于等于2将有值反之
        this.setData({contentHeight,isMusicLyric:deviceRadio >=2 ,textHeight})

        // // 4.使用audioContext播放歌曲
        // // 停止播放上一首音乐
        // audioContext.stop()
        // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        // // 自动播放
        // // audioContext.autoplay = true
        // // 准备好后立马可以播放
        // this.setupAudioContextListener()
        
    },

    //============================= 网络请求=============================
    // getPageData: function(id){
    //     getSongDetail(id).then(res=>{
    //         // console.log(res.songs[0])
    //         this.setData({currentSong:res.songs[0] , durationTime: res.songs[0].dt})
    //     })
    //     getSongLyric(id).then(res=>{
    //         const lyricString = res.lrc.lyric
    //         // console.log(lyricString)
    //         const lyrics = parseLyric(lyricString)
    //         // console.log(lyrics)
    //         this.setData({lyricInfos : lyrics})
    //     })
    // },

    // ======================事件监听============================
    // setupAudioContextListener(){
    //     audioContext.onCanplay(()=>{
    //         audioContext.play()
    //     })
    //     // 时间发生变化的时候监听
    //     audioContext.onTimeUpdate(()=>{
    //         // 1.获取当前时间
    //         const currentTime = audioContext.currentTime*1000
    //         // 2.根据当前时间修改滑块滑动的值
    //         if(!this.data.isSliderChanging){
    //         // 滑动条跟着音乐播放时间走
    //         const sliderValue = currentTime / this.data.durationTime * 100
    //         this.setData({sliderValue,currentTime})
    //         }

    //         // 3.根据当前时间去查找播放的歌词
    //         if(!this.data.lyricInfos.length) return
    //         let i =0
    //         for(;i<this.data.lyricInfos.length;i++){
    //             const lyricInfo = this.data.lyricInfos[i]
    //             if(currentTime < lyricInfo.time){
    //                break
    //              }
    //             }
    //             // 设置当前歌词的索引和内容
    //             const currentIndex = i - 1
    //             // 解决打印很多次
               
    //             if(this.data.currentLyricIndex !== currentIndex){
    //                 const currentLyricInfo = this.data.lyricInfos[currentIndex]
    //                 this.setData({
    //                     currentLyricText: currentLyricInfo.text,
    //                     currentLyricIndex:currentIndex,
    //                     lyricScrollTop:currentIndex * this.data.textHeight
    //                 })
    //         }
    //     })
    // },
    // ==========================事件处理=============================================
   
//    
    handleSwiperChange(event){
        const current = event.detail.current
        this.setData({currentPage:current})
    },

    handleSliderChanging(event){
        const value = event.detail.value
        const currentTime = this.data.durationTime * value / 100
        this.setData({isSliderChanging:true,currentTime})
    },

    handleSliderChange(event){
        // 1.获取slider变化的值
        const value = event.detail.value
        // 2.计算需要播放的currentTime
        const currentTime = this.data.durationTime*value/100
        // 3.设置context播放currentTime位置的音乐
        // 先暂停一下
        // audioContext.pause()
        audioContext.seek(currentTime/1000)
        // 记录最新的sliderValue
        this.setData({sliderValue:value,isSliderChanging:false})
    },
    handleBackBtnClick(){
        // 后退到前一页
        wx.navigateBack()
    },
    handleModeBtnClick(){
        let playModeIndex = this.data.playModeIndex + 1
        if(playModeIndex === 3) playModeIndex = 0
        // 设置playerStore中playModeIndex
        playerStore.setState("playModeIndex", playModeIndex)
    },

    handlePlayBtnClick(){
        playerStore.dispatch("changeMusicPlayStatusAction" ,!this.data.isPlaying)
    },
    // 播放上一首歌曲
    handlePrevBtnClick(){
        playerStore.dispatch("changeNewMusicAction" ,false)
    },
    // 播放下一首歌曲
    handleNextBtnClick(){
        playerStore.dispatch("changeNewMusicAction")
    },
    // ============================数据监听====================================
    setupPlayerStoreListener(){
        // 监听currentSong,durationTime,lyricInfos的变化
        playerStore.onStates(["currentSong","durationTime","lyricInfos"],({
            currentSong,
            durationTime,
            lyricInfos
        })=>{
            if(currentSong) this.setData({ currentSong })
            if(durationTime) this.setData({ durationTime })
            if(lyricInfos) this.setData({ lyricInfos })
        })

        // 2.监听currentTime/currentLyricIndex/currentLyricText
        playerStore.onStates(["currentTime","currentLyricIndex","currentLyricText"],({
            currentTime,
            currentLyricIndex,
            currentLyricText
        })=>{
            // 时间变化的操作
            if(currentTime && !this.data.isSliderChanging){
                const sliderValue = currentTime / this.data.durationTime * 100
                this.setData({currentTime, sliderValue})
            }
            // 歌词变化
            if(currentLyricIndex){
                this.setData({currentLyricIndex, lyricScrollTop: currentLyricIndex * this.data.textHeight})
            }
            if(currentLyricText){
                this.setData({currentLyricText})
            }
        })

        //3.监听playModeIndex

        playerStore.onStates(["playModeIndex","isPlaying"],({playModeIndex,isPlaying})=>{
            // console.log( playModeNames[playModeIndex])
            if(playModeIndex !== undefined){
                this.setData({
                    playModeIndex,
                    playModeName: playModeNames[playModeIndex],
                    })
            }
            if(isPlaying !==undefined){
                this.setData({ 
                    isPlaying,
                    playingName: isPlaying ? "pause" : "resume"
                 })
            }
        })
    },

    onUnload: function () {

    },
  
})