<template>
    <q-list separator style="border: 1px solid lightgrey;" class="full-width q-pl-md bg-white">
        <!-- Identification Document -->
        <q-item clickable class="q-pl-none" @click="onSelect('IdentityVerification')" v-if="checkPosition('IdentityVerification')">
            <q-item-section>
                <q-item-label class="font-normal">{{$t('identity.verification')}}</q-item-label>
                <q-item-label class="text-warning" v-if="$store.getters['user/getIdVerified'] === 2 || $store.getters['user/getSelfieVerified'] === 2">{{$t('status.pending')}}</q-item-label>
            </q-item-section>

            <q-item-section side>
                <q-item-label class="font-normal">
                    <div style="width: 25px;height: 25px;border-radius: 20px;" class="text-center rounded-borders">
                        <q-icon name="fas fa-check" class="text-positive"
                        v-if="(type === 'completed' && $store.getters['user/getIdVerified'] === 1 && $store.getters['user/getSelfieVerified'] === 1)"></q-icon>
                    </div>
                </q-item-label>
            </q-item-section>
        </q-item>

        <!-- Profile and Listing Photos -->
        <q-item clickable class="q-pl-none" v-if="checkPosition('ProfileListingPhotos')" @click="$router.push({name: 'EditProfile', params: {userId: $store.getters['user/getUserUuidState']}})">
            <q-item-section>
                <q-item-label class="font-normal">{{$t('profile.listing.photos')}}</q-item-label>
            </q-item-section>

            <q-item-section side>
                <q-item-label class="font-normal">
                    <div style="width: 25px;height: 25px;border-radius: 20px;" class="text-center rounded-borders">
                        <q-icon name="fas fa-check" class="text-positive" v-if="type === 'completed' && $store.getters['user/getUserAvatarImage'].includes('https')"></q-icon>
                    </div>
                </q-item-label>
            </q-item-section>
        </q-item>

        <!-- Pet Sitter Intro -->
        <q-item clickable class="q-pl-none" v-if="checkPosition('PetSitterIntro')" @click="openUrl(`${$t('link.href.petbacker')}/pet-sitter-intro?uuid=${$store.getters['user/getUserUuidState']}`); petSitterIntroLoader = true">
            <q-item-section>
                <q-item-label class="font-normal">{{$t('pet.sitter.intro.test')}}</q-item-label>
            </q-item-section>

            <q-item-section side>
                <q-item-label class="font-normal">
                    <div style="width: 25px;height: 25px;border-radius: 20px;" class="text-center rounded-borders">
                        <q-icon name="fas fa-check" class="text-positive" v-if="type === 'completed' && $store.getters['user/getSitterIntroVerified']"></q-icon>
                        <q-spinner v-else-if="petSitterIntroLoader"></q-spinner>
                    </div>
                </q-item-label>
            </q-item-section>
        </q-item>

        <!-- Get Testimonials -->
        <q-item clickable class="q-pl-none" v-if="checkPosition('Testimonials')" @click="goToService">
            <q-item-section>
                <q-item-label class="font-normal">{{$t('get.testimonials')}}</q-item-label>
                <q-item-label class="text-negative" v-if="$store.getters['user/getReviewCount'] < 3">{{$t('testimonials.more.needed', {reviewNum: (3 - $store.getters['user/getReviewCount'])})}}</q-item-label>
            </q-item-section>

            <q-item-section side>
                <q-item-label class="font-normal">
                    <div style="width: 25px;height: 25px;border-radius: 20px;" class="text-center rounded-borders">
                        <q-icon name="fas fa-check" class="text-positive" v-if="type === 'completed' && ($store.getters['user/getReviewCount'] >= 3)"></q-icon>
                    </div>
                </q-item-label>
            </q-item-section>
        </q-item>

        <!-- Approval Status -->
        <q-item clickable class="q-pl-none" v-if="checkPosition('ApprovalStatus')" @click="openUrl(`${$t('link.href.help.center')}/pet-service-providers/how-to-be-a-pet-sitter-or-walker`)">
          <q-item-section>
            <q-item-label class="font-normal">{{$t('approval.status')}}</q-item-label>
            <q-item-label class="text-negative" v-if="$store.getters['user/getListingApprovalStatus'] === 2">{{$t('status.pending')}}</q-item-label>
            <q-item-label class="text-positive" v-else-if="$store.getters['user/getListingApprovalStatus'] === 1">{{$t('approved')}}</q-item-label>
            <q-item-label class="text-warning" v-else-if="$store.getters['user/getListingApprovalStatus'] === 0"></q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label class="font-normal">
              <div style="width: 25px;height: 25px;border-radius: 20px;" class="text-center rounded-borders">
                <q-icon name="fas fa-check" class="text-positive" v-if="type === 'completed' && ($store.getters['user/getListingApprovalStatus'] === 1)"></q-icon>
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
    </q-list>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      petSitterIntroLoader: false,
      languagesSupported: ['en', 'zh_tw', 'zh_cn', 'zh_hk']
    }
  },
  mounted () {
    // listen to in app browser close event
    window.addEventListener('SVC-closed', this.onInAppBrowserClosed)
  },
  beforeDestroy () {
    // clean up event listeners
    window.removeEventListener('SVC-closed', this.onInAppBrowserClosed)
  },
  methods: {
    onInAppBrowserClosed () {
      // refresh internal states
      this.$store.dispatch('user/refreshState').then(() => {
        this.petSitterIntroLoader = false
      })
    },
    goToService () {
      if (this.$store.getters['user/getReviewCount'] === 3) {
        return
      }

      // take the latest service
      let service = this.$store.getters['cached/getServicesCached'][this.$store.getters['cached/getServicesCached'].length - 1]
      this.$router.push({name: 'ShareListing', params: {listingId: service.id}})
    },
    onSelect (selection) {
      if (selection === 'IdentityVerification' && this.$store.getters['user/getIdVerified'] === 1 && this.$store.getters['user/getSelfieVerified'] === 1) {
        return
      }

      this.$router.push({name: selection})
    },
    checkPosition (itemType) {
      if (itemType === 'IdentityVerification') {
        if (this.type === 'completed' && this.$store.getters['user/getIdVerified'] === 1 && this.$store.getters['user/getSelfieVerified'] === 1) {
          return true
        } else if (this.type === 'left' && ((this.$store.getters['user/getIdVerified'] !== 1 || this.$store.getters['user/getSelfieVerified'] !== 1))) {
          return true
        }
      }

      if (itemType === 'ProfileListingPhotos') {
        if (this.type === 'completed' && this.$store.getters['user/getUserAvatarImage'].includes('https')) {
          return true
        } else if (this.type === 'left' && (!this.$store.getters['user/getUserAvatarImage'].includes('https'))) {
          return true
        }
      }

      if (itemType === 'PetSitterIntro') {
        if (this.languagesSupported.indexOf(this.$store.getters['user/getCurrentLanguage']) > -1) {
          if (this.type === 'completed' && this.$store.getters['user/getSitterIntroVerified']) {
            return true
          } else if (this.type === 'left' && !this.$store.getters['user/getSitterIntroVerified']) {
            return true
          }
        } else {
          return false
        }
      }

      if (itemType === 'Testimonials') {
        if (this.type === 'completed' && (this.$store.getters['user/getReviewCount'] >= 3)) {
          return true
        } else if (this.type === 'left' && (this.$store.getters['user/getReviewCount'] < 3)) {
          return true
        }
      }

      if (itemType === 'ApprovalStatus') {
        if (this.type === 'completed' && (this.$store.getters['user/getListingApprovalStatus'] === 1)) {
          return true
        } else if (this.type === 'left' && (this.$store.getters['user/getListingApprovalStatus'] !== 1)) {
          return true
        }
      }
    }
  }
}
</script>
<style lang="stylus">
.rounded-borders
  border: solid 2px $primary;
</style>
