<template>
    <div class="row" style="justify-content: start;" v-if="userInfo">
        <!-- Sponsor Badge -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.proVerified && userInfo.proVerified === 1">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/sponsor.png"  style="width: 45px;"></q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;line-height: 1.1em;">{{$t('sponsor')}}</p>
        </div>

        <!-- Booking Badge -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.completedJob">
          <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/completed-job.png" style="position: relative; width: 45px;">
  <div class="text-white bg-none font-title text-weight-bold" :style="{
    position: 'absolute',
    top: '10px',
    left: userInfo.completedJob > 9 ? '9px' : '17px',
    padding: '0px',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }">
    {{ userInfo.completedJob > 20 ? '20+' : userInfo.completedJob }}
  </div>
</q-img>

            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;">{{$t('badges.bookings')}}</p>
        </div>

        <!-- Repeated Badge -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.repeatedBooking">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/repeated-cust.png" style="position: relative;width: 45px;">
                <div class="text-white bg-none font-title text-weight-bold" :style="{
    position: 'absolute',
    top: '10px',
    left: userInfo.repeatedBooking > 9 ? '10px' : '17px',
    padding: '0px',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }">
                   {{userInfo.repeatedBooking > 20 ? '20+' : userInfo.repeatedBooking}}
                </div>
            </q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;">{{$t('badges.repeated')}}</p>
         </div>

        <!-- Facebook Badge -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.facebookVerified && userInfo.facebookVerified === 1">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/facebook.png"  style="width: 45px;"></q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;line-height: 1.1em;">{{$t('badges.fb.verified')}}</p>
        </div>

        <!-- Google Badge -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.googleVerified && userInfo.googleVerified === 1">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/google.png"  style="width: 45px;"></q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;line-height: 1.1em;">{{$t('badges.google.verified')}}</p>
        </div>

         <!-- Mobile Number Verify Badge -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.mobileVerified && userInfo.mobileVerified === 1">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/mobile.png"  style="width: 45px;">
                </q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;line-height: 1.1em;">{{$t('badges.mobile.verified')}}</p>
        </div>

        <!-- Email Verified Badge -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.emailVerified && userInfo.emailVerified === 1">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/email.png"  style="width: 45px;"></q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px; line-height: 1.1em;">{{$t('badges.email.verified')}}</p>
        </div>

        <!-- Id verified Badge -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.idVerified && userInfo.idVerified === 1">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/id.png"  style="width: 45px;"></q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;line-height: 1.1em;">{{$t('badges.id.verified')}}</p>
        </div>

        <!-- Business verified Badge -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.businessVerified && userInfo.businessVerified === 1">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/business.png"  style="width: 45px;"></q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;line-height: 1.1em;">{{$t('business')}}</p>
        </div>

        <!-- Certified Trainer Badge -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.trainingCertified && userInfo.trainingCertified === 1">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/certification.png"  style="width: 45px;"></q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;line-height: 1.1em;">{{$t('certified.trainer')}}</p>
        </div>

        <!-- Certified Grooming Badge -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.groomingCertified && userInfo.groomingCertified === 1">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/grooming.png"  style="width: 45px;"></q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;line-height: 1.1em;">{{$t('certified.groomer')}}</p>
        </div>

        <!-- Certified Vet Badge -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.vetCertified && userInfo.vetCertified === 1">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/vet.png"  style="width: 45px;"></q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;line-height: 1.1em;">{{$t('certified.vet')}}</p>
        </div>

        <!-- Police Clearance Badge -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.policeVerified && userInfo.policeVerified === 1">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/police-clearance.png"  style="width: 45px;"></q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;line-height: 1.1em;">{{$t('police.clearance')}}</p>
        </div>

        <!-- Parent Authorized Badge -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.parentAuthorisation && userInfo.parentAuthorisation === 1">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/parent.png"  style="width: 45px;"></q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;line-height: 1.1em;">{{$t('parent.authorized')}}</p>
        </div>

        <!-- Online Test Badge -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.examCertified && userInfo.examCertified === 1">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/complete-test.png"  style="width: 45px;"></q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;line-height: 1.1em;">{{$t('badges.online.test')}}</p>
        </div>

        <!-- Support Charity -->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.csrParticipant && userInfo.csrParticipant === 1">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/csr_participant.png"  style="width: 45px;"></q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;line-height: 1.1em;">{{$t('badges.support.charity')}}</p>
        </div>

        <!-- Pet Sitter Intro Test-->
        <div class="text-center col-2 q-mx-xs" v-if="userInfo.sitterIntroVerified && userInfo.sitterIntroVerified === 1">
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/credentials/sitter_intro_verified.png"  style="width: 45px;"></q-img>
            <p class="text-grey q-my-none q-mt-xs" style="font-size: 11px;line-height: 1.1em;">{{$t('passed.sitter.intro.test')}}</p>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    userInfo: {
      type: Object
    }
  }
}
</script>
