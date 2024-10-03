<template>
  <div>
    <q-card style="border-radius: 11px;">
        <q-card-section class="q-pa-sm" @click="onClick">
            <q-item class="q-pa-none">
                <!-- Image -->
                <q-item-section avatar style="height: 80px; width: 80px;" class="q-mr-sm">
                  <img :src="serviceInfo.coverImage" class="image-upload" height="80px" width="80px"/>
                </q-item-section>

                <!-- Listing Name -->
                <q-item-section>
                  <q-item-label lines="1" v-if="serviceInfo.userServiceName" class="q-my-none font-normal text-weight-medium">{{serviceInfo.userServiceName}}</q-item-label>
                  <q-item-label lines="1" v-if="serviceInfo.userServiceDescription" caption>{{serviceInfo.userServiceDescription}}</q-item-label>
                  <q-item-label lines="1" v-if="serviceInfo && serviceInfo.serviceLocation.length > 0" caption>{{serviceInfo.serviceLocation[0].fullAddress}}</q-item-label>
                  <q-item-label lines="1">
                    <span v-if="serviceInfo.isPaused === 1" class="text-warning">{{$t('listing.status.paused')}}</span>
                    <span v-else-if="serviceInfo.status === 1" class="text-positive">{{$t('listing.status.listed')}}</span>
                    <span v-else-if="serviceInfo.status === 0" class="text-negative">{{$t('listing.status.hidden')}}</span>
                  </q-item-label>
                </q-item-section>

                <!-- Right Arrow -->
                <q-item-section side>
                  <q-icon name="chevron_right"></q-icon>
                </q-item-section>
            </q-item>
        </q-card-section>

        <q-card-actions class="text-grey q-pt-none" align="between" v-if="$route.name === 'MobileDashboard' || $route.name === 'Profile'">
          <q-btn color="primary" :label="$t('edit.listing')" :ripple="false" class="q-pa-none text-capitalize q-px-sm" style="border-radius: 8px;" @click="$router.push({name: 'EditListing', params: {listingId: serviceInfo.id}})"></q-btn>
          <q-btn color="primary" :label="$t('share')" :ripple="false" class="q-pa-none text-capitalize q-px-sm" style="border-radius: 8px;" @click="openShareDialog('', serviceInfo.listingUrl.includes('https://') ? serviceInfo.listingUrl : $t('link.href.petbacker') + serviceInfo.listingUrl)"></q-btn>
          <q-btn color="primary" :label="$t('requests.page.viewrequest')" :ripple="false" class="q-pa-none text-capitalize q-px-xs" style="border-radius: 8px;" @click="$router.push({name: 'Listing', params: {listingId: serviceInfo.id}, query: {id: $store.getters['user/getUserUuidState']}})"></q-btn>
        </q-card-actions>
    </q-card>
    <!-- share dialog -->
    <q-dialog v-model="sharingDialog" auto-close  position="bottom" class="moreOptions" transition-show="slide-up">
      <share-card :detail="shareText" :shareLink="shareLink" @on-shared="sharingDialog = false"></share-card>
    </q-dialog>

    <dialog-listing-options :trigger="optionsModal" @on-close="triggerOptionsModel" @on-click="onSelection"></dialog-listing-options>
  </div>
</template>
<script>
export default {
  components: {
    'dialog-listing-options': () => import('components/Listing/ListingCardEditOptions.vue'),
    'share-card': () => import('components/DialogShare.vue')
  },
  props: {
    serviceInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      optionsModal: false,
      sharingDialog: false,
      shareText: null,
      shareLink: null
    }
  },
  methods: {
    openShareDialog (shareText, shareLink) {
      this.shareText = shareText
      this.shareLink = shareLink
      this.sharingDialog = true
    },
    triggerOptionsModel (status) {
      this.optionsModal = status
    },
    onSelection (type) {
      switch (type) {
        case 'EditLocation': this.$router.replace({name: 'EditListing', params: {listingId: this.serviceInfo.id}, query: {editLocation: 1}}); break
        case 'EditInfo': this.$router.replace({name: 'EditListing', params: {listingId: this.serviceInfo.id}}); break
        case 'PreviewListing': this.openUrl(this.serviceInfo.listingUrl); break
      }

      this.triggerOptionsModel(false)
    },
    onClick () {
      if (this.$route.name === 'MobileDashboard' || this.$route.name === 'Profile' || this.$route.name === 'MyListings') {
        this.optionsModal = true
      } else {
        this.$router.push({name: 'Listing', params: {listingId: this.serviceInfo.id}, query: {id: this.$route.params.userId}})
      }
    }
  }
}
</script>
