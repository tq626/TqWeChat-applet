// 正则表达式：字符串匹配利器
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
export function parseLyric(lyricString){
    const lyricStrings = lyricString.split("\n")
    const lyricInfos = []
    for(const lineString of lyricStrings){
         // 执行正则表达式
    const timeResult = timeRegExp.exec(lineString)
    if(!timeResult) continue
    // 获取时间
    const minute = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    const millsecondTime = timeResult[3] 
    const millsecond = millsecondTime.length === 2 ? millsecondTime * 10 : millsecondTime * 1
    const time = minute + second + millsecond
    // 获取歌词
    const text = lineString.replace(timeRegExp,"")
    const lyricInfo = {time, text } 
    lyricInfos.push(lyricInfo)
    }
    return lyricInfos
}