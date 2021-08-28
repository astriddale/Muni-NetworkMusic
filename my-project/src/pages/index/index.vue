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
        <swiper-item>
          <img class="swiper-img" src="~static/logo.png" alt="" srcset="" />
        </swiper-item>
        <swiper-item>
          <img src="~static/logo.png" alt="" srcset="" />
        </swiper-item>
        <swiper-item>
          <img src="~static/logo.png" alt="" srcset="" />
        </swiper-item>
        <swiper-item>
          <img src="~static/logo.png" alt="" srcset="" />
        </swiper-item>
        <swiper-item>
          <img src="~static/logo.png" alt="" srcset="" />
        </swiper-item>
      </swiper>
    </view>
    <icon-recommend />
    <recommend />
  </view>
</template>

<script>
// 导入组件
import IconRecommend from "./childComps/IconRecommend.vue";
import Recommend from "./childComps/Recommend.vue";
import Search from "./childComps/Search.vue";

export default {
  data() {
    return {
      title: "HelloSWX",
    };
  },
  onLoad() {},
  methods: {},
  components: {
    Search,
    IconRecommend,
    Recommend,
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
}
</style>
