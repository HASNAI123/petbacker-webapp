<template>
  <q-dialog v-model="successModal" :persistent="persistent"  :content-css="{width: 'auto', height: 'fit-content', background: 'transparent', boxShadow: 'none'}">
      <q-card style="overflow: visible; border-radius: 11px;">
        <q-card-section style="min-height: 150px;min-width: 250px;max-width: 280px;" class="q-px-none q-py-sm">
          <div class="tip-bulb">
              <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
          </div>
          <div class="bg-white q-mt-lg">
              <div class="row justify-center">
                <div style="display: flex; justify-content: center; align-items: center;">
  <h6 style="margin: 0; text-align: center;" class="q-font-bold">
    <div v-if="posttype" >
      <span  style="display: block;">Job</span> Updated Successfully <br>
    </div>
    <div v-else >
      <span  style="display: block;">Moment</span> Posted Successfully <br>
    </div>
    <p class="thanks">{{$t('thanks.moment.posting')}}</p>
  </h6>
</div>

            <q-card-section class="q-pa-none text-center q-pb-lg" style="width: 100%; padding-bottom: 0px;">
  <q-btn class="q-mb-sm q-mt-md q-mx-sm" no-caps size="md" round style="background: #4568b2;" @click="goTo('facebook-share')">
    <q-icon name="fab fa-facebook-f" style="color: white; height: 10px; width: 10px;"/>
  </q-btn>
  <q-btn class="q-mb-sm q-mt-md q-mx-sm" no-caps size="md" round style="background: #00aced;" @click="goTo('twitter')">
    <q-icon name="fab fa-twitter" style="color: white; height: 10px; width: 10px;"/>
  </q-btn>
  <q-btn class="q-mb-sm q-mt-md q-mx-sm" size="md" round style="background: #25D366;" @click="goTo('whatsapp')">
    <q-icon name="fab fa-whatsapp" style="color: white; height: 10px; width: 10px;"/>
  </q-btn>
  <q-btn class="q-mb-sm q-mt-md q-mx-sm" size="md" round style="background: grey;" @click="goTo('share')">
    <q-icon name="far fa-clone" style="color: white; height: 10px; width: 10px;"/>
  </q-btn>
</q-card-section>

            <!-- <q-btn style="margin-bottom: 0;" label="Close" color="primary" @click="closeModal" /> -->

                <div class="col-12 text-center q-pa-md tip-desc">
                  <h6 class="q-my-none q-mb-md" v-if="title">{{title}}</h6>
                  <span style="white-space: pre-wrap;">{{message}}</span>
                </div>
              </div>
              <div class='full-width q-px-md'>
               <!--  <q-btn class="full-width text-capitalize q-my-sm text-primary" flat v-if="learnMoreLink" @click="openUrl(learnMoreLink)">{{$t('chat.learnmore')}}</q-btn> -->
                <q-btn  @click="closeModal" class="full-width text-capitalize q-my-sm" color="primary" label="Close" ></q-btn>
              </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script>
import clipboard from '../../mixins/copyClipboardMixin.js'

export default {
  mixins: [clipboard],
  props: {
    privacylevel: {
      publicChecked: false,
      friendsChecked: false,
      onlyMeChecked: false
    },
    successModal: {
      type: Boolean,
      default: false
    },
    trigger: {
      type: Boolean,
      required: true
    },
    posttype: {
      type: Boolean,
      default: null,
      required: true
    },
    shareurl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    }
  },
  watch: {
    trigger (newVal, oldVal) {
      if (newVal === false && oldVal === true) {
        this.$emit('on-close')
      }
    }
  },
  data () {
  },
  methods: {
    closeModal () {
      this.$emit('close-modal')
      console.log(this.posttype)
      console.log(this.shareurl)
      console.log(this.description)
    },
    back () {
      console.log(this.$router)
      this.$refs['Success-modal'].close()
      this.$refs['moment update'].close()
    },
    onPrivacyChange (selectedPrivacy) {
      this.$emit('privacy-selected', selectedPrivacy)
    },
    goTo (type) {
      switch (type) {
        case 'facebook-share':
          this.sendImpression('Shared', 'Facebook Share Button', 'Social Sharing')
          if (this.$q.platform.is.cordova) {
            window.facebookConnectPlugin.showDialog({
              method: 'share',
              href: this.shareurl,
              caption: this.description ? this.description : '',
              description: this.description ? this.description : '',
              hashtag: '#PetBacker'
            }, (response) => {
              console.log(response)
            }, (error) => {
              console.error(error)
            })
          } else {
            window.FB.ui({
              method: 'share',
              href: this.shareurl,
              quote: this.description ? this.description : '',
              hashtag: '#PetBacker'
            }, function (response) {})
          }
          break
        case 'whatsapp':
          this.sendImpression('Shared', 'WhatsApp Share Button', 'Social Sharing')
          this.openUrl(`https://wa.me/send?text=${this.detail ? encodeURIComponent(this.detail) : ''}${encodeURIComponent(` ${this.shareurl}`)}`)
          break
        case 'twitter':
          this.sendImpression('Shared', 'Twitter Share Button', 'Social Sharing')
          this.openUrl('http://twitter.com/share?url=' + encodeURIComponent(this.shareurl) + '&text=' + (this.detail ? encodeURIComponent(this.detail) : ''))
          break
        case 'share':
          this.sendImpression('Shared', 'Share Button', 'Social Sharing')
          if (navigator.share) {
            navigator.share({
              title: this.description,
              text: this.description,
              url: this.shareurl
            }).then(() => this.onShared()).catch((error) => {
              console.log('Error sharing', error)
            })
          } else {
            this.copy()
          }
          break
      }
      this.$emit('on-shared')
    },
    onShared () {
      this.$emit('on-shared')
    },
    copy () {
      console.log('share button clicked')
      this.copiedSuccessText = this.$t('link.successfully.copied')
      this.onCopy(`${this.description} ${this.shareurl}`)
    }
  }
}
</script>

<style lang="stylus">
.thanks
  font-size: 12px
  padding: 15px
  padding-right: 10px

  .q-dialog {
  max-width: 25vw; /* set to 25% of the viewport width */
  margin: auto;
}

</style>
