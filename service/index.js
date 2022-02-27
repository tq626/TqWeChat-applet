import TOKEN_KEY from '../constans/token-const'
const token = wx.getStorageSync(TOKEN_KEY)
const BASE_URL = "http://123.207.32.32:9001"
const LOGIN_BASE_URL = "http://123.207.32.32:3000"

class TQRequest {
    
    constructor(baseURL,authHeader = {}){
        this.baseURL = baseURL
        this.authHeader = authHeader
    }
    request(url,method,params,isAuth = false,header={}){
        const finalHeader = isAuth ? { ...this.authHeader,...header} : header
      return new Promise((resolve,reject)=>{
        wx.request({
            url:this.baseURL+url,
            method:method,
            header:finalHeader,
            data:params,
            success:function(res){
                resolve(res.data)
            },
            fail:function(err){
                reject(err)
            }
        })
      })
    }
    get(url,params,isAuth = false,header){
        return this.request(url,"GET",params,isAuth,header)
    }
    post(url,data,isAuth = false,header){
        return this.request(url,"POST",data,isAuth,header)
    }
}

const tqRequest = new TQRequest(BASE_URL)
// TQRequest.request("/top/mv","GET",{offset:0,limit:10}).then(res=>{}).catch(err=>{})

const tqLoginRequest = new TQRequest(LOGIN_BASE_URL,{
    token
})
export default tqRequest
export {
    tqLoginRequest
} 