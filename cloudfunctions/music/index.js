// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'shy-9gaedwfq183372c7'
})

//引入路由
const TcbRouter = require('tcb-router')
const axios = require('axios')
//定义基础URL
const BASE_URL = 'https://shycoder-cmusic.cn1.utools.club/top'
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
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
}