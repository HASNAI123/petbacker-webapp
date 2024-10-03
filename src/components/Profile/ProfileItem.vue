<template>
    <div>
        <q-item dense class="q-ma-xs">
            <!-- Avatar-->
            <q-item-section avatar @click="toProfile">
                <q-avatar style="width: 48px;height: 48px;">
                    <img style="width: 48px;height: 48px;" :src="userInfo.avatarImage" class="responsive profile-img"/>
                </q-avatar>
            </q-item-section>

            <!-- User's name -->
            <q-item-section>
                <q-item-label lines="1" class="text-weight-medium" @click="toProfile">
                    {{userInfo.standard_username}}
                </q-item-label>
            </q-item-section>

            <q-item-section side v-if="userInfo.id !== $store.getters['user/getUserUuidState']">
                <q-btn v-if="userInfo.isFollowing" :loading="btnLoader" :label="$t('following')" outline color="primary" class="text-capitalize q-px-xl" style="width: 120px;" dense @click="onUnfollow"></q-btn>
                <q-btn v-else :label="userInfo.isFollowed ? $t('follow.back') : $t('follow')" :loading="btnLoader" color="primary" class="text-capitalize" style="width: 120px;" dense @click="onFollow"></q-btn>
            </q-item-section>
        </q-item>
        <q-separator spaced inset="item"></q-separator>
    </div>
</template>
<script>
export default {
  props: {
    userInfo: {
      type: Object,
      require: true
    },
    index: {
      type: Number,
      require: true
    }
  },
  data () {
    return {
      btnLoader: false
    }
  },
  methods: {
    toProfile () {
      if (this.userInfo.id === this.$store.getters['user/getUserUuidState']) {
        return
      }

      this.$router.push({name: 'PublicProfile', params: {userId: this.userInfo.id}})
    },
    onUnfollow () {
      this.btnLoader = true
      this.$axios.delete(`moments/user/${this.userInfo.id}/follow`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('on-follow-status-change', false, this.index)
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.btnLoader = false
      })
    },
    onFollow () {
      this.btnLoader = true
      this.$axios.post(`moments/user/${this.userInfo.id}/follow`, {}, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('on-follow-status-change', true, this.index)
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.btnLoader = false
      })
    }
  }
}
</script>
