<template>
    <q-dialog v-model="deactivateInfo" @hide="onClose">
        <q-card style="overflow: visible; max-width: 355px;">
          <q-card-section style="max-width:275px" class="q-pb-xs">
            <div class="protection-bulb">
              <img src="statics/images/for-your-protection.jpg" class="protection-bulb-image">
            </div>
            <div class="bg-white-self">
              <div class="row justify-center column">
                <p class="q-my-sm q-mt-lg text-center protection-title text-weight-bold"> {{$t('deactivate.account')}} </p>
              </div>
              <div class="row text-justify q-mt-md">
                <div class="col-md-12 text-justify protection-desc">
                  <span>{{$t('deactivate.account.msg')}}</span>
                </div>
              </div>
              <div class="row q-mt-md">
                <div class="full-width q-mb-sm">
                  <q-btn class="full-width text-weight-bold deactivate-account-btn" @click="onDeactivateAccount()" color="negative" outline :label="$t('deactivate.account')" />
                </div>
                <div class="full-width q-my-sm">
                  <q-btn class="full-width text-weight-bold" color="primary" :label="$t('not.now')" @click="onClose" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    reason: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      deactivateInfo: false
    }
  },
  watch: {
    trigger (value) {
      this.deactivateInfo = value
    }
  },
  methods: {
    onClose () {
      this.$emit('on-close', false)
    },
    onDeactivateAccount (reasons = null) {
      let payload = {
        'accountInfo': {
          'reason': reasons || this.reason
        }
      }

      this.$q.loading.show({spinnerColor: 'primary', backgroundColor: 'white'})
      this.$axios.post(`account/${this.$store.state.user.uuid}/deactivation-reasons`, payload, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
      }).catch(error => {
        console.log(error)
        if (error.response && error.response.data) {
          this.$q.notify({
            message: error.response.data.message,
            type: 'negative'
          })
        } else {
          this.$q.notify({
            message: 'deactivation error',
            type: 'negative'
          })
        }
      }).finally(_ => {
        this.deleteAccount()
      })
    },
    deleteAccount () {
      this.$axios.delete(`account/${this.$store.state.user.uuid}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        this.$q.notify({
          message: this.$t('account.deactivated'),
          type: 'positive',
          position: 'top'
        })
        this.$router.replace({name: 'Logout'})
      }).catch(error => {
        console.log(error)
        if (error.response && error.response.data) {
          this.$q.notify({
            message: error.response.data.message,
            type: 'negative'
          })
        } else {
          this.$q.notify({
            message: 'deactivation error',
            type: 'negative'
          })
        }
      }).finally(_ => {
        this.$q.loading.hide()
        this.onClose()
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.protection-bulb
  position: absolute
  top: 0
  left: calc(50% - 35px)
  padding: 10px
  background:  #fff
  width: 70px
  border-radius: 50%
  margin-top: -35px
.protection-bulb-image
  width: 50px

.protection-desc
  font-size: 16px
  color: #111

.protection-title
  font-size 20px
  color: #444

.not-now-button
  opacity 0.3
</style>
