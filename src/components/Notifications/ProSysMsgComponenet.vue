<template>
  <div class="row justify-center q-px-md q-mt-md">
    <div v-if="notificationInfo" class="col-xs-12 col-md-6 col-xl-5 q-pb-xl">
      <div v-html="notificationInfo.content" class="q-pb-xl" style="min-height: 400px;"></div>

      <!-- Navigation Buttons from notification-->
      <div v-if="this.notificationInfo.destinationId !== '' || this.notificationInfo.destinationUrl !== ''">
        <q-btn class="q-mt-md q-mx-auto text-capitalize" style="font-size: 21px;" color="primary" :label="notificationInfo.buttonTitle" v-if="$q.platform.is.desktop" @click="onButtonClick"></q-btn>
        <q-btn class="q-mt-md q-mx-auto fixed-bottom full-width q-pt-xs q-pb-sm text-capitalize" style="font-size: 21px;" color="primary" :label="notificationInfo.buttonTitle" v-else-if="notificationInfo.buttonType !== 0" @click="onButtonClick"></q-btn>
      </div>

      <!-- Back Button for desktop -->
      <q-btn outline class="q-mt-lg q-mx-auto" color="primary" :label="'BACK TO NOTIFICATION LIST'" @click="handleClickButtonOfDetailedNotification" v-if="$q.platform.is.desktop"></q-btn>
    </div>
    <div v-else class="col-12 q-py-lg">
      <ComponentPreLoader></ComponentPreLoader>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    notificationInfo: {
      required: true
    }
  },
  methods: {
    onButtonClick () {
      switch (this.notificationInfo.buttonType) {
        // open url/deeplink
        case 1: this.openUrl(this.notificationInfo.destinationUrl); break

        // redirect to open voucher dialog
        case 2: {
          setTimeout(() => {
            this.$store.commit('user/updateUserCurrentMobileTab', 'navbar.profile')
          }, 120)
          this.$router.replace({name: 'MobileDashboard', query: {voucher: 1}})
          break
        }

        // redirect to chat request/job
        case 4: {
          let destinationId = this.notificationInfo.destinationId.toString()
          let id = destinationId.substring(1, destinationId.length)
          let type = destinationId.substring(0, 1)

          if (type === '2') {
            this.$router.replace({name: 'JobChat', params: {taskId: parseInt(id)}})
          } else if (type === '1') {
            this.$router.replace({name: 'Chat', params: {request: 0, response: parseInt(id)}})
          }
          break
        }

        // redirect to wallet
        case 5: this.$router.push({name: 'AccountHistory'}); break

        // redirect to app store for update or review
        case 6:
        case 7:
          if (this.$q.platform.is.ios) {
            this.openUrl(`https://itunes.apple.com/app/id1168037472`, '_system')
          } else if (this.$q.platform.is.android) {
            this.openUrl(`https://play.google.com/store/apps/details?id=com.petbacker.android`, '_system')
          }
          break

        // redirect to summary request/job
        case 8: {
          let destinationId = this.notificationInfo.destinationId.toString()
          let id = destinationId.substring(1, destinationId.length)
          let type = destinationId.substring(0, 1)

          if (type === '2') {
            this.$router.replace({name: 'JobSummary', params: {taskId: parseInt(id)}})
          } else if (type === '1') {
            this.$router.replace({name: 'RequestSummary', params: {requestId: parseInt(id)}})
          }
          break
        }

        // redirect to request/job list
        case 9: {
          let destinationId = this.notificationInfo.destinationId.toString()
          let type = destinationId.substring(0, 1)

          if (type === '2') {
            setTimeout(() => {
              this.$store.commit('user/updateUserCurrentMobileTab', 'mobile.navbar.jobs')
            }, 0)
          } else if (type === '1') {
            setTimeout(() => {
              this.$store.commit('user/updateUserCurrentMobileTab', 'mobile.navbar.requests')
            }, 0)
          }
          this.$router.replace({name: 'MobileDashboard'})
          break
        }
      }
    },
    handleClickButtonOfDetailedNotification () {
      this.$router.go(-1)
    }
  }
}
</script>
