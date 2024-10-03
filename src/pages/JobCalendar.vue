<template>
    <q-page class="margin-auto" :style="{width: $q.platform.is.mobile ? '100%' : '1030px'}">
        <div>
            <q-date v-model="date"
            :events="events"
            v-touch-swipe.mouse.right="decrementMonth"
            v-touch-swipe.mouse.left="incrementMonth"
            emit-immediately
            event-color="primary"
            class="full-width"
            style="border-radius: 0px;box-shadow: none;"></q-date>
        </div>
        <div>
          <q-tab-panels v-model="date" animated transition-prev="slide-right" transition-next="slide-left" v-if="!loader">
            <q-tab-panel :name="event" class="q-pa-none" v-for="(event, index) in events" :key="index">
              <q-list bordered separator >
                  <q-item clickable v-ripple v-for="eventInfo in eventsInfo[event]" :key="eventInfo.id" @click="$router.push({name: 'JobSummary', params: {taskId: eventInfo.id.toString()}})">
                    <q-item-section>
                      <q-item-label>{{computeServiceName(eventInfo.serviceId)}}</q-item-label>
                      <q-item-label>{{eventInfo.requestInfo.requestDescription.split(', ')[0]}} from {{eventInfo.requestInfo.requestorInfo.username}}</q-item-label>
                      <q-item-label caption>{{computeDuration(eventInfo.requestInfo.requiredTime, eventInfo.requestInfo.duration, eventInfo.id)}}</q-item-label>
                    </q-item-section>
                  </q-item>
              </q-list>
            </q-tab-panel>
          </q-tab-panels>
          <div v-else class="text-center">
            <ComponentPreLoader></ComponentPreLoader>
          </div>
        </div>
    </q-page>
</template>
<script>
import services from 'assets/services.json'
import moment from 'moment'
export default {
  data () {
    return {
      date: moment().format('YYYY/MM/DD'),
      events: [],
      eventsInfo: [],
      currentMonth: null,
      currentYear: null,
      calendarInfo: null,
      loader: false
    }
  },
  created () {
    this.getCalendarInfo()
  },
  watch: {
    date (value) {
      if (value.split('/')[1] !== this.currentMonth || value.split('/')[0] !== this.currentYear) {
        this.getCalendarInfo()
      }
      //    console.log(value)
    }
  },
  methods: {
    decrementMonth () {
      //  console.log('previous month')
    },
    incrementMonth () {
      //  console.log('next month')
    },
    computeDuration (startDate, duration, id) {
      if (duration === 1) {
        return `on ${moment.utc(startDate).local().format('DD MMM')}`
      } else {
        return `from ${moment.utc(startDate).local().format('DD MMM')} to ${moment.utc(startDate).local().add(duration - 1, 'days').format('DD MMM')}`
      }
    },
    getCalendarInfo () {
      this.loader = true

      // get current month and year (calendar pagination)
      let currentDate = this.date.split('/')
      this.currentMonth = currentDate[1]
      this.currentYear = currentDate[0]

      this.$axios.get(`users/${this.$store.getters['user/getUserUuidState']}/taskscalendar?fromdate=01-${currentDate[1]}-${currentDate[0]}&todate=30-${currentDate[1]}-${currentDate[0]}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.calendarInfo = response.data.taskCalendarInfo.items
        for (let index in response.data.taskCalendarInfo.items) {
          if (!this.events.includes(moment.utc(response.data.taskCalendarInfo.items[index].requestInfo.requiredTime).local().format('YYYY/MM/DD'))) {
            this.events.push(moment.utc(response.data.taskCalendarInfo.items[index].requestInfo.requiredTime).local().format('YYYY/MM/DD'))
            this.eventsInfo[moment.utc(response.data.taskCalendarInfo.items[index].requestInfo.requiredTime).local().format('YYYY/MM/DD')] = []
          }

          let duplicate = this.$_.findWhere(this.eventsInfo[moment.utc(response.data.taskCalendarInfo.items[index].requestInfo.requiredTime).local().format('YYYY/MM/DD')], {'id': response.data.taskCalendarInfo.items[index].id})
          if (!duplicate) {
            this.eventsInfo[moment.utc(response.data.taskCalendarInfo.items[index].requestInfo.requiredTime).local().format('YYYY/MM/DD')].push(response.data.taskCalendarInfo.items[index])
          }
        }

        // duplicate events for the amount of durations
        for (let i in response.data.taskCalendarInfo.items) {
          for (let duration = 1; duration < (response.data.taskCalendarInfo.items[i].requestInfo.duration); duration++) {
            if (!this.events.includes(moment.utc(response.data.taskCalendarInfo.items[i].requestInfo.requiredTime).local().add(duration, 'days').format('YYYY/MM/DD'))) {
              this.events.push(moment.utc(response.data.taskCalendarInfo.items[i].requestInfo.requiredTime).local().add(duration, 'days').format('YYYY/MM/DD'))
              this.eventsInfo[moment.utc(response.data.taskCalendarInfo.items[i].requestInfo.requiredTime).local().add(duration, 'days').format('YYYY/MM/DD')] = []
            }

            let duplicate = this.$_.findWhere(this.eventsInfo[moment.utc(response.data.taskCalendarInfo.items[i].requestInfo.requiredTime).local().add(duration, 'days').format('YYYY/MM/DD')], {'id': response.data.taskCalendarInfo.items[i].id})
            if (!duplicate) {
              this.eventsInfo[moment.utc(response.data.taskCalendarInfo.items[i].requestInfo.requiredTime).local().add(duration, 'days').format('YYYY/MM/DD')].push(response.data.taskCalendarInfo.items[i])
            }
          }
        }
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.loader = false
      })
    },
    computeServiceName (serviceId) {
      return this.$t(this.$_.findWhere(services, {'id': serviceId}).name)
    }
  }
}
</script>
