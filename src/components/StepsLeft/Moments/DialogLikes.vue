<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="this.$q.platform.is.mobile" :persistent="this.$q.platform.is.mobile" :transition-show="this.$q.platform.is.mobile ? 'slide-left' : ''" :transition-hide="this.$q.platform.is.mobile ? 'slide-right' : ''">
        <q-card :style="{'min-height': this.$q.platform.is.desktop ? '600px' : '', 'max-height': this.$q.platform.is.desktop ? '800px' : ''}">
            <q-toolbar style="z-index: 5000;" class="borderline">
                <q-btn flat round dense v-close-popup icon="chevron_left" size="1.3em"/>
                <!-- Header Title -->
                <q-toolbar-title v-close-popup>
                    <h6 class="q-my-none" style="margin-left: 36%;">Likes</h6>
                </q-toolbar-title>
            </q-toolbar>
            <q-card-section v-if="usersInfo !== null" class="q-pa-none" :style="{'min-height': this.$q.platform.is.desktop ? '520px' : ''}">
                <h6 class="text-center q-my-sm">
                    <q-icon name="fas fa-heart" color="primary"></q-icon>
                    {{likeCount}}
                </h6>

                <div v-if="usersInfo.length > 0">
                    <div v-for="user in usersInfo" :key="user.id">
                        <q-item dense>
                            <!-- Avatar-->
                            <q-item-section avatar @click="openBackerProfile(user.user.uuid)">
                                <q-avatar >
                                <img :src="user.user.avatarImage" class="responsive profile-img"/>
                                </q-avatar>
                            </q-item-section>
                            <!-- User's name and comment -->
                            <q-item-section>
                                <q-item-label lines="1" class="text-weight-medium" @click="openBackerProfile(user.user.uuid)">{{user.user.standard_username}}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-separator spaced inset="item" />
                    </div>
                </div>
            </q-card-section>
            <div class="justified text-center" v-else ref="preLoader" :style="{'min-height': $q.platform.is.desktop ? '520px' : ''}">
                <ComponentPreLoader></ComponentPreLoader>
            </div>
        </q-card>
    </q-dialog>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      default: false
    },
    momentId: {
      default: null
    },
    likes: {
      type: String,
      default: '0'
    }
  },
  data () {
    return {
      modal: false,
      usersInfo: null,
      likeCount: 0
    }
  },
  watch: {
    trigger (status) {
      this.modal = status

      if (status) {
        this.getMomentLikes()

        if (this.likeCount === 0) {
          this.likeCount = this.likes
        }
      }
    }
  },
  methods: {
    openBackerProfile (userUUID) {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.$emit('trigger-login-signup', 'ViewPublicProfile')
        return
      }

      this.$router.push({name: 'PublicProfile', params: {userId: userUUID}})
    },
    getMomentLikes () {
      this.$axios.get(`moments/${this.momentId}/likes`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.likeCount = response.data.data.length
        this.usersInfo = response.data.data
      }).catch((error) => {
        console.log(error)
      })
    },
    onClose () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
