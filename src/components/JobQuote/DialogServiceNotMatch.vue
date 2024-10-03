<template>
    <q-dialog v-model="modal" @hide="closePopUp" class="responsive-modal" :maximized="$q.platform.is.mobile" transition-hide="slide-down" transition-show="slide-up">
        <q-card>
          <!-- Header -->
          <q-toolbar style="border-bottom: 1px solid lightgrey;">
            <q-btn flat round dense icon="chevron_left" size="1.3em" v-close-popup></q-btn>
              <q-toolbar-title v-close-popup>
                <h6 class="q-my-none services-title font-header-title">{{$t('create.a.listing')}}</h6>
              </q-toolbar-title>
            <!--<q-btn flat round dense icon="add" ></q-btn>-->
          </q-toolbar>

          <!-- Image -->
          <q-card-section>
            <div class="text-center">
                <img src="statics/images/tip_icon.png" />
            </div>
          </q-card-section>

          <q-card-section v-if="assignedTo && jobType">
            <p class="font-normal q-px-md q-my-md" v-html="$t('job.matched.wrongly.adviced.to.create.new.listing', {jobServiceType: $t(getServiceName(jobType)), assignedServiceType: $t(getServiceName(assignedTo))})"></p>
          </q-card-section>

           <!-- Bottom buttons -->
          <div class="fixed-bottom" v-if="$q.platform.is.mobile">
            <div class="row">
              <q-btn class="col-xs-4 q-py-md" size="md" style="border-radius: 0px;" :ripple="false" :label="$t('proceed')" color="primary" outline @click="$router.replace({name: 'JobQuote', params: {taskId: taskId}, query:{serviceId: jobType, override: true}})"></q-btn>
              <q-btn class="col-xs-8 q-py-md" size="md" style="border-radius: 0px;" :ripple="false" :label="$t('create.listing')" color="primary" @click="$router.push({name: 'CreateListing', params: {serviceId: jobType}, query:{jobId: taskId}})"></q-btn>
            </div>
          </div>
        </q-card>
    </q-dialog>
</template>
<script>
import services from 'assets/services.json'
export default {
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    jobType: {
      type: Number,
      required: true
    },
    assignedTo: {
      type: Number,
      required: true
    },
    taskId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      services: null,
      testServiceInfo: null
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    }
  },
  methods: {
    closePopUp () {
      this.$emit('on-close', false)
    },
    getServiceName (id) {
      for (let items in services) {
        if (services[items].id === id) {
          return services[items].name
        }
      }
      return 'failed'
    }
  }
}
</script>
<style lang="stylus">
.services-title
  margin-left: 22%
</style>
