<template>
  <view>
    <view class="search-title">
      <text class="iconfont icon-sousuo"></text>
      <input
        type="text"
        placeholder="请输入搜索内容"
        placeholder-style="color:#ccc"
        focus
      />
    </view>
    <view class="search-history">
      <text class="history">历史</text>
      <scroll-view scroll-x enable-flex class="search-history-scroll">
        <view class="scroll-item" v-for="(item, index) in 20" :key="index">
          非运算空间
        </view>
      </scroll-view>
      <text></text>
    </view>
    <view>
      <view>热搜榜</view>
      <view></view>
    </view>
  </view>
</template>

<script>
export default {
  name: "InSearch",
};
</script>

<style scoped>
.search-title {
  display: flex;
  height: 80rpx;
  width: 100%;
  background-color: #dc2c1f;
  line-height: 80rpx;
  font-size: 34rpx;
  padding: 10rpx;
}
.search-title text {
  font-size: 60rpx;
  color: white;
  margin-right: 20rpx;
}
.search-title input {
  color: #fff;
  margin: auto 0;
  width: 80%;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.6);
}
.search-history {
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  margin: 0 20rpx;
  display: flex;
}
.search-history .history {
  font-size: 30rpx;
  color: #000;
  font-weight: bold;
  width: 80rpx;
}
.search-history .search-history-scroll {
  /* flex: 1; */
  white-space: nowrap;
  overflow: hidden;
  /* white-space: nowrap; */
  width: 77%;
  height: 100rpx;
  line-height: 100rpx;
  display: flex;
}
.scroll-item {
  height: 80rpx;
  line-height: 80rpx;
  margin: auto 0;
  margin-left: 20rpx;
  padding: 0 20rpx;
  border-radius: 40rpx;
  background-color: rgba(202, 202, 202, 0.2);
}
</style>