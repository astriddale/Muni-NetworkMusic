<template>
  <view class="content">
    <!-- <view>
      <mp-loading type="circle" show="true"></mp-loading>
    </view> -->
    <search class="search"></search>
    <view>
      <swiper
        indicator-dots
        autoplay
        circular
        class="muni-swiper"
        indicator-color="#e6e6e6"
        indicator-active-color="#ec4141"
      >
        <swiper-item v-for="banner in banners" :key="banner.bannnerId">
          <img class="swiper-img" :src="banner.pic" alt="" srcset="" />
        </swiper-item>
      </swiper>
    </view>
    <icon-recommend />
    <recommend
      :topList="allTopListData"
      :personalized="personalized"
      :flag="flag"
    />
    <bottom-bar v-show="!isShowMenu" @playMenu="showPlayMenu" ref="bottom" />
    <!-- 菜单列表 -->
    <!-- 幕布 -->
    <view class="mu-bu" @click="showPlayMenu" v-show="isShowMenu"></view>
    <view class="music-menu" :class="{ 'is-show-menu': isShowMenu }">
      <view class="menu-title">正在播放</view>
      <scroll-view scroll-y enable-flex class="menu-context">
        <view class="menu-context-item" v-if="musicPlaylist.length <= 0"
          >暂无音乐可以播放</view
        >
        <view
          v-else
          v-for="(item, index) in musicPlaylist"
          :key="item[index].id"
          class="menu-context-item"
          @click="changeMusic(index)"
        >
          <text class="music-name"> {{ item.name }} </text>
          <text>-</text>
          <text class="musicner-name"> {{ item.ar[0].name }} </text>
          <text class="quxiao">X</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
// 导入组件
import IconRecommend from "./childComps/IconRecommend.vue";
import Recommend from "./childComps/Recommend.vue";
import Search from "./childComps/Search.vue";
import BottomBar from "./childComps/BottomBar.vue";

export default {
  data() {
    return {
      banners: [],
      personalized: [],
      toplist: [],
      topListData: [],
      allTopListData: [],
      allTopList: [],

      // musicPlaylist: [],
      // currentIndex: "",
      // musicId: "",
      // playlistId: "",
      isShowMenu: false,
      musicPlaylist: [],
    };
  },
  components: {
    Search,
    IconRecommend,
    Recommend,
    BottomBar,
  },
  onLoad() {
    // 获取轮播图数据
    this.$request({
      url: "/banner",
      data: { type: 2 },
    }).then((res) => {
      this.banners = res.banners;
    });
    // 获取推荐歌曲数据
    this.$request({
      url: "/personalized",
    }).then((res) => {
      this.personalized = res.result;
    });
    // 获取排行榜列表
    this.$request({ url: "/toplist" }).then((res) => {
      this.toplist = res.list;
      let index = 0;
      while (index < 5) {
        this.$request({
          url: "/playlist/detail",
          data: {
            id: this.toplist[index].id,
          },
        }).then((res) => {
          this.topListData = res;
          // 存放所有排行榜完整数据
          this.allTopList.push(this.topListData.playlist.tracks);
          // console.log(this.allTopList)
          let listItem = {
            name: this.topListData.playlist.name,
            id: this.topListData.playlist.id,
            tracks: this.topListData.playlist.tracks.slice(0, 3),
          };
          this.allTopListData.push(listItem);
        });
        index++;
      }
    });
    // 获取歌单数据，若果有的话
    this.musicPlaylist = uni.getStorageSync("musicPlaylist");
  },
  methods: {
    showPlayMenu(res) {
      this.isShowMenu = !this.isShowMenu;
    },
    changeMusic(index) {
      this.$refs.bottom.musicPlay.stop();
      this.$refs.bottom.getMusicDetail(this.musicPlaylist[index].id);
      this.$refs.bottom.currentIndex = index;
      uni.setStorageSync("currentIndex", index);
      uni.setStorageSync("musicId", this.musicPlaylist[index].id);
    },
  },
};
</script>

<style scoped>
.search {
  width: 100%;
}
.content {
  display: flex;
  flex-direction: column;
  /* align-items: center;
  justify-content: center; */
}
.muni-swiper {
  background-color: rgb(224, 224, 224);
  margin: 0 40rpx;
  /* width: 90%; */
  height: 300rpx;
  border-radius: 15rpx;
  overflow: hidden;
}
.swiper-img {
  width: 100%;
  height: 100%;
  border-radius: 15rpx;
}

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
