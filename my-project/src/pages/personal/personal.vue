<template>
  <view class="personalContainer">
    <view class="user-section">
      <image
        class="bg"
        :src="
          userInfo.backgroundUrl
            ? userInfo.backgroundUrl
            : '/static/images/personal/bgImg2.jpg'
        "
      />
      <view class="user-info-box">
        <view class="portrait-box">
          <image
            class="portrait"
            :src="
              userInfo.avatarUrl
                ? userInfo.avatarUrl
                : '/static/images/personal/missing-face.png'
            "
          ></image>
        </view>
        <view class="info-box" @click="toLogin">
          <text class="username">{{
            userInfo.nickname ? userInfo.nickname : "游客"
          }}</text>
        </view>
      </view>

      <view class="vip-card-box">
        <image
          class="card-bg"
          src="/static/images/personal/vip-card-bg.png"
          mode=""
        ></image>
        <view class="b-btn"> 立即开通 </view>
        <view class="tit">
          <!-- 会员图标-->
          <text class="iconfont icon-huiyuan"></text>
          会员
        </view>
        <text class="e-m">Muni会员</text>
        <text class="e-b">开通会员听歌</text>
      </view>
    </view>

    <view
      class="cover-container"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
      :style="{ transform: translate, transition }"
    >
      <image class="arc" src="/static/images/personal/arc.png"></image>
      <!-- 个人中心导航 -->
      <view class="nav-section">
        <view class="nav-item" hover-class="common-hover" hover-stay-time="50">
          <text class="iconfont icon-wodexiaoxi-copy"></text>
          <text>我的消息</text>
        </view>
        <view class="nav-item" hover-class="common-hover" hover-stay-time="50">
          <text class="iconfont icon-haoyou"></text>
          <text>我的好友</text>
        </view>
        <view class="nav-item" hover-class="common-hover" hover-stay-time="50">
          <text class="iconfont icon-tubiaozhizuomoban"></text>
          <text>个人主页</text>
        </view>
        <view class="nav-item" hover-class="common-hover" hover-stay-time="50">
          <text class="iconfont icon-gexinghua"></text>
          <text>个性装扮</text>
        </view>
      </view>

      <!-- 个人中心列表 -->
      <view class="personalContent">
        <view class="recentPlayContainer">
          <text class="title">最近播放</text>
          <!-- 最近播放记录 -->
          <scroll-view
            v-if="record.length > 0"
            scroll-x="true"
            class="recentScroll"
            enable-flex="true"
          >
            <view
              class="recentItem"
              v-for="(records, index) in record"
              :key="records.song.id"
              @click="toMusicPage(records.song.id, index)"
            >
              <image :src="records.song.al.picUrl" lazy-load />
            </view>
          </scroll-view>
          <view class="swx-login" v-else
            >请
            <text @click="toLogin">登录</text>
            后查看
          </view>
        </view>

        <view class="cardList">
          <view class="card-item">
            <text class="title" @click="likeMusic">喜欢音乐</text>
            <text
              class="more iconfont"
              :class="isLike ? 'icon-you' : 'icon-xia'"
            ></text>
            <view>
              <view v-if="isLogin && !isLike">
                <view
                  class="like-music"
                  @click="toPlaylist(userLikeMusic[0].id)"
                >
                  <view>
                    <img :src="userLikeMusic[0].coverImgUrl" alt="" />
                  </view>
                  <view class="like-music-t">
                    <view class="like-music-t1">
                      {{ userLikeMusic[0].name }}
                    </view>
                    <view class="like-music-t2">
                      {{ userLikeMusic[0].trackCount }}首
                    </view>
                  </view>
                </view>
              </view>
              <view class="swx-login" v-else-if="!isLike"
                >请
                <text @click="toLogin">登录</text>
                后查看
              </view>
            </view>
          </view>
          <view class="card-item">
            <text class="title" @click="createMusic">创建歌单</text>
            <text
              class="more iconfont"
              :class="isCreate ? 'icon-you' : 'icon-xia'"
            ></text>
            <view>
              <view v-if="isLogin && !isCreate">
                <view
                  class="like-music"
                  v-for="item in userCreateMusic"
                  :key="item.id"
                  @click="toPlaylist(item.id)"
                >
                  <view>
                    <img :src="item.coverImgUrl" alt="" />
                  </view>
                  <view class="like-music-t">
                    <view class="like-music-t1">{{ item.name }}</view>
                    <view class="like-music-t2">{{ item.trackCount }}首</view>
                  </view>
                </view>
              </view>
              <view class="swx-login" v-else-if="!isCreate"
                >请
                <text @click="toLogin">登录</text>
                后查看
              </view>
            </view>
          </view>
          <view class="card-item">
            <text class="title" @click="recomMusic">收藏歌单</text>
            <text
              class="more iconfont"
              :class="isRecom ? 'icon-you' : 'icon-xia'"
            ></text>
            <view>
              <view v-if="isLogin && !isRecom">
                <view
                  class="like-music"
                  v-for="item in userRecomMusic"
                  :key="item.id"
                  @click="toPlaylist(item.id)"
                >
                  <view>
                    <img :src="item.coverImgUrl" alt="" />
                  </view>
                  <view class="like-music-t">
                    <view class="like-music-t1">{{ item.name }}</view>
                    <view class="like-music-t2">{{ item.trackCount }}首</view>
                  </view>
                </view>
              </view>
              <view class="swx-login" v-else-if="!isRecom"
                >请
                <text @click="toLogin">登录</text>
                后查看
              </view>
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
export default {
  name: "Personal",
  components: {
    BottomBar,
  },
  data() {
    return {
      positionY: 0,
      movePosition: 0,
      translate: "translateY(0)",
      transition: "",
      // 存储本地缓存的用户信息
      userInfo: {},
      // 存储播放记录
      record: [],
      isLike: true,
      isCreate: true,
      isRecom: true,
      // 用户喜欢的音乐
      userLikeMusic: [],
      // 用户创建的音乐
      userCreateMusic: [],
      // 用户收藏的音乐
      userRecomMusic: [],
      isLogin: false,
    };
  },
  onLoad() {
    // 获取本地缓存
    this.getUserInfo();
    // 获取用户播放记录的数据
    this.getUserRecord();
    // 获取用户歌单
    this.getUserLikeMusic();
  },
  methods: {
    // 跳转歌曲列表页面
    toPlaylist(id) {
      // console.log("歌单id:", id);
      uni.navigateTo({
        url: "/pages/playlist/Playlist?id=" + id,
      });
    },
    // 跳转歌曲页面
    toMusicPage(id, index) {
      uni.navigateTo({
        url:
          "/pages/musicplayer/MusicPlayer?id=" +
          id +
          "&index=" +
          index +
          "&playlistId=" +
          this.userLikeMusic[0].id,
      });
      // 提交vuex改变当前歌单的数据
      this.$store.commit("changeMusicPlaylist", this.record);
    },
    // 获取用户歌单
    getUserLikeMusic() {
      this.$request({
        url: "/user/playlist",
        data: {
          uid: this.userInfo.userId,
        },
      }).then((res) => {
        if (res) {
          this.userLikeMusic = res.playlist.splice(0, 1);
          this.userCreateMusic = res.playlist.splice(1, 13);
          this.userRecomMusic = res.playlist;
          // console.log(this.userLikeMusic);
          // console.log(this.userCreateMusic);
          // console.log(this.userRecomMusic);
        }
        this.isLogin = uni.getStorageSync("isLogin");
      });
    },
    // 控制是否显示歌单
    likeMusic() {
      this.isLike = !this.isLike;
    },
    createMusic() {
      this.isCreate = !this.isCreate;
    },
    recomMusic() {
      this.isRecom = !this.isRecom;
    },
    // 获取本地缓存数据
    getUserInfo() {
      let userInfo = uni.getStorageSync("userInfo");
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
      }
      // console.log(this.userInfo);
    },
    // 获取用户播放记录的数据
    getUserRecord() {
      this.$request({
        url: "/user/record",
        data: {
          uid: this.userInfo.userId,
          type: 0,
        },
      }).then((res) => {
        this.record = res.allData.splice(0, 13);
        // console.log(this.record);
      });
    },
    // 跳转登录页面
    toLogin() {
      uni.navigateTo({ url: "/pages/login/Login" });
    },
    // 触摸屏幕事件
    touchStart(event) {
      this.transition = "";
      this.positionY = event.touches[0].clientY;
    },
    // 移动屏幕事件
    touchMove(event) {
      this.movePosition = event.touches[0].clientY - this.positionY;
      // this.lastPosition = this.movePosition - this.positionY;
      if (this.movePosition <= 0) {
        this.movePosition = 0;
      } else if (this.movePosition >= 100) {
        this.movePosition = 100;
      }
      this.translate = `translateY(${this.movePosition}rpx)`;
    },
    // 放开屏幕事件
    touchEnd(event) {
      this.translate = "translateY(0)";
      this.transition = "transform 1s linear";
    },
  },
};
</script>

<style scoped>
.personalContainer {
  width: 100%;
  height: 100%;
}

.personalContainer .user-section {
  height: 520rpx;
  position: relative;
  padding: 100rpx 30rpx 0;
}
.user-section .bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.7;
  filter: blur(1px);
}

.user-info-box {
  height: 180rpx;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.user-info-box .portrait {
  width: 130rpx;
  height: 130rpx;
  border: 5rpx solid #fff;
  border-radius: 50%;
}
.user-info-box .username {
  font-size: 24;
  color: #303133;
  margin-left: 20rpx;
}

/* vip-box */
.vip-card-box {
  position: relative;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.7);
  height: 240rpx;
  color: #f7d680;
  border-radius: 16rpx 16rpx 0 0;
  padding: 20rpx 24rpx;
}

.vip-card-box .card-bg {
  position: absolute;
  top: 20rpx;
  right: 0;
  width: 380rpx;
  height: 260rpx;
}

.vip-card-box .b-btn {
  position: absolute;
  right: 20rpx;
  top: 16rpx;
  width: 132rpx;
  height: 40rpx;
  text-align: center;
  line-height: 40rpx;
  font-size: 22rpx;
  color: #36343c;
  border-radius: 20px;
  background: #f9e6af;
  z-index: 1;
}

.vip-card-box .b-btn {
  position: absolute;
  right: 20rpx;
  top: 16rpx;
  width: 132rpx;
  height: 40rpx;
  text-align: center;
  line-height: 40rpx;
  font-size: 22rpx;
  color: #36343c;
  border-radius: 20px;
  /*background: linear-gradient(left, #f9e6af, #ffd465);*/ /*渐变不生效*/
  background: #f9e6af;
  z-index: 1;
}

.vip-card-box .tit {
  font-size: 22rpx;
  color: #f7d680;
  margin-bottom: 28rpx;
}
.vip-card-box .tit .iconfont {
  color: #f6e5a3;
  margin-right: 16rpx;
}

.vip-card-box .e-m {
  font-size: 34rpx;
  margin-top: 10rpx;
}
.vip-card-box .e-b {
  font-size: 24rpx;
  color: #d8cba9;
  margin-top: 10rpx;
}

.cover-container {
  margin-top: -150rpx;
  padding: 0 30rpx;
  position: relative;
  background: #f5f5f5;
  padding-bottom: 20rpx;
}

.cover-container .arc {
  position: absolute;
  left: 0;
  top: -34rpx;
  width: 100%;
  height: 36rpx;
}

/* 导航部分 */
.cover-container .nav-section {
  display: flex;
  background: #fff;
  padding: 20rpx 0;
  border-radius: 15rpx;
}

.nav-section .nav-item {
  width: 25%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-section .nav-item .iconfont {
  font-size: 50rpx;
  color: #d43c33;
  line-height: 70rpx;
}

.nav-section .nav-item text:last-child {
  font-size: 22rpx;
}

/* 个人中心列表 */
.personalContent {
  background: #fff;
  margin-top: 20rpx;
  /* border: 1px solid rgb(240, 0, 0); */
  border-radius: 20rpx;
  margin-bottom: 100rpx;
}

/* 最近播放 */
.personalContent .scrollView {
  display: flex;
  height: 160rpx;
}
.personalContent .recentPlay {
  display: flex;
}

.title {
  display: inline-block;
  width: 600rpx;
  height: 60rpx;
  padding-left: 20rpx;
  font-size: 26rpx;
  color: #333;
  line-height: 80rpx;
}

.personalContent .recentPlay image {
  width: 160rpx;
  height: 160rpx;
  margin-left: 20rpx;
  border-radius: 20rpx;
}

.cardList {
  margin-top: 20rpx;
}
.cardList .card-item {
  border-top: 1rpx solid #eee;
  /* height: 80rpx; */
  line-height: 80rpx;
  padding: 10rpx;
  font-size: 26rpx;
  color: #333;
}
.cardList .card-item .more {
  float: right;
}

/*最近播放记录*/
.recentScroll {
  display: flex;
  height: 200rpx;
}
.recentItem {
  margin: 0 20rpx;
}
.recentItem image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 10rpx;
}
.swx-login {
  font-size: 32rpx;
  margin-left: 20rpx;
}

.swx-login text {
  color: red;
}
/* 修改个人页面下拉喜欢菜单的样式 */
.like-music {
  display: flex;
}
.like-music img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 15rpx;
  margin-left: 10rpx;
}
.like-music-t {
  /* position: absolute; */
  margin-left: 20rpx;
}
.like-music .like-music-t1 {
  height: 30rpx;
  font-size: 30rpx;
  color: black;
  margin-bottom: 15rpx;
  margin-top: -15rpx;
}
.like-music .like-music-t2 {
  height: 24rpx;
  font-size: 24rpx;
  color: rgb(168, 168, 168);
}
</style>