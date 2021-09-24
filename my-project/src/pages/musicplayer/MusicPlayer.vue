<template>
  <view class="music-player">
    <!-- 头部标题区域 -->
    <view class="iconfont icon-zuo iconfont-zuo" @click="goBack"></view>
    <img
      class="music-background"
      :src="
        musicPlaylist[musicIndex].al.picUrl ||
        musicPlaylist[musicIndex].al.artist.img1v1Url
      "
      alt=""
      lazy-load
    />
    <view class="music-musicname">{{ musicPlaylist[musicIndex].name }}</view>
    <view class="music-username">{{
      musicPlaylist[musicIndex].ar[0].name
    }}</view>
    <!-- 歌盘区域 -->
    <view v-if="!isShowWords">
      <view class="yan-gan" @click="playAudio">
        <img
          :class="{ needle: stateIsPlay }"
          src="~static/images/song/needle.png"
          alt=""
          lazy-load
        />
      </view>
      <swiper
        class="music-swiper"
        circular
        @change="changeMusic"
        :current="musicIndex"
        @click="controlMusicWords"
      >
        <swiper-item
          class="music-swiper-item"
          v-for="item in musicPlaylist"
          :key="item.id"
        >
          <view
            class="zhuan-pan zhuan-pan-animate"
            :class="{ pause: !stateIsPlay }"
          >
            <img
              class="zhuan-pan-item1"
              src="~static/images/song/disc.png"
              alt=""
              lazy-load
            />
            <img
              class="zhuan-pan-item2"
              :src="item.al.picUrl || item.al.artist.img1v1Url"
              alt=""
              lazy-load
            />
          </view>
        </swiper-item>
      </swiper>
    </view>
    <!-- 歌词区域 -->
    <view v-else class="music-words" @click="controlMusicWords">
      <scroll-view
        scroll-y
        enable-flex
        class="music-words-scroll"
        :scroll-into-view="'swx' + (lyricsIndex - 4)"
        scroll-with-animation
      >
        <view class="placeHolder" id="t-3"></view>
        <view class="placeHolder" id="t-2"></view>
        <view class="placeHolder" id="t-1"></view>
        <view
          class="music-words-scroll-item"
          v-for="(item, index) of lyrics"
          :key="index"
          :class="{ 'change-words-color': lyricsIndex - 1 == index }"
          :id="'swx' + index"
        >
          {{ item[1] }}
        </view>
        <view class="placeHolder"></view>
        <view class="placeHolder"></view>
        <view class="placeHolder"></view>
      </scroll-view>
    </view>

    <!-- 三个按钮区域 -->
    <view class="three-icon">
      <view><text class="iconfont icon-xihuan-xianxing"></text></view>
      <view><text class="iconfont icon-jia"></text></view>
      <view @click="toRecommendPage"
        ><text class="iconfont icon-wodexiaoxi"></text
      ></view>
    </view>
    <!-- 进度条区域 -->
    <view class="music-slider">
      <view>{{ currentTime }}</view>
      <slider
        class="music-slider-item"
        block-size="12"
        activeColor="#FF0000"
        backgroundColor="#FFFFFF"
        :value="currentWidth"
        @change="changePosition"
      />
      <view>{{ getDurationTime }}</view>
    </view>
    <!-- 播放按钮区域 -->
    <view class="five-icon">
      <view> <text class="iconfont icon-yuanxunhuanbofang-copy"></text></view>
      <view>
        <text
          class="iconfont icon-icon-1"
          id="pre"
          @click="handleCallback"
        ></text
      ></view>
      <view>
        <text
          class="iconfont big"
          :class="changemusicplay"
          @click="playAudio"
        ></text
      ></view>
      <view>
        <text
          class="iconfont icon-icon-"
          id="next"
          @click="handleCallback"
        ></text
      ></view>
      <view @click="showPlayMenu">
        <text class="iconfont icon-caidan"></text
      ></view>
    </view>
    <!-- 菜单列表 -->
    <!-- 幕布 -->
    <view class="mu-bu" @click="showPlayMenu" v-show="isShowMenu"></view>
    <view class="music-menu" :class="{ 'is-show-menu': isShowMenu }">
      <view class="menu-title">正在播放</view>
      <scroll-view scroll-y enable-flex class="menu-context">
        <view class="menu-context-item" v-if="musicPlaylist.length <= 0">
          暂无音乐可以播放
        </view>
        <view
          v-else
          v-for="(item, index) in musicPlaylist"
          :key="item[index].id"
          class="menu-context-item"
          @click="changeMusicMenu(index)"
        >
          <text class="music-name"> {{ item.name }} </text>
          <text>-</text>
          <text class="musicner-name"> {{ item.ar[0].name }} </text>
          <text class="quxiao">X</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import moment from "moment";
export default {
  name: "MusicPlayer",
  data() {
    return {
      // 歌单数据
      musicPlaylist: uni.getStorageSync("musicPlaylist"),
      // 存储音乐id
      musicId: "",
      // 音乐数据详情
      musicDetail: {},
      // 音乐的url
      musicUrl: "",
      // 音乐播放的实例
      musicPlay: {},
      // 当前播放音乐在歌单内的下标值
      musicIndex: 0,
      // 当前歌曲所在歌单的id
      playlistId: "",

      //歌曲总时长
      durationTime: 0,
      // 播放实时时间
      currentTime: "00:00",
      //实时播放进度
      currentWidth: 0,
      //歌词校准
      // 存放歌词的数组
      lyrics: [["Tip", "正在加载歌词"]],
      // 当前歌词位置的索引
      lyricsIndex: 0,
      // 是否显示歌词
      //歌词显示按钮
      isShowWords: false,
      // 音乐列表滑动到的位置
      scrollPosition: 0,
      // 用于切歌时重置动画, true代表加载完成，false代表未完成，
      //  可以通过加载存在时间间隔达到删除并重置动画类名从而重置动画的效果
      switchMusicAnimationState: true,
      // 显示歌单列表
      showList: 58,
      // 碟子的swiper
      discSwiper: [[], [], []],
      // 是否显示歌单列表
      isShowMenu: false,
    };
  },
  watch: {
    // 监听musicUrl的变化，实时更新url切换歌曲播放
    musicUrl: {
      deep: true,
      handler(val) {
        if (val == null) {
          uni.showToast({
            title: "抱歉,暂时无法播放哦",
            icon: "error",
            mask: true,
            duration: 1000,
          });
          setTimeout(() => {
            this.setMusicIndex("next");
          }, 800);
        } else {
          this.musicPlay.src = val;
        }
      },
    },
    // 监听musicDetail的变化，实时更新title的值
    musicDetail: {
      deep: true,
      handler(val) {
        this.musicPlay.title = val.name;
      },
    },
  },
  onLoad(options) {
    this.playlistId = options.playlistId;
    // 获取从歌单进来时当前歌曲的下标值
    this.musicIndex = options.index;
    // 打印当前歌曲所在歌单列表数据，存在vuex里了
    console.log("歌曲id:", options.id);
    this.musicId = options.id;
    this.getMusicDetail(options.id);
    // 修改状态管理器中音乐id为当前页面的id
    this.$store.commit("changeMusicId", {
      id: options.id,
      index: options.index,
      playlistId: options.playlistId,
    });
    // 判断当前播放id和vuex里的id是否相同控制音乐的播放状态
    if (this.$store.state.musicId == this.musicId) {
      setTimeout(() => {
        // 设置musicPlay为背景音频播放的实例
        this.musicPlay = uni.getBackgroundAudioManager();

        // 必填，播放音乐的标题，不填不播放也不报错
        this.musicPlay.title = this.musicDetail.name;
        // 设置音频的来源
        // 判断为空时，跳过这次播放
        if (this.musicUrl != null) {
          this.musicPlay.src = this.musicUrl;
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

          // 清空歌词数据
          this.currentWidth = 0;
          this.currentTime = "00:00";
          this.lyrics = [["Tip", "正在加载歌词"]];
          this.lyricsIndex = 0;
          this.isShowWords = false;
          this.showList = 58;
        });
        // 监听播放进度的事件，一秒调用一次
        this.musicPlay.onTimeUpdate(() => {
          this.currentTime = moment(this.musicPlay.currentTime * 1000).format(
            "mm:ss"
          );

          // 根据实时播放时间实现歌词滚动
          // console.log(backgroundAudioManager.currentTime);
          if (this.lyricsIndex < this.lyrics.length) {
            if (
              this.musicPlay.currentTime >= this.lyrics[this.lyricsIndex][0]
            ) {
              this.lyricsIndex += 1;
            }
          }

          let lastTime = 0;
          // 每次执行都判定是否相等，相等就不重新计算--节流
          if (lastTime != this.currentTime) {
            this.currentWidth =
              (this.musicPlay.currentTime / this.durationTime) * 100000;
            lastTime = this.currentTime;
            // uni.setStorageSync("currentTime", this.currentTime);
          }
        });
      }, 500);
    }
  },
  computed: {
    stateIsPlay() {
      return this.$store.state.isPlay;
    },
    changemusicplay() {
      return this.$store.state.isPlay ? "icon-zanting" : "icon-icon-2";
    },
    getDurationTime() {
      return moment(this.durationTime).format("mm:ss");
    },
  },
  onShow() {},
  methods: {
    //打开菜单列表
    showPlayMenu() {
      this.isShowMenu = !this.isShowMenu;
    },
    changeMusicMenu(index) {
      // 先停止上次的播放
      this.musicPlay.stop();
      // 获取点击音乐的数据
      this.getMusicDetail(this.musicPlaylist[index].id);
      // 更新下标值
      this.musicIndex = index;
      // 更新本地缓存的值
      uni.setStorageSync("currentIndex", index);
      uni.setStorageSync("musicId", this.musicPlaylist[index].id);
    },
    //返回主页
    goBack() {
      uni.navigateBack();
    },
    //去评论页面
    toRecommendPage() {
      uni.navigateTo({
        url:
          "/pages/musicplayer/childComps/Recommend?id=" +
          uni.getStorageSync("musicId") +
          "&type=" +
          0,
      });
    },
    //获取歌曲数据
    getMusicDetail(ids) {
      this.$request({
        url: "/song/detail",
        data: {
          ids,
        },
      })
        .then((res) => {
          // console.log("音乐详情数据", res);
          this.durationTime = res.songs[0].dt;
          // uni.setStorageSync("durationTime", res.songs[0].dt);
          this.musicDetail = res.songs[0];
        })
        .catch((err) => {
          console.log(err);
        });
      this.$request({
        url: "/song/url",
        data: {
          id: ids,
        },
      })
        .then((res) => {
          // console.log("音乐数据", res);
          this.musicUrl = res.data[0].url;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 播放音乐
    playAudio() {
      // 用vuex的mutation改变isPlay的值
      this.$store.commit("changePlay");
      // 判断是否正在播放
      if (this.stateIsPlay) {
        this.musicPlay.play();
      } else {
        this.musicPlay.pause();
      }
    },
    // 拖动进度条的回调函数
    async changePosition(event) {
      await this.musicPlay.pause();
      let progress = event.detail.value / 100;
      // 计算拖动进度后的当前播放时间(毫秒)
      let time = this.durationTime * progress;
      this.musicPlay.seek(time / 1000);
      this.currentTime = moment(time).format("mm:ss");
      this.currentWidth = event.detail.value;

      await this.musicPlay.play();
      

      // 处理播放时间跳转时歌词位置的校准
      if (this.lyrics.length > 1) {
        this.getCurrentLyricsIndex(time / 1000);
      }
      // console.log("进度条动了，我不玩了");
    },
    // 处理播放时间跳转时歌词位置的校准
    getCurrentLyricsIndex(time) {
      // console.log(time);
      // 特殊处理，当time大于最后一条数据的事件时，令下标等于数组长度+2
      if (time > this.lyrics[this.lyrics.length - 1][0]) {
        this.lyricsIndex = this.lyrics.length + 2;
        return;
      }
      // 遍历所有歌词数据的下标，返回大于等于time的数据的下标值
      this.lyricsIndex = this.lyrics.findIndex((item) => {
        return time <= item[0];
      });
    },
    // 切换歌曲的事件
    changeMusic(event) {
      // if (event.detail.source != "") {
      // }
      // 获取滑动后的下标值
      // console.log(event)
      let index = event.detail.current;
      // console.log(index);
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
      } else if (index > this.musicIndex) {
        this.setMusicIndex("next");
      } else if (index < this.musicIndex) {
        this.setMusicIndex("pre");
      }
      // console.log("当前滑后的下标为：", index);
      // console.log("当前读取的本地缓存的下标为：", this.currentIndex);

      // 清空歌词数据
      this.currentWidth = 0;
      this.currentTime = "00:00";
      this.lyrics = [["Tip", "正在加载歌词"]];
      this.lyricsIndex = 0;
      this.isShowWords = false;
      this.showList = 58;
    },
    // 封装函数 设置下一首的异步获取vuex中的事件
    setMusicIndex(type) {
      // 提交异步事务
      this.$store
        .dispatch("changeMusicPlay", {
          type: type,
          index: this.musicIndex,
        })
        // actions是一个异步回调，可以返回处理后的index值，然后根据index值获取数据
        .then((res) => {
          // console.log(res);
          // console.log(this.$store.state.musicPlaylist);
          // 获取存储在vuex里数据下标为index的数据
          let id =
            this.$store.state.musicPlaylist[res].id ||
            this.$store.state.musicPlaylist[res].song.id;
          // 获取下一首或者上一首的数据
          this.getMusicDetail(id);
          // 更新当前歌曲的index
          this.musicIndex = res;
          // this.musicPlay.play();
        });
    },
    // 点击下一首或者下一首的回调函数
    handleCallback(event) {
      // 结束当前歌曲的播放
      this.musicPlay.stop();
      // 设置isPlay初始化
      this.$store.state.isPlay = true;
      // 获取点击的是哪一个按钮
      let type = event.currentTarget.id;
      // 调用该函数获取数据
      this.setMusicIndex(type);

      // 清空歌词数据
      this.currentWidth = 0;
      this.currentTime = "00:00";
      this.lyrics = [["Tip", "正在加载歌词"]];
      this.lyricsIndex = 0;
      this.isShowWords = false;
      this.showList = 58;
    },
    // 控制显示的是歌词还是转盘
    controlMusicWords() {
      this.isShowWords = !this.isShowWords;
      if (this.isShowWords) {
        this.$request({
          url: "/lyric",
          data: {
            id: uni.getStorageSync("musicId"),
          },
        }).then((res) => {
          // console.log(res);
          if (!res.nolyric) {
            // 获取到歌词的字符串形式
            let words = res.lrc.lyric;
            // console.log(words);
            // 通过\n切割为数组
            let arr = words.split("\n");
            // 查找数组中的空串并过滤
            let filterArr = [];
            arr.forEach((item) => {
              if (item != "") {
                filterArr.push(item);
              }
            });
            // 获取数组里的时间和歌词
            let result = [];
            // 对第一层过滤后的数据进行遍历
            filterArr.forEach((item) => {
              // 将数据进行分割，第一次拿musicTime[0]的数据，但是会多一个‘[’，所以需要进行二次操作
              let musicTime = item.split("]")[0];
              let time = musicTime.slice(1).split(":");
              // 根据‘]’进行分割拿到的数据就是歌词数据
              let musicWords = item.split("]")[1];
              // 放入一个新的数组里，时间需要转换为秒数
              result.push([
                parseInt(time[0], 10) * 60 + parseFloat(time[1]),
                musicWords,
              ]);
            });
            // 将数组给到lyrics
            this.lyrics = result;
          }
        });
      }
    },
  },
};
</script>

<style scoped>
/* 返回按钮 */
.iconfont-zuo {
  position: fixed;
  font-size: 50rpx;
  color: rgb(0, 0, 0);
  z-index: 100;
  left: 30rpx;
  top: 60rpx;
  font-weight: bold;
}
.music-player {
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.3);
}
.music-player .music-background {
  width: 100%;
  height: 100%;
  /* 将图片进行高斯模糊化 */

  opacity: 0.8;
  filter: blur(30px);
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: -1;
}
/* 标题 */
.music-player .music-musicname {
  margin-top: 100rpx;
  text-align: center;
  font-size: 34rpx;
  color: white;
  font-weight: bold;
}
/* 歌名 */
.music-player .music-username {
  margin-top: 10rpx;
  font-size: 26rpx;
  text-align: center;
  color: rgb(223, 223, 223);
  font-weight: bold;
}
.music-player .yan-gan img {
  position: relative;
  top: 36rpx;
  left: 360rpx;
  width: 265rpx;
  height: 216rpx;
  z-index: 100;

  transform-origin: 14rpx 14rpx;
  /* transform: rotate(-5deg); */
  transition: transform 0.5s;
}
/* 控制遥杠动画的样式 */
.needle {
  transform: rotate(22deg);
}
/* 转盘和歌词区域 */
.music-swiper {
  position: relative;
  height: 46vh;
  width: 100%;
}
.music-swiper .music-swiper-item {
  height: 100%;
  width: 100%;
  position: absolute;
}
.music-player .zhuan-pan {
  position: absolute;
  top: 0;
  left: 12.5%;
  width: 75vw;
  height: 75vw;
}
.music-player .zhuan-pan .zhuan-pan-item1 {
  height: 100%;
  width: 100%;
}
/* 转盘中间的图片 */
.music-player .zhuan-pan .zhuan-pan-item2 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1000;
  height: 70%;
  width: 70%;
}
.zhuan-pan-animate {
  /* 动画名 */
  animation-name: zhuanpan;
  /* 动画持续时间 */
  animation-duration: 10s;
  /* 动画成绩持续次数 */
  animation-iteration-count: infinite;
  /* 动画速度曲线 */
  animation-timing-function: linear;
  /* 动画延迟0.8s */
  animation-delay: 0.8s;
  /* 动画简写形式 */
  /* animation: zhuanpan 5s linear infinite; */
}
/* 控制转盘的动画效果 */
@keyframes zhuanpan {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* 歌词样式 */
.music-words {
  width: 100%;
  height: 56.8vh;
  padding: 40rpx 0;
  /* background-color: rgb(231, 126, 126); */
}
.music-words-scroll {
  width: 100%;
  height: 56.8vh;
  display: flex;
  flex-direction: column;
  /* justify-content: center;
  align-items: center; */
}
.music-words-scroll-item {
  padding: 0 20rpx;
  font-size: 36rpx;
  margin-top: 60rpx;
  color: rgb(185, 185, 185);
  text-align: center;
}
.music-word-show {
  color: rgb(253, 23, 23);
}
/* 音乐暂停 */
.pause {
  /* 规定动画是运行还是暂停。 */
  animation-play-state: paused;
  -webkit-animation-play-state: paused;
}
/* 音乐继续 */
/* .restart {
} */
/* 进度条样式 */
.music-slider {
  display: flex;
  margin: 0 auto;
  width: 92%;
  height: 50rpx;
  line-height: 50rpx;
  font-size: 30rpx;
  color: #fff;
}
.music-slider-item {
  width: 84%;
  margin: auto 20rpx;
}
/* 三个图标的样式 */
.three-icon {
  margin: 20rpx auto;
  height: 50rpx;
  width: 75%;
  line-height: 50rpx;
  color: #fff;

  text-align: center;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.five-icon {
  margin: 20rpx auto;
  height: 120rpx;
  width: 90%;
  line-height: 120rpx;
  color: #fff;

  text-align: center;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.iconfont {
  font-size: 50rpx;
}
.big {
  font-size: 80rpx;
}
/* 设置歌曲离顶部和底部一定的距离 */
.placeHolder {
  width: 100%;
  min-height: 42rpx;
  margin: 40rpx 0;
  /* background-color: #fff; */
}
/* 设置文字高亮
 */
.change-words-color {
  color: #fff;
}

/* 播放列表样式 */
.music-menu {
  position: fixed;
  bottom: -550rpx;
  z-index: 100;
  width: 90%;
  margin: 0 20rpx;
  border-radius: 30rpx;
  padding: 20rpx;
  background-color: rgb(255, 255, 255);
  transition: transform 0.3s linear;
}
/* 控制是否显示菜单列表 */
.is-show-menu {
  transform: translateY(calc(650rpx - 100vh));
  z-index: 100;
}
.music-menu .menu-title {
  height: 60rpx;
  line-height: 60rpx;
  font-size: 36rpx;
  color: #000;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.menu-context {
  height: 400rpx;
}
.menu-context .menu-context-item {
  height: 60rpx;
  line-height: 60rpx;
  /* background-color: rgb(241, 81, 81); */
  margin: 40rpx 0;
  display: flex;
  position: relative;
}
.menu-context .menu-context-item .music-name {
  font-size: 34rpx;
  display: block;
  word-spacing: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180rpx;
}
.menu-context .menu-context-item .musicner-name {
  display: block;
  font-size: 26rpx;
  color: rgb(139, 139, 139);
  word-spacing: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180rpx;
}
.quxiao {
  position: absolute;
  top: 5rpx;
  bottom: 5rpx;
  right: 10rpx;
}
.mu-bu {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(104, 104, 104, 0.2);
}
</style>