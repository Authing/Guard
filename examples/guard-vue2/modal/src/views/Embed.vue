<template>
  <div class="embed-container">
    <button class="authing-button" @click="showGuard">Show Guard</button>

    <div>模态窗口打开后会在 2 秒内调用 hide 方法关闭模态窗口，用于展示 hide 方法的效果</div>
    <div>模态框自动关闭后，可以点击 Show Guard 按钮再次显示</div>

    <div id="authing-guard-container"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted () {
    // 使用 start 方法挂载 Guard 组件到你指定的 DOM 节点，登录成功后返回 userInfo
    this.$guard.start('#authing-guard-container').then(userInfo => {
      console.log('userInfo: ', userInfo)
    })

    setTimeout(() => {
      this.$guard.hide()
    }, 2000)
  },
  methods: {
    showGuard () {
      this.$guard.show()
    }
  }
}
</script>
