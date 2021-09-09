<template>
  <view class="chart-playlist" v-if="chartsDatas.length != 0">
    <view class="gf">
      <view class="gf-title">官方榜</view>
      <view
        v-for="item in chartsDatas[0]"
        :key="item.id"
        class="gf-context"
        @click="toPlaylist(item.id)"
      >
        <view>
          <img :src="item.coverImgUrl" alt="" />
        </view>
        <view class="gf-context-playlist">
          <text v-for="(track, index) of item.tracks" :key="index">
            {{ index + 1 }}.{{ track.first }}-{{ track.second }}
          </text>
        </view>
      </view>
    </view>
    <view class="qq">
      <view class="qq-title">全球榜</view>
      <view class="qq-flex">
        <view
          class="qq-context"
          v-for="item in chartsDatas[1]"
          :key="item.id"
          @click="toPlaylist(item.id)"
        >
          <view>
            <img :src="item.coverImgUrl" alt="" />
          </view>
          <view class="qq-context-playlist">
            <text> {{ item.name }} </text>
          </view>
        </view>
      </view>
    </view>
    <bottom-bar />
  </view>
</template>

<script>
import BottomBar from "../childComps/BottomBar.vue";
export default {
  components: { BottomBar },
  name: "ChartPlaylist",
  data() {
    return {
      chartsDatas: [],
    };
  },
  onLoad() {
    // 判断是否登录
    let userInfo = uni.getStorageSync("userInfo");
    if (!userInfo) {
      uni.showToast({
        title: "请先登录",
        icon: "none",
        mask: true,
        success() {
          uni.reLaunch({ url: "/pages/login/Login" });
        },
      });
    }
    // 请求榜单数据
    this.getChartsDatas();
  },
  methods: {
    // 跳转歌单列表页面
    toPlaylist(id) {
      uni.navigateTo({
        url: "/pages/playlist/Playlist?id=" + id,
      });
    },
    // 请求榜单数据
    getChartsDatas() {
      this.$request({
        url: "/toplist/detail",
      }).then((res) => {
        let result = [[], []];
        res.list.forEach((item) => {
          if (item.tracks.length != 0) {
            result[0].push(item);
          } else {
            result[1].push(item);
          }
        });
        this.chartsDatas = result;
      });
    },
  },
};
</script>

<style scoped>
.chart-playlist .gf {
  padding: 30rpx 20rpx 0 20rpx;
}
.gf-title {
  color: #000;
  font-weight: bold;
  font-size: 36rpx;
  margin-bottom: 20rpx;
}
.chart-playlist .gf .gf-context {
  display: flex;
  margin-top: 16rpx;
}
.chart-playlist .gf .gf-context img {
  width: 230rpx;
  height: 230rpx;
  border-radius: 20rpx;
}
.chart-playlist .gf .gf-context .gf-context-playlist {
  margin-left: 20rpx;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.chart-playlist .gf .gf-context .gf-context-playlist text {
  max-width: 400rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.qq {
  padding: 30rpx 0 20rpx 0;
  margin-bottom: 90rpx;
}
.qq-title {
  color: #000;
  font-weight: bold;
  font-size: 36rpx;
  margin-bottom: 20rpx;
  padding-left: 20rpx;
}
.qq-context img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 20rpx;
}
.qq .qq-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.qq .qq-flex .qq-context-playlist {
  max-width: 200rpx;
  font-size: 30rpx;
  margin-bottom: 40rpx;

  overflow: hidden;
  text-overflow: ellipsis;
}
</style>