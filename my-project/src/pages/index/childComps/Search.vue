<template>
  <view class="search">
    <input
      @click="inToSearch"
      class="search-item"
      type="text"
      placeholder="发现更多好音乐"
      disabled
    />
  </view>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {};
  },
  methods: {
    inToSearch() {
      uni.navigateTo({ url: "/pages/search/InSearch" });
    },
  },
};
</script>

<style scoped>
.search {
  background-color: rgb(255, 255, 255);
  display: flex;
}
.search-item {
  border: 1rpx solid #eee;
  /* flex-grow 可拉伸   */
  /* flex-shrink 可压缩   */
  /* flex-basis 当前元素的宽度   */
  /* flex默认值: flex-grow:0,flex-shrink:1,flex-basis:auto */
  /* flex:1代表 flex-grow:1,flex-shrink:1,flex-basis:0% */
  /* flex:auto代表 flex-grow:1,flex-shrink:1,flex-basis:auto */
  /* flex: 1会导致父元素宽度自动为100% */
  flex: 1;
  margin: 20rpx 40rpx;
  height: 60rpx;
  font-size: 28rpx;
  text-align: center;
  line-height: 60rpx;
  color: #939594;
  background-color: #edefee;
  border-radius: 30rpx;
}
</style>