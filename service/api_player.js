import tqRequest from './index'

export function getSongDetail(ids){
    return tqRequest.get("/song/detail",{
        ids
    })
}

export function getSongLyric(id){
    return tqRequest.get("/lyric",{
        id
    })
}