<template>
  <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" transition-hide="slide-down" transition-show="slide-up">
    <q-card>
      <q-toolbar class="q-pl-xs fixed-top bg-white" style="border-bottom: solid 1px lightgrey;z-index: 3000;">
        <q-btn flat round dense v-close-popup size="1.3em" class="q-ml-xs" icon="chevron_left"/>
        <q-toolbar-title v-close-popup>
          <h6 class="q-my-none benefits-title font-normal">{{$t('job.scam.title')}}</h6>
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section class="q-pt-none q-px-none">
        <!-- <div class="margin-auto">
            <img style="max-width:100%;" src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewartop.png" />
        </div> -->
        <div class="text-center q-mt-xl q-pt-md">
            <h4 class="q-my-none text-uppercase" style="color: #570a90;"><strong>{{$t('job.scam.title')}}</strong></h4>
        </div>
        <p class="text-center q-pa-md">{{$t('job.scam.summary')}}</p>
        <table cellspacing="0" cellpadding="0">
            <tr>
                <td class="text-center">
                    <img src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno9.png"/>
                </td>
                <td>
                    <p>{{$t('job.scam.cash.payment')}}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>{{$t('job.scam.request.payment.outside')}}</p>
                </td>
                <td class="text-center"><img style="-webkit-user-select: none;" src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno10.png"></td>
            </tr>
            <tr>
                <td class="text-center"><img src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno1.png"></td>
                <td>
                    <p>{{$t('job.scam.request.revise.booking')}}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>{{$t('job.scam.promote.other.platform')}}</p>
                    <p>{{$t('job.scam.request.contact.outside')}}</p>
                </td>
                <td class="text-center"> <img style="-webkit-user-select: none;" src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno3.png"></td>
            </tr>
            <tr>
                <td class="text-center"><img src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno4.png"></td>
                <td>
                    <p>{{$t('job.scam.activity.before.payment')}}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>{{$t('job.scam.unreasonable.rate')}}</p>
                </td>
                <td class="text-center"><img style="-webkit-user-select: none;" src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno5.png"></td>
            </tr>
            <tr>
                <td class="text-center"><img style="-webkit-user-select: none;" src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno67.png"></td>
                <td>
                    <p>{{$t('job.scam.unreasonable.cancellation')}}</p>
                    <p>{{$t('job.scam.subsequent.booking.outside')}}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>{{$t('job.scam.misleading.customers')}}</p>
                </td>
                <td class="text-center"><img style="-webkit-user-select: none;" src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno8.png"></td>
            </tr>
        </table>
        <div style="border: 1px solid lightgrey;border-radius: 11px;" class="q-mt-sm q-mb-xl q-mx-xs">
          <p class="text-center q-pa-sm q-my-none">{{$t('do.inform.us.for.help')}}<br/>{{$t('ps.account.restrictions.remove')}}</p>
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
      modal: false
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
    }
  }
}
</script>
<style lang="stylus">
.benefits-title
  margin-left: 12%

@media screen and (min-width: 320px)
  .benefits-title
    margin-left: 27%

@media screen and (min-width: 350px)
  .benefits-title
    margin-left: 30%

@media screen and (min-width: 370px)
  .benefits-title
    margin-left: 31%

@media screen and (min-width: 400px)
  .benefits-title
    margin-left: 32%

@media screen and (min-width: 530px)
  .benefits-title
    margin-left: 30%

table
  border: none
td
  padding: 15px
tr:nth-child(even)
  background-color:#FDF8FF
</style>
