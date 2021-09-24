<template>
  <view class="bottom-bar">
    <swiper
      v-if="musicId != ''"
      class="bottom-bar-swiper"
      circular
      @change="changeMusic"
      :current="currentIndex"
    >
      <swiper-item
        class="bottom-bar-swiper-item"
        v-for="item in musicPlaylist"
        :key="item.id"
      >
        <view @click="toMusicPage">
          <img
            class="radio-img"
            :src="item.al.picUrl || item.song.al.picUrl"
            alt=""
            lazy-load
          />
          <view class="music-stop" v-if="musicId != ''">
            <text>{{ item.name || item.song.name }}</text>
            <text>-</text>
            <text>{{ item.ar[0].name || item.song.ar[0].name }}</text>
          </view>
        </view>
        <view class="swiper-item-icon">
          <text class="iconfont big" :class="isPlay" @click="palyMusic"></text>
          <text @click="playMenu" class="iconfont icon-caidan"></text>
        </view>
      </swiper-item>
    </swiper>
    <view class="music-stop" v-else>暂无播放音乐</view>
  </view>
</template>

<script>
import moment from "moment";
export default {
  name: "BottomBar",
  data() {
    return {
      // 当前歌曲的实例对象
      musicPlay: {},
      // 当前歌曲所在歌单数据
      musicPlaylist: {},
      // 当前歌曲所在下标
      currentIndex: "",
      // 当前歌曲id
      musicId: "",
      // 歌单id
      playlistId: "",
      // 当前歌曲的url
      musicUrl: "",
      // 播放进度
      currentTime: "00:00",
      currentWidth: 0,
    };
  },
  computed: {
    musicIsPlay() {
      return this.$store.state.isPlay;
    },
    isPlay() {
      return this.$store.state.isPlay ? "icon-zanting" : "icon-icon-2";
    },
  },
  created() {
    // 获取本地缓存的歌单数据
    this.musicPlaylist = uni.getStorageSync("musicPlaylist");
    // 获取本地缓存的歌曲下标
    this.currentIndex = uni.getStorageSync("currentIndex");
    // console.log(this.currentIndex);
    // 获取本地缓存的歌曲id
    this.musicId = uni.getStorageSync("musicId");
    // 获取本地缓存的歌曲id
    this.playlistId = uni.getStorageSync("playlistId");

    // 设置musicPlay为背景音频播放的实例
    this.musicPlay = uni.getBackgroundAudioManager();
    // 设置手播放音乐
    // this.musicPlay.pause();
    // 设置音频的来源
    // 判断为空时，跳过这次播放并且读取vuex里面的播放状态，当点击暂停后，必须同步播放
    if (this.musicPlaylist.length > 0 && this.$store.state.isPlay) {
      this.getMusicDetail(this.musicId);
      // 必填，播放音乐的标题，不填不播放也不报错
      this.musicPlay.title = this.musicPlaylist[this.currentIndex].name;
    }
    // 监听音乐实例背景的播放和暂停
    this.musicPlay.onPause(() => {
      // 这里不适用mutation，因为每次调用都是取反，值会错乱（可优化）
      this.$store.state.isPlay = false;
    });
    this.musicPlay.onPlay(() => {
      this.$store.state.isPlay = true;
    });
    // 音乐自然播放结束后的回调函数
    this.musicPlay.onEnded(() => {
      this.setMusicIndex("next");
    });

    // 监听播放进度的事件，一秒调用一次
    // this.musicPlay.onTimeUpdate(() => {
    //   this.currentTime = moment(this.musicPlay.currentTime * 1000).format(
    //     "mm:ss"
    //   );
    //   let lastTime = 0;
    //   // 每次执行都判定是否相等，相等就不重新计算--节流
    //   if (lastTime != this.currentTime) {
    //     this.currentWidth =
    //       (this.musicPlay.currentTime / uni.getStorageSync("durationTime")) *
    //       100000;
    //     lastTime = this.currentTime;
    //     uni.setStorageSync("currentTime", this.currentTime);
    //   }
    // });
  },
  watch: {
    currentIndex: {
      deep: true,
      handler(val) {
        this.musicPlay.title = this.musicPlaylist[val].name;
      },
    },
  },
  // 在页面发生变化时重新获取组件的数据
  onPageShow: function () {
    // 获取本地缓存的歌单数据
    this.musicPlaylist = uni.getStorageSync("musicPlaylist");
    // 获取本地缓存的歌曲下标
    this.currentIndex = uni.getStorageSync("currentIndex");
    // console.log(this.currentIndex);
    // 获取本地缓存的歌曲id
    this.musicId = uni.getStorageSync("musicId");
    // 获取本地缓存的歌曲id
    this.playlistId = uni.getStorageSync("playlistId");
    // 设置音频的来源
    // 判断为空时，跳过这次播放
    if (this.musicPlaylist.length > 0 && this.$store.state.isPlay) {
      this.getMusicDetail(this.musicId);
      // 必填，播放音乐的标题，不填不播放也不报错
      this.musicPlay.title = this.musicPlaylist[this.currentIndex].name;
    }
    // 音乐自然播放结束后的回调函数
    this.musicPlay.onEnded(() => {
      this.setMusicIndex("next");
    });
  },
  // 不能使用update钩子函数，会造成错误，只在h5平台适用
  // updated() {
  // },
  methods: {
    // 显示菜单列表
    playMenu() {
      this.$emit("playMenu");
    },
    // 点击播放或者暂停
    palyMusic() {
      this.$store.commit("changePlay");
      // 判断是否正在播放
      if (this.musicIsPlay) {
        this.musicPlay.play();
      } else {
        this.musicPlay.pause();
      }
    },
    // toMusicPage跳转音乐播放界面
    toMusicPage() {
      // 跳转的时候需要实时获取本地缓存的数据
      if (this.musicId) {
        uni.navigateTo({
          url:
            "/pages/musicplayer/MusicPlayer?id=" +
            uni.getStorageSync("musicId") +
            "&index=" +
            uni.getStorageSync("currentIndex") +
            "&playlistId=" +
            uni.getStorageSync("playlistId"),
        });
        // 获取当前歌曲所在歌单数据并且存储在vuex中
        this.$request({
          url: "/playlist/detail",
          data: {
            id: this.playlistId,
          },
        }).then((res) => {
          // console.log("res", res);
          // 把数据进行提交至vuex
          this.$store.commit("changeMusicPlaylist", res.playlist.tracks);
        });
      }
    },
    // 切换歌曲的事件
    changeMusic(event) {
      // if (event.detail.source != "") {
      //   this.musicPlay.pause();
      // }
      // 获取滑动后的下标值
      let index = event.detail.current;

      // 对特殊情况进行处理
      if (
        uni.getStorageSync("currentIndex") == 0 &&
        index == this.musicPlaylist.length - 1
      ) {
        // 当前歌曲为第一首并且滑动后的index为歌单长度时,回退上一首
        this.setMusicIndex("pre");
      } else if (
        uni.getStorageSync("currentIndex") == this.musicPlaylist.length - 1 &&
        index == 0
      ) {
        // 当前歌曲为最后一首并且滑动后的index为0时,去上一首
        this.setMusicIndex("next");
      } else if (index > this.currentIndex) {
        this.setMusicIndex("next");
      } else if (index < this.currentIndex) {
        this.setMusicIndex("pre");
      }
      // console.log("当前滑后的下标为：", index);
      // console.log("当前读取的本地缓存的下标为：", this.currentIndex);
    },
    // 根据传入type值切换歌曲
    setMusicIndex(type) {
      // 提交异步事务
      this.$store
        .dispatch("changeMusicPlay", {
          type: type,
          // 实时读取本地缓存的currentIndex
          index: uni.getStorageSync("currentIndex"),
        })
        // actions是一个异步回调，可以返回处理后的index值，然后根据index值获取数据
        .then((res) => {
          // console.log("res===", res);
          // 获取存储在vuex里数据下标为index的数据
          let id =
            this.musicPlaylist[res].id || this.musicPlaylist[res].song.id;
          // 获取下一首或者上一首的数据
          this.getMusicDetail(id);
          // 更新当前歌曲的index
          this.currentIndex = res;
        });
    },
    getMusicDetail(id) {
      this.$request({
        url: "/song/url",
        data: {
          id,
        },
      }).then((res) => {
        // console.log("音乐数据", res);
        this.musicUrl = res.data[0].url;
        if (this.musicUrl != null) {
          this.musicPlay.src = this.musicUrl;
        } else {
          uni.showToast({
            title: "抱歉,暂时无法播放哦",
            icon: "error",
            mask: true,
            duration: 1000,
          });
          setTimeout(() => {
            this.setMusicIndex("next");
          }, 800);
        }
      });
    },
  },
};
</script>

<style scoped>
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: rgb(233, 233, 233);
  height: 100rpx;
  display: flex;
  justify-content: space-between;
  line-height: 100rpx;
  align-items: center;
}
.bottom-bar-swiper {
  width: 100%;
  height: 100rpx;
}
.bottom-bar-swiper-item {
  display: flex;
  width: 100%;
  height: 100rpx;
}
.bottom-bar .radio-img {
  margin: 10rpx 30rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 15rpx;
}

.music-stop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 140rpx;
  height: 100rpx;
  line-height: 100rpx;
  color: rgb(59, 59, 59);
  font-size: 32rpx;
  max-width: 400rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.swiper-item-icon {
  position: absolute;
  right: 20rpx;
  top: 0;
}
.iconfont {
  color: rgb(59, 59, 59);
  font-size: 50rpx;
  margin-right: 20rpx;
}
.big {
  font-size: 66rpx;
}
</style>