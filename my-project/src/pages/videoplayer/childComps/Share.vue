<template>
  <view class="share">
    <view class="share-title">
      <view class="share-title-img">
        <img :src="videoDetail.creator.avatarUrl || mvDetail.cover" alt="" />
        <view>{{ videoDetail.creator.nickname || mvDetail.artistName }}</view>
      </view>
      <view>
        <text></text>
        <button
          class="iconfont icon-fenxiang"
          open-type="share"
          plain="false"
        ></button>
      </view>
    </view>
    <view class="share-bottom" v-show="JSON.stringify(mvDetail) != '{}'">
      {{ mvDetail.name }}-{{ mvDetail.artistName }}
    </view>
    <view
      class="share-bottom-item"
      v-show="JSON.stringify(videoDetail) != '{}'"
    >
      {{ videoDetail.title }}
    </view>
  </view>
</template>

<script>
export default {
  name: "Share",
  data() {
    return {
      videoDetail: {},
      mvDetail: {},
    };
  },
  props: {
    videoId: {
      type: String,
      default: "",
    },
    videoType: {
      type: String,
      default: "",
    },
  },
  created() {
    this.getVideoDetail(this.videoId, this.videoType);
  },
  methods: {
    // 请求视频或者MV数据
    getVideoDetail(id, type) {
      if (type == 1) {
        this.$request({
          url: "/video/detail",
          data: {
            id,
          },
        }).then((res) => {
          this.videoDetail = res.data;
        });
      } else {
        this.$request({
          url: "/mv/detail",
          data: {
            mvid: id,
          },
        }).then((res) => {
          this.mvDetail = res.data;
        });
      }
    },
  },
};
</script>

<style scoped>
/* 分享区域的样式 */
.share {
  background-color: #fff;
  padding: 15rpx 30rpx;
  margin: 0 32rpx;
  border: 1rpx solid rgba(160, 156, 156, 0.3);
  border-radius: 20rpx;
  margin-bottom: 40rpx;
}
.iconfont {
  outline: none;
  border: none;
  background-color: #fff;
}
/* 顶部标签 */
.share .share-title {
  display: flex;
  justify-content: space-between;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 30rpx;
}
.share .share-title .share-title-img {
  display: flex;
}
.share .share-title .share-title-img view {
  margin-left: 20rpx;
}
.share .share-title .share-title-img img {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}
/* 底部歌名区域 */
.share .share-bottom {
  margin-top: 20rpx;
  font-size: 30rpx;
  margin-bottom: 20rpx;
}
.share .share-bottom-item {
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  color: rgb(184, 184, 184);
  font-size: 26rpx;
}
</style>