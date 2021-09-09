<template>
  <view>
    <!--:scroll-into-view="'swx' + currentIndex" 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素 -->
    <!--scroll-with-animation 开启动画过度效果 -->
    <scroll-view
      scroll-x
      enable-flex
      :scroll-into-view="'swx' + getIndex"
      scroll-with-animation
      class="category-list"
    >
      <!-- :id="'swx' + index" 与scrollView绑定 -->
      <view
        v-for="(item, index) in categroyList"
        :id="'swx' + index"
        :key="item.id"
        class="category-list-item"
        :class="{ 'list-item-border': currentIndex == index }"
        @click="itemClick(index)"
      >
        {{ item.name }}
      </view>
    </scroll-view>
    <search class="search"></search>
    <!-- 因为是异步请求数据，所以添加if判断数据是否请求成功，请求成功再将数给子组件进行渲染 -->
    <videos
      :categroyList="categroyList"
      :currentIndex="currentIndex"
      v-if="categroyList.length > 0"
    />
    <bottom-bar />
  </view>
</template>

<script>
import Search from "index/childComps/Search.vue";
import BottomBar from "../index/childComps/BottomBar.vue";
import Videos from "./childComps/Videos.vue";

export default {
  name: "Video",
  data() {
    return {
      categroyList: [],
      currentIndex: 0,
      // videoDatas: [],
      // allVideoDatas: [],
      // offset: 0,
      // isTrigger: false,
    };
  },
  components: {
    Search,
    BottomBar,
    Videos,
  },
  created() {
    // 拿到本地缓存里userInfo的信息
    let userInfo = uni.getStorageSync("userInfo");
    // 判断是否有，没有则显示需要登录并且定向到登录页面
    if (!userInfo) {
      uni.showToast({
        title: "请先登录",
        icon: "none",
        success: () => {
          // 跳转至登录界面
          uni.reLaunch({
            url: "/pages/login/Login",
          });
        },
      });
      return;
    }
    // 获取导航栏的数据
    this.getCategroyList();
  },
  computed: {
    getIndex() {
      return this.currentIndex > 2 ? this.currentIndex - 1 : 0;
    },
  },
  methods: {
    // 切换导航栏的index值
    itemClick(index) {
      this.currentIndex = index;
    },
    // 获取导航栏的数据
    getCategroyList() {
      this.$request({
        url: "/video/category/list",
      }).then((res) => {
        this.categroyList = res.data;
      });
    },
    // async mounted() {
    //   // 获取第一页的数据
    //   await this.getAllVideoDatas(this.currentIndex);
    // },
    // // async mounted() {
    // //   await this.getOnePageVideoList(this.currentIndex);
    // // },
    // methods: {
    //   itemClick(index) {
    //     this.currentIndex = index;
    //     console.log(this.currentIndex);
    //   },
    //   // 获取标签栏的数据
    //   async getCategroyList() {
    //     this.$request({
    //       url: "/video/category/list",
    //     }).then((res) => {
    //       this.categroyList = res.data;
    //       // console.log(this.categroyList[0].id);
    //       // 根据导航栏数据长度创建同样长的一个新数组
    //       this.categroyList.forEach((item) => {
    //         let arr = [];
    //         this.allVideoDatas.push(arr);
    //       });
    //       // console.log(this.categroyList);
    //     });
    //   },
    //   async getVideo(page) {
    //     uni.showLoading({
    //       title: "数据加载中",
    //     });
    //     let result = await this.$request({
    //       url: "/video/group",
    //       data: { id: this.categroyList[page].id, offset: this.offset },
    //     });
    //     this.isTrigger = false;
    //     this.offset++;
    //     result = result.datas;
    //     uni.hideLoading();
    //     this.videoDatas = result;
    //     return result;
    //   },
    //   async getAllVideoDatas(page) {
    //     let result = await this.getVideo(page);

    //     this.allVideoDatas[page].push(...result);
    //   },
    //   // 每次查询都调用此函数清空所有数据
    //   cleanAllVideoList() {
    //     let index = 0;
    //     this.allVideoDatas.forEach((item) => {
    //       // console.log(item);
    //       this.allVideoDatas[index++] = [];
    //     });
    //     this.offset = 0;
    //   },
    //   async pageChange(ev) {
    //     // cureent的值就是cuttentIndex的值
    //     console.log(ev.detail.current);
    //     let index = ev.detail.current;
    //     // 清空数据
    //     this.cleanAllVideoList();
    //     // 请求当前currentIndex所在页面的数据
    //     await this.getAllVideoDatas(this.currentIndex);
    //     // console.log(this.allVideoDatas);
    //     //，当滑动时,更新currentIndex的值
    //     // 一更新currentIndex的值，本函数会调用自身（递归）
    //     this.currentIndex = index;
    //     // this.getOnePageVideoList(this.currentIndex);
    //   },
    //   // 点击去视频页面的事件
    //   toVideoPlay(video) {
    //     // console.log(video);
    //     let type = video.type;
    //     let data = video.data.vid || video.data.id;
    //     console.log(data, type);
    //     uni.navigateTo({
    //       url:
    //         "/pages/videoplayer/VideoPlayer?videoid=" +
    //         data +
    //         "&videotype=" +
    //         type,
    //     });
    //   },
    //   // 自定义下拉刷新事件
    //   async onRefresh() {
    //     this.isTrigger = true;
    //     let result = await this.getVideo(this.currentIndex);
    //     this.allVideoDatas.splice(this.currentIndex, 1, result);
    //   },
    //   // 自定义上拉加载事件
    //   tolower() {
    //     this.getAllVideoDatas(this.currentIndex);
    //     console.log(this.allVideoDatas);
    //   },
  },
};
</script>

<style scoped>
.search {
  width: 100%;
}
.category-list {
  display: flex;
  background-color: #dc2c1f;
  height: 60rpx;
  color: rgb(20, 20, 20);
}
.category-list .category-list-item {
  height: 56rpx;
  /* color: rgb(231, 212, 212); */
  line-height: 56rpx;
  margin: 0 10rpx;
  /* width: 120rpx; */
  font-size: 28rpx;
  white-space: nowrap;
}
.list-item-border {
  border-bottom: 2rpx solid rgb(255, 255, 255);
  color: rgb(255, 255, 255);
}

/*  */

/* .swiper-swx {
  height: calc(100vh - 60rpx - 184rpx);
}
.video {
  height: calc(100vh - 60rpx - 184rpx);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.video .video-item {
  margin-top: 10rpx;
  display: flex;
  flex-direction: column;
  width: 45%;
  height: 280rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  background-color: white;
  border-radius: 20rpx;
  border: 1rpx solid #eee;
  box-shadow: 0 -6rpx 6rpx rgb(156, 156, 156);
}
.video .video-item .video-item-img {
  width: 100%;
  height: 190rpx;
}
.video .video-item .video-item-title {
  padding: 6rpx 10rpx;
  font-size: 26rpx;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
.not {
  text-align: center;
} */
</style>