<template>
  <view class="content">
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
    <recommend :topList="allTopListData" :personalized="personalized" />
    <bottom-bar />
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
    };
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

    // 排行榜swiper当前所处的current
    let currentPage = 0;

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
  },
  methods: {},
  components: {
    Search,
    IconRecommend,
    Recommend,
    BottomBar,
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
</style>
