<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="this.$q.platform.is.mobile" :persistent="this.$q.platform.is.mobile" :transition-show="this.$q.platform.is.mobile ? 'slide-left' : ''" :transition-hide="this.$q.platform.is.mobile ? 'slide-right' : ''">
        <q-card :style="{'min-height': this.$q.platform.is.desktop ? '600px' : '', 'max-height': this.$q.platform.is.desktop ? '800px' : ''}">
            <q-toolbar style="z-index: 5000;" class="borderline">
                <q-btn flat round dense v-close-popup icon="chevron_left" size="1.3em"/>
                <!-- Header Title -->
                <q-toolbar-title v-close-popup>
                    <h6 class="q-my-none font-normal" style="margin-left: 33%;">Sections</h6>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section class="q-pa-none q-px-md" :style="{'min-height': this.$q.platform.is.desktop ? '520px' : ''}">
              <h6 class="text-center q-my-sm">
                <q-icon name="vertical_distribute" color="grey"></q-icon>
              </h6>

              <q-input v-model="sectionName" type="text" placeholder="Section Name, e.g. Sunday Afternoon" flat borderless class="input q-my-md"></q-input>

              <!-- Icons -->
              <p class="text-center q-my-sm text-grey-6 q-mt-xl">Please select an icon for this section</p>
              <div class="row justify-left q-pa-sm margin-auto" style="max-width: 320px;border: 1px solid lightgrey;border-radius: 11px;">
                <q-icon name="fas fa-tag" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-tag' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-tag')"></q-icon>
                <q-icon name="fas fa-guitar" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-guitar' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-guitar')"></q-icon>
                <q-icon name="fas fa-couch" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-couch' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-couch')"></q-icon>
                <q-icon name="fas fa-heart" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-heart' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-heart')"></q-icon>
                <q-icon name="fas fa-star" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-star' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-star')"></q-icon>
                <q-icon name="fas fa-concierge-bell" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-concierge-bell' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-concierge-bell')"></q-icon>
                <q-icon name="fas fa-envelope" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-envelope' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-envelope')"></q-icon>
                <q-icon name="fas fa-plane" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-plane' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-plane')"></q-icon>
                <q-icon name="fas fa-map-pin" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-map-pin' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-map-pin')"></q-icon>
                <q-icon name="fas fa-dog" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-dog' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-dog')"></q-icon>
                <q-icon name="fas fa-cat" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-cat' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-cat')"></q-icon>
                <q-icon name="far fa-clock" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-clock' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-clock')"></q-icon>
                <q-icon name="fas fa-broom" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-broom' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-broom')"></q-icon>
                <q-icon name="fas fa-camera" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-camera' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-camera')"></q-icon>
                <q-icon name="fas fa-trophy" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-trophy' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-trophy')"></q-icon>
                <q-icon name="fas fa-shopping-cart" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-shopping-cart' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-shopping-cart')"></q-icon>
                <q-icon name="fas fa-bell" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-bell' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-bell')"></q-icon>
                <q-icon name="fas fa-bone" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-bone' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-bone')"></q-icon>
                <q-icon name="fas fa-fish" class="col-3 q-py-sm" size="md" :color="selectedIcon === 'fas fa-fish' ? 'primary' : 'grey-4'" @click="onSelectIcon('fas fa-fish')"></q-icon>
              </div>
            </q-card-section>

            <div class="fixed-bottom bg-primary" v-if="$q.platform.is.mobile" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" @click="onSave">
                <div class="q-pa-md q-pb-lg">
                    <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
                        <span v-if="!showLoading">Add Section</span>
                        <span v-else><q-spinner size="1.5em"></q-spinner></span>
                    </div>
                </div>
            </div>
        </q-card>
    </q-dialog>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modal: false,
      sectionName: null,
      showLoading: false,
      selectedIcon: null
    }
  },
  watch: {
    trigger (status) {
      this.modal = status
    }
  },
  methods: {
    onSelectIcon (iconName) {
      this.selectedIcon = iconName
    },
    onClose () {
      this.modal = false
      this.$emit('on-close', false)
    },
    onSave () {
      this.$emit('on-save', this.selectedIcon, this.sectionName)
      this.selectedIcon = null
      this.sectionName = null
      this.onClose()
    }
  }
}
</script>
