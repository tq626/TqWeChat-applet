// pages/detail-songs/index.js
import {playerStore, rankingStore} from '../../store/index'
import { getSongMenuDetail } from '../../service/api-music'
Page({
    data: {
        type:"",
        ranking:"",
        songInfo:{}
    },
    onLoad: function (options) {
        const type = options.type
        this.setData({type})
        if(type === "menu"){
            const id =options.id
            // console.log(id)
            getSongMenuDetail(id).then(res=>{
                // console.log(res)
                this.setData({songInfo:res.playlist})
            })
        }else if( type === "rank" ){
            const ranking = options.ranking
            // console.log(ranking)
            this.setData({ranking})
            rankingStore.onState(ranking,this.getRankingDataHanlder)
        }
        
    },
    onUnload: function () {
        if(this.data.ranking){
            rankingStore.offState(this.data.ranking,this.getRankingDataHanlder)
        }
    },

    handleSongItemClick(event){
        const index = event.currentTarget.dataset.index
        playerStore.setState("playListSongs",this.data.songInfo.tracks)
        playerStore.setState("playListIndex", index)
    },
    getRankingDataHanlder(res){
        this.setData({songInfo:res})
    }
})