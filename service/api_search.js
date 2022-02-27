import tqRequest from "./index";

export function getSearchHot(){
    return tqRequest.get("/search/hot")
}

export function getSearchSuggest(keywords){
    return tqRequest.get("/search/suggest",{
        keywords,
        type:"mobile"
    })
}

export function getSearchResult( keywords){
    return tqRequest.get("/search",{
        keywords
    })
}