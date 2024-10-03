<template>
  <q-input v-model="getPlace" ref="autocomplete" :class="className" :placeholder="placeholder || $t('enter.location.here')" borderless dense></q-input>
</template>

<script>
/* global google */
export default {
  props: {
    place: {
      require: true
    },
    className: String,
    placeholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      autocomplete: null,
      sessionToken: ''
    }
  },
  computed: {
    getPlace: {
      get () {
        return this.place
      },
      set (value) {
        this.$emit('inputChanged', value)
      }
    }
  },
  mounted () {
    let center = {
      lat: this.$store.getters['user/getUserLatitude'] || this.$store.getters['geolocation/geopluginLatitude'],
      lng: this.$store.getters['user/getUserLongitude'] || this.$store.getters['geolocation/geopluginLongitude']
    }

    this.sessionToken = new google.maps.places.AutocompleteSessionToken()
    this.autocomplete = new google.maps.places.Autocomplete(this.$refs.autocomplete.$refs.input,
      {
        types: ['geocode', 'establishment'],
        sessionToken: this.sessionToken,
        offset: 3,
        origin: center
      })
    this.autocomplete.setFields([
      'address_components', 'geometry', 'formatted_address', 'name'
    ])

    this.autocomplete.addListener('place_changed', () => {
      // emits value
      this.$emit('place-changed', this.autocomplete.getPlace())

      // new session token
      this.sessionToken = new google.maps.places.AutocompleteSessionToken()
    })
    // need to stop prop of the touchend event - quasar platform detectoin added for ipad check
    if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) || this.$q.platform.is.ipad) {
      setTimeout(function () {
        var container = document.getElementsByClassName('pac-container')[0]
        container.addEventListener('touchend', function (e) {
          e.stopImmediatePropagation()
        })
      }, 500)
    }
  },
  beforeDestroy () {
    // clean up pac-containers
    if (document.querySelector('.pac-container')) {
      document.querySelector('.pac-container').remove()
    }
  }
}
</script>
