<template>
  <div :class="$store.getters['user/getCurrentLanguage'] === 'elel' ? 'q-mt-lg q-pt-sm' : 'q-pt-sm'">
    <q-input v-model="searchInput" class="input text-capitalize" readonly ref="search" @click.native="openSearchDialog" :label="$t('tap.here.to.search.jobs')" dense borderless>
      <template slot="append">
        <q-icon name="fas fa-search"></q-icon>
      </template>
    </q-input>

    <!-- Search Dialog -->
    <dialog-search ref="dialog-job-search" :trigger="modalSearchDialog" @on-close="closeSearchDialog" @on-search="onSearch" @on-reset="onReset"></dialog-search>
  </div>
</template>
<script>
import services from 'assets/services.json'
export default {
  components: {
    'dialog-search': () => import('components/JobCenter/DialogSearch.vue')
  },
  data () {
    return {
      searchInput: null,
      modalSearchDialog: false
    }
  },
  methods: {
    prefilledSearch (data) {
      if (data.searchKeyword) {
        this.searchInput = data.searchKeyword
      } else if (data.serviceType) {
        this.searchInput = this.$t(this.$_.findWhere(services, {'id': data.serviceType}).name)
      } else {
        this.searchInput = null
      }

      this.$refs['dialog-job-search'].onPrefilled(data)
    },
    clearSearch () {
      this.searchInput = null
      if (this.$refs['dialog-job-search']) {
        this.$refs['dialog-job-search'].onClear()
      }
    },
    onReset (searchInfo) {
      this.searchInput = null
      this.$emit('on-reset', searchInfo)
    },
    onSearch (searchInfo) {
      if (searchInfo.searchKeyword) {
        this.searchInput = searchInfo.searchKeyword
      } else if (searchInfo.serviceType) {
        this.searchInput = this.$t(this.$_.findWhere(services, {'id': searchInfo.serviceType}).name)
      } else {
        this.searchInput = null
      }

      this.$emit('on-search', searchInfo)
    },
    closeSearchDialog (value) {
      this.modalSearchDialog = value
    },
    openSearchDialog () {
      this.modalSearchDialog = true
    }
  }
}
</script>
