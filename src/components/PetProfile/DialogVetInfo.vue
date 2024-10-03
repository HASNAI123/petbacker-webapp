<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" :persistent="$q.platform.is.mobile" transition-show="slide-left" transition-hide="slide-right">
        <q-card>
            <q-toolbar style="z-index: 5000;" class="borderline">
                <q-btn flat dense v-close-popup icon="chevron_left" size="1.3em"></q-btn>
                <q-toolbar-title v-close-popup class="font-title">
                    <h6 class="q-my-none text-title" v-if="vetInfo">Vet</h6>
                </q-toolbar-title>
                <q-btn icon="delete" :loading="removeLoader" flat dense class="text-negative" @click="onRemove"></q-btn>
            </q-toolbar>

            <!-- Vet Info -->
            <q-card-section class="justify-center" >
              <h6 class="q-my-none">Clinic Info</h6>
              <div v-if="vetInfo">
                <q-input v-model="vetInfo.name" readonly hide-bottom-space label="Clinic Name" borderless class="input q-my-md"></q-input>
                <q-input v-model="vetInfo.contact" readonly hide-bottom-space label="Clinic Contact Number" borderless class="input q-my-md"></q-input>
                <q-input type="textarea" v-model="vetInfo.address" readonly hide-bottom-space label="Clinic Address" borderless class="input q-my-md"></q-input>
              </div>
            </q-card-section>

            <!-- Bottom Button will appear on mobile screen -->
            <!-- <div class="row text-center fixed-bottom">
                <div class="col-xs-12 lt-lg" @click="checkValid">
                    <div class="full-width text-white q-pa-md bg-primary cursor-pointer" v-ripple style="height: 70px;z-index:6000;">
                        <p class="text-weight-bold font-title" style="margin-top: 5px;">Suggest an Edit</p>
                        <span v-else>
                            <q-spinner size="3em"></q-spinner>
                        </span>
                    </div>
                </div>
            </div> -->
        </q-card>
      </q-dialog>
</template>
<script>

export default {
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    vetInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      removeLoader: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    }
  },
  methods: {
    onClose () {
      this.modal = false
      this.$emit('on-close', false)
    },
    onRemove () {
      this.removeLoader = true
      this.$axios.delete(`users/${this.$store.state.user.uuid}/personal-items/${this.$route.params.petId}/vets/${this.vetInfo.id}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('on-remove-vet')
      }).catch(e => {
        console.error(e)
        if (e.response && e.response.data) {
          this.$q.dialog({
            title: this.$t('requests.error.title'),
            message: e.response.data.message
          })
        }
      }).finally(_ => {
        this.onClose()
        this.removeLoader = false
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.text-title
  margin-left: 12%
  font-size: 18px

@media screen and (min-width: 320px)
  .text-title
    margin-left: 14%

@media screen and (min-width: 350px)
  .text-title
    margin-left: 22%

@media screen and (min-width: 370px)
  .text-title
    margin-left: 28%

@media screen and (min-width: 400px)
  .text-title
    margin-left: 38%

@media screen and (min-width: 530px)
  .text-title
    margin-left: 40%

</style>
