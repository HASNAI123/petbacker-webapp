<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" :persistent="$q.platform.is.mobile" :transition-show="$q.platform.is.mobile ? 'slide-left' : 'none'" :transition-hide="$q.platform.is.mobile ? 'slide-right' : 'none'">
        <q-card>
            <q-toolbar style="z-index: 5000;" class="borderline">
                <q-btn flat dense v-close-popup icon="keyboard_arrow_left" size="1.3em"></q-btn>
                <q-toolbar-title v-close-popup >
                    <h6 class="q-my-none add-reminder-title">Vets</h6>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section class="justify-center">
              <!-- Select Vet -->
              <q-select use-input
              v-model="vetInfo.selected"
              input-debounce="500"
              :label="$t('select.clinic')"
              ref="clinic-selection"
              :options="vetOptions"
              :option-label="(item) => item === null ? null : item.name"
              :option-value="(item) => item === null ? null : item"
              @filter="onFilter"
              :loading="loading"
              @input="onVetSelected"
              v-if="vetInfo.selected !== 'create'"
              :error="!vetInfoValid && !vetInfo.selected"
              behavior="menu"
              borderless
              class="input q-my-md"
              hide-bottom-space>
                <template v-slot:no-option>
                  <q-item clickable @click="onAddClinic">
                    <q-item-section class="text-grey">
                      No results. Click Here to Add Clinic.
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-card-section>

            <!-- Vet Info -->
            <q-card-section class="justify-center q-mb-xl" v-if="addClinic || displayVetInfo">
              <h6 class="q-my-none">Clinic Info</h6>
              <q-input autofocus :readonly="displayVetInfo" v-model="vetInfo.name" :error="!vetInfoValid && !vetInfo.name" hide-bottom-space label="Clinic Name" borderless class="input q-my-md"></q-input>
              <q-input v-model="vetInfo.contact" :readonly="displayVetInfo" :error="!vetInfoValid && !vetInfo.contact" :type="$q.platform.is.desktop ? 'number' : 'tel'" hide-bottom-space label="Clinic Contact Number" borderless class="input q-my-md"></q-input>
              <q-input type="textarea" v-model="vetInfo.address" :readonly="displayVetInfo" :error="!vetInfoValid && !vetInfo.address" hide-bottom-space label="Clinic Address" borderless class="input q-my-md"></q-input>
            </q-card-section>

            <!-- Bottom Button will appear on mobile screen -->
            <div class="row text-center fixed-bottom">
                <div class="col-xs-12 lt-lg" @click="checkValid">
                    <div class="full-width text-white q-pa-md bg-primary cursor-pointer" v-ripple style="height: 70px;z-index:6000;">
                      <p v-if="!saveLoading" class="text-weight-bold font-title" style="margin-top: 5px;">Add Vet</p>
                      <span v-else>
                          <q-spinner size="3em"></q-spinner>
                      </span>
                    </div>
                </div>
            </div>
        </q-card>

        <dialog-error :trigger="errorModal" :message="`Please wait for image to be fully uploaded before saving.`" @on-close="triggerErrorModal"></dialog-error>
    </q-dialog>
</template>
<script>
export default {
  components: {
    'dialog-error': () => import('components/Dialog400Error.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      vetInfoValid: true,
      vetInfo: {
        id: null,
        selected: null,
        name: null,
        contact: null,
        address: null
      },
      loader: false,
      addClinic: false,
      vetOptions: [],
      displayVetInfo: false,
      errorModal: false,
      saveLoading: false,
      loading: false,
      vetInfoName: null
    }
  },
  watch: {
    trigger (value) {
      this.modal = value

      if (value && this.vetOptions.length === 0) {
        this.getVets()
      }
    }
  },
  methods: {
    triggerLoading (status) {
      this.saveLoading = status

      if (status === false) {
        this.onClose()
      }
    },
    triggerErrorModal (status) {
      this.errorModal = status
    },
    onAddClinic () {
      this.$refs['clinic-selection'].$el.blur()
      this.vetInfoValid = true
      this.vetInfo.selected = 'create'
      this.vetInfo.name = this.vetInfoName
      this.vetInfo.contact = null
      this.vetInfo.address = null
      this.displayVetInfo = false
      this.addClinic = true
    },
    onFilter (val, update) {
      if (val === '' || val === ' ') {
        update()
        return
      }

      if (val.length > 2) {
        this.getVets(val.toLowerCase(), update)
        this.vetInfoName = val
      } else {
        if (update) {
          update()
        }
      }
    },
    onVetSelected (vetInfo) {
      this.vetInfoValid = true
      this.$refs['clinic-selection'].blur()
      this.vetInfo.name = vetInfo.name
      this.vetInfo.contact = vetInfo.contact
      this.vetInfo.address = vetInfo.address
      this.displayVetInfo = true
    },
    getVets (filterByName = null, update) {
      this.loading = true
      this.$axios.get(`vets${filterByName !== null ? `?name=${encodeURI(filterByName)}&` : '?'}per_page=6&page=1`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 204) {
          this.vetOptions = []
        } else {
          this.vetOptions = response.data.vetsInfo.items
        }
      }).catch(e => {
        console.log(e)
        if (e.response && e.response.data) {
          this.$q.dialog({
            title: this.$t('requests.error.title'),
            message: e.response.data.message
          })
        }
      }).finally(_ => {
        this.loading = false
        if (update) {
          update()
        }
      })
    },
    onClose () {
      this.modal = false
      this.$emit('on-close', false)

      this.vetInfo.name = null
      this.vetInfo.selected = null
      this.vetInfo.contact = null
      this.vetInfo.address = null
      this.displayVetInfo = false
      this.addClinic = false
    },
    checkValid () {
      this.vetInfoValid = true

      if (this.loader) {
        this.triggerErrorModal(true)
      }

      if (this.vetInfo.selected === 'create' && (this.vetInfo.name === null || this.vetInfo.name === '' || this.vetInfo.name === ' ' || this.vetInfo.contact === null || this.vetInfo.contact === '' || this.vetInfo.name === ' ' || this.vetInfo.address === null || this.vetInfo.address === '' || this.vetInfo.address === ' ')) {
        this.vetInfoValid = false
      } else if (!this.vetInfo.selected) {
        this.vetInfoValid = false
      }

      // if both valid then submit to save
      if (this.vetInfoValid && !this.loader) {
        this.onSave()
      }
    },
    onSave () {
      let vetInfo = {
        name: null,
        contact: null,
        address: null
      }

      if (this.vetInfo.selected === 'create') {
        vetInfo = {
          name: this.vetInfo.name,
          contact: this.vetInfo.contact,
          address: this.vetInfo.address
        }
      } else if (this.vetInfo.selected && this.vetInfo.selected.id) {
        vetInfo = {
          id: this.vetInfo.selected.id,
          name: this.vetInfo.name,
          contact: this.vetInfo.contact,
          address: this.vetInfo.address
        }
      }

      this.$emit('on-add-vet', vetInfo)
    }
  }
}
</script>
