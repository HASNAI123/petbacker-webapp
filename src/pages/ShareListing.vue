<template>
    <q-page class="q-mx-md q-mt-sm" style="min-height: 100%;height: 100%;">
        <h6 class="q-my-none q-mb-sm">{{ $t('pet.owners.rely.on.recommendation') }}</h6>
        <p class="font-normal text-grey-8">{{$t('references.job.cv')}}</p>
        <br/>
        <p class="q-my-none q-mb-sm">{{ $t('share.fowlling.recommendation') }}</p>
        <div class="text-center q-pa-sm text-center" style="border: solid 1px lightgrey;">
          <input v-if="share_url" :value="share_url" class="text-center margin-auto full-width" style="background: none; outline: none; border: none;" readonly/>
          <q-skeleton v-else width="220px" class="margin-auto"></q-skeleton>
        </div>

        <div class="q-mt-md font-normal">
            <span class="anchor-link" style="text-decoration:none;" @click="onFBShare">
            {{$t('share.on.facebook')}}
            </span>
            <br/>
            <span class="anchor-link" style="text-decoration:none;" @click="onEmail">
            {{$t('share.on.email')}}
            </span>
            <br/>
            <span class="anchor-link" style="text-decoration:none;" @click="onWebShare">
            {{$t('share.on.others')}}
            </span>
        </div>

        <!-- BUTTON BOTTOM will appear on mobile screen -->
        <div class="row text-center fixed-bottom lt-lg" v-if="$q.platform.is.mobile">
            <div class="col-xs-12" :disabled="showLoading" @click="onFBShare">
                <div class="full-width z999 text-white q-pa-md bg-primary cursor-pointer font-header-title-large" :class="{'q-pb-lg': $q.platform.is.cordova}">
                    <span v-if="!showLoading">{{ $t('share') }}</span>
                    <span v-else><q-spinner></q-spinner></span>
                </div>
            </div>
        </div>
        <div class="text-center q-mt-lg" v-else>
            <q-btn color="primary" :label="$t('share')" class="q-px-xl q-mt-lg" size="lg" @click="onFBShare"></q-btn>
        </div>
    </q-page>
</template>
<script>
import clipboard from '../mixins/copyClipboardMixin.js'
export default {
  mixins: [clipboard],
  data () {
    return {
      share_url: '',
      showLoading: false,
      listingInfo: null
    }
  },
  created () {
    this.getListingInfo()
  },
  methods: {
    onShared () {
      this.$router.go(-1)
    },
    getListingInfo () {
      this.$axios.get(`users/${this.$store.getters['user/getUserUuidState']}/services/${this.$route.params.listingId}?lang=${this.$store.getters['user/getCurrentLanguage']}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.listingInfo = response.data.serviceInfo
        this.share_url = response.data.serviceInfo.listingUrl
      }).catch((error) => {
        console.error(error)
      })
    },
    onFBShare () {
      this.sendImpression('Shared', 'Facebook Share Button', 'Social Sharing')
      if (this.$q.platform.is.cordova) {
        window.facebookConnectPlugin.showDialog({
          method: 'share',
          href: `${this.share_url}`,
          caption: this.detail ? this.detail : '',
          description: this.detail ? this.detail : '',
          hashtag: '#PetBacker'
        }, (response) => {
          console.log(response)
          this.$router.go(-1)
        }, (error) => {
          console.error(error)
        })
      } else {
        window.FB.ui({
          method: 'share',
          href: `${this.share_url}`,
          quote: `Help%20${this.$store.getters['user/getUserName']}%20get%20started%20on%20PetBacker%20for%20pet%20community%27s%20security%20and%20trust.`,
          hashtag: '#PetBacker'
        }, function (response) {})
      }
    },
    onWebShare () {
      this.sendImpression('Shared', 'Share Button', 'Social Sharing')
      if (navigator.share) {
        navigator.share({
          title: this.$t('share.get.started'),
          text: this.$t('help.backer.get.started', {backerName: this.$store.getters['user/getUserName']}),
          url: `${this.share_url}`
        }).then(() => this.onShared()).catch((error) => console.log('Error sharing', error))
      } else {
        this.copy()
      }
    },
    copy () {
      this.sendImpression('Shared', 'Share Button', 'Social Sharing')
      this.copiedSuccessText = this.$t('link.successfully.copied')
      this.onCopy(this.share_url)
    },
    onEmail () {
      this.sendImpression('Shared', 'Email Share Button', 'Social Sharing')
      this.openUrl(`mailto:?subject=Help%20Me%20Get%20Started%20in%20PetBacker%20-%20Pet%20Sitter%2C%20Groomer%2C%20Dog%20Walker&body=Help%20${this.$store.getters['user/getUserName']}%20get%20started%20on%20PetBacker%20for%20pet%20community%27s%20security%20and%20trust.%0A%0A${this.share_url}`)
    }
  }
}
</script>
