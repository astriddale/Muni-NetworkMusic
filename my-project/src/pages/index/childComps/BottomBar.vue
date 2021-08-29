<template>
  <view class="bottom-bar">
    <view>
      <img class="radio-img" src="~static/logo.png" alt="" />
      <text>title</text>
      <text>-</text>
      <text>name</text>
    </view>
    <view>
      <text>播放</text>
      <text>列表</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "BottomBar",
};
</script>

<style scoped>
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: rgb(163, 162, 162);
  height: 100rpx;
  display: flex;
  justify-content: space-between;
  line-height: 100rpx;
}
.bottom-bar .radio-img {
  width: 80rpx;
  height: 80rpx;
}
</style>