// pages/detail-search/index.js
import { getSearchHot,getSearchSuggest,getSearchResult } from '../../service/api_search'
import debounce from '../../utils/debounce'//防抖工具
import stringToNodes from '../../utils/string2nodes'
const debounceGetSearchSuggest = debounce(getSearchSuggest,300) 
Page({
    data: {
        hotKeywords:[],
        suggestSongs:[],
        searchValue:"",
        suggestSongsNodes:[],
        resultSongs:[]
    },
    onLoad: function (options) {
        // 获取页面数据
        this.getPageData()
    },
    onUnload: function () {

    },
    // 网络请求
    getPageData(){
        getSearchHot().then(res=>{
            // console.log(res)
            this.setData({hotKeywords:res.result.hots})
        })
    },
    // 事件处理
    handleSearchChange(event){
        const searchValue = event.detail
        // 保存关键字
        this.setData({searchValue})
        // 3.判断关键字为空字符的处理逻辑
        if(!searchValue.length){
             this.setData({suggestSongs:[],resultSongs:[]})
            debounceGetSearchSuggest.cancel()
            return
        }
        // 搜索框防抖处理
        debounceGetSearchSuggest(searchValue).then(res=>{
            // 1.获取建议的关键字歌曲
            const suggestSongs = res.result.allMatch
            this.setData({suggestSongs})
            // 2.转成nodes节点
            const suggestKeywords = suggestSongs.map(item=>item.keyword)
            const suggestSongsNodes = []
            for(const keyword of suggestKeywords){
                const nodes = stringToNodes(keyword,searchValue)
                suggestSongsNodes.push(nodes)
            }
            this.setData({suggestSongsNodes})
        })
    },
    handleSearchAction:function(){
        const searchValue = this.data.searchValue
        getSearchResult(searchValue).then(res=>{
            this.setData({resultSongs:res.result.songs})
        })
    },
    handleKeywordItemClick(event){
        // 获取点击关键字
        const keyword = event.currentTarget.dataset.keyword
        
        // 2.将关键字设置到searchValue
        this.setData({searchValue:keyword})

        // 3.发送网络请求
        getSearchResult(keyword).then(res=>{
            this.setData({resultSongs:res.result.songs})
        })
    }
})