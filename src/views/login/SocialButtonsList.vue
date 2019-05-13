
<template>
  <div class="authing-oauth-form">
    <div style="height: 60px;" v-show="socialButtonsListLoading">
      <div class="authing-loading-circle margin-top-11"></div>
    </div>

    <SocialButton
      v-for="(item) in socialButtonsList"
      :key="item._id"
      :name="item.description"
      :icon="socialButtonsThemes[item.alias].icon"
      :iconStyle="socialButtonsThemes[item.alias].iconStyle"
      :buttonStyle="socialButtonsThemes[item.alias].buttonStyle"
      :url="item.url"
      class="_authing_form-group"
    />
  </div>
</template>
<script>
import SocialButton from "../components/SocialButton";
import { mapGetters } from "vuex";
import themes from "../themes/themes";

export default {
  name: "SocialButtonsList",
  components: {
    SocialButton
  },
  data() {
    return {
      socialButtonsThemes: themes.socialButton
    };
  },
  computed: {
    ...mapGetters("loading", { socialButtonsListLoading: "socialButtonsList" }),
    ...mapGetters("data", { socialButtonsList: "socialButtonsList" })
  }
};
</script>
<style scoped>
</style>
