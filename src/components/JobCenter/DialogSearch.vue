<template>
  <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-down" transition-show="slide-up">
    <q-card class="q-pb-xl">
        <!-- Header -->
        <q-toolbar style="border-bottom: 1px solid lightgrey;">
          <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
          <q-toolbar-title v-close-popup>
            <h6 class="q-my-none search-title">{{$t('job.search.title')}}</h6>
          </q-toolbar-title>
        </q-toolbar>

        <q-card-section>
            <q-input class="input" ref="searchBox" v-model="searchKeyword" clearable :label="$t('search.backer.name')" dense borderless>
                <template slot="append">
                  <q-icon name="fas fa-search"></q-icon>
                </template>
            </q-input>

            <!-- Keywords search filter -->
            <!-- <q-btn-toggle
              v-model="keywordFilter"
              no-caps
              unelevated
              spread
              rounded
              class="q-mt-md"
              toggle-color="primary"
              color="white"
              text-color="primary"
              style="border: 1px solid #9B89B9;"
              :options="[
                {label: $t('filter.by.owner.name'), value: 'name'},
                {label: $t('filter.by.job.reference'), value: 'job_ref'}
              ]"
            ></q-btn-toggle> -->
        </q-card-section>

        <!-- Private or all Filter -->
        <!-- <q-card-section>
            <q-btn-toggle
              v-model="filterType"
              no-caps
              unelevated
              spread
              rounded
              toggle-color="primary"
              color="white"
              text-color="primary"
              style="border: 1px solid #9B89B9;"
              :options="[
                {label: $t('filter.by.all'), value: 'All'},
                {label: $t('filter.by.private'), value: 'Private'}
              ]"
            ></q-btn-toggle>
        </q-card-section> -->

        <!-- Service Type Filter -->
        <q-card-section class="q-my-sm">
          <p class="text-grey-6 text-center">{{$t('select.job.service.type.or.all')}}</p>
          <div class="row">
            <q-btn :outline="serviceType !== 5" @click="onChangeServiceFilter(5)" rounded :label="$t('services.petboarding.short')" color="primary" class="col-3 text-capitalize q-ml-xs q-mb-sm"></q-btn>
            <q-btn :outline="serviceType !== 22" @click="onChangeServiceFilter(22)" rounded :label="$t('services.pettaxi.short')" color="primary" padding="0px" class="col text-capitalize q-ml-xs q-mb-sm"></q-btn>
            <q-btn :outline="serviceType !== 28" @click="onChangeServiceFilter(28)" rounded :label="$t('services.pettraining.short')" color="primary" class="col-3 text-capitalize q-ml-xs q-mb-sm"></q-btn>
            <q-btn :outline="serviceType !== 19" @click="onChangeServiceFilter(19)" rounded :label="$t('services.petgrooming.short')" color="primary" class="col-3 text-capitalize q-ml-xs q-mb-sm"></q-btn>
            <q-btn :outline="serviceType !== 16" @click="onChangeServiceFilter(16)" rounded :label="$t('services.dogwalking.short')" color="primary" class="col-3 text-capitalize q-ml-xs q-mb-sm"></q-btn>
            <q-btn :outline="serviceType !== 8" @click="onChangeServiceFilter(8)" rounded :label="$t('services.petdaycare.short')" color="primary" class="col-3 text-capitalize q-ml-xs q-mb-sm"></q-btn>
            <q-btn :outline="serviceType !== 13" @click="onChangeServiceFilter(13)" rounded :label="$t('services.pethousesitting.short')" color="primary" class="col text-capitalize q-ml-xs q-mb-sm"></q-btn>
            <q-btn :outline="serviceType !== 25" @click="onChangeServiceFilter(25)" rounded :label="$t('services.veterinarian.short')" color="primary" class="col-3 text-capitalize q-ml-xs q-mb-sm"></q-btn>
          </div>
        </q-card-section>

        <!-- Job Status Filter -->
        <q-card-section class="q-my-sm">
          <p class="text-grey-6 text-center">{{$t('select.job.status.to.search')}}</p>
          <div class="row">
            <q-btn :outline="statusType !== 'All'" @click="onChangeStatusFilter('All')" rounded :label="$t('filter.by.all')" color="primary" class="col text-capitalize q-ml-xs q-mb-sm"></q-btn>
            <q-btn :outline="statusType !== 'cancel'" @click="onChangeStatusFilter('cancel')" rounded :label="$t('decline')" color="primary" class="col-3 text-capitalize q-ml-xs q-mb-sm"></q-btn>
            <q-btn :outline="statusType !== 'hired'" @click="onChangeStatusFilter('hired')" rounded :label="$t('hired.status')" color="primary" class="col-3 text-capitalize q-ml-xs q-mb-sm"></q-btn>
            <q-btn :outline="statusType !== 'nego'" @click="onChangeStatusFilter('nego')" rounded :label="$t('requests.page.negotiation')" color="primary" class="col-3 text-capitalize q-ml-xs q-mb-sm"></q-btn>
          </div>
          <div class="row">
            <q-btn :outline="statusType !== 'upcoming'" @click="onChangeStatusFilter('upcoming')" rounded :label="$t('job.filter.status.upcoming')" color="primary" class="col text-capitalize q-ml-xs q-mb-sm"></q-btn>
            <q-btn :outline="statusType !== 'ongoing'" @click="onChangeStatusFilter('ongoing')" rounded :label="$t('requests.page.inprogress')" color="primary" class="col text-capitalize q-ml-xs q-mb-sm"></q-btn>
          </div>
          <div class="row q-mx-sm">
            <q-btn :outline="statusType !== 'open'" @click="onChangeStatusFilter('open')" rounded :label="$t('earn.now')" color="primary" class="col-8 text-capitalize q-mb-sm"></q-btn>
            <q-btn :outline="statusType !== 'completed'" @click="onChangeStatusFilter('completed')" rounded :label="$t('requests.page.completed')" color="primary" class="col text-capitalize q-ml-xs q-mb-sm"></q-btn>
          </div>
        </q-card-section>

        <!-- Bottom buttons on mobile -->
        <div class="fixed-bottom" style="border-top: solid 1px lightgrey;" v-if="$q.platform.is.mobile">
          <div class="row q-pa-md q-pb-lg bg-white">
            <q-btn class="col text-weight-bold q-mx-sm" style="border-radius: 6px;" :ripple="false" :label="$t('reset')" @click="onReset" color="primary" outline></q-btn>
            <q-btn class="col-8 text-weight-bold q-mx-xs" style="border-radius: 6px;" :ripple="false" :label="$t('apply')" @click.native="onApply" color="primary"></q-btn>
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
      required: true
    }
  },
  data () {
    return {
      searchKeyword: null,
      modal: false,
      keywordFilter: 'name',
      filterType: 'All',
      serviceType: null,
      statusType: this.$store.getters['user/getJobFilter']
    }
  },
  computed: {
    jobFilterStatus () {
      return this.$store.getters['user/getJobFilter']
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
    },
    jobFilterStatus (value) {
      this.statusType = value
    }
  },
  methods: {
    onPrefilled (data) {
      this.searchKeyword = data.searchKeyword
      this.keywordFilter = data.keywordFilter
      this.filterType = data.filterType
      this.serviceType = data.serviceType
      this.statusType = data.statusType
    },
    onClear () {
      this.searchKeyword = null
      this.keywordFilter = 'name'
      this.filterType = 'All'
      this.serviceType = null
      this.statusType = null
    },
    onReset () {
      this.searchKeyword = null
      this.keywordFilter = 'name'
      this.filterType = 'All'
      this.serviceType = null
      this.statusType = null
      this.$store.commit('user/updateJobFilter', this.statusType)

      let form = {
        searchKeyword: this.searchKeyword,
        keywordFilter: null,
        filterType: this.filterType,
        serviceType: this.serviceType,
        statusType: this.statusType
      }

      this.$emit('on-reset', form)
      this.closePopUp()
    },
    onApply () {
      if (this.statusType === 'All') {
        this.statusType = null
      }

      let form = {
        searchKeyword: this.searchKeyword,
        keywordFilter: this.keywordFilter,
        filterType: this.filterType,
        serviceType: this.serviceType,
        statusType: this.statusType
      }
      this.$store.commit('user/updateJobFilter', this.statusType)

      this.$emit('on-search', form)
      this.closePopUp()
    },
    onChangeStatusFilter (status) {
      this.sendImpression('Status Filter Change - search', status, 'Job Center')
      if (this.statusType === status) {
        this.statusType = null
      } else {
        this.statusType = status
      }
    },
    onChangeServiceFilter (service) {
      this.sendImpression('Service Filter Change - search', status, 'Job Center')
      if (service === this.serviceType) {
        this.serviceType = null
      } else {
        this.serviceType = service
      }
    },
    closePopUp () {
      this.modal = false
      this.$emit('on-close', false)
    }
  }
}
</script>
<style lang="stylus">
.search-title
  margin-left: 28%
</style>
