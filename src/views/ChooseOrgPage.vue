<template>
  <div id="_authing_login_form" v-show="orgs.length">
    <div class="authing-loading-circle screen-center" v-if="pageLoading"></div>
    <div class="authing-cover-layer" v-if="$parent.isMountedInModal"></div>
    <div
      class="_authing_container"
      id="_authing_login_form_content"
      :class="{
        hide: pageLoading,
        'authing-login-form-modal': $parent.isMountedInModal
      }"
    >
    
      <div class="authing-login-form-wrapper" :class="{ 'z-index1000': $parent.isMountedInModal }">
        <div
          class="_authing_form-wrapper"
          :class="{
            animated: true,
            fast: true,
          }"
        >
          <div class="_authing_form-header">
            <div class="_authing_form-header-bg"></div>
            <div class="_authing_form-header-welcome">
              <img class="form-header-logo" :src="appInfo.image" />
              <div class="_authing_form-header-name" title="Authing">{{ appInfo.name }}</div>
            </div>
          </div>

          <!-- <GlobalMessage v-show="globalMessage" :message="globalMessage" :type="globalMessageType" /> -->
          <form class="authing-form form-body no-shadow choose-org-body">
            <div class="hint">请选择组织与角色</div>

            <OrgItem
              v-for="item in orgs"
              :key="item.orgId"
              :org-name="item.orgMame"
              :role-name="item.roleName"
              style="margin-bottom: 8px;"
              @click.native="handleChooseOrg(item)"
            />
          </form>
          <!-- <div class="authing-loading-circle" v-show="formLoading"></div> -->
          <!-- <div class="_authing_form-footer login">
            <button class="btn btn-primary" @click="handleCompleteInfo">
              <span v-show="!formLoading">确定</span>
            </button>
          </div>-->
          <!-- <div class="_authing_form-footer-non-up" v-show="opts.hideUP"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import OrgItem from "./components/Org";
import axios from "axios";
export default {
  name: "ChooseOrg",
  components: {
    OrgItem,
  },
  data() {
    return {
      orgs: [],
      pageLoading: false,
    };
  },
  async mounted() {
    this.opts = this.$root.$data.$authing.opts;
    const api = "https://core.teamory.cn/api/v1/get_user_orgs";
    let token = localStorage.getItem("_authing_token");
    let orgsResult = await axios.get(api, {
      headers: {
        authorization: token,
      },
    });
    this.orgs = orgsResult.data;
    let tmp = [];
    this.orgs.map((item) => {
      item.roles.map((role) => {
        tmp.push({
          orgId: item.org._id,
          orgMame: item.org.rootNode.name,
          roleName: role.name,
          roleId: role._id
        });
      });
    });
    this.orgs = tmp
    // 如果用户没有多个组织，就直接跳走
    if (this.orgs.length <= 1) {
      this.handleProtocolProcess({ router: this.$router });
    }
  },
  computed: {
    ...mapGetters("data", ["appInfo", "userInfo", "isLogged"]),
    ...mapGetters("protocol", ["protocol", "params"]),
    ...mapGetters("loading", {
      formLoading: "form",
    }),
  },
  methods: {
    ...mapActions("protocol", ["handleProtocolProcess"]),
    async handleChooseOrg(org) {
      const api = "https://core.teamory.cn/api/v1/choose_user_org";
      let token = localStorage.getItem("_authing_token");

      await axios.post(
        api,
        { roleId: org.roleId, orgId: org.orgId },
        { headers: { authorization: token } }
      );
      this.handleProtocolProcess({ router: this.$router });
    },
  },
};
</script>
<style scoped>
.hint {
  font-size: 14px;
  margin-bottom: 16px;
}
.choose-org-body {
  border-radius: 0 0 4px 4px;
  padding-bottom: 24px;
}
</style>