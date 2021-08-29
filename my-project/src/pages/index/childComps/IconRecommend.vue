<template>
  <view class="icon-recommend">
    <view class="icon-item" v-for="(item, index) in iconText" :key="index">
      <view class="icon iconfont" :class="iconList[index]"></view>
      <view class="text">{{ item }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "IconRecommend",
  data() {
    return {
      iconList: [
        "icon-meirituijian",
        "icon-gedan1",
        "icon-icon-ranking",
        "icon-diantai",
      ],
      iconText: ["每日推荐", "歌单", "排行榜", "电台"],
    };
  },
};
</script>

<style scoped>
.icon-recommend {
  display: flex;
}
.icon-recommend .icon-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
  text-align: center;
  margin-top: 30rpx;
  padding-bottom: 30rpx;
  border-bottom: 1px solid rgb(124, 121, 12, 0.3);
}
.icon-recommend .icon-item .icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #f83030;
  line-height: 100rpx;
  color: white;
  font-size: 40rpx;
}
.icon-recommend .icon-item .text {
  font-size: 30rpx;
  color: rgb(46, 46, 46);
}
</style>