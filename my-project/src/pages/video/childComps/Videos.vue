<template>
  <view v-if="videoDatas.length > 0">
    <swiper class="swiper-swx" @change="pageChange" :current="currentIndex">
      <swiper-item v-for="(item, index) in categroyList.length" :key="index">
        <view>
          <!-- 需要判断是否有数据再进行显示 -->
          <!--scroll-y 开启竖向滚动，都需要设置高度  -->
          <!--enable-flex 开启felx布局  -->
          <!-- refresher-enabled 开启自定义下拉刷新  -->
          <!--:refresher-triggered="isTrigger" 控制isTrigger为真时显示加载 -->
          <!--@refresherrefresh="onRefresh"  下拉刷新事件-->
          <!--@scrolltolower="tolower" 上拉加载事件-->
          <scroll-view
            v-if="allVideoDatas[currentIndex].length > 0"
            scroll-y
            class="video"
            enable-flex
            refresher-enabled
            :refresher-triggered="isTrigger"
            @refresherrefresh="onRefresh"
            @scrolltolower="tolower"
          >
            <view
              v-for="(video, indez) in allVideoDatas[currentIndex]"
              :key="indez"
              class="video-item"
              @click="toVideoPlay(video)"
            >
              <img
                class="video-item-img"
                :src="video.data.coverUrl"
                alt=""
                lazy-load
              />
              <view class="video-item-title">
                {{
                  video.type == 1
                    ? video.data.title
                    : video.data.name + "--" + video.data.artists[0].name
                }}
              </view>
            </view>
          </scroll-view>
          <view v-else class="not">视频数据加载中...</view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>
<script>
export default {
  name: "Videos",
  data() {
    return {
      // 存取单页数据
      videoDatas: [],
      // 控制是否有下拉加载
      isTrigger: false,
      // 页数
      offset: 0,
      // 所有数据的集合
      allVideoDatas: [],
    };
  },
  props: {
    categroyList: {
      type: Array,
      default: [],
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
  },
  created() {
    // 判断categroyList是否拿到并且通过他的数组长度给allVideoDatas添加新的空数组
    this.categroyList.length > 0 &&
      this.categroyList.forEach((item) => {
        let arr = [];
        this.allVideoDatas.push(arr);
      });
    // 获取第一页的数据
    this.getAllVideoDatas(this.currentIndex);
  },

  mounted() {},
  // 监听videoDatas数据的变化（videoDatas数据是异步请求来的）
  watch: {
    videoDatas: {
      deep: true,
      handler(newVal, oldVal) {
        // 根据currentIndex的值决定将监听数据的新值给数据集
        // 将获取到的videoDatas加入到this.allVideoDatas[page]的数组内
        this.allVideoDatas[this.currentIndex] = newVal;
      },
    },
  },
  methods: {
    // 根据currentIndex获取数据
    getVideo(page) {
      this.$request({
        url: "/video/group",
        data: { id: this.categroyList[page].id, offset: this.offset * 8 },
      }).then((res) => {
        this.isTrigger = false;
        this.offset++;
        this.videoDatas = res.datas;
        // 获取到数据以后关闭加载组件
        uni.hideLoading();
      });
    },
    getAllVideoDatas(page) {
      // 获取数据
      this.getVideo(page);
      // 显示加载组件
      uni.showLoading({
        title: "数据加载中",
      });
    },
    // 每次查询都调用此函数清空所有数据
    cleanAllVideoList() {
      let index = 0;
      this.allVideoDatas.forEach((item) => {
        // 清空allVideoDatas里的所有数据
        this.allVideoDatas[index++] = [];
      });
      // 将页码置零
      this.offset = 0;
    },
    // 滑动事件
    pageChange(ev) {
      // 清空数据
      this.cleanAllVideoList();
      // cureent的值就是cuttentIndex的值
      let index = ev.detail.current;
      // 请求当前currentIndex所在页面的数据
      this.getAllVideoDatas(index);
      //，当滑动时,更新currentIndex的值
      // 一更新currentIndex的值，本函数会调用自身（递归）
      this.$parent.currentIndex = index;
    },

    // 自定义下拉刷新事件
    onRefresh() {
      // 加载组件
      this.isTrigger = true;
      // 获取数据
      this.getVideo(this.currentIndex);
      // 将获取到的数据替换当前数组里的数据，完成下拉刷新的效果
      this.allVideoDatas.splice(this.currentIndex, 1, this.videoDatas);
    },
    // 自定义上拉加载事件
    tolower() {
      // 获取新一页的数据并且push进allVideoDAtas数据集里
      uni.showLoading({
        title: "视频加载中",
        mask: true,
      });
      this.$request({
        url: "/video/group",
        data: {
          id: this.categroyList[this.currentIndex].id,
          offset: this.offset + 1 * 8,
        },
      }).then((res) => {
        this.isTrigger = false;
        this.offset++;
        let result = res.datas;
        // 将获取到的result分批加入到this.allVideoDatas[page]的数组内
        this.allVideoDatas[this.currentIndex].push(...result);
        // 获取到数据以后关闭加载组件
        uni.hideLoading();
      });
    },
    // 点击去视频页面的事件
    toVideoPlay(video) {
      // console.log(video);
      let type = video.type;
      let data = video.data.vid || video.data.id;
      uni.navigateTo({
        url:
          "/pages/videoplayer/VideoPlayer?videoid=" +
          data +
          "&videotype=" +
          type,
      });
    },
  },
};
</script>

<style scoped>
.swiper-swx {
  height: calc(100vh - 60rpx - 184rpx);
}
/* 设置视屏的样式 */
.swiper-swx {
  height: calc(100vh - 60rpx - 184rpx);
}
/* 设置视屏的样式 */
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
}
</style>