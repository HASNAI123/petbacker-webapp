<template>
    <q-page>
        <h6 class="q-my-md q-mx-md q-px-xs text-center" style="font-size: 15px;">Select a similar requests you want to extend/re-book</h6>
        <div class="col-md-9 col-xs-12" v-if="requests" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}">
            <!-- Requests -->
            <q-infinite-scroll class="q-pb-lg animate-popup-down" v-if="this.requests !== 'NO CONTENT'" >
                <request-card v-for="requestInfo in requests" :request="requestInfo" :key="requestInfo.id" class="q-my-md" :class="$q.platform.is.mobile ? 'q-mx-lg' : ''"></request-card>
            </q-infinite-scroll>
            <div v-else class="row">
                <div class="q-my-lg text-center" :class="$q.platform.is.mobile ? 'q-mx-lg' : ''">
                    <img src="statics/images/logo-mid.jpg" class="image-upload q-mb-sm" width="25%"/>
                    <!-- <h5 class="q-my-none q-mb-xs" >{{ $t('requests.page.createfirstrequest') }}</h5> -->
                    <p class="q-px-xl">{{ $t('requests.page.makefirstrequest') }}</p>
                    <q-btn class="bg-white" color="primary" outline :label="$t('requests.page.makerequest')" @click.native="goTo('Services')"></q-btn>
                </div>
            </div>
        </div>
        <div class="col-xs-12 text-center" v-else>
            <ComponentPreLoader></ComponentPreLoader>
        </div>
    </q-page>
</template>
<script>
export default {
  components: {
    'request-card': () => import('components/Requests/RequestCard.vue')
  },
  data () {
    return {
      requests: null
    }
  },
  created () {
    this.getRequests()
  },
  methods: {
    getRequests () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.requests = 'NO CONTENT'
        return
      }

      this.$axios.get(`users/${this.$store.getters['user/getUserUuidState']}/requests?page=${this.pageCount}&per_page=20&v=6&status[]=1&status[]=2`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then(response => {
        if (response.data) {
          this.requests = response.data.requestInfo.items
        } else {
          this.requests = 'NO CONTENT'
        }
      }).catch(error => {
        this.forceLogout(error)
      })
    }
  }
}
</script>
