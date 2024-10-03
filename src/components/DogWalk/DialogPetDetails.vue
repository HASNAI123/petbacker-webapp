<template>
    <q-dialog v-model="modal" position="bottom" @hide="closePopUp" transition-show="slide-up" transition-hide="slide-down">
        <q-card style="border-radius: 15px;" v-touch-pan.down.prevent.mouse="onSwipe" :style="{'max-width: 355px;': $q.platform.is.desktop}">
          <q-card-section class="q-pb-none">
            <div class="margin-auto text-center">
                <hr class="q-my-none bg-grey-3" style="width: 30%;height: 5px;border:none;border-radius: 15px;" />
            </div>
          </q-card-section>

          <q-card-section class="q-py-xs">
            <h6 class="q-my-none text-left q-pl-sm">Pets In Walk</h6>
          </q-card-section>

          <q-card-section class="q-px-none q-pb-lg" v-if="walkingPets">
            <div class="row justify-center">
                <div class="col-3 justify-center text-center q-mx-sm" v-for="(pet, index) in walkingPets" :key="index">
                    <q-img :src="pet.mediaInfo[0].filePath" class="image-upload" style="border-radius:50%;height: 55px; width: 55px;"></q-img>
                    <p>{{ pet.title }}</p>
                </div>
            </div>
          </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean
    }
  },
  data () {
    return {
      modal: false,
      walkingPets: null
    }
  },
  created () {
    this.loadPets()
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    }
  },
  methods: {
    loadPets () {
      if (this.$q.localStorage.has('dogWalkInfo')) {
        this.walkingPets = this.$q.localStorage.getItem('dogWalkInfo').selectedPets
      }
      console.log(this.walkingPets)
    },
    onSwipe ({ evt, ...info }) {
      if (info.direction === 'down' && info.offset.y > 20) {
        this.modal = false
      }
    },
    closePopUp () {
      this.$emit('on-close', false)
    }
  }
}
</script>
