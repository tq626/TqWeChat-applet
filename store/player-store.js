import { getSongDetail, getSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'
import {HYEventStore} from 'hy-event-store'
// 创建播放器
// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()
// 自动播放
// audioContext.play()
// audioContext.autoplay = true
const playerStore = new HYEventStore({
    state:{
        isFirstPlay:true,
        id:0,
        playModeIndex: 0 ,//0:循环播放 1：单曲循环 2：随机播放
        currentSong:{},
        durationTime:0,
        lyricInfos:[],
        currentLyricText:[],
        currentLyricIndex:0,
        currentTime:0,
        isPlaying:false,
        isStoping:false,

        playListSongs: [],
        playListIndex: 0
    },
    actions:{
        playMusicWithSongIdAction(ctx, { id, isRefresh = false }){
            if(ctx.id == id && !isRefresh){
                // this.dispatch中this指playerStore
                this.dispatch("changeMusicPlayStatusAction" , true)
                return
            }
            ctx.id = id

            // 0.修改播放的状态
            ctx.isPlaying = true
            // 重置上一首的数据的残影
            ctx.currentSong = {}
            ctx.durationTime = 0
            ctx.lyricInfos = []
            ctx.currentTime = 0
            ctx.currentLyricIndex = 0
            ctx.currentLyricText = ""

            // 请求歌词详情
            getSongDetail(id).then(res=>{
                // console.log(res.songs[0])
                ctx.currentSong = res.songs[0]
                ctx.durationTime = res.songs[0].dt
                // 设置背景播放的title
                audioContext.title = res.songs[0].name
            })
            // 请求歌词
            getSongLyric(id).then(res=>{
                const lyricString = res.lrc.lyric
                // console.log(lyricString)
                const lyrics = parseLyric(lyricString)
                // console.log(lyrics)
                ctx.lyricInfos = lyrics
            })
            // 2.播放对应id的歌曲
            // 使用audioContext播放歌曲
            // 停止播放上一首音乐
            audioContext.stop()
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
            // 背景播放的标题
            audioContext.title = id
            // 自动播放
            audioContext.autoplay = true

            // 3.监听audioContext一些事件
            if(ctx.isFirstPlay){
                this.dispatch("setupAudioContextListenerAction")
                ctx.isFirstPlay = false
            }

           
        },
        setupAudioContextListenerAction(ctx){
            // 1.监听歌曲可以播放
            audioContext.onCanplay(()=>{
                audioContext.play()
            })
            // 2.监听时间改变
            audioContext.onTimeUpdate(()=>{
                // 1.获取当前时间
                const currentTime = audioContext.currentTime*1000
                // 2.根据当前时间修改currentTime
                ctx.currentTime = currentTime
                
                // 3.根据当前时间去查找播放的歌词
                if(!ctx.lyricInfos.length) return
                let i =0
                for(;i<ctx.lyricInfos.length;i++){
                    const lyricInfo = ctx.lyricInfos[i]
                    if(currentTime < lyricInfo.time){
                       break
                     }
                    }
                    // 设置当前歌词的索引和内容
                    const currentIndex = i - 1
                    // 解决打印很多次
                    if(ctx.currentLyricIndex !== currentIndex){
                        const currentLyricInfo = ctx.lyricInfos[currentIndex]
                        ctx.currentLyricIndex = currentIndex
                        ctx.currentLyricText = currentLyricInfo.text
                }
            })

            // 3.监听歌曲播放完成,在播放下一首歌
            audioContext.onEnded(()=>{
                this.dispatch("changeNewMusicAction")
            })

            // 4.监听背景播放的按钮
            audioContext.onPlay(()=>{
                ctx.isPlaying = true
            })
            audioContext.onPause(()=>{
                ctx.isPlaying = false
            })
            audioContext.onStop(()=>{
                ctx.isPlaying = false
                ctx.isStoping = true
            })
        },

        changeMusicPlayStatusAction(ctx,isPlaying = true){
            ctx.isPlaying = isPlaying
            if(ctx.isPlaying && ctx.isStoping){
                // 播放音乐
                // audioContext.play()
                audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
                // 背景播放的标题
                audioContext.title = currentSong.name
                audioContext.startTime = ctx.currentTime / 1000
                ctx.isStoping = false
              }
              ctx.isPlaying ? audioContext.play() : audioContext.pause()
             
        },
        changeNewMusicAction(ctx,isNext = true){
            // 1.获取索引
            let index = ctx.playListIndex
            // 2.根据不同的播放模式，获取下一首歌的索引
            switch(ctx.playModeIndex){
                case 0://
                  index = isNext ? index + 1 : index - 1
                  if(index === ctx.playListSongs.length) index = 0
                  if(index === -1) index = ctx.playListSongs.length - 1
                  break
                case 1://单曲播放
                  index = index
                  break
                case 2: //随机播放
                  index = Math.floor(Math.random() * ctx.playListSongs.length)
                  break
            }
            // 记录最新的索引
            ctx.playListIndex = index
            // 3.获取歌曲
            let currentSong = ctx.playListSongs[index]
            if(!currentSong) currentSong = ctx.currentSong

            // 4.播放新的歌曲
            this.dispatch("playMusicWithSongIdAction", {id: currentSong.id, isRefresh:true })
        }

    }
})
export {
    audioContext,
    playerStore
}