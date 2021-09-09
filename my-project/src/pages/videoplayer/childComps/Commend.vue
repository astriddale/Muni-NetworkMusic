<template>
  <!-- 评论区域 -->
  <view class="commend">
    <scroll-view
      class="commend-title-scroll"
      scroll-y
      enable-flex
      @scrolltolower="scrolltolower"
    >
      <!-- 后期抽为一个组件可以封装为slot -->
      <slot></slot>

      <view class="commend-title">评论区({{ totalCount }})</view>
      <view
        class="commend-scroll-item"
        v-for="item of videoCommentData"
        :key="item.commentId"
      >
        <view><img :src="item.user.avatarUrl" alt="" /></view>
        <view class="commend-scroll-context"
          ><view class="user">{{ item.user.nickname }}</view>
          <view class="date">{{ item.time | timeStamp }}</view>
          <view class="context">
            {{ item.content }}
          </view>
          <view
            class="recontext"
            @click="showToast(item.commentId, videoId, type)"
          >
            {{ item.showFloorComment.replyCount }}条回复
          </view>
        </view>
      </view>
      <view class="hasMore" v-show="!hasMore">没有更多评论了~~~</view>
    </scroll-view>

    <!-- 回复列表 -->
    <!-- 遮罩层 -->
    <view
      class="mask"
      :class="{ showrecomment: isShow }"
      @click="showRecomment"
    ></view>
    <!-- 回复层 -->
    <view class="recomment" :class="{ showrerecomment: isShow }">
      <view class="recomment-title">回复({{ reTotalCount }})</view>
      <scroll-view
        v-if="JSON.stringify(ownerComment) !== '{}'"
        scroll-y
        enable-flex
        class="calcheight"
        @scrolltolower="scrollItemTolower(ownerComment.commentId)"
      >
        <view class="commend-scroll-item re-comment">
          <view><img :src="ownerComment.user.avatarUrl" alt="" /></view>
          <view class="commend-scroll-context"
            ><view class="user">{{ ownerComment.user.nickname }}</view>
            <view class="date">{{ ownerComment.time | timeStamp }}</view>
            <view class="context">
              {{ ownerComment.content }}
            </view>
          </view>
        </view>
        <view
          class="commend-scroll-item"
          v-for="item of reCommnedData"
          :key="item.commentId"
        >
          <view><img :src="item.user.avatarUrl" alt="" /></view>
          <view class="commend-scroll-context"
            ><view class="user">{{ item.user.nickname }}</view>
            <view class="date">{{ item.time | timeStamp }}</view>
            <view class="context">
              {{ item.content }}
            </view>
          </view>
        </view>
        <view class="hasMore" v-show="!reHasMore">没有更多评论了~~~</view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import Share from "./Share.vue";
export default {
  name: "Commend",
  components: { Share },
  data() {
    return {
      pageNo: 1,
      // 是否有更多评论
      hasMore: false,
      // 评论总数
      totalCount: 0,
      // 评论数据
      videoCommentData: [],
      // 评论恢复数据
      floorCommentData: [],

      // 回复列表的数据
      time: "",
      reHasMore: false,
      reTotalCount: 0,
      reCommnedData: [],
      ownerComment: {},
      isShow: false,
    };
  },
  filters: {
    timeStamp: function (value) {
      if (!value) return "";
      var now = new Date(value);
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      var date = now.getDate();
      if (date < 10) {
        date = "0" + date;
      }
      return year + "-" + month + "-" + date;
    },
  },
  props: {
    // 视屏id
    videoId: {
      type: String,
      default: "",
    },
    // 视频类型，只在video页面传
    videoType: {
      type: String,
      default: "",
    },
    // 类型，任何页面都可以传
    type: {
      type: Number,
      default: 0,
    },
  },
  created() {
    // 取得第一页的评论数
    this.getCommend(this.videoId, this.videoType);
  },
  methods: {
    // 请求评论数据
    getCommend(videoId, videoType = 1, pageNo = 1, url = "/comment/new") {
      // videoId, videoType, pageNo = 1, url分别为视频id，视频类型（视频或MV），评论页数，请求地址
      // 根据视频类型设置相应的请求参数类型
      if (videoType == 1) {
        this.type = 5;
      } else if (videoType == 2) {
        this.type = 1;
      }
      uni.showLoading({
        title: "评论加载中",
        mask: true,
      });

      // console.log("id为", videoId);
      // console.log("type为", this.type);
      this.$request({
        url,
        data: {
          id: videoId,
          type: this.type,
          pageNo: pageNo,
          pageSize: 20,
          sortType: 2,
        },
      }).then((res) => {
        // console.log("swxsssss", res);
        this.pageNo++;
        this.hasMore = res.data.hasMore;
        this.totalCount = res.data.totalCount;
        this.videoCommentData.push(...res.data.comments);
        uni.hideLoading();
      });
    },
    //加载更多评论
    scrolltolower() {
      this.getCommend(this.videoId, this.videoType, this.pageNo);
    },
    getReCommend(commmendId, id, type, time = "") {
      // commmendId, id, type, time分别为评论id，视频id，视频类型，上一轮评论最后一个的time
      uni.showLoading({
        title: "评论加载中",
        mask: true,
      });
      this.$request({
        url: "/comment/floor",
        data: {
          parentCommentId: commmendId,
          id,
          type,
          time,
        },
      })
        .then((res) => {
          // console.log(res.data.ownerComment)
          // 判断是否存在自己的数据
          if (res.data.ownerComment) {
            this.ownerComment = res.data.ownerComment;
          }
          this.reHasMore = res.data.hasMore;
          uni.hideLoading();
          // 判断是否存在最后一条数据
          if (res.data.comments[res.data.comments.length - 1].time) {
            this.time = res.data.comments[res.data.comments.length - 1].time;
          }
          // 判断最大值
          if (res.data.totalCount >= this.reTotalCount) {
            this.reTotalCount = res.data.totalCount;
          }
          // 存数据
          this.reCommnedData.push(...res.data.comments);
        })
        .catch((err) => {
          // 打印错误
          console.log(err);
        });
    },
    //回复列表下拉加载更多
    scrollItemTolower(ownerComment) {
      this.getReCommend(ownerComment, this.videoId, this.type, this.time);
    },
    // 弹出回复列表
    showToast(commmendId, id, type) {
      this.isShow = true;
      // 清空之前的数据避免数据重叠
      this.reCommnedData = [];
      // 获取回复数据
      this.getReCommend(commmendId, id, type);
    },
    // 控制是否显示回复列表
    showRecomment() {
      this.isShow = false;
    },
  },
};
</script>

<style scoped>
/* 评论区域 */
.commend {
  margin: 40rpx 0;
}
.commend .commend-title {
  color: black;
  font-weight: bold;
  font-size: 30rpx;
  padding: 0 32rpx;
}
.commend .commend-scroll-item {
  margin-top: 26rpx;
  display: flex;
  padding: 0 32rpx;
}
.commend .commend-scroll-item img {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}
.commend .commend-scroll-item .commend-scroll-context {
  width: 100%;
  margin-left: 20rpx;
  border-bottom: 1rpx solid rgba(160, 159, 159, 0.3);
}
.commend-scroll-context .user {
  font-size: 30rpx;
  margin-top: 6rpx;
}
.commend-scroll-context .date {
  margin-top: 4rpx;
  color: rgb(155, 155, 155);
  font-size: 20rpx;
}
.commend-scroll-context .context {
  font-size: 30rpx;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}
.commend-scroll-context .recontext {
  font-size: 22rpx;
  color: rgb(59, 178, 207);
  margin-bottom: 30rpx;
}
.commend-title-scroll {
  height: calc(100vh - 400rpx - 80rpx);
}
.hasMore {
  height: 100rpx;
  line-height: 100rpx;
  width: 100%;
  text-align: center;
}

/* 遮罩层样式 */
.mask {
  position: absolute;
  display: none;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(133, 133, 133, 0.1);
  height: 400rpx;
}
/* 评论信息 */
.re-comment {
  margin-bottom: 20rpx;
  border-bottom: 20rpx solid rgba(148, 148, 148, 0.2);
}
/* 回复列表样式 */
.recomment {
  background-color: #fff;
  border-top-right-radius: 20rpx;
  border-top-left-radius: 20rpx;
  height: calc(100vh - 300rpx);
  overflow: hidden;
  transition: transform 0.3s linear;
}
.recomment .recomment-title {
  padding-top: 20rpx;
  padding-bottom: 20rpx;
  margin: 0 0 0 20rpx;
  font-size: 34rpx;
  font-weight: bold;
}
.showrecomment {
  display: block;
}
.showrerecomment {
  transform: translateY(calc(300rpx - 100vh));
}
.calcheight {
  height: calc(100vh - 370rpx);
}
</style>