<template>
  <div class="console-banner">
    <p>
      若你已对系统有基本了解，并且感兴趣的话，点击跳转 Authing
      控制台，来开启你的 Authing 之旅！
    </p>
    <a
      href="https://console.authing.cn"
      target="_blank"
      rel="noopener noreferrer"
    >
      进入 Authing 控制台
    </a>
  </div>
</template>

<style lang="stylus">
.console-banner
  width: 692px
  height: 160px;
  margin: 6px auto 0;
  background: url('~@theme/assets/images/banner.png') no-repeat center center;
  background-size: 692px 160px;
  p
    padding: 20px 35px;
    width: 420px;
    color: #fff;
    font-weight: 600;
    font-size: 16px;
    line-height: 26px;
  a
    margin-left: 32px;
    padding: 5px 16px;
    width: 128px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 4px;
  a:hover
    text-decoration: none !important;

@media (max-width: $MQMobile)
  .console-banner
    display: none
</style>
