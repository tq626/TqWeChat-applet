// app.js
import { getLoginCode,codeToToken,checkToken ,checkSession} from './service/api_login'
import {TOKEN_KEY} from './constans/token-const'
App({
  // 其他页面获取到globalData中的数据不是响应式的
  globalData: {
    screenWidth:0,
    screenHeight:0,
    statusBarHeight:0,
    navBarHeight:44,
    deviceRadio:0,
    textHeight:35
  },
    onLaunch() {
    // 1.获取了设备信息
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth
    // console.log(info)
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight
    // console.log(info.statusBarHeight)
    const deviceRadio = info.screenHeight / info.screenWidth
    this.globalData.deviceRadio = deviceRadio

    this.handleLogin()
  },

   async handleLogin(){
      // 2.让用户默认进行登录
    const token = wx.getStorageSync(TOKEN_KEY)
    // token有没有过期
    const checkResult = await checkToken(token)
    const isSessionExpire = await checkSession()
    if(!token || checkResult.errorCode || !isSessionExpire)
      this.loginAction()
   },
   async loginAction(){
    // 1.获取code
    const code = await getLoginCode()
    // console.log(code)
    const result = await codeToToken(code)
    const token = result.token
    wx.setStorageSync(TOKEN_KEY, token)
  }

})
