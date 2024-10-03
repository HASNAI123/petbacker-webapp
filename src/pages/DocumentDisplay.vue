<template>
    <q-page padding>
        <div v-if="this.docInfo !== null">
            <div class="margin-auto print-hide q-mb-xl" style="max-width:1030px; font-size:16px;">
              <p>
                Please print out a hardcopy of this Job Verification Letter so you may show the letter to enforcement officers during a roadblock.<br/>
                What should you do if you're being stopped by enforcement officers at a roadblock? :-
              </p>
              <ul>
                <li>Stay calm</li>
                <li>Cooperate with the enforcement officer</li>
                <li>Show the Job Verification Letter</li>
                <li>If possible, take the name of the officer and his badge number</li>
              </ul>
              <br/>
              <p>
                Kindly note that this Job Verification Letter should only be used if you have an active PetBacker job. It will <strong>NOT</strong> cover any other personal errands or activities.
                Your safety is our top priority and we are here to help you so do ensure you comply with these requirements to stay safe:-
              </p>
              <ul>
                <li>Update your app on time (this includes start job & updating jobs as completed)</li>
                <li>Keep all forms on communication in the app via in-app messages. Alternatively, do keep a record of call logs if you make calls to the Pet Owner.</li>
                <li>Report the job to PetBacker support team for assistance if you are having issues.</li>
              </ul>
            </div>
            <br/>
            <div class="margin-auto outlined printing q-pa-md" style="max-width:1030px; font-size:16px; min-height: 800px;" ref="print">
                <div v-if="country === 'PH'">
                  <h6 class="text-left q-my-none text-weight-bold" v-if="$q.platform.is.mobile">OPERATION AND MOVEMENT DURING MODIFIED ENHANCED COMMUNITY QUARANTINE (“MECQ”)</h6>
                  <h5 class="text-left q-mb-none print-hide" v-else>OPERATION AND MOVEMENT DURING MODIFIED ENHANCED COMMUNITY QUARANTINE (“MECQ”)</h5>
                </div>
                <div v-else>
                  <h6 class="text-left q-my-none text-weight-bold" v-if="$q.platform.is.mobile">OPERATION AND MOVEMENT DURING MOVEMENT CONTROL ORDER ("MCO")</h6>
                  <h5 class="text-left q-mb-none print-hide" v-else>OPERATION AND MOVEMENT DURING MOVEMENT CONTROL ORDER ("MCO")</h5>
                </div>
                <p class="text-left q-mb-none text-weight-bold print-only" v-if="$q.platform.is.desktop" >OPERATION AND MOVEMENT DURING MOVEMENT CONTROL ORDER ("MCO")</p>
                <hr class="q-my-md"/>
                <p>Our App is an E-commerce platform providing services which include pet sitting, pet boarding and pet taxi which entails essential care, veterinary and medication supports to pets.</p>
                <br/>
                <p>
                    The following independent contractor has accepted job for pet-related services and need to make the required movements or travel for the purposes of performing animal care, such as pet feeding, support for pet medication or pets transportation during {{ country === 'PH' ? 'MECQ in Philippines' : 'MCO' }}:
                </p>
                <ol type="i">
                    <li>NAME : {{this.docInfo.sitter_name}}</li>
                    <li>IDENTITY CARD NUMBER : {{this.docInfo.id_number}}</li>
                    <li>JOB LOCATIONS :
                      <ol>
                        <li v-if="this.docInfo.request_full_address">{{this.docInfo.request_full_address}}</li>
                        <li v-if="this.docInfo.location_full_address">{{this.docInfo.location_full_address}}</li>
                      </ol>
                    </li>
                    <li>JOB DATE : {{formatTime(this.docInfo.request_date_start)}} - {{formatTime(this.docInfo.request_date_end)}}</li>
                    <li>CUSTOMER NAME : {{this.docInfo.pet_owner_name}}</li>
                </ol>
                <br/>
                <p v-if="country === 'PH'">Under the implementation of MECQ by the Philippine Government in the designated areas, i.e. MetroManila, Laguna and Cebu City, sectors which are allowed and/ or partially allowed to operate includingactivities relating to the supply of pet food, pet feeding, medication, and pet care supplies. As such, ourindependent contractors who are based in the MECQ areas are required to observe the requisite safetyprotocols and guidelines while travelling for purposes of the aforementioned</p>
                <p v-else >Please refer to the following Letters (as attached) from related Government agencies for approved services:</p>
                <ol type="a" v-if="country === 'MY'">
                    <li>
                        Department of Veterinary Services Malaysia (“DVS”) dated 25 March 2020<br/>
                        <a :href="`${domain}resources/dvs-letter`" target="_blank">{{domain}}resources/dvs-letter</a>
                    </li>
                    <li>
                        DVS dated 4 April 2020<br/>
                        <a :href="`${domain}resources/dvs-letter-2`" target="_blank">{{domain}}resources/dvs-letter-2</a>
                    </li>
                    <li>
                        MITI dated 21 April 2020<br/>
                        <a :href="`${domain}resources/miti-letter`" target="_blank">{{domain}}resources/miti-letter</a>
                    </li>
                </ol>
                <ol type="a" v-if="country === 'SG'">
                    <li>
                        MTI Letter of Exemption from Suspension<br/>
                        <a :href="`${domain}resources/mti-letter-1`" target="_blank">{{domain}}resources/mti-letter-1</a>
                    </li>
                    <li>
                        AVS annoucement<br/>
                        <a :href="`${domain}resources/avs-announcement-sg`" target="_blank">{{domain}}resources/avs-announcement-sg</a>
                    </li>
                </ol>
                <br/>
                <p>In this regard, we hope that relevant authority will allow the aforementioned independent contractor to travel to the location for such services as specified in the above job details.</p>
                <br/>
                <p>Thank you.</p>
            </div>
            <div class="margin-auto print-hide q-mt-xl" style="max-width:1030px; font-size:16px;">
                <q-btn label="print" size="md" class="q-px-xl" color="primary" style="display:block;margin-left:auto;margin-right:auto;" @click="printDoc"></q-btn>
            </div>
        </div>
        <div v-else-if="this.systemMessage !== null">
            <div class="margin-auto text-center" v-if="this.systemMessage.code === 400">
              <p style="font-size:16px;" class="q-mt-lg">Oops, it seems we do not have your valid ID number in our records, which is required for this form.<br/>Please inform our support team of your ID number <a href='https://web.petbacker.com/chat/support-help'>here</a> or submit your ID for verification if you have not done so already <a href='https://www.petbacker.com/help-center/pet-service-providers/how-do-i-submit-my-identification-and-documents-as-trust-points-for-verification' target="_blank">here</a></p>
            </div>
            <div class="margin-auto text-center" v-else>
              <h6>{{this.systemMessage.name}}</h6>
              <p>{{this.systemMessage.message}}</p>
            </div>
        </div>
        <div v-else class="row justify-center q-py-lg">
            <ComponentPreLoader></ComponentPreLoader>
        </div>
    </q-page>
</template>
<script>
import domains from 'assets/domains.json'
import moment from 'moment'
export default {
  data () {
    return {
      docInfo: null,
      systemMessage: null,
      country: 'MY',
      domain: null
    }
  },
  created () {
    if (this.$route.query.country) {
      this.country = this.$route.query.country.substring(0, 2).toUpperCase()
    }

    if (this.$_.findWhere(domains, {'countryName': this.country})) {
      this.domain = this.$_.findWhere(domains, {'countryName': this.country}).domain
    } else {
      this.domain = 'https://www.petbacker.com/'
    }
    this.getDocInfo()
  },
  watch: {
    $route (to, from) {
      if (to.path !== from.path) { // to prevent an infinite loop
        this.$router.replace({ query: from.query })
      }
    }
  },
  methods: {
    printDoc () {
      window.print()
    },
    formatTime (date) {
      return moment.utc(date).local().format('DD/MM/YYYY')
    },
    getDocInfo () {
      this.$axios.get(`tasks?TasksSearch[job_reference]=${this.$route.query.jobref}&query=basic`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.docInfo = response.data.tasksInfo
      }).catch((error) => {
        console.error(error)
        this.systemMessage = {
          name: error.response.data.name,
          message: error.response.data.message,
          code: error.response.data.status
        }
      })
    }
  }
}
</script>
<style lang="stylus">
.outlined
  border: 1px solid lightgrey

@media print {
  .printing {
    background-color: white
    width=800
    height=900
    top: 0
    left: 0
    margin: 10px
    padding: 15px
    font-size: 14px
    line-height: 18px
    border: none
  }
  @page {
    size:  auto   /* auto is the initial value */
    margin-top: 0mm  /* this affects the margin in the printer settings */
    margin-bottom: 0mm
  }
}
</style>
