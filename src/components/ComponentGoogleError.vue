<template>
  <q-dialog v-model="successModal"   :content-css="{width: 'auto', height: 'fit-content', background: 'transparent', boxShadow: 'none'}" @click.stop="">
      <q-card style="overflow: visible; border-radius: 11px;" @click.stop="">
        <q-card-section style="min-height: 150px;min-width: 250px;max-width: 280px;" class="q-px-none q-py-sm">
          <div class="tip-bulb">
              <img src="statics/images/logo-mid.jpg" class="tip-bulb-image">
          </div>
          <div class="bg-white q-mt-lg">
              <div class="row justify-center">
                <div style="display: flex; justify-content: center; align-items: center;">
  <h6 style="margin: 0; text-align: center;" class="q-font-bold">

    <div>
      <span  style="display: block; font-size: 16px;">Google login was not successful. Please try another login method.</span> <br>
    </div>
  </h6>
</div>

            <q-card-section class="q-pa-none text-center q-pb-lg" style="width: 100%; padding-bottom: 0px;">

</q-card-section>

            <!-- <q-btn style="margin-bottom: 0;" label="Close" color="primary" @click="closeModal" /> -->

              </div>
              <div class='full-width q-px-md'>
               <!--  <q-btn class="full-width text-capitalize q-my-sm text-primary" flat v-if="learnMoreLink" @click="openUrl(learnMoreLink)">{{$t('chat.learnmore')}}</q-btn> -->
                <q-btn  @click="closeModal" class="full-width text-capitalize q-my-sm" color="primary" label="Close" ></q-btn>
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
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      successModal: false,
      title: null,
      message: null
    }
  },
  watch: {
    trigger (newVal) {
      if (newVal) {
        this.showDialog()
        console.log('did this start ?')
      }
    }
  },
  methods: {
    showDialog () {
      // Logic to show the dialog
      this.successModal = true
      // Set title and message values if needed
      // this.title = ...
      // this.message = ...
    },
    closeModal () {
      // Logic to close the dialog
      this.successModal = false
      this.$emit('google-close')
    }
    // Other methods...
  }
}
</script>

<style lang="stylus">
.thanks
  font-size: 12px
  padding: 15px
  padding-right: 10px

  .q-dialog {
  max-width: 25vw; /* set to 25% of the viewport width */
  margin: auto;
}

</style>
