<template>
  <view class="re-commend">
    <view class="jia-video">
      <view class="jia-img">
        <img :src="musicDetail.al.picUrl" alt="" />
      </view>
      <view class="jia-jianjie">
        <view class="jia-jianjie-item">歌手：{{ musicDetail.ar[0].name }}</view>
        <view>歌名：{{ musicDetail.name }}</view>
        <view>专辑名称：{{ musicDetail.al.name }}</view>
        <view>歌曲简介：{{ musicDetail.alia[0] || "暂无简介" }}</view>
      </view>
    </view>
    <commend v-if="musicId != ''" :videoId="musicId" :type="type"></commend>
  </view>
</template>

<script>
import Commend from "../../videoplayer/childComps/Commend.vue";
export default {
  name: "Recommend",
  components: {
    Commend,
  },
  data() {
    return {
      musicId: "",
      type: "",
      musicDetail: {},
    };
  },
  onLoad(options) {
    console.log(options);
    this.musicId = options.id;
    this.type = options.type;
    this.getMusicDetail(options.id);
  },
  methods: {
    getMusicDetail(id) {
      this.$request({
        url: "/song/detail",
        data: {
          ids: id,
        },
      }).then((res) => {
        console.log(res);
        this.musicDetail = res.songs[0];
      });
    },
  },
};
</script>

<style scoped>
.jia-video {
  width: 100%;
  height: 430rpx;
  display: flex;
  padding: 10rpx;
}
.jia-video .jia-img img {
  margin: 30rpx 20rpx 0 20rpx;
  width: 250rpx;
  height: 350rpx;
  border-radius: 40rpx;
}
.re-commend {
  height: 100vh;
  overflow: hidden;
}
.jia-jianjie view {
  margin-bottom: 15rpx;
  font-size: 34rpx;
  color: rgb(107, 107, 107);
}
.jia-jianjie-item {
  margin-top: 30rpx;
}
</style>