
import {tqLoginRequest} from './index'
export function getLoginCode(){
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout:1000,
            success: res=>{
                const code = res.code
                resolve(code)
            },
            fail: err=>{
                console.log(err)
                reject(err)
            }
        })
    })
}

export function codeToToken(code){
   return tqLoginRequest.post("/login",{code},true)
}

export function checkToken(token){
    return tqLoginRequest.post("/auth",{},true)
}

export function checkSession(){
    return new Promise((resolve)=>{
        wx.checkSession({
            success:(res)=>{
                resolve(true)
            },
            fail:(err)=>{
                reject(false)
            }
        })
    })
}