<template>
  <div class="org-item-container">
    <img class="org-logo" :src="logo" alt="组织 logo" width="50" />
    <div>
      <div class="org-name">{{orgName}}</div>
      <div class="role-name">{{roleName}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "OrgItem",
  props: {
    logo: {
      type: String,
      default: "https://cdn.authing.cn/blog/avatar.png",
    },
    orgName: {
      type: String,
      default: "测试组织",
    },
    roleName: {
      type: String,
      default: "测试角色",
    },
  },
};
</script>
<style scoped>
.org-name {
  font-size: 14px;
  font-weight: bold;
}
.role-name {
  font-size: 12px;
  color: #919191;
}
.org-item-container {
  display: flex;
  align-items: center;
  border-radius: 2px;
  transition: .2s all;

}
.org-item-container:hover {
  background-color: #eaeaea;
  transition: .2s all;
  cursor: pointer;
}
.org-logo {
  margin-right: 16px;
}
</style>