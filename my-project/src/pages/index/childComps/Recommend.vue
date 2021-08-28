<template>
  <view class="recommend">
    <view class="recommend-info">
      <view class="recommend-item"> 推荐歌曲 </view>
      <view class="for-you">
        <view>为您精心推荐</view>
        <view class="look-more">更多></view>
      </view>
      <scroll-view class="recommend-img" scroll-x enable-flex enhanced>
        <view
          class="recommend-img-item"
          v-for="(item, index) in 30"
          :key="index"
        >
          <img src="~static/logo.png" alt="" />
          <text>kjla善打算D啊jdfiohasdofjilkhauildfhaisudfhiusafghui</text>
        </view>
      </scroll-view>
    </view>
    <view class="line"></view>
    <view class="charts">
      <view class="charts-title">
        <view class="recommend-item"> 排行榜 </view>
        <view class="look-more">更多></view>
      </view>
      <swiper circular class="charts-content" next-margin="100rpx">
        <swiper-item v-for="(item, index) in 10" :key="index">
          <view class="charts-content-title">标题</view>
          <view
            class="content-item-info"
            v-for="(ins, indez) in 30"
            :key="indez"
          >
            <img class="content-img" src="~static/logo.png" alt="" />
            <view class="content-item-name">
              <text class="content-count">1</text>
              <text class="content-name">歌曲名字</text>
              <text class="content-rename">--</text>
              <text class="content-rename">歌手名字</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
export default {
  name: "Recommend",
};
</script>

<style scoped>
.recommend {
  padding: 20rpx;
}
.line {
  border-bottom: 16rpx solid rgba(185, 185, 185, 0.3);
  margin: 0 -20rpx;
}
.recommend .recommend-info {
  border-bottom-left-radius: 20rpx;
  border-bottom-right-radius: 20rpx;
}
.recommend .recommend-item {
  font-size: 36rpx;
  color: rgb(58, 56, 56);
}
.recommend .for-you {
  display: flex;
  color: rgb(99, 94, 94);
  font-size: 32rpx;
  justify-content: space-between;
  margin: 14rpx 0;
}
.recommend .look-more {
  padding: 4rpx 10rpx;
  margin-right: 14rpx;
  width: 100rpx;
  height: 30rpx;
  text-align: center;
  color: #353535;
  font-size: 30rpx;
  line-height: 30rpx;
  border: 1px solid #ccc;
  border-radius: 40rpx;
}
.recommend .recommend-img {
  display: flex;
  white-space: nowrap;
  height: 300rpx;
}
.recommend .recommend-img .recommend-img-item {
  width: 200rpx;
  margin-right: 20rpx;
}
.recommend .recommend-img .recommend-img-item img {
  box-sizing: content-box;
  width: 200rpx;
  height: 200rpx;
  box-shadow: 0rpx -22rpx 5rpx -14rpx #ddd;
  border-radius: 20rpx;
}
.recommend .recommend-img .recommend-img-item text {
  font-size: 26rpx;
  /* 单行文本溢出隐藏，省略号代替 */
  /* 要转为块级元素才能使用overflow:hidden切割 */
  /* display: block;
  white-space:nowrap;
  overflow:hidden;
  text-overflow: ellipsis; */

  /* 多行文本溢出隐藏，省略号代替 */
  overflow: hidden;
  text-overflow: ellipsis;
  /* 设置为webkit内核盒子元素 */
  display: -webkit-box;
  /* 设置对齐模式 */
  -webkit-box-orient: vertical;
  /* 设置盒子的行数 */
  -webkit-line-clamp: 2;
}
.charts-title {
  border-radius: 20rpx;
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
}
.content-item-info {
  display: flex;
  margin: 10rpx 0;
}
.charts-content .charts-content-title {
  margin-top: 20rpx;
}
.charts-content .content-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  border: 1rpx solid #eee;
}
.charts-content .content-item-name {
  height: 100rpx;
  text-align: center;
  line-height: 100rpx;
  margin-left: 20rpx;
  font-size: 32rpx;
  color: black;
}
.charts-content .content-item-name .content-rename {
  color: rgb(145, 145, 145);
  font-size: 24rpx;
}
</style>