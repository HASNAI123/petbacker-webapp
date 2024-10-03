<template>
  <q-page>
    <div :style="{width: this.$q.platform.is.mobile ? '100%' : '1030px'}" class="margin-auto">
      <div :style="{'min-height': $q.platform.is.mobile ? '190px;' : '330px'}">
        <img src="statics/images/support-help.jpg" height="190px" width="100%" alt="Petbacker Support" style="object-fit:cover;" loading="lazy" decoding="async" />
      </div>

      <!-- <q-card style="border-radius: 10px;" class="support-card-position">
        <q-card-section class="q-pb-sm q-pt-none q-px-sm text-center row text-primary">
          <div class="col-md-3 col-xs-3 q-mx-sm" style="width: 54px;">
              <div class="q-px-sm selected-button" style="border-radius:50px;height:45px;margin-top: 10%;">
                <q-icon name="fas fa-inbox" style="margin-top: 23%;" size="30px"></q-icon>
              </div>
              <p class="font-x-small text-primary q-my-none font-x-small">Inbox</p>
          </div>
          <div class="col-md-3 col-xs-3 q-mx-sm" style="width: 100px;" @click="$router.push('/chat/support-enquiry')">
              <div class="q-px-xs q-pt-sm" style="border-radius:50px;height:50px;">
                  <q-icon name="fas fa-vote-yea" size="35px"></q-icon>
              </div>
              <p class="font-x-small text-primary q-my-none font-x-small">Submit Enquiry</p>
          </div>
          <div class="col-md-3 col-xs-3 q-mr-sm q-ml-xs" style="width: 56px;" @click="openUrl($t('link.href.help'))">
              <div class="q-px-xs q-pt-sm" style="border-radius:50px;height:50px;">
                  <q-icon name="far fa-question-circle" style="margin-top: 10%;" size="30px"></q-icon>
              </div>
              <p class="font-x-small text-primary q-my-none font-x-small">FAQs</p>
          </div>
        </q-card-section>
      </q-card> -->

      <div class="q-px-md">
        <div class="div-hi">
          <div class="hi">
            <span>{{$t('hi')}}</span>
            <!-- <img width="26" src="statics/icons/hi.jpg" /> -->
            <q-icon name="img:statics/icons/custom-icon/hi.jpg" size="26px"></q-icon>
          </div>
          <p class="para">{{$t('keep.your.communication.in.one.message')}} </p>
        </div>
        <q-btn class="col-md-12 q-mb-sm q-mt-md q-mx-md primary q-px-lg bg-primary text-white full-width" size="md" @click="$router.push('/chat/support-enquiry')">
          {{$t('submit_a_new_enquiry')}}
        </q-btn>
        <!-- <q-btn v-if="ticketsInfo.length === 0" class="col-md-12 q-mb-sm q-mt-sm q-mx-md primary q-px-lg full-width" color="primary" outline size="md" @click="$router.push({name: 'ChatSupport', params: {ticketId: 0}})">
          {{$t('check_previous_messages')}}
          <span class="notification-dot" v-if="this.$store.getters['user/getUnreadSupportMessage'] > 0"></span>
        </q-btn> -->
        <q-separator class="full-width q-my-lg"></q-separator>
        <q-label class="font-normal text-weight-medium q-ma-none">{{$t('your.tickets')}}</q-label>
      </div>

      <q-infinite-scroll @load="onLoadTickets" :offset="250" debounce="500" class="q-pb-lg">
        <ticket-card v-for="(ticket, index) in ticketsInfo" :key="ticket.id" :index="index" :ticketInfo="ticket"></ticket-card>
        <template v-slot:loading>
          <div class="row justify-center q-my-lg">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </q-page>
</template>

<script>
export default {
  components: {
    'ticket-card': () => import('components/HelpCenter/TicketCard.vue')
  },
  data () {
    return {
      messageInfo: null,
      chatInterval: null,
      notified: false,
      ticketsInfo: []
    }
  },
  created () {
    this.$store.commit('user/updateUserFooterVisibilityState', false)
  },
  methods: {
    onLoadTickets (index, done) {
      if (index === 1 && this.$store.getters['cached/getSupportTicketsCached']) {
        this.ticketsInfo = this.$store.getters['cached/getSupportTicketsCached']
      }

      this.$axios.get(`helpdesk-tickets?uuid=${this.$store.state.user.uuid}&per_page=10&page=${index}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 204) {
          done(true)
        } else {
          if (index === 1) {
            this.ticketsInfo = response.data.ticketInfo.items

            if (JSON.stringify(this.$store.getters['cached/getSupportTicketsCached']) !== JSON.stringify(response.data.ticketInfo.items)) {
              this.$store.dispatch('cached/cacheSupportTickets', response.data.ticketInfo.items)
            }
          } else {
            this.ticketsInfo = this.ticketsInfo.concat(response.data.ticketInfo.items)
          }
        }
      }).catch((error) => {
        this.forceLogout(error)
        console.error(error)
      }).finally(_ => {
        done()
      })
    }
  },
  beforeDestroy () {
    this.$store.commit('user/updateUserFooterVisibilityState', true)
  }
}
</script>
<style lang="stylus">
// .support-card-position
//   position: absolute
//   top: 160px
//   display: block

// @media only screen and (min-width: 320px)
//   .support-card-position
//     position: absolute
//     top: 125px
//     display: block
//     margin-left: 4%

// @media only screen and (min-width: 350px)
//   .support-card-position
//     position: absolute
//     top: 125px
//     display: block
//     margin-left: 8%

// @media only screen and (min-width: 370px)
//   .support-card-position
//     position: absolute
//     top: 125px
//     display: block
//     margin-left: 11%

// @media only screen and (min-width: 390px)
//   .support-card-position
//     position: absolute
//     top: 125px
//     display: block
//     margin-left: 12.5%

// @media only screen and (min-width: 410px)
//   .support-card-position
//     position: absolute
//     top: 125px
//     display: block
//     margin-left: 17%

// @media only screen and (min-width: 440px)
//   .support-card-position
//     position: absolute
//     top: 125px
//     display: block
//     margin-left: 17%

// @media only screen and (min-width: 500px)
//   .support-card-position
//     position: absolute
//     top: 120px
//     display: block
//     margin-left: 20%

// @media only screen and (min-width: 750px)
//   .support-card-position
//     position: absolute
//     top: 120px
//     display: block
//     margin-left: 32%

// @media only screen and (min-width: 1024px)
//   .support-card-position
//     position: absolute
//     top: 120px
//     display: block
//     margin-left: 35%

// @media only screen and (min-width: 1300px)
//   .support-card-position
//     position: absolute
//     top: 120px
//     display: block
//     margin-left: 35%

// @media only screen and (min-width: 1600px)
//   .support-card-position
//     position: absolute
//     top: 120px
//     display: block
//     margin-left: 36%
.hi {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  img{
    margin-left: 6px;
  }
}
.para{
  font-size: 15px;
  line-height: 1.2;
  margin: 0;
}
.div-hi{
  max-width: 700px;
  margin: 0 auto;
  margin-top: 5px;
}
</style>
