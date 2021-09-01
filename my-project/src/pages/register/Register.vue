<template>
  <view class="container">
    <view class="wrapper">
      <view class="left-top-sign">LOGIN</view>
      <view class="welcome">欢迎回来！</view>
      <view v-if="!isPass" class="input-content">
        <view class="input-item">
          <text class="tit">手机号码</text>
          <input
            type="text"
            placeholder="请输入手机号码"
            id="phone"
            v-model="phone"
          />
        </view>
        <view class="input-item">
          <text class="tit">密码</text>
          <input
            type="password"
            placeholder="请输入密码"
            id="password"
            v-model="password"
          />
        </view>
      </view>
      <view v-else class="input-content">
        <view class="input-item">
          <text class="tit">手机号码</text>
          <input
            type="text"
            placeholder="请输入手机号码"
            id="phone"
            v-model="phone"
          />
        </view>
        <view class="input-item-code">
          <view class="input-item-2">
            <text class="tit">验证码</text>
            <input type="text" placeholder="请输入验证码" v-model="passcode" />
          </view>
          <view class="code-btn">
            <button
              :disabled="codeTimer"
              :class="{ active: !coderTimer }"
              @click="codeBtn"
            >
              {{ title }}
            </button>
          </view>
        </view>
      </view>
      <view>
        <button v-if="isPass" class="confirm-btn" @click="codeLogin">
          注册
        </button>
        <button v-else class="confirm-btn" @click="login">注册</button>
      </view>

      <view @click="changeRegister" class="change-login">
        <view v-if="isPass">密码注册</view>
        <view v-else>手机验证码注册</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      isPass: false,
      title: "获取验证码",
    };
  },
  methods: {
    changeRegister() {
      this.isPass = !this.isPass;
    },
  },
};
</script>

<style scoped>
/* pages/login/login.wxss */
.wrapper {
  position: relative;
  z-index: 90;
  padding-bottom: 40rpx;
}

.left-top-sign {
  font-size: 120rpx;
  color: #f8f8f8;
  position: relative;
  left: -16rpx;
}

.welcome {
  position: relative;
  left: 50rpx;
  top: -90rpx;
  font-size: 46rpx;
  color: #555;
}

.input-content {
  padding: 0 60rpx;
}
.input-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 30rpx;
  background: #f8f6fc;
  height: 120rpx;
  border-radius: 4px;
  margin-bottom: 50rpx;
}
.input-item-code {
  display: flex;
  flex-direction: row;
}
.input-item-2 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 30rpx;
  background: #f8f6fc;
  height: 120rpx;
  border-radius: 4px;
}
.input-item-code .code-btn button {
  height: 120rpx;
  font-size: 30rpx;
  line-height: 120rpx;
}

.input-item:last-child {
  margin-bottom: 0;
}
.tit {
  height: 50rpx;
  line-height: 56rpx;
  font-size: 30rpx;
  color: #606266;
}
.input-item input {
  height: 60rpx;
  font-size: 30rpx;
  color: #303133;
  width: 100%;
}
.change-login {
  font-size: 30rpx;
  color: rgb(0, 191, 255);
  margin-left: 60rpx;
  margin-top: 20rpx;
}
.confirm-btn {
  width: 630rpx !important;
  height: 76rpx;
  line-height: 76rpx;
  border-radius: 50rpx;
  margin-top: 70rpx;
  background: #d43c33;
  color: #fff;
  font-size: 32rpx;
  padding: 0;
}
.confirm-btn2:after {
  border-radius: 100px;
}

.forget-section {
  font-size: 28rpx;
  color: #4399fc;
  text-align: center;
  margin-top: 40rpx;
}

.register-section {
  position: absolute;
  left: 0;
  bottom: 50rpx;
  width: 100%;
  font-size: 28rpx;
  color: #606266;
  text-align: center;
}
.register-section text {
  color: #4399fc;
  margin-left: 10rpx;
}
.active {
  color: rgb(255, 25, 25);
}
</style>