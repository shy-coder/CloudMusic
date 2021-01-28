// 云函数入口文件
const cloud = require('wx-server-sdk')

//初始化云环境
cloud.init({
  env: 'shy-9gaedwfq183372c7'
})

//引入云数据库，并定义一个常量方便调用
const db = cloud.database()
//引入云数据库的playlist集合，并定义一个常量方便使用
const playListCollection = db.collection('playlist')
//引入网络请求库axios，并定义一个常量方便使用
const axios = require('axios')
//定义接口地址，复制内网穿透厚postman测试通过的接口地址
const URL = 'https://shy-coder.cn1.utools.club/top/playlist/highquality?before=1503639064232&limit=20'
// 云函数入口函数
exports.main = async (event, context) => {
  const{
    data
  }=await axios.get(URL)
  console.log('#####' + JSON.stringify(data))
  if(data.code >= 1000){
    console.log(data.msg)
    return 0
  }
  const playlist = data.playlists

  const newData= []
  for(let i = 0,len = playlist.length;i<len;i++){
    let pl = playlist[i]
    pl.createTime = db.serverDate()
    newData.push(pl)
  }
  console.log(newData)
  if(newData.length >0){
    await playListCollection.add({
      data:[...newData]
    }).then((res)=>{
      console.log('插入成功')
    }).catch((err)=>{
      console.log(err)
      console.error('插入失败')
    })
  }
  return newData.length

}