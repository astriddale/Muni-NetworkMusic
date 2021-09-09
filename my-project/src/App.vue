<script>
export default {
  onLaunch: function () {},
  onShow: function () {
    uni.showShareMenu({
      title: "Muni云音乐",
    });
  },
  onHide: function () {},
};
</script>

<style>
@import "./static/iconfont/iconfont.css";
/*每个页面公共css */
page {
  height: 100%;
}
</style>
