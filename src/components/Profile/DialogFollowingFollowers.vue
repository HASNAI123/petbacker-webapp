<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" transition-show="slide-left" transition-hide="slide-right">
      <q-card style="overflow: visible;">
        <!-- Header -->
        <q-toolbar style="z-index: 5000;" class="borderline fixed-top bg-white" >
            <q-btn q-btn flat dense v-close-popup icon="chevron_left" size="lg" class="q-pl-none"></q-btn>
        </q-toolbar>

        <q-card-section class="q-pa-none q-my-xl">
            <q-tabs v-model="tab" dense active-color="primary" @input="onTabChange" animated>
                <q-tab name="followers" :label="`${followersCount ? followersCount : ''} ${$t('followers')}`" class="text-capitalize"></q-tab>
                <q-tab name="followings" :label="`${followingsCount ? followingsCount : ''} ${$t('followings')}`" class="text-capitalize"></q-tab>
            </q-tabs>
            <q-separator></q-separator>

            <q-tab-panels v-model="tab" swipeable keep-alive :keep-alive-max="2" animated>
                <!-- Followers -->
                <q-tab-panel name="followers" class="q-pa-none">
                    <div v-if="followers">
                      <profile-item v-for="(user, index) in followers" :key="user.id" :index="index" :userInfo="user" @on-follow-status-change="onUpdateFollowStatus"></profile-item>
                      <div v-if="followers.length === 0" class="q-my-lg text-center" :class="$q.platform.is.mobile ? 'q-mx-lg' : ''" >
                          <img src="statics/images/logo-mid.jpg" class="image-upload q-mb-md" width="25%"/>
                          <p v-if="userUuid === $store.getters['user/getUserUuidState']" v-html="$t('empty.followers.description')"></p>
                          <p v-else>{{$t('empty.followers.description.others')}}</p>
                      </div>
                    </div>
                    <div v-else class="text-center">
                        <ComponentPreLoader></ComponentPreLoader>
                    </div>
                </q-tab-panel>

                <!-- Followings -->
                <q-tab-panel name="followings" class="q-pa-none">
                    <div v-if="followings">
                        <profile-item v-for="(user, index) in followings" :key="user.id" :index="index" :userInfo="user" @on-follow-status-change="onUpdateFollowStatus"></profile-item>
                        <div v-if="followings.length === 0" class="q-my-lg text-center" :class="$q.platform.is.mobile ? 'q-mx-lg' : ''" >
                            <img src="statics/images/logo-mid.jpg" class="image-upload q-mb-md" width="25%"/>
                            <p v-if="userUuid === $store.getters['user/getUserUuidState']" v-html="$t('empty.followings.description')"></p>
                            <p v-else v-html="$t('empty.followings.others.descriptions')"></p>
                        </div>
                    </div>
                    <div v-else class="text-center">
                        <ComponentPreLoader></ComponentPreLoader>
                    </div>
                </q-tab-panel>
            </q-tab-panels>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>
<script>
export default {
  components: {
    'profile-item': () => import('components/Profile/ProfileItem.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    active: {
      type: String,
      default: 'followers',
      required: true
    },
    userUuid: {
      type: String,
      require: true
    },
    followersCount: {
      type: Number
    },
    followingsCount: {
      type: Number
    }
  },
  data () {
    return {
      modal: false,
      tab: 'followers',
      followers: null,
      followings: null
    }
  },
  watch: {
    trigger (value) {
      this.modal = value

      if (value) {
        if (this.followers === null && this.active === 'followers') {
          this.getFollowers()
        }

        if (this.followings === null && this.active === 'followings') {
          this.getFollowings()
        }
      }
    },
    active (tabName) {
      this.tab = tabName
    }
  },
  methods: {
    onUpdateFollowStatus (status, index) {
      this.$emit('update-followings-count', status)
      if (this.tab === 'followers') {
        this.followers[index].isFollowing = (status ? 1 : 0)

        // refresh followings
        if (this.followings) {
          this.getFollowings()
        }
      } else if (this.tab === 'followings') {
        this.followings[index].isFollowing = (status ? 1 : 0)

        // refresh followers
        if (this.followers) {
          this.getFollowers()
        }
      }
    },
    onTabChange (currentTab) {
      if (this.followers === null && currentTab === 'followers') {
        this.getFollowers()
      }

      if (this.followings === null && currentTab === 'followings') {
        this.getFollowings()
      }
    },
    onClose () {
      this.modal = false
      this.$emit('on-close', false)
    },
    getFollowers () {
      this.$axios.get(`users/${this.userUuid}/followers`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 204) {
          this.followers = []
        } else {
          this.followers = response.data
        }
      }).catch((error) => {
        console.error(error)
      })
    },
    getFollowings () {
      this.$axios.get(`users/${this.userUuid}/following`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 204) {
          this.followings = []
        } else {
          this.followings = response.data
        }
      }).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>
