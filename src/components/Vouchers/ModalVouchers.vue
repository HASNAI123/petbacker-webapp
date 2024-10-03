<template>
  <div>
    <!-- Promo Code Modal -->
    <q-dialog v-model="modal" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-down"
      transition-show="slide-up" @hide="closeModal">
      <q-card style="min-width: 300px;min-height: 200px;">
        <q-toolbar class="bg-white" :class="{ 'fixed-top': $q.platform.is.mobile }"
          style="z-index: 5000;border-bottom: solid 1px lightgrey;">
          <q-btn flat round dense v-close-popup icon="close" size="1.3em"></q-btn>
          <q-toolbar-title v-close-popup>
            <h6 class="q-my-none voucher-title">{{ $t('promocode.vouchercode') }}</h6>
          </q-toolbar-title>
          <q-btn v-if="$store.getters['user/getUserUuidState']" flat round dense icon="add"
            @click.native="addPromocodeModal = true"></q-btn>
        </q-toolbar>

        <q-card-section :class="{ 'q-pt-xl': $q.platform.is.mobile }">
          <q-card-section class="q-px-none"
            @click="openUrl(`https://www.petbacker.com/promotions/5th-time-booking-promotion`)">
            <img src="statics/images/Vouchers/10-off.jpg" alt="Discount Voucher 10% off" class="full-width"
              style="border-radius:15px;" />
          </q-card-section>
          <q-card-section class="q-px-none" @click="openNewTab">
            <img src="statics/images/Vouchers/invite-friend-voucher.jpg" alt="Discount Voucher 10% off"
              class="full-width" style="border-radius:15px;" />
          </q-card-section>
          <div class="full-width q-pa-none q-my-none text-weight-bold font-x-large">
            {{ $t('my.vouchers') }}
          </div>
          <div v-if="promocodeItems === 'GUEST'" class="row justify-center">
            <div class="col-12 text-center q-pa-lg tip-desc">
              <p class="q-my-none">Log in or sign up to view and get vouchers for your next booking</p>
            </div>
            <div class='full-width q-px-lg'>
              <q-btn class="full-width text-capitalize q-my-sm" color="primary" :label="$t('login.or.sign.up')"
                @click="onLoginSignUp"></q-btn>
            </div>
          </div>
          <div v-else-if="promocodeItems !== 'GUEST'">
            <q-card-section v-for="promocodeItem in promocodeItems" :key="promocodeItem.id" link
              @click="onSelect(promocodeItem)" class="q-px-none ">
              <div v-if="promocodeItem.discountValue !== 0">
                <div class="promocode_text" v-if="getCurrencyNameFromCountryID(promocodeItem.currencyId) === 'EUR'">{{
      promocodeItem.discountValue + ' ' + getCurrencyNameFromCountryID(promocodeItem.currencyId) }}</div>
                <div class="promocode_text" v-else>{{ getCurrencyNameFromCountryID(promocodeItem.currencyId) + ' ' +
      promocodeItem.discountValue }}</div>
              </div>
              <div v-else-if="promocodeItem.discountPercent !== 0">
                <div class="promocode_text">{{ getDiscountSign(promocodeItem.discountPercent, promocodeItem.currencyId) }}
                </div>
              </div>

              <img :src="promocodeItem.image" :alt="promocodeItem.name" class="full-width" style="border-radius:15px;"
                loading="lazy" />
              <div class="promocode-below-part q-pa-sm q-pl-m">
                <div>{{ promocodeItem.name }}</div>
                <div style="opacity: 0.7">*{{ $t('min.spend') }}:{{ getCurrencyNameFromCountryID(promocodeItem.currencyId)
      + ' ' + promocodeItem.minSpend }}</div>
              </div>
            </q-card-section>
          </div>
          <div v-if="promocodeItems.length === 0" style="text-align: center;">
            <h6>No Vouchers available</h6>
          </div>
          <div v-if="isLoading" class="text-center">
            <ComponentPreLoader></ComponentPreLoader>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Voucher Modal -->
    <addvoucher-modal @error="showError" :trigger="addPromocodeModal" @on-close="closeAddPromocodeModal"
      @promocode-inserted="promocodeInsert"></addvoucher-modal>
  </div>
</template>
<script>
export default {
  components: {
    'addvoucher-modal': () => import('components/Vouchers/ModalAddVoucher.vue')
  },
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    countries: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      addPromocodeModal: false,
      promocodeItems: null,
      modal: false,
      isLoading: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value

      if (value && this.promocodeItems === null) {
        this.getPromoCodes()
      }
    }
  },
  methods: {
    onLoginSignUp () {
      this.closeModal()
      this.$router.replace({ name: 'Logout' })
    },
    openNewTab () {
      if (this.$q.platform.is.cordova) {
        this.$router.push({ name: 'Referrals' })
      } else {
        let referralUrl = this.$router.resolve({ name: 'Referrals' })
        this.openUrl(referralUrl.href)
      }
    },
    showError (value) {
      this.$emit('on-error', value)
    },
    closeModal () {
      this.$emit('on-close', false)
    },
    promocodeInsert (promocode) {
      let item = {
        'referenceCode': promocode
      }
      this.$emit('on-apply-promocode', item)
      this.closeAddPromocodeModal()
    },
    onSelect (promocode) {
      this.loader = true
      this.$emit('on-apply-promocode', promocode)
    },
    closeAddPromocodeModal (value) {
      this.addPromocodeModal = value
    },
    getPromoCodes () {
      this.isLoading = true
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.promocodeItems = 'GUEST'
        this.isLoading = false
        return
      }

      this.$axios.get(`users/${this.$store.state.user.uuid}/promocodes${this.$route.params.response ? `?rsl_id=${this.$route.params.response}` : ''}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.promocodeItems = response.data.promoCodeInfo.items
        this.isLoading = false
      }).catch((error) => {
        console.error(error)
        this.isLoading = false
      })
    },
    getDiscountSign (discountValue, currencyId) {
      if (currencyId === 229 || currencyId === 96) {
        let discountList = 100 - discountValue
        return discountList + ' 折'
      } else {
        return discountValue + '% OFF'
      }
    },
    getCurrencyNameFromCountryID (countryid) {
      if (typeof (countryid) === 'number') {
        return this.$_.findWhere(this.countries, { 'id': countryid.toString() }).currencyCode
      } else if (typeof (countryid) === 'string') {
        return this.$_.findWhere(this.countries, { 'id': countryid }).currencyCode
      } else {
        return countryid
      }
    }
  }
}
</script>
<style lang="stylus">
.promocode_text
 position: absolute;
 top: 23px
 right: 40px
 font-size: 40px
 color: white

.promocode-below-part
 position: absolute
 bottom: 22px
 font-size: 14px
 font-weight: normal
 color: white
 background: rgba(0,0,0,0.5)
 width: 100%
 border-radius: 15px

.voucher-title
 margin-left: 15%

@media screen and (max-width: 320px)
 .promocode_text
  right: 30px
  font-size: 25px
.q-modal-layout
  padding: 10px

@media screen and (min-width: 320px)
 .promocode_text
  right: 10px
  font-size: 24px
 .voucher-title
  margin-left: 12%

@media screen and (min-width: 370px)
 .promocode_text
  right: 20px
  font-size: 28px
 .voucher-title
  margin-left: 18%

@media screen and (min-width: 400px)
 .promocode_text
  right: 25px
  font-size: 28px
 .voucher-title
  margin-left: 21%

@media screen and (min-width: 530px)
 .promocode_text
  top: 25px
  right: 35px
  font-size: 40px
 .voucher-title
  margin-left: 30%
</style>
