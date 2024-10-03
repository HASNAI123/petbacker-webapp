<template>
   <div>
        <q-dialog v-model="modal" :content-css="{width: 'auto', height: 'fit-content', background: 'transparent', boxShadow: 'none'}" @hide="onClose">
            <q-card style="overflow: visible;border-radius: 20px;max-width: 320px;" class="q-pb-none">
                <q-card-section style="min-height: 150px;" class="q-pb-none">
                <div class="tip-bulb">
                    <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
                </div>
                <div class="bg-white q-mt-sm">
                    <div class="row justify-center">
                        <div class="col-12 text-center q-px-sm q-pt-sm tip-desc">
                          <h6 class="q-my-none q-my-sm">{{$t('rate.petbacker.title')}}</h6>
                          <p class="q-my-none">{{$t('rate.petbacker.subtitle')}}</p>
                        </div>
                    </div>
                    <div class="row justify-center q-pa-md">
                        <q-rating v-model="rating" color="grey" color-selected="yellow" size="2.3em"></q-rating>
                    </div>
                    <div class="full-width">
                        <q-btn class="full-width q-mb-md" color="primary" @click="onReview">{{$t('chat.reviewnow')}}</q-btn>
                        <q-btn class="full-width q-mb-md text-primary" flat color="primary" @click="onClose">{{$t('button.not.now')}}</q-btn>
                    </div>
                </div>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Input Review Pop Up -->
        <q-dialog v-model="inputReviewModal" :maximized="$q.platform.is.mobile" :content-css="{width: 'auto', height: 'fit-content', background: 'transparent', boxShadow: 'none'}" transition-show="slide-up" transition-hide="slide-down">
            <q-card>
                <q-toolbar style="border-bottom: 1px solid lightgrey;">
                    <q-btn flat round dense v-close-popup icon="close"></q-btn>
                    <q-toolbar-title v-close-popup>
                        <h6 class="q-my-none" style="margin-left: 32%;">{{ $t('write.a.review') }}</h6>
                    </q-toolbar-title>
                    <q-btn :label="$t('send')" flat color="primary" @click="onSend"></q-btn>
                </q-toolbar>

                <!-- Ratings -->
                <q-card-section class="text-center">
                    <q-rating v-model="rating" color="grey" color-selected="yellow" size="2.3em"></q-rating>
                    <p class="q-my-none q-mt-sm text-grey-5">Tap Star To Rate</p>
                </q-card-section>

                <!-- Input review -->
                <q-card-section>
                    <q-input v-model="inputReview" type="textarea" borderless class="input" placeholder="Review (Optional)"></q-input>
                </q-card-section>
            </q-card>
        </q-dialog>
   </div>
</template>
<script>
import chatMixin from '../mixins/chatMixin'
export default {
  mixins: [chatMixin],
  props: {
    trigger: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      rating: 4,
      inputReviewModal: false,
      inputReview: null
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  methods: {
    onClose () {
      this.$emit('on-close', false)
    },
    onReview () {
      // redirect app store review on 5 star review
      // else just submit to support
      if (this.rating === 5) {
        if (this.$q.platform.is.ios) {
          this.openUrl(`https://itunes.apple.com/app/id1168037472`, '_system')
        } else if (this.$q.platform.is.android) {
          this.openUrl(`https://play.google.com/store/apps/details?id=com.petbacker.android`, '_system')
        }
      } else {
        this.inputReviewModal = true
      }

      this.onClose()
    },
    onSend () {
      // submit review to support
      this.messageBox = this.inputReview
      this.sendSupportMessage()

      // reset review
      this.inputReviewModal = false
      this.inputReview = null
      this.rating = 0
    }
  }
}
</script>
