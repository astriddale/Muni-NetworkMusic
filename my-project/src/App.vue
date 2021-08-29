<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
    // console.log(this)
    // this.$request({
    //   url: "/banner",
    // }).then((response) => {
    //   console.log(response);
    // });
    // const result = await this.$request({
    //   url: "/banner",
    // });
    // console.log(result);
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style>
/*每个页面公共css */
page {
  height: 100%;
}
</style>
