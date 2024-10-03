<template>
    <q-page>
        <div v-if="blockInfo">
            <q-item class="input q-my-sm q-mx-sm" v-for="userInfo in blockInfo" :key="userInfo.blocked_user_id">
                <q-item-section avatar>
                    <q-avatar style="width: 55px;height: 55px;">
                        <q-img src="https://placeimg.com/100/100/nature" class="image-upload" basic></q-img>
                    </q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{userInfo.blocked_user_id}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-btn class="text-capitalize" :ripple="false" style="border-radius: 12px;" @click="onUnblock(userInfo.blocked_user_id)" outline label="Unblock"></q-btn>
                </q-item-section>
            </q-item>
        </div>
        <div class="text-center" v-else>
          <ComponentPreLoader></ComponentPreLoader>
        </div>

        <!-- Confirmation Dialog -->
        <q-dialog v-model="confirmationModal" persistent="true">
            <q-card style="overflow: visible; border-radius: 11px;">
                <q-card-section style="min-height: 150px;max-width: 300px;" class="q-px-none q-py-sm">
                <div class="tip-bulb">
                    <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
                </div>
                <div class="bg-white q-mt-md">
                    <div class="row justify-center">
                        <div class="col-12 text-center q-pa-md tip-desc">
                            <h6 class="q-my-none q-mb-sm">Unblock {{unblockUuid}}?</h6>
                            <p class="q-my-none">{{unblockUuid}} will now be able to chat with you, comment, review or request your services. You may start receiving requests and messages from this user. They won't be notified that you blocked them.</p>
                        </div>
                    </div>
                    <div class='full-width q-px-md'>
                        <q-btn class="full-width text-capitalize q-my-sm" :loading="loader" color="primary" label="Unblock" @click="unblockUser" ></q-btn>
                        <q-btn class="full-width text-capitalize q-my-sm" color="primary" flat v-close-popup :label="$t('cancel')"></q-btn>
                    </div>
                </div>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
  data () {
    return {
      blockInfo: null,
      loader: false,
      confirmationModal: false,
      unblockUuid: null
    }
  },
  created () {
    this.getBlockInfo()
  },
  methods: {
    getBlockInfo () {
      this.$axios.get(`users/${this.$store.state.user.uuid}/blocks`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.blockInfo = response.data.userBlockInfo[0]
      }).catch(error => {
        console.error(error)
      })
    },
    onUnblock (uuid) {
      this.unblockUuid = uuid
      this.confirmationModal = true
    },
    unblockUser () {
      this.loader = true
      let blockInfo = {
        'blockInfo': {
          'uuid': this.unblockUuid
        }
      }

      this.$axios.delete(`users/${this.$store.state.user.uuid}/blocks`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        },
        data: blockInfo
      }).then((response) => {
        this.blockInfo = response.data.userBlockInfo[0]
      }).catch(error => {
        console.error(error)
      }).finally(_ => {
        this.confirmationModal = false
        this.loader = false
        this.unblockUuid = null
      })
    }
  }
}
</script>
