<template>
    <q-dialog v-model="modal" @hide="onClose" :content-css="{width: 'auto', height: 'fit-content', background: 'transparent', boxShadow: 'none'}">
      <q-card style="overflow: visible; border-radius: 11px;">
        <q-card-section style="min-height: 150px;width: 300px;" class="q-px-none q-py-sm">
          <div class="tip-bulb">
              <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
          </div>
          <div class="bg-white q-mt-lg">
              <div class="row justify-center">
                <div class="col-12 text-center q-pa-md tip-desc">
                  <h6 class="q-my-none q-mb-md">{{$t('reply')}}</h6>
                  <q-input v-model="reply" type="textarea" placeholder="Type your reply here..." class="input" borderless></q-input>
                </div>
              </div>
              <div class='full-width q-px-md'>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary" :loading="loader" :label="$t('reply')" @click="onSubmit" ></q-btn>
                <q-btn class="full-width text-capitalize q-my-sm" color="primary" outline :label="$t('close')" @click="onClose"></q-btn>
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
    reviewReply: {
      default: null
    },
    reviewInfo: {
      type: Object,
      required: true
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      modal: false,
      reply: this.reviewReply,
      loader: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    },
    reviewReply (info) {
      this.reply = info
    }
  },
  methods: {
    onSubmit () {
      this.loader = true
      //  this.$emit('on-reply', this.reply)
      let info = {
        'reviewInfo': {
          'serviceUserReviewReply': this.reply
        }
      }

      this.$axios.put(`/users/${this.$store.state.user.uuid}/services/${this.$route.params.listingId}/reviews/${this.reviewInfo.id}/reply`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('reply-submitted', info)
      }).catch(error => {
        console.error(error)
      }).finally(_ => {
        this.loader = false
        this.onClose()
      })
    },
    onClose () {
      this.$emit('on-close', false)
    }
  }
}
</script>
