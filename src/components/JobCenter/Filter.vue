<template>
 <div class="row no-wrap q-px-sm justify-left hide-scrollbar" style="overflow: auto;" ref="status-scroll-bar" v-if="$store.getters['user/getCurrentLanguage'] !== 'elel'">
  <q-btn :outline="currentFilter !== 'All'" :ripple="false" color="primary" :label="$t('filter.by.all')" class="text-capitalize q-ml-sm q-my-xs" @click="selectFilter('All')" rounded style="min-width: 100px;"></q-btn>
  <q-btn :outline="currentFilter !== 'nego'" :ripple="false" color="primary" :label="$t('negotiating')" class="text-capitalize q-mx-xs q-my-xs" @click="selectFilter('nego')" rounded style="min-width: 100px;"></q-btn>
  <q-btn :outline="currentFilter !== 'hired'" :ripple="false" color="primary" :label="$t('hired.status')" class="text-capitalize q-mx-xs q-my-xs" @click="selectFilter('hired')" rounded style="min-width: 100px;"></q-btn>
  <q-btn :outline="currentFilter !== 'upcoming'" :ripple="false" color="primary" :label="$t('job.filter.status.upcoming')" class="text-capitalize q-mx-xs q-my-xs" @click="selectFilter('upcoming')" rounded style="min-width: 100px;"></q-btn>
  <q-btn :outline="currentFilter !== 'ongoing'" :ripple="false" color="primary" :label="$t('requests.page.inprogress')" class="text-capitalize q-mx-xs q-my-xs" @click="selectFilter('ongoing')" rounded style="min-width: 100px;"></q-btn>
  <q-btn :outline="currentFilter !== 'open'" :ripple="false" :label="$t('earn.now')" color="primary" class="text-capitalize q-mx-xs q-my-xs" @click="selectFilter('open')" rounded style="min-width: 100px;"></q-btn>
  <q-btn :outline="currentFilter !== 'completed'" :ripple="false" :label="$t('requests.page.completed')" color="primary" class="text-capitalize q-mx-xs q-my-xs" @click="selectFilter('completed')" rounded style="min-width: 100px;"></q-btn>
  <q-btn outline :ripple="false" icon="help_outline" color="primary" class="text-capitalize q-mx-xs q-my-xs" @click="openUrl(`${$t('link.href.help.center')}`)" rounded style="min-width: 100px;"></q-btn>
</div>

</template>
<script>
export default {
  data () {
    return {
      currentFilter: this.$store.getters['user/getJobFilter'] || 'All'
    }
  },
  computed: {
    jobFilterStatus () {
      return this.$store.getters['user/getJobFilter']
    }
  },
  watch: {
    jobFilterStatus (value) {
      this.currentFilter = value || 'All'
    }
  },
  methods: {
    prefilledFilter (status) {
      this.currentFilter = status
    },
    adjustIntoView (status) {
      // adjust scroll bar to scroll selected status into view
      switch (status) {
        case 'hired': this.$refs['status-scroll-bar'].scrollLeft = 183; break
        case 'upcoming': this.$refs['status-scroll-bar'].scrollLeft = 256; break

        case 'completed':
        case 'open':
        case 'ongoing': this.$refs['status-scroll-bar'].scrollLeft = 370; break

        default: this.$refs['status-scroll-bar'].scrollLeft = 0; break
      }
    },
    selectFilter (filter) {
      this.sendImpression('Status Filter Change - status bar', filter, 'Job Center')

      this.currentFilter = filter
      this.$store.commit('user/updateJobFilter', filter)

      this.$emit('status-changed', this.currentFilter === 'All' ? null : this.currentFilter)
    }
  }
}
</script>
