<template>
    <q-card @click="onTriggerListingModal(true)">
        <q-card-section class="q-pa-sm">
            <q-item dense class="q-pa-none">
                <q-item-section thumbnail class="q-pl-md">
                    <q-avatar style="height:55px; width: 55px; max-width: 55px;">
                        <img :src="listingInfo.thumbnail" class="image-upload"/>
                    </q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label v-if="listingInfo.name" lines="2">{{listingInfo.name}}</q-item-label>
                    <q-item-label v-if="listingInfo.parent_service_id" caption>{{$t(getParentServiceName(listingInfo.parent_service_id))}}</q-item-label>
                </q-item-section>
            </q-item>
        </q-card-section>

        <!-- Listing Dialog -->
        <dialog-listing v-if="listingInfo" :trigger="listingModal" :listingId="parseInt(listingInfo.id)" :info="{userInfo: {id: userUuid}}" :viewUserOtherListing="true" @on-close="onTriggerListingModal"></dialog-listing>
    </q-card>
</template>
<script>
export default {
  components: {
    'dialog-listing': () => import('components/Listing/DialogListing.vue')
  },
  props: {
    listingInfo: {
      type: Object,
      require: true
    },
    services: {
      require: true
    },
    userUuid: {
      required: true
    }
  },
  data () {
    return {
      listingModal: false
    }
  },
  methods: {
    onTriggerListingModal (status) {
      this.listingModal = status
    },
    getParentServiceName (parentServiceId) {
      let serviceInfo = this.$_.findWhere(this.services, {'parentId': parentServiceId})
      if (serviceInfo) {
        return serviceInfo.name
      }

      // fall back from by id
      serviceInfo = this.$_.findWhere(this.services, {'id': parentServiceId})
      if (serviceInfo) {
        return serviceInfo.name
      }

      return ''
    }
  }
}
</script>
