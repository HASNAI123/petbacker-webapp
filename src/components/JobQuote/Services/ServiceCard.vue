<template>
    <q-item class="q-my-sm font-normal" style="border: 1px solid lightgrey; border-radius: 12px;" @click.native="onSelected">
        <q-item-section avatar>
            <q-avatar style="height: 55px; width: 55px;">
              <img :src="serviceInfo.icon" class="image-upload"/>
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label lines="1" class="font-title text-weight-bold">{{serviceInfo.userServiceName || $t(serviceInfo.name)}}</q-item-label>
            <q-item-label lines="1" v-if="serviceInfo.userServiceDescription">{{serviceInfo.userServiceDescription}}</q-item-label>
            <q-item-label lines="3" v-if="serviceInfo.serviceDescription">{{serviceInfo.serviceDescription}}</q-item-label>
            <q-item-label lines="1" class="text-wrap" caption v-if="serviceInfo.services">{{serviceInfo.services.serviceDescription}}</q-item-label>
        </q-item-section>

        <q-item-section side>
            <div v-if="!showLoader">
                <q-item-label><q-icon name="chevron_right" size="1.5em"></q-icon></q-item-label>
            </div>
            <div v-else>
                <q-spinner :size="25" ></q-spinner>
            </div>
        </q-item-section>
    </q-item>
</template>
<script>
export default {
  props: {
    serviceInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showLoader: false
    }
  },
  methods: {
    onSelected () {
      this.$emit('selected-service', this.serviceInfo.ratesInfo, this.serviceInfo.id)
    }
  }
}
</script>
