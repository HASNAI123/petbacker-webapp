<template>
    <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-right" transition-show="slide-left">
        <q-card>
            <!-- Header -->
            <q-toolbar ref="rewards-navbar" style="border-bottom: 1px solid lightgrey;z-index: 6000;" class="fixed-top bg-white row">
                <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
            </q-toolbar>

            <q-card-section class="q-pt-xl q-px-none">
              <q-img v-if="rewardInfo && rewardInfo.image" :src="rewardInfo.image" placeholder-src="statics/images/graphic-placeholder.jpg" class="image-upload" width="100%" height="250px"></q-img>
              <q-skeleton v-else height="250px" width="100%"></q-skeleton>
            </q-card-section>

            <q-card-section v-if="rewardInfo && rewardInfo.referenceCode && rewardInfo.expiryDate" class="q-px-md text-grey-7">
              <p v-if="rewardInfo.referenceCode"><q-icon color="primary" size="1.5em" name="confirmation_number" class="q-mr-sm"></q-icon> {{rewardInfo.referenceCode}}</p>
              <p v-if="rewardInfo.expiryDate"><q-icon color="primary" size="1.5em" name="schedule" class="q-mr-sm"></q-icon> Valid until {{rewardInfo.expiryDate}}</p>
            </q-card-section>

            <q-separator inset v-if="rewardInfo && rewardInfo.referenceCode && rewardInfo.expiryDate"></q-separator>

            <!-- Content -->
            <q-card-section v-if="rewardInfo" class="row justify-center q-px-md q-">
                <div class="col-xs-12 col-md-6 col-xl-5 q-pb-xl">
                    <div v-html="rewardInfo.content" class="q-pb-xl" style="min-height: 400px;"></div>

                    <!-- Navigation Buttons from notification-->
                    <div v-if="rewardInfo.destinationUrl && rewardInfo.destinationUrl !== ''">
                        <q-btn class="q-mt-md q-mx-auto text-capitalize" style="font-size: 21px;" color="primary" :label="rewardInfo.buttonTitle" v-if="$q.platform.is.desktop" @click="onButtonClick(rewardInfo.destinationUrl)"></q-btn>
                        <q-btn class="q-mt-md q-mx-auto fixed-bottom full-width q-pt-xs q-pb-sm text-capitalize" style="font-size: 21px;" color="primary" :label="rewardInfo.buttonTitle" v-else @click="onButtonClick(rewardInfo.destinationUrl)"></q-btn>
                    </div>
                </div>
            </q-card-section>
            <q-card-section v-else class="text-center q-py-xl">
                <ComponentPreLoader></ComponentPreLoader>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    trigger: {
      type: Boolean,
      require: true
    },
    rewardId: {
      type: Number,
      require: true,
      default: 0
    }
  },
  data () {
    return {
      modal: false,
      rewardInfo: null
    }
  },
  watch: {
    trigger (status) {
      this.modal = status

      if (status && !this.rewardInfo) {
        this.getRewardInfo()
      }
    }
  },
  methods: {
    formatTime (expiryDate) {
      return `${moment.utc(expiryDate).local().format('DD MMMM YYYY')}`
    },
    onButtonClick (url) {
      this.openUrl(url)
    },
    getRewardInfo () {
      this.$axios.get(`rewards/${this.rewardId}?country_id=${this.$store.getters['user/getUserPrefferedCurrency']}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 204) {
          this.closePopUp()
        } else {
          this.rewardInfo = response.data.rewardInfo
        }
      }).catch((error) => {
        if (error.response.status === 404 || error.response.status === 500) {
          this.closePopUp()
        }

        let errorMessage = this.$t('requests.error.title')
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message ? error.response.data.message : this.$t('requests.error.title')
        }

        this.$q.dialog({
          title: errorMessage,
          ok: {
            label: 'Contact Support',
            flat: true
          },
          cancel: {
            label: 'its okay',
            flat: true
          }
        }).onOk(data => {
          this.$router.push({name: 'ChatSupportHelp'})
        })

        this.forceLogout(error)
        console.log(error)
      })
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
