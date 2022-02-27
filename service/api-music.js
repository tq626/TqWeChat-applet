import tqRequest from './index'

export function getBanners(){
    return tqRequest.get("/banner",{
        type:2
    })
}

export function getRankings(idx){
    return tqRequest.get("/top/list",{
        idx
    })
}

export function getSongMenu(cat="全部",limit=6,offset=0){
    return tqRequest.get("/top/playlist",{
        cat,
        limit,
        offset
    })
}

export function getSongMenuDetail(id){
    return tqRequest.get("/playlist/detail/dynamic",{
        id
    })
}
