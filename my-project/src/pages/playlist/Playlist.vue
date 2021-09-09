<template>
  <view class="playlist" v-if="playlist.length != 0">
    <view class="playlist-title">
      <view class="iconfont icon-zuo iconfont-zuo" @click="goBack"></view>
      <view class="playlist-title-back">
        <img
          class="img"
          :src="
            playlist.backgroundCoverUrl
              ? playlist.backgroundCoverUrl
              : playlist.coverImgUrl
          "
          alt=""
        />
        <view class="playlist-title-title">
          <img
            :src="playlist.coverImgUrl"
            alt=""
            class="playlist-title-title-img"
          />
          <view class="playlist-title-title-context">
            <view class="item-1">{{ playlist.name }}</view>
            <view class="item-2">
              <img :src="playlist.creator.avatarUrl" alt="" />
              <view>{{ playlist.creator.nickname }}</view>
            </view>
            <view class="item-3">{{
              playlist.description ? playlist.description : ""
            }}</view>
          </view>
        </view>
      </view>
    </view>
    <scroll-view scroll-y enable-flex class="playlist-center">
      <view
        v-for="(item, index) in playlist.tracks"
        :key="index"
        class="center-item"
        @click="toMusicPage(item.id, index)"
      >
        <view class="center-item-index">{{ index + 1 }}</view>
        <view class="center-item-name">
          <view class="item-name">{{ item.name }}</view>
          <view class="item-fullname">
            {{ item.ar[0].name }}-{{ item.name }}
          </view>
        </view>
      </view>
    </scroll-view>
    <bottom-bar />
  </view>
</template>

<script>
import BottomBar from "../index/childComps/BottomBar.vue";
export default {
  components: { BottomBar },
  name: "Playlist",
  data() {
    return {
      playlist: [],
    };
  },
  onLoad(options) {
    // 获取歌单详情数据
    this.getMusicDatas(options.id);
  },
  methods: {
    //跳转到音乐播放页面
    toMusicPage(id, index) {
      uni.navigateTo({
        url:
          "/pages/musicplayer/MusicPlayer?id=" +
          id +
          "&index=" +
          index +
          "&playlistId=" +
          this.playlist.id,
      });
      console.log("歌单数据：", this.playlist);
      this.$store.commit("changeMusicPlaylist", this.playlist.tracks);
    },
    //返回主页
    goBack() {
      uni.navigateBack();
    },
    // 获取歌单详情数据
    getMusicDatas(id) {
      this.$request({
        url: "/playlist/detail",
        data: {
          id,
        },
      }).then((res) => {
        this.playlist = res.playlist;
      });
    },
  },
};
</script>

<style scoped>
.iconfont-zuo {
  position: fixed;
  font-size: 50rpx;
  color: rgb(255, 255, 255);
  z-index: 100;
  left: 30rpx;
  top: 60rpx;
}
.playlist-title .playlist-title-back .img {
  width: 100%;
  /* 将图片进行高斯模糊化 */
  filter: blur(40px);
  position: relative;
}
.playlist-title-title {
  margin-left: 20rpx;
  height: 200rpx;
  display: flex;
  position: absolute;
  top: 160rpx;
  z-index: 99;
}
.playlist-title-title .playlist-title-title-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 20rpx;
  box-shadow: 0 -10rpx 0 rgba(187, 182, 182, 0.2);
}
.playlist-title-title .playlist-title-title-context {
  max-width: 400rpx;
  margin-left: 40rpx;
}
.playlist-title-title-context .item-1 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
  font-size: 32rpx;
  margin-bottom: 6rpx;
}
.playlist-title-title-context .item-2 {
  display: flex;
  margin-top: 20rpx;
  height: 50rpx;
  line-height: 50rpx;
  color: rgb(233, 227, 227);
  font-size: 26rpx;
}
.playlist-title-title-context .item-2 img {
  margin-right: 15rpx;
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
}
.playlist-title-title-context .item-3 {
  white-space: nowrap;
  overflow: hidden;

  margin-top: 56rpx;
  color: rgb(233, 227, 227);
  font-size: 26rpx;
}
.playlist-center {
  height: calc(100vh - 500rpx);
  position: relative;
  z-index: 100;
  margin-top: -80rpx;
  background-color: rgb(255, 255, 255);
  width: 100%;
  margin-bottom: 100rpx;
}
.playlist-center .center-item {
  display: flex;
  margin: 30rpx;
}
.playlist-center .center-item .center-item-index {
  height: 100rpx;
  line-height: 100rpx;
  font-size: 36rpx;
  color: rgb(163, 154, 154);
}
.playlist-center .center-item .center-item-name {
  margin-left: 20rpx;
}
.center-item .center-item-name .item-name {
  margin-top: 12rpx;
  color: black;
  font-size: 32rpx;
  max-width: 500rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.center-item .center-item-name .item-fullname {
  font-size: 26rpx;
  color: rgb(173, 179, 179);
  margin-top: 8rpx;
  max-width: 500rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>