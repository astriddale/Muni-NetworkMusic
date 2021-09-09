<template>
  <view>
    <view class="recommend-playlist">
      <view
        class="recommend"
        v-for="item in recommendDatas"
        :key="item.id"
        @click="toPlaylist(item.id)"
      >
        <view>
          <img :src="item.picUrl" alt="" />
        </view>
        <view class="recommend-context">
          <text> {{ item.name }} </text>
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
  name: "RecommendPlaylist",
  data() {
    return {
      recommendDatas: [],
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
    // 请求推荐歌单的数据
    this.getRecommendDatas();
  },
  methods: {
    // 跳转歌曲列表页面
    toPlaylist(id) {
      // console.log("歌单id：", id);
      uni.navigateTo({
        url: "/pages/playlist/Playlist?id=" + id,
      });
    },
    // 获取推荐歌单数据
    getRecommendDatas() {
      this.$request({
        url: "/recommend/resource",
      }).then((res) => {
        this.recommendDatas = res.recommend;
      });
    },
  },
};
</script>

<style scoped>
.recommend-playlist {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  margin-bottom: 100rpx;
}
.recommend {
  margin: 0 18rpx;
}
.recommend-playlist .recommend img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 20rpx;
}
.recommend .recommend-context {
  width: 200rpx;
  font-size: 28rpx;
  color: rgb(58, 58, 58);
  display: -webkit-flex;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>