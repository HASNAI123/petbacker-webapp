<template>
    <q-card @click="onSelectLocation">
        <q-card-section>
          <q-item-label>{{locationInfo.fullAddress}}<q-icon class="float-right" name="chevron_right" size="20px"></q-icon></q-item-label>
        </q-card-section>
        <q-card-section class="q-pa-none">
            <div style="height: 100%;">
                <q-icon name="fas fa-map-marker-alt" color="negative" size="40px" style="z-index: 5000;position: absolute; top: 40%;left: 45%;"></q-icon>
                <div ref="map" style="width: 100%;height: 200px;" class="map-style"></div>
            </div>
        </q-card-section>
    </q-card>
</template>
<script>
export default {
  props: {
    locationInfo: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true,
      default: 0
    }
  },
  mounted () {
    setTimeout(() => {
      this.loadMap()
    }, 100)
  },
  methods: {
    onSelectLocation () {
      this.$emit('location-selected', this.index)
    },
    async loadMap () {
      try {
        /* global google */
        this.gMap = new google.maps.Map(this.$refs['map'], {
          center: {lat: parseFloat(this.locationInfo.latitude), lng: parseFloat(this.locationInfo.longitude)},
          zoom: 15,
          disableDefaultUI: true,
          draggable: true
        })
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
