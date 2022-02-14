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
            @keyup.enter="login"
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
          登录
        </button>
        <button v-else class="confirm-btn" @click="login">登录</button>
      </view>

      <view @click="changeLogin" class="change-login">
        <view v-if="isPass">密码登录</view>
        <view v-else>手机验证码登录</view>
      </view>
      <view class="forget-section" v-show="isPass">忘记密码?</view>
    </view>
    <view class="register-section">
      还没有账号?
      <text @click="toRegister">马上注册</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      phone: "",
      password: "",
      passcode: "",
      isPass: true,
      codeTimer: false,
      title: "获取验证码",
      timer: 30,
    };
  },
  onLoad() {
    uni.hideLoading();
  },
  methods: {
    // 登录功能的实现
    login() {
      if (!this.phone) {
        uni.showToast({
          title: "手机号码不能为空",
          icon: "none",
          mask: true,
        });
        return;
      } else if (!this.password) {
        uni.showToast({
          title: "密码不能为空",
          icon: "none",
          mask: true,
        });
        return;
      } else if (!/^1[3|4|5|7|8|9][0-9]{9}$/.test(this.phone)) {
        uni.showToast({
          title: "手机号码输入格式错误",
          icon: "none",
          mask: true,
        });
        return;
      }
      this.$request({
        url: "/login/cellphone",
        data: {
          phone: this.phone,
          password: this.password,
          isLogin: true,
        },
      }).then((res) => {
        // console.log(res)
        if (res.code === 200) {
          uni.showToast({
            title: "登录成功",
            icon: "success",
            mask: true,
          });
          this.$store.commit("changeLogin", true);
          uni.setStorageSync("userInfo", JSON.stringify(res.profile));
          setTimeout(() => {
            uni.reLaunch({ url: "/pages/personal/personal" });
          }, 1000);
        } else if (res.code === 502) {
          uni.showToast({
            title: "密码错误",
            icon: "none",
            mask: true,
          });
          return;
        } else if (res.code === 501) {
          uni.showToast({
            title: "账号不存在，请先注册",
            icon: "none",
            mask: true,
          });
          return;
        } else {
          uni.showToast({
            title: "登录失败，请稍后重试",
            icon: "none",
            mask: true,
          });
          return;
        }
      });
    },
    // 跳转到注册页面
    toRegister() {
      uni.navigateTo({ url: "/pages/register/Register" });
    },
    // 修改登录方式
    changeLogin() {
      this.isPass = !this.isPass;
    },
    // 获取验证码事件
    codeBtn() {
      if (!this.phone) {
        uni.showToast({
          title: "手机号码不能为空",
          icon: "none",
          mask: true,
        });
        return;
      } else if (!/^1[3|4|5|7|8|9][0-9]{9}$/.test(this.phone)) {
        uni.showToast({
          title: "手机号码输入格式错误",
          icon: "none",
          mask: true,
        });
        return;
      }
      let timer = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
          this.codeTimer = true;
          this.title = `请${this.timer}s后重试`;
        } else {
          this.codeTimer = false;
          this.title = "获取验证码";
          this.timer = 30;
          clearInterval(timer);
        }
      }, 1000);
      // 发送获取验证码的请求
      this.$request({
        url: "/captcha/sent",
        data: {
          phone: this.phone,
        },
      });
    },
    // 验证码登录
    codeLogin() {
      if (!this.phone) {
        uni.showToast({
          title: "手机号码不能为空",
          icon: "none",
          mask: true,
        });
        return;
      } else if (!this.passcode) {
        uni.showToast({
          title: "验证码不能为空",
          icon: "none",
          mask: true,
        });
        return;
      } else if (!/^1[3|4|5|7|8|9][0-9]{9}$/.test(this.phone)) {
        uni.showToast({
          title: "手机号码输入格式错误",
          icon: "none",
          mask: true,
        });
        return;
      }
      // 验证码是否正确
      this.$request({
        url: "/captcha/verify",
        data: {
          phone: this.phone,
          captcha: this.passcode,
        },
      }).then((res) => {
        console.log(res);
        if (res.code === 200) {
          uni.showToast({
            title: "登录成功",
            icon: "success",
            mask: true,
          });
          setTimeout(() => {
            uni.reLaunch({ url: "/pages/personal/personal" });
          }, 1000);
        } else if (res.code === 503) {
          uni.showToast({
            title: "验证码错误",
            icon: "none",
            mask: true,
          });
        } else {
          uni.showToast({
            title: "网络错误，请稍后重试",
            icon: "none",
            mask: true,
          });
        }
      });
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