<!-- user's balance page -->
<template>
  <div>
    <q-page style="min-height: 100%;">
      <div v-if="accountHistory !== null" class="margin-auto" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}" style="min-height: 80vh;">
        <!-- Summary-->
        <div class="row q-my-md q-mb-lg">
            <!-- My Wallet/Balance -->
            <div class="col-6 text-center" style="border-right: 1px solid lightgrey;">
              <p class="q-my-none text-grey-5">{{$t('profile.wallet')}}</p>
              <p class="q-my-sm font-header-title-large">{{getCurrency(accountHistory.currencyId)}} {{accountHistory.balance}}</p>
            </div>

            <!-- Total Withdrawn -->
            <div class="col-6 text-center" style="border-left: 1px solid lightgrey;">
              <p class="q-my-none text-grey-5">{{$t('total.withdrawn')}}</p>
              <p class="q-my-sm font-header-title-large ">{{getCurrency(accountHistory.currencyId)}} {{accountHistory.totalPayout}}</p>
              <p class="q-my-none text-grey-5" v-if="accountHistory.firstWithdrawalTimestamp">Since {{formatTimeSince(accountHistory.firstWithdrawalTimestamp)}}</p>
            </div>
        </div>

        <!-- Transaction History  -->
        <div class="q-my-md">
            <h6 class="q-my-none q-mx-md">{{$t('transaction.history')}}</h6>
            <p class="q-my-sm q-mx-md text-grey-8">{{$t('account.history.description')}}</p>
            <!-- withdrawal button -->
            <div  v-if="accountHistory && (accountHistory.withdrawAllowed === 1)" class="text-center">
              <q-btn color="primary" class="q-px-xl" :label="$t('withdrawal.title')" :loading="withdrawalLoading" rounded @click="triggerDialogWithdrawal(true)"></q-btn>
            </div>
            <q-list style="padding-bottom: 24%;">
              <!-- title of table list -->
              <q-item style="border-bottom: 1px solid lightgrey;">
                  <q-item-section>
                      <q-item-label class="text-weight-bold font-title">{{$t('date')}}</q-item-label>
                  </q-item-section>

                  <q-item-section>
                      <q-item-label class="text-weight-bold font-title">{{$t('amount')}}</q-item-label>
                  </q-item-section>

                  <q-item-section>
                      <q-item-label class="text-weight-bold font-title">{{$t('note')}}</q-item-label>
                  </q-item-section>
              </q-item>

              <!-- History Items -->
              <q-infinite-scroll @load="onLoad" ref="infinite-scroll">
                <transaction-card v-for="transaction in accountHistoryItems" :key="transaction.id" :transaction="transaction"></transaction-card>
                <template v-slot:loading>
                  <div class="row justify-center q-my-md">
                    <ComponentPreLoader></ComponentPreLoader>
                  </div>
                </template>
              </q-infinite-scroll>
            </q-list>
        </div>
        <div class="fixed-bottom">
          <q-btn class="full-width q-pb-lg q-pt-md" :loading="withdrawalLoading" color="primary" :label="$t('request.withdrawal')" style="border-radius: 15px 15px 0px 0px;" @click="modalWithdrawal = true"></q-btn>
        </div>
      </div>
      <div class="text-center" v-else>
        <ComponentPreLoader></ComponentPreLoader>
      </div>
    </q-page>

    <dialog-withdrawal v-if="accountHistory" @refresh="getAccountInfo()" @on-close="triggerDialogWithdrawal"
      :trigger="modalWithdrawal"
      :minimum="accountHistory.minWithdrawalAmount"
      :currency="getCurrency(accountHistory.currencyId)"
      :currencyId="accountHistory.currencyId"
      :balance="accountHistory.balance"
      :transferrableAmount="accountHistory.transferrableAmount"
      :nonTransferrableAmount="accountHistory.nonTransferrableAmount"
      ></dialog-withdrawal>
  </div>
</template>
<script>
import moment from 'moment'
import countries from 'assets/countries.json'
export default {
  components: {
    'transaction-card': () => import('components/Wallet/TransactionCard.vue'),
    'dialog-withdrawal': () => import('components/Wallet/DialogWithdrawal.vue')
  },
  data () {
    return {
      accountHistory: null,
      accountHistoryItems: [],
      withdrawalLoading: false,
      modalWithdrawal: false,
      countriesWithoutWithdrawal: [
        13, // Australia
        48, // China
        96, // Hong Kong
        106, // India
        159, // Malaysia
        199, // Singapore
        229, // Taiwan
        234 // US
      ],
      onRefresh: false
    }
  },
  created () {
    if (this.$store.getters['user/getUserUuidState'] !== null) {
      this.getAccountInfo()
    }
  },
  methods: {
    formatTimeSince (timestamp) {
      return moment.utc(timestamp).local().format('Do MMMM, YYYY')
    },
    onLoad (index, done) {
      setTimeout(() => {
        this.getAccountInfo(index)
        done()
      }, 1500)
    },
    getAccountInfo (index = 0) {
      if (this.$store.getters['cached/getTransactionHistory'] && index === 0) {
        this.accountHistory = this.$store.getters['cached/getTransactionHistory']
        this.accountHistoryItems = this.$store.getters['cached/getTransactionHistory'].items
      }

      this.$axios.get(`users/${this.$store.state.user.uuid}/accountstatement?per-page=20&page=${index + 1}&country_id=${this.$store.getters['user/getUserPrefferedCurrency']}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 204 || response.data.accountStatementInfo.items.length === 0) {
          if (this.$refs['infinite-scroll']) {
            this.$refs['infinite-scroll'].stop()
          }
        } else if (index === 0) {
          this.accountHistory = response.data.accountStatementInfo
          this.accountHistoryItems = response.data.accountStatementInfo.items

          // cache transaction history
          if (JSON.stringify(this.$store.getters['cached/getTransactionHistory']) !== JSON.stringify(response.data.accountStatementInfo)) {
            this.$store.dispatch('cached/cacheTransactionHistory', response.data.accountStatementInfo)
          }
        } else if (response.data.accountStatementInfo.items.length > 0) {
          this.accountHistoryItems = this.accountHistoryItems.concat(response.data.accountStatementInfo.items)
        } else {
          if (this.$refs['infinite-scroll']) {
            this.$refs['infinite-scroll'].stop()
          }
        }
      }).catch((error) => {
        console.log(error)

        if (error.response.status === 500) {
          if (this.$refs['infinite-scroll']) {
            this.$refs['infinite-scroll'].stop()
          }
        }
      })
    },
    getCurrency (currencyId) {
      return this.$_.findWhere(countries, {'id': currencyId.toString()}).currencyCode
    },
    triggerDialogWithdrawal (status) {
      this.modalWithdrawal = status
    }
  }
}
</script>
