<template>
  <view class="index-playlist">
    <view class="index-playlist-item1">
      <scroll-view
        scroll-x
        enable-flex
        class="index-scroll-item1"
        :scroll-into-view="'swx' + getIndex"
        scroll-with-animation
      >
        <view
          :id="'swx' + index"
          class="scroll-item1"
          :class="{ active: currentIndex == index }"
          v-for="(item, index) of catlist"
          :key="item.id"
          @click="itemClick(index)"
        >
          {{ item.name }}
        </view>
      </scroll-view>
      <view class="index-scroll-item2"><text class="iconfont icon-jia"></text></view>
    </view>
    <view>
      <swiper @change="pageChange" class="index-swiper" :current="currentIndex">
        <swiper-item
          v-for="(item, index) of tagsCatlist.length"
          :key="index"
          class="index-swiper-item"
        >
          <scroll-view
            scroll-y
            enable-flex
            class="index-scroll-item2"
            @scrolltolower="scrolltolower"
            v-show="isShow"
          >
            <view
              v-for="playlist in tagsCatlist[currentIndex]"
              :key="playlist.id"
              class="index-scroll-item2-view"
              @click="toPlaylist(playlist.id)"
            >
              <img :src="playlist.coverImgUrl" alt="" lazy-load />
              <view class="text">{{ playlist.name }}</view>
            </view>
            <!-- <view>
              <mp-loading show="true"></mp-loading>
            </view> -->
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
    <bottom-bar />
  </view>
</template>

<script>
import BottomBar from "../childComps/BottomBar.vue";
// import MpLoading from "weui-miniprogram/loading/loading";
export default {
  components: { BottomBar },
  name: "IndexPlaylist",
  data() {
    return {
      currentIndex: 0,
      catlist: [],
      tagsCatlist: [],
      allTagsCatlist: [],
      tagName: "",
      isShow: false,
    };
  },
  computed: {
    // 判断当curretnindex滚到3的时候定位到1上
    getIndex() {
      return this.currentIndex > 2 ? this.currentIndex - 1 : 0;
    },
  },
  watch: {
    // 监听catlist的数据，数据改变时就获取标签下的数据
    catlist: {
      deep: true,
      handler(val) {
        // 获取标签名
        this.tagName = val[this.currentIndex].name;
        // 获取第一页的数据
        this.getTagsCatlist(this.tagName);
      },
    },
  },
  onLoad() {
    // 获取标签数据
    this.getCatlist();
  },

  methods: {
    //sweiper改变导航栏坐标
    pageChange(event) {
      this.isShow = true;
      // 清空数据
      this.clearTagsCatliast();
      // 获取滚动后的页数
      let index = event.detail.current;
      // 更新滑动后tagName的值
      this.tagName = this.catlist[index].name;
      if (this.allTagsCatlist[index].length == 0) {
        this.getTagsCatlist(this.tagName);
      } else {
        this.tagsCatlist[index].push(...this.allTagsCatlist[index]);
      }
      // 更新页数
      this.currentIndex = index;
    },
    // 控制导航栏动态显示
    itemClick(index) {
      this.currentIndex = index;
    },
    // 获取歌单数据
    getCatlist() {
      this.$request({
        url: "/playlist/hot",
      }).then((res) => {
        this.catlist = res.tags;
        // 根据标签的长度定义两个存放歌单数据的新数组
        this.catlist.forEach(() => {
          this.tagsCatlist.push([]);
          this.allTagsCatlist.push([]);
        });
      });
    },
    // getTagsCatlist获取歌单标签下的21条数据
    getTagsCatlist(cat, offset = "") {
      uni.showLoading({
        title: "歌单加载中",
        mask: true,
      });
      this.$request({
        url: "/top/playlist",
        data: {
          cat,
          limit: 21,
          offset,
        },
      }).then((res) => {
        // 使用push的方法而不使用直接赋值是避免浅拷贝数据会被清空
        this.tagsCatlist[this.currentIndex].push(...res.playlists);
        this.allTagsCatlist[this.currentIndex].push(...res.playlists);
        uni.hideLoading();
        this.isShow = true;
      });
    },
    // 清空之前获取到的数据
    clearTagsCatliast() {
      this.tagsCatlist.forEach((item, index) => {
        this.tagsCatlist[index] = [];
      });
    },
    // 自定义上拉加载事件
    scrolltolower() {
      // 获取新数据，参数为标签名和偏移量，偏移量作用防止数据重复
      this.getTagsCatlist(
        this.tagName,
        this.tagsCatlist[this.currentIndex].length
      );
    },
    // 跳转歌单界面
    toPlaylist(id) {
      uni.navigateTo({
        url: "/pages/playlist/Playlist?id=" + id,
      });
    },
  },
};
</script>

<style scoped>
.index-playlist-item1 {
  display: flex;
}
.iconfont{
  font-size: 40rpx;
}
.index-playlist-item1 .index-scroll-item2 {
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
}
.index-scroll-item1 {
  padding: 0 20rpx;
  display: flex;
  height: 60rpx;
  line-height: 60rpx;
  width: 86%;
}
.index-scroll-item1 .scroll-item1 {
  height: 60rpx;
  font-size: 32rpx;
  margin-right: 50rpx;
  color: rgb(107, 107, 107);
  white-space: nowrap;
}

/* 代表index所在块处于点击下的活跃状态 */
.active {
  color: rgb(0, 0, 0) !important;
}

.index-swiper {
  height: calc(100vh - 160rpx);
  width: 100%;
}
.index-swiper-item {
  width: 100%;
  height: 100%;
}
.index-swiper-item .index-scroll-item2 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
.index-scroll-item2-view {
  margin: 20rpx 20rpx 90rpx 20rpx;
  width: 28%;
  height: 22%;
}
.index-scroll-item2-view img {
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
  margin-bottom: 5rpx;
}
.index-scroll-item2-view .text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  font-size: 26rpx;
  overflow: hidden;
  color: rgb(126, 126, 126);

  margin-bottom: 20rpx;
}
</style>