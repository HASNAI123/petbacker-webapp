<template>
    <div>
        <q-item class="q-ml-md q-mr-xs q-mb-xs" dense>
            <!-- Reviewer avatar -->

  <q-avatar style="height: 50px; width: 50px; margin-right: 10px; ">
    <img :src="reviewInfo.items[index - 1].userInfo.avatarImage" class="image-upload" style="" />
  </q-avatar>

            <!-- Reviewer username & rating -->
            <q-item-section >
              <q-item-label lines="1">
                <span class="text-weight-bold text-capitalize">{{reviewInfo.items[index - 1].userInfo.username}}</span>
                <span class="float-right text-grey-8 font-x-small">{{formatDate(reviewInfo.items[index - 1].reviewDate)}}</span>
              </q-item-label>

              <q-item-label>
                <q-icon name="fas fa-star" style="font-size: 12px;" class="star-color q-mr-xs" v-for="i in reviewInfo.items[index - 1].rating" :key="i"></q-icon>
                <span class="float-right font-x-small text-grey-6" v-if="reviewInfo.items[index - 1].verified === 0">{{$t('unverified')}}</span>
                <span class="float-right font-x-small text-negative" v-else-if="reviewInfo.items[index - 1].verified === 1">{{$t('review.petbacker.verified')}}<q-icon class="q-ml-xs" style="font-size: 9px;padding-bottom: 1%;" name="fas fa-check-circle"></q-icon></span>
                <span class="float-right font-x-small text-positive" v-else-if="reviewInfo.items[index - 1].verified === 2">{{$t('review.for.pet')}}</span>
              </q-item-label>

              <!-- Reviewer comment -->
              <q-item-label class="q-pt-xs">
                {{reviewInfo.items[index - 1].comment}}
              </q-item-label>

              <!-- Reply Button -->
              <q-item-label v-if="showReply" @click="triggerReplyModal(true)">
                <p class="q-my-none q-mt-xs text-grey-7" :ripply="false">{{$t('reply')}}</p>
              </q-item-label>
            </q-item-section>

            <!-- <q-item-section side top>
                <q-item-label caption>{{formatDate(reviewInfo.items[index - 1].reviewDate)}}</q-item-label>
            </q-item-section> -->
        </q-item>

        <!-- Reply to this review -->
        <q-item class="q-mx-sm q-mx-lg q-mt-md q-mb-xs q-ml-xl" dense v-if="replyInfo">
          <!-- Reviewer avatar -->
          <q-item-section thumbnail @click="$router.push({name: 'PublicProfile', params: {userId: reviewInfo.items[index - 1].userInfo.id}})">
              <q-avatar style="height:50px; width: 50px;">
                <q-img :src="reviewInfo.revieweeInfo.avatarImage" class="image-upload"></q-img>
              </q-avatar>
          </q-item-section>

          <!-- Reviewer username & rating -->
          <q-item-section >
            <q-item-label lines="1" class="q-mb-sm">
              <span class="text-weight-bold text-capitalize">{{reviewInfo.revieweeInfo.username}}</span>
              <span class="float-right text-grey-8 font-x-small">{{formatDate(reviewInfo.items[index - 1].reviewDate)}}</span>
            </q-item-label>
           <!--  {{ reviewInfo.revieweeInfo.reviewDate }} -->
            <q-item-label>{{replyInfo}}</q-item-label>
          </q-item-section>
          <!-- <q-item-section side top>
              <q-item-label caption>{{formatDate(reviewInfo.items[index - 1].reviewDate)}}</q-item-label>
          </q-item-section> -->
        </q-item>

        <q-separator inset class="q-my-md" v-if="!hideSeparator" />

        <!-- Dialog Reply Review -->
        <dialog-reply v-if="showReply" :trigger="replyModal" :reviewReply="replyInfo" :reviewInfo="reviewInfo.items[index - 1]" :index="index" @on-close="triggerReplyModal" @reply-submitted="onReplySubmit"></dialog-reply>
    </div>
</template>
<script>
import moment from 'moment'
export default {
  components: {
    'dialog-reply': () => import('components/Listing/DialogReplyReview.vue')
  },
  data () {
    return {
      replyModal: false,
      replyInfo: null
    }
  },
  props: {
    reviewInfo: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    hideSeparator: {
      type: Boolean,
      default: false
    },
    showReply: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    console.log('Check review info', this.reviewInfo.items)
    if (this.reviewInfo) {
      this.replyInfo = this.reviewInfo.items[this.index - 1].reply
    }
  },
  methods: {
    onReplySubmit (replyInfo) {
      this.replyInfo = replyInfo.reviewInfo.serviceUserReviewReply
    },
    triggerReplyModal (status) {
      this.replyModal = status
    },
    formatDate (date) {
      let locale = this.$store.getters['user/getCurrentLanguage']
      switch (locale) {
        case 'en': locale = 'en'; break
        case 'zh_tw': locale = 'zh-tw'; break
        case 'msmy': locale = 'ms-my'; break
        case 'eses': locale = 'es'; break
        case 'jajp': locale = 'ja'; break
        case 'dede': locale = 'de'; break
        case 'zh_cn': locale = 'zh-cn'; break
        case 'thth': locale = 'th'; break
        case 'frfr': locale = 'fr'; break
        case 'ptpt': locale = 'pt'; break
        case 'nlnl': locale = 'nl'; break
        case 'idid': locale = 'id'; break
        case 'sksk': locale = 'sk'; break
        case 'he': locale = 'he'; break
        case 'itit': locale = 'it'; break
        case 'cscz': locale = 'cs'; break
        case 'zh_hk': locale = 'zh-hk'; break
        case 'elel': locale = 'el'; break
      }
      return moment.utc(date).locale(locale).local().format('MMMM YYYY')
    }
  }
}
</script>
