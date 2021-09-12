<template>
  <view class="in-search">
    <view class="search-title">
      <text class="iconfont icon-sousuo search"></text>
      <input
        type="text"
        :placeholder="defaultSearchInfo + '  最近很火哦！'"
        placeholder-style="color:#ccc"
        focus
        v-model="inputSearchInfo"
        @input="handleSearchInput"
      />
      <text
        class="iconfont icon-quxiao1 quxiao-anniu"
        @click="cleanSearch"
      ></text>
    </view>
    <view v-if="flag == 1" class="show-search-context">
      <view
        v-for="(item, indez) of searchSuggestData"
        :key="indez"
        class="context-item"
        @click="toSearch(item.keyword)"
      >
        <text class="iconfont icon-wangyiyunyinle-copy"></text>
        <view>{{ item.keyword }}</view>
      </view>
    </view>
    <view v-else-if="flag == 2" class="search-center">
      <scroll-view
        scroll-x
        enable-flex
        class="search-center-title"
        :scroll-into-view="'swx' + titleindex"
        scroll-with-animation
      >
        <view
          v-for="(irem, indew) of titleInfo"
          :key="indew"
          :class="{ 'title-active': indew == titleIndex }"
          @click="toShowData(indew)"
          :id="'swx' + indew"
        >
          {{ irem }}
        </view>
      </scroll-view>
      <swiper
        class="search-center-swiper"
        @change="pagesChange"
        :current="titleIndex"
      >
        <swiper-item
          v-for="(item, indes) in 3"
          :key="indes"
          class="search-center-swiper-item"
        >
          <scroll-view
            scroll-y
            enable-flex
            class="center-swiper-item-scroll"
            @scrolltolower="scrolltolower"
          >
            <view class="item-scroll-music" v-if="type == 1">
              <view
                v-for="data of searchDataOfKeyWord"
                :key="data.id"
                class="swiper-item-scroll-item"
                @click="
                  addPlaylist(data.id, data.album, data.artists, data.name)
                "
              >
                <view class="data-name">{{ data.name }}</view>
                <view>
                  <text class="name">{{ data.artists[0].name }}</text>
                  <text>-</text>
                  <text class="music-name">{{ data.album.name }}</text>
                </view>
              </view>
            </view>
            <view class="item-scroll-playlist" v-else-if="type == 1000">
              <view
                v-for="data of searchDataOfKeyWord"
                :key="data.id"
                class="swiper-item-scroll-item1"
                @click="toPlaylist(data.id)"
              >
                <view class="scroll-item-img">
                  <img :src="data.coverImgUrl" alt="" />
                </view>
                <view>
                  <view class="data-name1">{{ data.name }}</view>
                  <view class="music-name1">
                    {{ data.trackCount }}首,by
                    {{ data.creator.nickname }},播放{{ data.playCount }}次</view
                  >
                </view>
              </view>
            </view>
            <view class="item-scroll-video" v-else-if="type == 1014">
              <view
                v-for="data of searchDataOfKeyWord"
                :key="data.vid"
                class="swiper-item-scroll-item2"
                @click="toVideoPlayer(data.vid, data.type)"
              >
                <view class="data-title">{{ data.title }}</view>
                <view class="data-img"
                  ><img :src="data.coverUrl" alt=""
                /></view>
              </view>
            </view>
            <view v-show="!hasMore">已经没有更多了</view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
    <view v-else>
      <view class="search-history">
        <text class="history">历史</text>
        <scroll-view scroll-x enable-flex class="search-history-scroll">
          <view
            class="scroll-item"
            v-for="(item, index) of searchHistoryData"
            :key="index"
            @click="toSearch(item)"
          >
            {{ item }}
          </view>
        </scroll-view>
        <text
          class="iconfont icon-quxiao1 quxiao-anniu"
          @click="cleanHistory"
        ></text>
      </view>
      <view class="search-hot">
        <view class="search-hot-title">热搜榜</view>
        <view class="hot">
          <view
            class="search-hot-context"
            v-for="(item, index) of hotSearchListData"
            :key="index"
            @click="toSearch(item.searchWord)"
          >
            <view class="search-hot-context-item">
              <view style="color: #dc2c1f; margin-right: 30rpx">{{
                index + 1
              }}</view>
              <view class="box-hidden">{{ item.searchWord }}</view>
              <img class="icon-url" :src="item.iconUrl" alt="" />
            </view>
          </view>
        </view>
      </view>
    </view>

    <bottom-bar />
  </view>
</template>

<script>
import BottomBar from "../index/childComps/BottomBar.vue";
// 导入节流函数
import { debounce } from "../../common/debance";
export default {
  components: { BottomBar },
  name: "InSearch",
  data() {
    return {
      // 输入框搜索信息
      inputSearchInfo: "",
      // 默认搜索信息
      defaultSearchInfo: "",
      // 搜索历史记录
      searchHistoryData: [],
      // 热搜榜数据
      hotSearchListData: [],
      // 搜索建议数据
      searchSuggestData: [],
      // 真正搜索的数据关键词
      reallySearchWords: "",
      // 存储搜索到的信息，包括单曲，视频获取歌单信息
      searchDataOfKeyWord: [],
      // 是否还有更多数据
      hasMore: true,
      // 记录显示哪个页面标识
      flag: 0,
      // 记录显示哪个标题
      titleInfo: ["单曲", "歌单", "视频"],
      //记录标题的下标
      titleIndex: 0,
      // 记录显示哪个类型的数据
      type: 1,
    };
  },
  onLoad(options) {
    this.getDefaultSearchInfo();
    this.getHotSearchListData();
  },
  methods: {
    //下拉加载更多
    scrolltolower() {
      this.getSearchDataOfKeyWord(
        this.reallySearchWords,
        this.type,
        this.searchDataOfKeyWord.length
      );
    },
    handleSearchInput(e) {
      // 表示要显示搜索建议页面
      this.flag = 1;
      // console.log(this.inputSearchInfo);
      // 适使用节流函数获取input的值并请求数据
      debounce(this.getInputValue(this.inputSearchInfo), 1500);
    },
    //清除搜索框内容
    cleanSearch() {
      // 表示要返回初始搜索的页面
      this.flag = 0;
      // 搜索信息初始化
      this.inputSearchInfo = "";
      // 搜索到的建议初始化
      this.searchSuggestData = [];
      // 搜索到的内容初始化
      this.searchDataOfKeyWord = [];
      // 初始化下标值
      this.titleIndex = 0;
      //初始化类型值
      this.type = 1;
    },
    // 清除搜索记录
    cleanHistory() {
      this.searchHistoryData = [];
    },
    // 跳转歌单页面
    toPlaylist(playlistId) {
      uni.navigateTo({
        url: "/pages/playlist/Playlist?id=" + playlistId,
      });
    },
    // 跳转视频页面
    toVideoPlayer(videoId, videoType) {
      uni.navigateTo({
        url:
          "/pages/videoplayer/VideoPlayer?videoid=" +
          videoId +
          "&videotype=" +
          videoType,
      });
    },
    // 跳转歌曲页面并且将当前歌曲添加至歌单里面
    addPlaylist(musicId, al, ar, name) {
      // console.log("歌曲id：", musicId);
      let playlist = uni.getStorageSync("musicPlaylist");
      let flag = 0;
      for (let i of playlist) {
        if (musicId == i.id) {
          flag = 0;
          break;
        } else {
          flag = 1;
        }
      }
      console.log(flag);
      if (flag) {
        playlist.splice(uni.getStorageSync("currentIndex"), 0, {
          al,
          ar,
          id: musicId,
          name,
        });
        uni.setStorageSync("musicPlaylist", playlist);
        uni.navigateTo({
          url:
            "/pages/musicplayer/MusicPlayer?id=" +
            musicId +
            "&index=" +
            uni.getStorageSync("currentIndex") +
            "&playlistId=" +
            uni.getStorageSync("playlistId"),
        });
      } else {
        uni.navigateTo({
          url:
            "/pages/musicplayer/MusicPlayer?id=" +
            musicId +
            "&index=" +
            uni.getStorageSync("currentIndex") +
            "&playlistId=" +
            uni.getStorageSync("playlistId"),
        });
      }
    },
    // 搜索热搜榜的内容
    toSearch(value) {
      // 绑定搜索框
      this.inputSearchInfo = value;
      // 表示要显示搜索到到的内容页面
      this.flag = 2;
      // 将搜索信息加入搜索历史
      this.setInfoToSearchHistoryData(value);
      // 搜索内容
      this.reallySearchWords = value;
      // console.log(this.reallySearchWords);
      this.getSearchDataOfKeyWord(this.reallySearchWords, 1);
    },
    // 显示搜索到的内容为歌曲还是歌单等等
    toShowData(index) {
      this.titleIndex = index;
    },
    // 页面滑动时的回调函数
    pagesChange(event) {
      // 清空之前的数据
      this.searchDataOfKeyWord = [];
      // console.log(event);
      // 获取滑动后的下标值
      let index = event.detail.current;
      // 根据下标显示什么类型的数据
      if (index == 0) {
        this.type = 1;
      } else if (index == 1) {
        this.type = 1000;
      } else {
        this.type = 1014;
      }
      // 请求第一页数据
      this.getSearchDataOfKeyWord(this.reallySearchWords, this.type);
      // 更新下标值数据
      this.titleIndex = index;
    },
    // 将搜索信息加入搜索历史
    setInfoToSearchHistoryData(value) {
      // console.log(this.searchHistoryData);
      // 当搜索历史长度大于0时，判断数组当中是否有重复数据，没有才加入数组
      if (this.searchHistoryData.length > 0) {
        let flag = false;
        for (let i of this.searchHistoryData) {
          if (i == value) {
            flag = false;
            return;
          } else {
            flag = true;
          }
        }
        if (flag) {
          this.searchHistoryData.unshift(value);
        }
      } else {
        this.searchHistoryData.unshift(value);
      }
    },
    // 获取默认搜索信息
    getDefaultSearchInfo() {
      this.$request({
        url: "/search/default",
      }).then((res) => {
        this.defaultSearchInfo = res.data.showKeyword;
      });
    },
    // 获取搜索页面热搜数据
    getHotSearchListData() {
      this.$request({
        url: "/search/hot/detail",
      }).then((res) => {
        // console.log("热搜榜数据", res);
        this.hotSearchListData = res.data;
      });
    },
    // 获取inputvalue并接受接口数据
    getInputValue(keywords) {
      uni.showLoading({
        title: "加载中",
        mask: true,
      });
      if (keywords == "") {
        keywords = this.defaultSearchInfo;
        uni.hideLoading();
      }
      this.$request({
        url: "/search/suggest",
        data: {
          keywords,
          type: "mobile",
        },
      }).then((res) => {
        // console.log(res);
        this.searchSuggestData = res.result.allMatch;
        // console.log("搜索建议数据：", this.searchSuggestData);
        uni.hideLoading();
      });
    },
    // 根据keyword的值获取数据并显示在搜索页面
    getSearchDataOfKeyWord(keywords, type, offset = 0) {
      uni.showLoading({
        title: "加载中",
        mask: true,
      });
      this.$request({
        url: "/search",
        data: {
          keywords,
          limit: 30,
          offset,
          type,
        },
      })
        .then((res) => {
          // console.log(res);
          uni.hideLoading();
          // 获取有没有很多数据的标识
          this.hasMore = res.hasMore;
          // 判断是什么类型的数据
          if (type == 1) {
            this.searchDataOfKeyWord.push(...res.result.songs);
          } else if (type == 1000) {
            this.searchDataOfKeyWord.push(...res.result.playlists);
          } else if (type == 1014) {
            this.searchDataOfKeyWord.push(...res.result.videos);
          }
          // console.log(this.searchDataOfKeyWord);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.icon-url {
  width: 30rpx;
  height: 20rpx;
  margin-left: 10rpx;
}
.in-search {
  height: 100%;
  overflow: hidden;
}
.search-title {
  display: flex;
  height: 80rpx;
  width: 100%;
  background-color: #dc2c1f;
  line-height: 80rpx;
  font-size: 34rpx;
  padding: 10rpx;
}
.search-title .search {
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
  background-color: rgba(202, 202, 202, 0.1);
}
.search-hot {
  margin-bottom: 100rpx;
}
.hot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.search-hot .search-hot-title {
  /* background-color: rgb(255, 78, 78); */
  margin: 20rpx;
  width: 90%;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid rgba(110, 110, 110, 0.2);
  font-size: 30rpx;
  font-weight: bold;
}
.search-hot .search-hot-context {
  width: 40%;
  margin-bottom: 40rpx;
  margin-left: 30rpx;
}
.search-hot-context-item {
  display: flex;
}
.search-hot-context-item .box-hidden {
  max-width: 200rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.quxiao-anniu {
  width: 100rpx;
  height: 100rpx;
  line-height: 100rpx;
}
.show-search-context .context-item {
  height: 80rpx;
  line-height: 80rpx;
  margin: 20rpx 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid rgba(128, 128, 128, 0.2);
  display: flex;
  font-size: 30rpx;
}

/* 第三个页面的样式 */
.search-center .search-center-title {
  display: flex;
  justify-content: space-around;
  background-color: #dc2c1f;
  height: 60rpx;
  line-height: 60rpx;
}
/* 标题活跃时的样式 */
.title-active {
  color: rgb(255, 255, 255);
  border-bottom: 4rpx solid rgb(255, 255, 255);
}
/* 滑块部分的样式 */
.search-center-swiper {
  height: calc(100vh - 160rpx - 100rpx);
  width: 100%;
}
.search-center-swiper .center-swiper-item-scroll {
  height: 100%;
  width: 100%;
}
.center-swiper-item-scroll .swiper-item-scroll-item {
  margin: 20rpx 30rpx;
}
.item-scroll-music .data-name {
  max-width: 600rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-scroll-music .name {
  font-size: 24rpx;
  color: rgb(52, 197, 233);
}
.item-scroll-music .music-name {
  font-size: 24rpx;
  color: rgb(109, 109, 109);
}
.swiper-item-scroll-item1 {
  display: flex;
  margin: 30rpx 40rpx;
}
.swiper-item-scroll-item1 .scroll-item-img img {
  height: 100rpx;
  width: 100rpx;
  border-radius: 20rpx;
  margin-right: 20rpx;
}
.swiper-item-scroll-item1 .data-name1 {
  max-width: 600rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.swiper-item-scroll-item1 .music-name1 {
  font-size: 24rpx;
  color: rgb(109, 109, 109);
  margin-top: 20rpx;
}
.swiper-item-scroll-item2 {
  border-bottom: 1rpx solid rgba(61, 61, 61, 0.1);
}

.swiper-item-scroll-item2 .data-title {
  margin: 20rpx;
}
.swiper-item-scroll-item2 .data-img {
  width: 94%;
  margin: 0 auto;
}
.swiper-item-scroll-item2 .data-img img {
  width: 100%;
  border-radius: 30rpx;
  margin-bottom: 40rpx;
}
</style>