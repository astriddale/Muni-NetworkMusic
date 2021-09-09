<template>
  <view class="recommend">
    <view class="recommend-info">
      <view class="recommend-item"> 推荐歌曲 </view>
      <view class="for-you">
        <view>为您精心推荐</view>
        <view class="look-more" @click="toMoreList"
          >更多
          <text class="iconfont icon-you"></text>
        </view>
      </view>
      <scroll-view class="recommend-img" scroll-x enable-flex enhanced>
        <view
          class="recommend-img-item"
          v-for="(result, index) in personalized"
          :key="index"
          @click="totoPlaylist(result.id)"
        >
          <img :src="result.picUrl" alt="" lazy-load />
          <text>{{ result.name }}</text>
        </view>
      </scroll-view>
    </view>
    <view class="line"></view>
    <view class="charts">
      <view class="charts-title">
        <view class="recommend-item"> 排行榜 </view>
        <view class="look-more" @click="toChart">
          更多
          <text class="iconfont icon-you"></text>
        </view>
      </view>
      <swiper
        circular
        class="charts-content"
        next-margin="100rpx"
        v-if="topList.length != 0"
      >
        <swiper-item v-for="(item, indez) in topList" :key="item.id">
          <view class="charts-content-title" @click="toPlaylist(item.id)">
            {{ item.name }}
          </view>
          <view
            class="content-item-info"
            v-for="(tracks, index) in item.tracks"
            :key="tracks.id"
            @click="toMusicPage(tracks.id, indez, index)"
          >
            <img class="content-img" :src="tracks.al.picUrl" alt="" lazy-load />
            <view class="content-item-name">
              <text class="content-count">{{ index + 1 }}</text>
              <text class="content-name">{{ tracks.name }}</text>
              <text class="content-rename">--</text>
              <text class="content-rename">{{ tracks.ar[0].name }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
export default {
  name: "Recommend",
  data() {
    return {};
  },
  props: {
    personalized: {
      type: Array,
      default: [],
    },
    topList: {
      type: Array,
      default: [],
    },
  },
  methods: {
    // 跳转歌单页面
    toPlaylist(id) {
      console.log(id)
      uni.navigateTo({
        url: "/pages/playlist/Playlist?id=" + id,
      });
    },
    //跳转歌曲播放页面
    toMusicPage(id, indez, index) {
      uni.navigateTo({
        url:
          "/pages/musicplayer/MusicPlayer?id=" +
          id +
          "&index=" +
          index +
          "&playlistId=" +
          this.topList[indez].id,
      });
      // 获取当前歌曲所在歌单数据并且存储在vuex中
      this.$request({
        url: "/playlist/detail",
        data: {
          id: this.topList[indez].id,
        },
      }).then((res) => {
        // console.log("res",res)
        // 把数据进行提交至vuex
        this.$store.commit("changeMusicPlaylist", res.playlist.tracks);
      });
    },
    // 跳转歌曲列表页面
    totoPlaylist(id) {
      uni.navigateTo({
        url: "/pages/playlist/Playlist?id=" + id,
      });
    },
    // 跳转排行榜页面
    toChart() {
      uni.navigateTo({
        url: "/pages/index/pages/ChartPlaylist",
      });
    },
    // 跳转更多推荐歌单页面
    toMoreList() {
      uni.navigateTo({
        url: "/pages/index/pages/RecommendPlaylist",
      });
    },
  },
};
</script>

<style scoped>
.recommend {
  padding: 20rpx;
}
.line {
  border-bottom: 16rpx solid rgba(185, 185, 185, 0.3);
  margin: 0 -20rpx;
}
.recommend .recommend-info {
  border-bottom-left-radius: 20rpx;
  border-bottom-right-radius: 20rpx;
}
.recommend .recommend-item {
  font-size: 36rpx;
  color: rgb(58, 56, 56);
}
.recommend .for-you {
  display: flex;
  color: rgb(99, 94, 94);
  font-size: 32rpx;
  justify-content: space-between;
  margin: 14rpx 0;
}
.recommend .look-more {
  padding: 4rpx 10rpx;
  margin-right: 14rpx;
  width: 100rpx;
  height: 30rpx;
  text-align: center;
  color: #353535;
  font-size: 30rpx;
  line-height: 30rpx;
  border: 1px solid #ccc;
  border-radius: 40rpx;
}
.recommend .look-more text {
  font-size: 30rpx;
  margin-left: 10rpx;
  line-height: 30rpx;
}
.recommend .recommend-img {
  display: flex;
  white-space: nowrap;
  height: 270rpx;
}
.recommend .recommend-img .recommend-img-item {
  width: 200rpx;
  margin-right: 20rpx;
}
.recommend .recommend-img .recommend-img-item img {
  box-sizing: content-box;
  width: 200rpx;
  height: 200rpx;
  box-shadow: 0rpx -22rpx 5rpx -14rpx #ddd;
  border-radius: 20rpx;
}
.recommend .recommend-img .recommend-img-item text {
  font-size: 26rpx;
  /* 单行文本溢出隐藏，省略号代替 */
  /* 要转为块级元素才能使用overflow:hidden切割 */
  /* display: block;
  white-space:nowrap;
  overflow:hidden;
  text-overflow: ellipsis; */

  /* 多行文本溢出隐藏，省略号代替 */
  overflow: hidden;
  text-overflow: ellipsis;
  /* 设置为webkit内核盒子元素 */
  display: -webkit-box;
  /* 设置对齐模式 */
  -webkit-box-orient: vertical;
  /* 设置盒子的行数 */
  -webkit-line-clamp: 2;
}
.charts-title {
  border-radius: 20rpx;
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
}
.content-item-info {
  display: flex;
  margin: 10rpx 0;
}
/*显示高度 */
.charts-content {
  height: 500rpx;
}
.charts-content .charts-content-title {
  margin-top: 20rpx;
}
.charts-content .content-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  border: 1rpx solid #eee;
}
.charts-content .content-item-name {
  height: 100rpx;
  text-align: center;
  line-height: 100rpx;
  margin-left: 20rpx;
  font-size: 32rpx;
  color: black;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.charts-content .content-item-name .content-rename {
  color: rgb(145, 145, 145);
  font-size: 24rpx;
}
.content-name {
  margin-left: 20rpx;
}
</style>