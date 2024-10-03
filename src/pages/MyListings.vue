<template>
    <q-page class="q-px-md q-py-md">
        <div v-if="listingsInfo === 'EMPTY'">
          <!-- Add Service Card -->
          <q-card style="border-radius: 11px;" @click="updateDisclamerModal(true)">
            <q-card-section class="q-pa-sm">
              <q-item class="q-pa-none">
                  <!-- Image -->
                  <q-item-section avatar style="height: 80px; width: 80px;" class="q-mr-sm bg-grey-3">
                    <q-icon name="fas fa-plus" size="45px" color="primary" class="text-center" style="left: 26%;"></q-icon>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1" class="q-my-none font-normal text-weight-medium">{{$t('add.pet.service')}}</q-item-label>
                    <q-item-label lines="2" caption>{{$t('be.a.sitter')}}</q-item-label>
                  </q-item-section>

                  <!-- Right Arrow -->
                  <q-item-section side>
                    <q-icon name="chevron_right"></q-icon>
                  </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>
        <div v-else-if="listingsInfo">
          <card-horizontal-listing v-for="service in listingsInfo" :key="service.id" :serviceInfo="service" class="q-mb-md"></card-horizontal-listing>
        </div>
        <div v-else class="text-center">
          <ComponentPreLoader></ComponentPreLoader>
        </div>

        <!-- Disclaimer Dialog -->
        <dialog-disclamer :trigger="disclamerModal" @on-close="updateDisclamerModal"></dialog-disclamer>
    </q-page>
</template>
<script>
export default {
  components: {
    'card-horizontal-listing': () => import('components/Listing/HorizontalListingCards.vue'),
    'dialog-disclamer': () => import('components/CreateListing/DialogDisclamer.vue')
  },
  data () {
    return {
      listingsInfo: this.$store.getters['cached/getServicesCached'],
      disclamerModal: false
    }
  },
  created () {
    this.getListings()
  },
  methods: {
    updateDisclamerModal (value) {
      this.disclamerModal = value
    },
    getListings () {
      this.$axios.get(`users/${this.$route.params.userId}/services?lang=${this.$store.getters['user/getCurrentLanguage']}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status !== 204) {
          this.listingsInfo = response.data.serviceInfo.services

          if (response.data.serviceInfo.services > 0) {
            if (JSON.stringify(this.$store.getters['cached/getServicesCached']) !== JSON.stringify(response.data.serviceInfo.services)) {
              this.$store.dispatch('cached/cacheUserServices', response.data.serviceInfo.services)
            }
          }
        } else {
          this.listingsInfo = 'EMPTY'
        }
      }).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>
