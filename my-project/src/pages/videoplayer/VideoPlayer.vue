<template>
  <view class="video-player">
    <video class="video" :src="videoDatas[0].url || mvDatas.url"></video>

    <!-- 评论区域 -->
    <commend
      v-if="videoId !== '' && videoType != ''"
      :videoId="videoId"
      :videoType="videoType"
    >
      <share :videoId="videoId" :videoType="videoType" />
    </commend>
  </view>
</template>

<script>
import Commend from "./childComps/Commend.vue";
import Share from "./childComps/Share.vue";
export default {
  name: "VideoPlayer",
  data() {
    return {
      videoId: "",
      videoType: "",
      videoDatas: [],
      mvDatas: {},
    };
  },
  components: {
    Commend,
    Share,
  },
  onLoad(options) {
    this.videoId = options.videoid;
    this.videoType = options.videotype;
    this.getVideoDatas(this.videoId, this.videoType);
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: "Muni云音乐",
      imageUrl: "../../static/logo.png",
    };
  },
  // 分享事件
  onShareAppMessage: function () {
    // return eventHandler接收到的分享参数
    return {
      title: "Muni云音乐", // 分享名称
      path: "pages/video/Video", // 这里写你这个页面的路径
      success: function (shareTickets) {
        uni.showToast({
          title: "转发成功",
        });
        // 转发成功
      },
      fail: function (res) {
        uni.showToast({
          title: "转发失败",
        });
        // 转发失败
      },
      complete: function (res) {
        // 不管成功失败都会执行
        setTimeout(() => {
          uni.hideToast();
        }, 500);
      },
    };
  },
  methods: {
    getVideoDatas(videoId, videoType) {
      if (videoType == 1) {
        this.$request({
          url: "/video/url",
          data: {
            id: videoId,
          },
        }).then((res) => {
          this.videoDatas = res.urls;
        });
      } else {
        this.$request({
          url: "/mv/url",
          data: {
            id: videoId,
          },
        }).then((res) => {
          this.mvDatas = res.data;
        });
      }
    },
  },
};
</script>

<style scoped>
.video-player .video {
  width: 100%;
}
.video-player {
  height: 100%;
  overflow: hidden;
}
</style>