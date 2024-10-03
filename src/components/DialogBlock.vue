<template>
  <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-down" transition-show="slide-up">
    <q-card>
        <!-- Header -->
        <q-toolbar style="border-bottom: solid 1px lightgrey;">
            <q-toolbar-title v-close-popup style="margin-left: 36%;">
                <h6 class="q-my-none font-title">{{ title }}</h6>
            </q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup></q-btn>
        </q-toolbar>

        <q-card-section class="q-pa-none">
            <q-img src="statics/images/support-help.jpg"></q-img>
        </q-card-section>

        <q-card-section>
            <p class="text-grey-9 q-mt-md text-center">{{ description }}</p>
            <q-input v-model="blockReasons" type="textarea" :error="!isValid" class="input" borderless :label="$t('enter.block.reason')" stack-label></q-input>
        </q-card-section>
        <!-- Mobile bottom button -->
        <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;">
            <div class="q-pa-md q-pb-lg" @click="checkValid">
                <div class="text-white text-center cursor-pointer font-header-title q-pt-sm">
                    <span v-if="!showLoading">{{$t('block')}}</span>
                    <span v-else><q-spinner size="2em"></q-spinner></span>
                </div>
            </div>
        </div>

        <!-- Support Enquiry Submitted Dialog Box -->
        <q-dialog v-model="modalSubmitted">
          <q-card style="width: 360px;">
            <q-card-section>
              <div class="tip-bulb">
                  <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
              </div>
              <div class="bg-white-self">
                  <div class="row q-px-md column">
                  <div class="q-title q-pt-xl text-center tip-title">{{$t('app.footer.petbacker')}} </div>
                  </div>
                  <div class="row justify-center">
                    <div class="col-12 text-center q-pa-md tip-desc">
                        <span>{{$t('support_form_submitted_text')}}</span>
                    </div>
                  </div>
                  <div class='full-width q-px-md'>
                    <q-btn class="full-width" color="primary" :label="$t('ok')" @click.native="modalSubmitted=false;closePopUp()" />
                  </div>
                  <div class="row q-py-sm q-mx-auto">
                  </div>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      default: false,
      required: true
    },
    blockUserUuid: {
      required: true
    },
    type: {
      default: 'user'
    },
    momentId: {
      default: null
    }
  },
  data () {
    return {
      modal: false,
      showLoading: false,
      blockReasons: null,
      isValid: true,
      modalSubmitted: false,
      title: '',
      description: '',
      successMessage: '',
      emitText: '',
      blockvalue: ''
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    },
    blockUserUuid (newVal, oldVal) {
    console.log('blockUserUuid old value:', oldVal)
    this.blockvalue = oldVal
    console.log('blockUserUuid new value:', newVal)
    },
    blockReasons (value) {
      if (value !== null && value !== '' && value !== ' ') {
        this.isValid = true
      }
    }
  },
  mounted () {
    console.log('cehck the block id on mounted', this.blockUserUuid)
    switch (this.type) {
      case 'user':
      case 'listing':
        this.title = this.$t('block.account')
        this.description = this.$t('block.account.description')
        this.successMessage = this.$t('user.blocked.successful')
        this.emitText = 'on-block-user'
        break
      case 'pet':
      case 'moment':
        this.title = this.$t('block.post')
        this.description = this.$t('block.post.description')
        this.successMessage = this.$t('post.blocked.successful')
        this.emitText = 'on-block-moment'
        break
      default:
        this.title = this.$t('block.account')
        this.description = this.$t('block.account.description')
        this.successMessage = this.$t('user.blocked.successful')
        this.emitText = 'on-block-user'
        break
    }
  },
  methods: {
    checkValid () {
      console.log('cehck the block id on check Valid', this.blockvalue)
      if (this.blockReasons === null || this.blockReasons === '') {
        this.isValid = false
      }

      if (this.isValid) {
        this.onBlock()
      }
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    },
    onBlock () {
      console.log('cehck the block id on block function ', this.blockvalue || this.blockUserUuid)

      this.showLoading = true
      let blockInfo = {
        'blockInfo': {
          'uuid': this.blockvalue || this.blockUserUuid,
          'comment': this.blockReasons
        }
      }

      if (this.momentId) {
        blockInfo = {
          'blockInfo': {
            'uuid': this.blockUserUuid,
            'moment_id': this.momentId,
            'comment': this.blockReasons
          }
        }
      }

      this.$axios.post(`/users/${this.$store.state.user.uuid}/blocks`, blockInfo, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.closePopUp()
        this.$emit('on-block')
        this.$emit(this.emitText)
        this.$q.notify({message: this.successMessage, position: 'top', type: 'positive'})
      }).catch((error) => {
        console.error(error)
        let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
        this.$q.notify({
          message: errorMessage,
          type: 'negative'
        })
      }).finally(_ => {
        this.showLoading = false
        this.blockReasons = null
      })
    }
  }
}
</script>
<style lang="stylus">
.protection-bulb
  position: absolute
  top: 0
  left: calc(50% - 35px)
  padding: 10px
  background: #fff
  width: 70px
  border-radius: 50%
  margin-top: -35px
.protection-bulb-image
  width: 50px

.protection-desc
  font-size: 16px
  color: #111

.protection-title
  font-size: 20px
  color: #444

.bg-white-self
  background: #fff
  margin-top: 30px
  border-radius: 10px
</style>
