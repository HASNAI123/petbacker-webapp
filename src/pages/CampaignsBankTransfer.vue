<template>
  <q-page padding class="justify-center">
    <div class="row">
        <div class="col-md-12 col-xs-12 q-mb-sm">
          <img :src="$q.platform.is.mobile ? 'statics/images/campaign/summary-header-plain-mobile.jpg' : 'statics/images/campaign/summary-header-plain.jpg' " style="display:block;margin-left:auto;margin-right:auto;" :style="{'height': this.$q.platform.is.mobile ? 'auto;' : '', 'width' : this.$q.platform.is.mobile ? '100%' : ''} " />
        </div>
        <div class="col-md-12 col-xs-12 q-mb-md">
          <p class="text-center" style="font-size:16px;" v-html="$t('selected.bank.transfer.donation')"></p>
        </div>
        <div class="col-md-12 col-xs-12 q-my-md">
          <p class="text-center"><strong>Malaysia (MYR)</strong><br/>{{$t('bank.name.label')}}<strong> CIMB</strong><br/>{{$t('account.name.label')}}<strong> PetBacker Sdn Bhd</strong><br/>{{$t('account.number.label')}}<strong> 8008562866</strong></p>
          <p class="text-center"><strong>Singapore (SGD)</strong><br/>{{$t('bank.name.label')}}<strong> OCBC</strong><br/>{{$t('account.name.label')}}<strong> Petbacker Pte Ltd</strong><br/>{{$t('account.number.label')}}<strong> 712475821001</strong></p>
        </div>
        <div class="col-md-12 col-xs-12 q-my-md">
          <p class="text-center" v-html="$t('submit.bank.transfer.slip.donation')"></p>
        </div>
        <div class="col-md-5 col-xs-12 q-mb-xl q-mt-md margin-auto">
          <div class="text-center row">
            <div class="col-md-6 col-xs-12 q-my-md">
              <q-btn class="q-px-lg text-capitalize row" color="primary" @click="$router.replace({name: 'Campaigns'})" size="lg" label="Select Another Method" >
              </q-btn>
            </div>
            <div class="col-md-6 col-xs-12 q-my-md">
              <q-btn class="text-capitalize row" color="primary" style="padding: 5px 50px" :loading="onFileSelection" size="lg" @click.native="onFileSelection" label="Submit Bank Slip" ></q-btn>
              <input type="file" @change="onFileChange2($event)" ref="selectedFile" accept=".jpg,.jpeg,.png" style="display: none;">
            </div>
          </div>
        </div>
    </div>
  </q-page>
</template>
<script>
import chatMixin from '../mixins/chatMixin.js'
import ImageUploadMixin from '../mixins/imageUploadMixin.js'
export default {
  mixins: [chatMixin, ImageUploadMixin],
  data () {
    return {
      imageUploading: false,
      isSupport: true
    }
  },
  mounted () {
    // listen to ImageUploadMixin callback (image processing)
    this.$on('image-data', this.uploadImageData)
  },
  beforeDestroy () {
    this.$off('image-data')
  },
  methods: {
    uploadImageData (imageBlobData) {
      let vm = this
      this.loader = true
      let formData = new FormData()
      formData.append('imagefile', imageBlobData.blob, 'image.jpg')
      vm.$axios.post('imageupload', formData)
        .then((response) => {
          vm.imageLink = response.data.imageName
          vm.sendImage(vm.isSupport)
        }).catch(e => {
          console.error(e)
          vm.$q.notify(e.response.data.message)
        }).finally(_ => {
          vm.loader = false
        })

      this.messageBox = `Bank transfer payment made for Stray Animals Day Donation`
      this.sendSupportMessage()
      let bookingConfirmed = this.$t('pending.approval')
      let paymentVerify = this.$t('thank.you.bank.slip')
      let ok = this.$t('ok')
      this.imageUploading = false
      setTimeout(() => {
        this.$q.dialog({
          title: bookingConfirmed,
          message: paymentVerify,
          persistent: true,
          ok: ok
        }).onOk(() => {
          this.$router.replace({name: 'CampaignsPaymentSuccess', query: {currency: this.$q.cookies.get('strayDogDonation').split(' ')[0], amount: this.$q.cookies.get('strayDogDonation').split(' ')[1]}})
        })
      }, 400)
    },
    onFileChange2 (event) {
      this.imageUploading = true
      if (!event.target.files[0]) {
        this.imageUploading = false
        return
      }
      this.onFileChange(event, true)
      this.messageBox = `Bank transfer payment made for Stray Animals Day Donation`
      this.sendSupportMessage()
      let bookingConfirmed = this.$t('pending.approval')
      let paymentVerify = this.$t('thank.you.bank.slip')
      let ok = this.$t('ok')
      this.imageUploading = false
      setTimeout(() => {
        this.$q.dialog({
          title: bookingConfirmed,
          message: paymentVerify,
          persistent: true,
          ok: ok
        }).onOk(() => {
          this.$router.replace({name: 'CampaignsPaymentSuccess', query: {currency: this.$q.cookies.get('strayDogDonation').split(' ')[0], amount: this.$q.cookies.get('strayDogDonation').split(' ')[1]}})
        })
      }, 400)
    }
  }
}
</script>
