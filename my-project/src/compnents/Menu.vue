<template>
  <view>
    <!-- 菜单列表 -->
    <!-- 幕布 -->
    <view class="mu-bu" @click="showPlayMenu" v-show="isShowMenu"></view>
    <view class="music-menu" :class="{ 'is-show-menu': isShowMenu }">
      <view class="menu-title">正在播放</view>
      <scroll-view scroll-y enable-flex class="menu-context">
        <view v-for="item in 30" :key="item" class="menu-context-item">
          <text class="music-name"> 歌名 </text>
          <text>-</text>
          <text class="musicner-name"> 歌手 </text>
          <text class="quxiao">X</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  name: "Menu",
  props: {
    isShowMenu: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isShowMenu: {
      deep: true,
      handler(newVal) {
        console.log(newVal);
      },
    },
  },
};
</script>

<style scoped>
/* 播放列表样式 */
.music-menu {
  position: fixed;
  bottom: -550rpx;
  z-index: 100;
  width: 90%;
  margin: 0 20rpx;
  border-radius: 30rpx;
  padding: 20rpx;
  background-color: rgb(255, 255, 255);
  transition: transform 0.3s linear;
}
/* 控制是否显示菜单列表 */
.is-show-menu {
  transform: translateY(calc(500rpx - 100vh));
  z-index: 100;
}
.music-menu .menu-title {
  height: 60rpx;
  line-height: 60rpx;
  font-size: 36rpx;
  color: #000;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.menu-context {
  height: 400rpx;
}
.menu-context .menu-context-item {
  height: 60rpx;
  line-height: 60rpx;
  /* background-color: rgb(241, 81, 81); */
  margin: 40rpx 0;
  display: flex;
  position: relative;
}
.menu-context .menu-context-item .music-name {
  font-size: 34rpx;
  display: block;
  word-spacing: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180rpx;
}
.menu-context .menu-context-item .musicner-name {
  display: block;
  font-size: 26rpx;
  color: rgb(139, 139, 139);
  word-spacing: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180rpx;
}
.quxiao {
  position: absolute;
  top: 5rpx;
  bottom: 5rpx;
  right: 10rpx;
}
.mu-bu {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(104, 104, 104, 0.2);
}
</style>