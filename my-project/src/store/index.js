import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    isLogin: false,
    // 音乐是否在播放
    isPlay: false,
    // 音乐id
    musicId: "",
    // 存放当前播放歌曲的歌单数据
    musicPlaylist: [],
    // 存放当前播放歌曲的下标值
    currentIndex: 0,
    // 当前播放歌曲的进度
    currentTime: ''
  },
  mutations: {
    // 改变进度的事件
    changeCurrentTimeTime(state, playload) {
      state.currentTime = playload
      uni.setStorageSync('currentTime', playload)
    },
    changeLogin(state, playload) {
      state.isLogin = uni.setStorageSync('isLogin', playload);
    },
    // 改变播放状态
    changePlay(state, playload) {
      state.isPlay = !state.isPlay;
    },
    // 改变歌曲id
    changeMusicId(state, playload) {
      state.musicId = playload.id;

      // 点击播放时存储id和下标值
      uni.setStorageSync('musicId', playload.id);
      uni.setStorageSync('currentIndex', playload.index);
      // 存储当前播放歌曲歌单的id
      uni.setStorageSync("playlistId", playload.playlistId);
    },
    // 改变歌单数据
    changeMusicPlaylist(state, playload) {
      // console.log("ssssss",playload)
      state.musicPlaylist = [];
      state.musicPlaylist = playload;
      // 对数据进行处理，防止太多数据存不进本地缓存
      if (playload[0].score) {
        let result = [];
        playload.forEach((item) => {
          result.push(...[{
            item: item.song
          }])
        })
        let arr = [];
        result.forEach((index) => {
          // console.log(index)
          arr.push(...[{
            al: index.item.al,
            ar: index.item.ar,
            id: index.item.id,
            name: index.item.name,
          }])
        })
        uni.setStorageSync('musicPlaylist', arr);
      } else {
        // 将歌单数据存储到本地缓存
        let arr = [];
        playload.forEach((item) => {
          arr.push(...[{
            al: item.al,
            ar: item.ar,
            id: item.id,
            name: item.name,
          }])

        })
        // console.log("arr", arr)
        uni.setStorageSync('musicPlaylist', arr);
      }

    },
    // 改变下标值
    changeCurrentIndex(state, playload) {
      state.currentIndex = playload.index * 1;
      if (playload.type == 'next') {
        if (playload.index == uni.getStorageSync("musicPlaylist").length - 1) {
          state.currentIndex = -1;
        }
        state.currentIndex += 1;
      } else if (playload.type == 'pre') {
        if (playload.index == 0) {
          state.currentIndex = uni.getStorageSync("musicPlaylist").length;
        }
        state.currentIndex -= 1;
      }
      // 将当前歌曲在歌单中的下标值存储到本地缓存
      uni.setStorageSync('currentIndex', state.currentIndex);
      // 将当前播放歌曲的id存入本地缓存
      uni.setStorageSync('musicId',
        uni.getStorageSync("musicPlaylist")[uni.getStorageSync("currentIndex")].id ||
        uni.getStorageSync("musicPlaylist")[uni.getStorageSync("currentIndex")].song.id);
    }
  },
  actions: {
    // 改变是否下一首或者上一首
    changeMusicPlay(context, payload) {
      // console.log("vuwx-----", context, payload)
      return new Promise((resolve, reject) => {
        context.commit("changeCurrentIndex", payload);
        resolve(context.state.currentIndex);
      })
    }
  },
  getters: {

  }
})
export default store;