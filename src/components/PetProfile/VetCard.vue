<template>
    <q-card class="col-xs-5 col-md-2 q-mt-md justify-center petCard" style="margin-left: 20px;" @click="onTriggerVetInfoModal(true)">
        <img src="statics/images/vet-image.png" :class="$q.platform.is.desktop ? 'petImgDesktop' : 'petImg'" class="image-upload" style="height: 150px;width: 100%;">
        <q-card-section class="item-content cursor-pointer q-pa-sm">
            <p class="q-mb-xs text-weight-bold text-capitalize font-normal" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{vetInfo.name}}</p>
            <p class="q-mb-xs text-grey-7 text-weight-light font-small">{{vetInfo.address}}</p>
        </q-card-section>

        <dialog-vetinfo :trigger="vetInfoModal" :index="index" :vetInfo="vetInfo" @on-close="onTriggerVetInfoModal" @on-remove-vet="onRemoveVet"></dialog-vetinfo>
    </q-card>
</template>
<script>

export default {
  components: {
    'dialog-vetinfo': () => import('components/PetProfile/DialogVetInfo.vue')
  },
  props: {
    vetInfo: {
      type: Object,
      default: () => { return null }
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      vetInfoModal: false
    }
  },
  methods: {
    onRemoveVet () {
      this.onTriggerVetInfoModal(false)
      this.$emit('on-remove-vet', this.index)
    },
    onTriggerVetInfoModal (status) {
      this.vetInfoModal = status
    }
  }
}
</script>
