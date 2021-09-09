<template>
  <view class="recommended-daily">
    <view class="recommended-daily-item1">
      <view class="iconfont icon-zuo iconfont-zuo" @click="goBack"></view>
      <img src="~static/images/recommendSong/taylor.jpg" alt="" />
      <view class="date">
        <text class="day">{{ day }}</text>
        <text class="mouth">/{{ month }}</text>
      </view>
    </view>
    <view class="recommended-daily-item2">
      <view class="item2-title">
        <view>播放全部</view>
        <view>多选</view>
      </view>
      <scroll-view scroll-y enable-flex class="item2-scroll">
        <view
          class="item2-contenxt"
          v-for="(item, index) of dailyDatas.dailySongs"
          :key="item.id"
        >
          <view class="contenxt-img" @click="toMusicPage(item.id, index)">
            <img :src="item.al.picUrl" alt="" lazy-load />
            <view>{{ item.name }}</view>
          </view>
          <view class="contenxt-icon">
            <text class="iconfont icon-gengduo"></text>
          </view>
        </view>
      </scroll-view>
    </view>
    <bottom-bar />
  </view>
</template>

<script>
import BottomBar from "../childComps/BottomBar.vue";
export default {
  name: "RecommendedDaily",
  data() {
    return {
      dailyDatas: [],
      day: "",
      month: "",
    };
  },
  onLoad() {
    // 拿到本地缓存里userInfo的信息
    let userInfo = uni.getStorageSync("userInfo");
    // 判断是否有，没有则显示需要登录并且定向到登录页面
    if (!userInfo) {
      uni.showToast({
        title: "请先登录",
        icon: "none",
        success: () => {
          // 跳转至登录界面
          uni.reLaunch({
            url: "/pages/login/Login",
          });
        },
      });
      return;
    }
    // 获取当前天数和月份
    this.day = new Date().getDate();
    this.month = new Date().getMonth() + 1;
    this.getDailyDatas();
  },
  methods: {
    // 获取每日推荐页面数据
    getDailyDatas() {
      this.$request({
        url: "/recommend/songs",
      }).then((res) => {
        this.dailyDatas = res.data;
      });
    },
    // 跳转音乐页面，参数为音乐id
    toMusicPage(id, index) {
      uni.navigateTo({
        url: "/pages/musicplayer/MusicPlayer?id=" + id + "&index=" + index,
      });
      this.$store.commit("changeMusicPlaylist", this.dailyDatas.dailySongs);
    },
    //返回主页
    goBack() {
      uni.navigateBack();
    },
  },
  components: {
    BottomBar,
  },
};
</script>

<style scoped>
.iconfont-zuo {
  position: fixed;
  font-size: 50rpx;
  color: #fff;
  left: 30rpx;
  top: 60rpx;
}
.recommended-daily {
  margin-bottom: 100rpx;
}
.recommended-daily .recommended-daily-item1 img {
  width: 100%;
}
.recommended-daily .recommended-daily-item1 .date {
  position: relative;
  bottom: 160rpx;
  left: 60rpx;
  color: #fff;
}
.recommended-daily .recommended-daily-item1 .day {
  font-size: 70rpx;
}
.recommended-daily .recommended-daily-item1 .mouth {
  font-size: 50rpx;
}
.recommended-daily .recommended-daily-item2 {
  padding: 20rpx 0 20rpx 20rpx;
  border-radius: 30rpx;
  margin-top: -140rpx;

  font-size: 32rpx;
  background-color: #fff;

  position: relative;
  z-index: 9;
}
.recommended-daily .recommended-daily-item2 .item2-title {
  padding-right: 20rpx;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}
.item2-contenxt {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
  height: 80rpx;
}
.item2-contenxt .contenxt-img {
  display: flex;
}
.item2-contenxt .contenxt-img view {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500rpx;
}
.item2-contenxt .contenxt-img img {
  width: 80rpx;
  height: 80rpx;
  border-radius: 15rpx;
  margin-right: 20rpx;
}
.item2-contenxt .contenxt-icon {
  font-size: 40rpx;
  width: 100rpx;
  height: 80rpx;
  line-height: 80rpx;
  margin-right: 50rpx;
  text-align: right;
}
.item2-scroll {
  height: calc(100vh - 400rpx);
}
</style>