// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'shy-9gaedwfq183372c7'
})

//引入路由
const TcbRouter = require('tcb-router')
const axios = require('axios')
//定义基础URL
const BASE_URL = 'https://shy-coder.cn1.utools.club'
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event,
  })

  //歌单列表请求，需要传入url，其实记录索引，请求的记录数，按照创建时间降序排列
  app.router('playlist', async (ctx,next) => {
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
  })

  //根据歌单id获取歌单详情
  app.router('musiclist', async (ctx, next) => {
    console.log('######' + event.playlistId)
    const res = await axios.get(`${BASE_URL}/playlist/detail?id=${parseInt(event.playlistId)}`)
    console.log('######' + res)
    ctx.body = res.data
  })

  app.router('musicUrl', async (ctx, next) => {
    const res = await axios.get(`${BASE_URL}/song/url?id=${event.musicId}`)
    ctx.body = res.data
  })
  return app.serve()
}