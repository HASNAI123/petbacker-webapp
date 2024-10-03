<template>
    <q-card>
      <q-card-section class="q-pa-none text-center q-pb-lg" style="width: 100%;">
  <q-btn class="q-mb-sm q-mt-md q-mx-sm" no-caps size="lg" round style="background: #4568b2;" @click="goTo('facebook-share')">
    <q-icon name="fab fa-facebook-f" style="color: white; height: 40px; width: 40px;"/>
  </q-btn>
  <q-btn class="q-mb-sm q-mt-md q-mx-sm" no-caps size="lg" round style="background: #00aced;" @click="goTo('twitter')">
    <q-icon name="fab fa-twitter" style="color: white; height: 40px; width: 40px;"/>
  </q-btn>
  <q-btn class="q-mb-sm q-mt-md q-mx-sm" size="lg" round style="background: #25D366;" @click="goTo('whatsapp')">
    <q-icon name="fab fa-whatsapp" style="color: white; height: 40px; width: 40px;"/>
  </q-btn>
  <q-btn class="q-mb-sm q-mt-md q-mx-sm" size="lg" round style="background: grey;" @click="goTo('share')">
    <q-icon name="far fa-clone" style="color: white; height: 40px; width: 40px;"/>
  </q-btn>
  <div class="q-pa-md"><q-separator/></div>
  <q-btn flat class="full-width q-py-xs text-weight-bold" text-color="black" no-caps>{{$t('close')}}</q-btn>
</q-card-section>
    </q-card>
</template>
<script>
import clipboard from '../mixins/copyClipboardMixin.js'
import 'assets/fb-sdk.js'
export default {
  mixins: [clipboard],
  props: {
    shareLink: {
      required: true,
      default: null
    },
    detail: {
      required: true,
      default: ''
    }
  },
  mounted () {
    document.addEventListener('deviceready', function () {
      // initialize the Instagram plugin

    })
  },
  methods: {
    goTo (type) {
      switch (type) {
        case 'facebook-share':
          this.sendImpression('Shared', 'Facebook Share Button', 'Social Sharing')
          if (this.$q.platform.is.cordova) {
            window.facebookConnectPlugin.showDialog({
              method: 'share',
              href: this.shareLink,
              caption: this.detail ? this.detail : '',
              description: this.detail ? this.detail : '',
              hashtag: '#PetBacker'
            }, (response) => {
              console.log(response)
            }, (error) => {
              console.error(error)
            })
          } else {
            window.FB.ui({
              method: 'share',
              href: this.shareLink,
              quote: this.detail ? this.detail : '',
              hashtag: '#PetBacker'
            }, function (response) {})
          }
          break
        case 'whatsapp':
          this.sendImpression('Shared', 'WhatsApp Share Button', 'Social Sharing')
          this.openUrl(`https://wa.me/send?text=${this.detail ? encodeURIComponent(this.detail) : ''}${encodeURIComponent(` ${this.shareLink}`)}`)
          break
        case 'twitter':
          this.sendImpression('Shared', 'Twitter Share Button', 'Social Sharing')
          this.openUrl('http://twitter.com/share?url=' + encodeURIComponent(this.shareLink) + '&text=' + (this.detail ? encodeURIComponent(this.detail) : ''))
          break
        case 'instagram':
          this.sendImpression('Shared', 'Share Button', 'Social Sharing')
          if (navigator.share) {
            navigator.share({
              title: this.detail,
              text: this.detail,
              url: this.shareLink
            }).then(() => this.onShared()).catch((error) => {
              console.log('Error sharing', error)
            })
          } else {
            this.copy()
          }

          break
        case 'share':
          this.sendImpression('Shared', 'Share Button', 'Social Sharing')
          if (navigator.share) {
            navigator.share({
              title: this.detail,
              text: this.detail,
              url: this.shareLink
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
      this.copiedSuccessText = this.$t('link.successfully.copied')
      this.onCopy(`${this.detail} ${this.shareLink}`)
    }
  }
}
</script>
