import tqRequest from './index'
export function getTopMV(offset,limit = 10){
    return tqRequest.get("/top/mv",{
        offset,
        limit
    })
}

export function getMVURL(id){
    return tqRequest.get("/mv/url",{
        id
    })
}
// 请求MV的详情
export function getMVDetail(mvid){
    return tqRequest.get("/mv/detail",{
        mvid
    })
}

// 
export function getRelatedVideo(id){
    return tqRequest.get("/related/allvideo",{
        id
    })
}
