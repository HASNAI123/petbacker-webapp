<!-- for payout type dialog in payout page-->
<template>
  <q-dialog
      v-model="modal"
      position="bottom"
      @hide="closePopUp"
      class="responsive-modal"
      transition-hide="slide-down"
      transition-show="slide-up"
  >
    <q-card style="border-top-left-radius:11px;border-top-right-radius:11px;" class="q-pb-lg q-pt-sm" >
        <q-card-section class="q-pa-none text-center q-pb-xs" style="width: 100%;">
          <div v-for="payOption in bankContent" :key="payOption.payout_method_id">
            <q-btn :ripple="false" class="q-py-sm full-width text-capitalize font-normal" flat :label="payOption.name" @click="onSelect(payOption.payout_method_id)"></q-btn>
          </div>
            <div class="q-pa-sm"><q-separator/></div>
            <q-btn :ripple="false" flat class="full-width q-py-md text-weight-bold text-capitalize" text-color="black" @click="closePopUp">{{$t('close')}}</q-btn>
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
      bankContent: [],
      // payoutNum: 0,
      // paymentChoiceNum: this.bankContent[index].payout_method_id,
      // optionSelected: this.bankContent.payout_method_id,
      // payoutOptions: [],
      modal: false
      // ,
      // excludePaypal: [
      //   106, // India
      //   159, // Malaysia
      //   199, // Singapore
      //   102, // Indonesia
      //   219, // Thailand
      //   70, // Europe
      //   78, // UK
      //   96 // Hong Kong
      // ],
      // bank: [
      //   106, // India
      //   159, // Malaysia
      //   199, // Singapore
      //   96, // Hong Kong
      //   102, // Indonesia
      //   219, // Thailand
      //   70, // Europe
      //   78, // UK
      //   49, // Colombia,
      //   31 // Brazil
      // ],
      // wechat: [48]
    // zelle: [234]
    }
  },
  mounted () {
    this.$axios.get(`https://pbapistaging.forwen.com/v5/users/${this.$store.state.user.uuid}/payoutchoices`, {
      headers: {
        'Authorization': this.$store.getters['user/authorizationHeader']
      }
    }).then(response => {
      this.bankContent = response.data.payoutsMethodsInfo.payoutOption

      // questionnaire is in JSON format, must parse it to access its string
      // const questionnaire = JSON.parse(this.bankContent[0].questionnaire)
      // this.bankQuestions = questionnaire.question
      // console.log('this is GET data ' + response.data)
      // console.log('this is a content: ' + this.bankQuestions)
    }).catch(error => {
      console.log('Oops an error occurred: ' + error)
    })
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    }
  },
  methods: {
    // setPayoutVal (value) {
    //   this.payoutNum = value
    //   console.log(this.payoutNum)
    //   this.onSelect(this.payoutNum)
    // },
    onSelect (paymentMethod) {
      // console.log('hi')
      // console.log(paymentMethod)
      this.$emit('on-select', paymentMethod)
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
