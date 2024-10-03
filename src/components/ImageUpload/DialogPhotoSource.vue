<template>
  <q-dialog v-model="modal" position="bottom" @hide="closePopUp" class="responsive-modal" transition-hide="slide-down" transition-show="slide-up"  :no-backdrop-dismiss="true" :no-escape-key-dismiss="true">
    <!-- Selection -->
    <q-card style="border-top-left-radius:11px;border-top-right-radius:11px;" class="q-pb-lg">
      <q-card-section class="q-pb-xs">
        <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="black" style="margin-top:8px" @click="onPhotoLibrary">
          <p style="text-transform: none;" >{{$t('choose.from.photo.library')}}</p>
        </q-btn>
        <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="black" style="margin-top:8px" @click="onPhotoCamera">
          <p  style="text-transform: none;" >{{$t('take.a.photo')}}</p>
        </q-btn>
        <div><q-separator/></div>
        <q-btn flat class="full-width q-my-md text-weight-bold" text-color="black" id="closeBtn" no-caps @click="closeDialog">{{$t('close')}}</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
// ... Your imports and setup ...

export default {
  // ... Your component setup ...
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      modal: this.value
    }
  },
  watch: {
    value (newVal) {
      this.modal = newVal
    }
  },

  methods: {
    // ... Other methods ...
    closeDialog () {
      this.$emit('close-dialog') // Emit the custom "close-dialog" event
    },
    closePopUp () {
      this.modal = false // Close the dialog when it's hidden
    },

    onPhotoLibrary () {
      console.log('chekc plugin', navigator.camera)
      this.mediaSource = navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
      this.$emit('option-selected', 'photoLibrary') // Emit 'photoLibrary' when this option is selected
      this.closePopUp()
    },

    onPhotoCamera () {
      console.log('chekc plugin', navigator.camera)
      this.mediaSource = navigator.camera.PictureSourceType.CAMERA
      this.$emit('option-selected', 'camera') // Emit 'camera' when this option is selected
      this.closePopUp()
    }

    // ... Rest of the component methods ...
  }
}
</script>
