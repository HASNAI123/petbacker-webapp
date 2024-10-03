<template>
    <q-dialog v-model="modal" @hide="closePopUp" maximized transition-show="slide-up" transition-hide="slide-down" style="z-index: 500;">
        <q-card class="q-pa-none">
            <q-toolbar class="q-pl-xs">
                <q-btn flat round dense v-close-popup size="lg" icon="chevron_left"></q-btn>
                <q-toolbar-title v-close-popup>
                    <h6 class="q-my-none add-pet-title">{{$t('add.pet')}}</h6>
                </q-toolbar-title>
                <q-btn flat round v-close-popup class="text-capitalize" :label="$t('skip')"></q-btn>
            </q-toolbar>

            <q-img class="image-upload" src="statics/images/personal_items_header.jpg" basic style="height: 280px;"></q-img>

            <q-card-section class="font-normal q-mt-md">
              <p >{{$t('add.personal.items.prompt')}}</p>
              <ul>
                <li>{{$t('record.vaccinations')}}</li>
                <li>{{$t('reminder.on.next.vaccination')}}</li>
                <li>{{$t('pet.walk.with.map.recorded')}}</li>
                <li>{{$t('get.pet.homestay')}}</li>
                <li>{{$t('and.more')}}</li>
              </ul>
              <q-checkbox v-model="offReminder" size="xxs" :label="$t('no.pets.do.not.remind.me.again')" class="text-grey-6"/>
            </q-card-section>

            <div class="fixed-bottom bg-primary" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" @click="onNext">
                <div class="q-pa-md q-pb-lg">
                    <div class="text-white q-pb-sm text-center cursor-pointer font-header-title">
                        <span>{{$t('button.next')}}</span>
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
      default: true
    }
  },
  data () {
    return {
      modal: false,
      offReminder: false,
      personalItems: []
    }
  },
  mounted () {
    if (this.$route.name === 'MobileDashboard' && (this.$store.getters['cached/getPersonalItemsCached'] === null || (this.$store.getters['cached/getPersonalItemsCached'].items && (this.$store.getters['cached/getPersonalItemsCached'].items.length === 0 && this.$store.getters['cached/getPersonalItemsCached'].hide === false)))) {
      this.getPersonalItems()
    }
  },
  computed: {
    currentRoute () {
      return this.$route.name
    }
  },
  watch: {
    currentRoute (to, fromRoute) {
      if ((fromRoute === 'Index' || fromRoute === 'LoginEmail' || fromRoute === 'OAuthFacebook' || fromRoute === 'SignupEmail' || fromRoute === 'ReferralSignup') && to === 'MobileDashboard' && (this.$store.getters['cached/getPersonalItemsCached'] === null || (this.$store.getters['cached/getPersonalItemsCached'].items && (this.$store.getters['cached/getPersonalItemsCached'].items.length === 0 && this.$store.getters['cached/getPersonalItemsCached'].hide === false)))) {
        if (parseInt(this.$route.query.createListing) === 1) {
          return
        }

        this.getPersonalItems()
      }
    }
  },
  methods: {
    getPersonalItems () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        return
      }

      this.$axios.get(`users/${this.$store.state.user.uuid}/personal-items?v=8`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.personalItems = response.data.personalItemsInfo.items
        if (response.data.personalItemsInfo.items.length === 0) {
          // no need this pop up for now
          // this.modal = true
        }

        let cacheInfo = {
          items: this.personalItems,
          hide: this.offReminder
        }

        if (!this.$store.getters['cached/getPersonalItemsCached']) {
          this.$store.dispatch('cached/cachePersonalItems', cacheInfo)
        } else if (JSON.stringify(response.data.personalItemsInfo.items) !== this.$store.getters['cached/getPersonalItemsCached'].items) {
          if (this.$store.getters['cached/getPersonalItemsCached'] && this.$store.getters['cached/getPersonalItemsCached'].hasOwnProperty('hide')) {
            cacheInfo.hide = this.$store.getters['cached/getPersonalItemsCached'].hide
          }

          this.$store.dispatch('cached/cachePersonalItems', cacheInfo)
        }
      }).catch((e) => {
        console.error(e)
      })
    },
    onNext () {
      this.$router.push({name: 'MyPets'})
      this.closePopUp()
    },
    closePopUp () {
      let cacheInfo = {
        items: this.personalItems,
        hide: this.offReminder
      }
      this.$store.dispatch('cached/cachePersonalItems', cacheInfo)

      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
<style lang="stylus">
.add-pet-title
  margin-left: 12%

@media screen and (min-width: 320px)
  .add-pet-title
    margin-left: 27%

@media screen and (min-width: 350px)
  .add-pet-title
    margin-left: 30%

@media screen and (min-width: 370px)
  .add-pet-title
    margin-left: 31%

@media screen and (min-width: 400px)
  .add-pet-title
    margin-left: 34%

@media screen and (min-width: 530px)
  .add-pet-title
    margin-left: 30%
</style>
