<template>
    <div>
        <q-item @click.native="triggerScreenshotModal(true)">
            <q-item-section thumbnail>
                <img :src="walkInfo.mediaFileName" style="height: 85px; width: 85px;" class="image-upload"/>
            </q-item-section>

            <q-item-section>
                <q-item-label class="text-weight-bold font-normal">
                    {{formatTime(walkInfo.endTime)}}
                </q-item-label>

                <q-item-label v-if="walkInfo.personalItems.length > 0" class="row q-ml-md">
                    <q-img class="image-upload col-2" v-for="index in (walkInfo.personalItems.length > 3 ? 3 : walkInfo.personalItems.length)" :src="walkInfo.personalItems[index - 1].mediaInfo[0].filePath" style="border-radius: 50px;margin-left: -16px;height: 35px;width: 35px;" :key="walkInfo.personalItems[index - 1].id"></q-img>
                    <span class="col-2 q-ml-xs text-secondary" style="margin-top: 5%;" v-if="walkInfo.personalItems.length > 3">+{{walkInfo.personalItems.length - 3}}</span>
                </q-item-label>

                <q-item-label class="row">
                    <!-- Walk Duration -->
                    <q-badge color="positive" v-if="cachedInfo && cachedInfo.walkDuration && cachedInfo.walkDuration.seconds > 0" class="q-pa-xs q-px-md q-mr-xs text-weight-bold" style="border-radius: 20px;">
                    {{formatWalkDuration((cachedInfo.walkDuration.hours * 3600) + (cachedInfo.walkDuration.minutes * 60) + cachedInfo.walkDuration.seconds)}}
                    </q-badge>
                    <q-badge color="positive" v-else-if="walkInfo.walkDuration" class="q-pa-xs q-px-md q-mr-xs text-weight-bold" style="border-radius: 20px;">
                    {{formatWalkDuration(walkInfo.walkDuration)}}
                    </q-badge>

                    <!-- Walk Distance -->
                    <q-badge color="positive" v-if="(cachedInfo && parseFloat(cachedInfo.trackDistance) > 0) || (walkInfo && parseFloat(walkInfo.trackDistance) > 0)" class="q-pa-xs q-px-sm q-mr-xs text-weight-bold" style="border-radius: 20px;">
                    {{cachedInfo ? cachedInfo.trackDistance : walkInfo.trackDistance}} km
                    </q-badge>

                    <!-- Num of poo -->
                    <q-badge color="white" v-if="cachedInfo ? cachedInfo.pooCount : walkInfo.pooCount" class="q-pa-xs q-mr-xs text-black font-normal">
                    💩{{cachedInfo ? cachedInfo.pooCount : walkInfo.pooCount}}
                    </q-badge>

                    <!-- Num of pee -->
                    <q-badge color="white" v-if="cachedInfo ? cachedInfo.peeCount : walkInfo.peeCount" class="q-pa-xs q-mr-xs text-black font-normal">
                    <q-icon name="opacity" class="q-pa-none" color="yellow" size="17px"></q-icon>{{cachedInfo ? cachedInfo.peeCount : walkInfo.peeCount}}
                    </q-badge>
                </q-item-label>
            </q-item-section>

            <q-item-section side style="padding-left: 0px;">
                <q-icon name="chevron_right"></q-icon>
            </q-item-section>
        </q-item>
        <q-separator></q-separator>

        <!-- Dialog View ScreenShot -->
        <dialog-view-screenshot :trigger="viewScreenshotModal" :walkId="walkInfo.id" :imageUrl="walkInfo.mediaFileName" @on-close="triggerScreenshotModal"></dialog-view-screenshot>
    </div>
</template>
<script>
import moment from 'moment'
export default {
  components: {
    'dialog-view-screenshot': () => import('components/DogWalk/DialogViewScreenshot.vue')
  },
  props: {
    walkInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      viewScreenshotModal: false,
      cachedInfo: null
    }
  },
  created () {
    this.checkCachedData()
  },
  methods: {
    formatTime (timestamp) {
      return moment.utc(timestamp).local().format('MMM DD, YYYY')
    },
    checkCachedData () {
      if (this.$q.localStorage.has('petWalks') && this.$q.localStorage.getItem('petWalks')[this.walkInfo.id.toString()]) {
        this.cachedInfo = this.$q.localStorage.getItem('petWalks')[this.walkInfo.id.toString()]
      }
    },
    formatWalkDuration (duration) {
      // compute hours
      let hours = duration / 3600
      duration = duration % (3600)

      // compute minutes
      let min = parseInt(duration / 60)
      duration = duration % (60)

      // compute seconds
      let sec = parseInt(duration)

      if (sec < 10) {
        sec = `${sec}`
      }
      if (min < 10) {
        min = `${min}`
      }

      // format time to string
      if (parseInt(hours, 10) > 0) {
        return (`${parseInt(hours, 10)}h ${min}m ${sec}s`)
      } else if (parseInt(min, 10) > 0) {
        return (`${min}m ${sec}s`)
      } else {
        return (`${sec}s`)
      }
    },
    triggerScreenshotModal (status) {
      // prevent opening if no image available
      // instead should open back this pending/pause walk and resume to dog walking screen
      if (status && this.walkInfo.mediaFileName === null) {
        // check for dog walk availability cache
        if (this.$q.localStorage.has('petWalks') && this.$q.localStorage.getItem('petWalks')[this.walkInfo.id.toString()]) {
          this.$q.localStorage.set('dogWalkInfo', this.$q.localStorage.getItem('petWalks')[this.walkInfo.id.toString()])
          this.$router.push({name: 'DogWalk'})
        }

        return
      }

      this.viewScreenshotModal = status
    }
  }
}
</script>
