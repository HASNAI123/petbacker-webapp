<template>
  <div class="bg-white" :class="$q.platform.is.mobile ? 'q-px-xs q-pb-xl' : 'q-px-md'" v-if="requestInfo">
    <!-- Request location in maps -->
    <q-item v-if="responseServiceInfo && $route.name !== 'Checkout' && $route.name !== 'Chat'" @click.native="openNewTab(responseServiceInfo.listingUrl)" class="clickable q-py-none" :class="$q.platform.is.mobile ? 'q-px-none' : ''">
      <q-item-section class="q-pa-none" style="height: 199px;">
        <iframe
          v-if="requestInfo"
          sandbox="allow-same-origin allow-pointer-lock allow-scripts"
          :width="(deviceWidth - 8)"
          scrolling="no"
          height="200"
          frameborder="0"
          allowtransparency="true"
          style="border:0;"
          :src="`https://www.google.com/maps/embed/v1/view?center=${requestInfo.latitude},${requestInfo.longitude}&zoom=13&key=${PROCESS.GOOGLE_MAPS_KEY}`"
        ></iframe>
        <div v-else-if="$q.platform.is.cordova" ref="map" style="height:200px;" :style="{width: (deviceWidth - 8)}">
          <q-skeleton :width="`${(deviceWidth - 8)}px`" height="200px"></q-skeleton>
          <!-- <q-icon name="img:http://storage.googleapis.com/petbacker/images/cms/map_coverage_64.png" style="position: absolute;width: 150px;height: 150px;left: 31%;top: 1%;"></q-icon> -->
        </div>
        <div v-else-if="$q.platform.is.browser">
          <img :src="`https://www.google.com/maps/api/staticmap?size=375x180&zoom=13&center=${this.requestInfo.latitude},${this.requestInfo.longitude}&markers=icon:http://storage.googleapis.com/petbacker/images/cms/map_coverage_64.png%7C${this.requestInfo.latitude},${this.requestInfo.longitude}&key=${PROCESS.GOOGLE_MAPS_KEY}`" />
        </div>
      </q-item-section>
    </q-item>
    <div v-if="responseServiceInfo && $route.name !== 'Checkout' && $route.name !== 'Chat'" class="text-center bg-grey text-white q-py-xs">{{$t('distance.away').replace('{distance}', Math.round(responseInfo.distance))}}</div>

    <!-- Dispute-Interested Button -->
    <div class="bg-white" v-if="$q.platform.is.mobile && ($route.name === 'JobSummary' || $route.name === 'MobileDashboard') && !hideBottomBar">
      <!-- Closed/Declined Jobs -->
      <div class="row q-py-sm q-px-sm bg-white" v-if="responseInfo.completionStatus === 1">
        <!-- <q-btn class="col-xs-11 text-weight-bold q-mx-sm q-ml-md" style="border-radius: 6px;" :ripple="false" :label="$t('inbox.message.status.completed')" color="positive" @click="$router.push({name: 'JobChat', params: {taskId: responseInfo.id}})"></q-btn> -->
        <!-- Bottom buttons fixed -->
          <div class="fixed-bottom bg-white z999">
            <div class="row">
              <q-btn class="col-xs-12 q-py-md z999 text-white bg-blue" size="md" style="border-radius: 0px;" :ripple="false" :label="$t('inbox.message.status.completed')" @click="$router.push({name: 'JobChat', params: {taskId: responseInfo.id}})"></q-btn>
            </div>
          </div>
      </div>
      <!-- Closed/Declined Jobs -->
      <div class="row q-py-sm q-px-sm bg-white" v-else-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_REJECT || responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_REJECT || responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_REJECT_AFTER_BOOK">
        <q-btn class="col-xs-11 text-weight-bold q-mx-sm q-ml-md" style="border-radius: 6px;" :ripple="false" :label="$t('requests.page.closed')" color="negative"></q-btn>
      </div>
      <!-- New Jobs -->
      <div class="row q-py-sm q-px-sm bg-white" v-else-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_NO_RESPONSE">
        <!-- <q-btn class="col-xs-3 text-weight-bold q-mx-sm" :loading="declineLoader" style="border-radius: 6px;" :ripple="false" :label="$t('decline')" color="negative" outline @click="onDecline"></q-btn>
        <q-btn class="col-xs-8 text-weight-bold q-mx-xs text-white bg-primary" style="border-radius: 6px" :ripple="false" :label="$t('button.interested')" @click="checkPromoUsed"></q-btn> -->

        <!-- Bottom buttons fixed -->
          <div class="fixed-bottom bg-white z999">
            <div class="row">
              <q-btn class="col-xs-4 q-py-md z999" size="md" style="border-radius: 0px;" :ripple="false" :label="$t('decline')" color="negative" outline @click="onDecline"></q-btn>
              <q-btn class="col-xs-8 q-py-md z999 text-white bg-positive" size="md" style="border-radius: 0px;" :ripple="false" :label="$t('button.interested')" @click="checkPromoUsed"></q-btn>
            </div>
          </div>
      </div>
      <!-- Negiotiating/hired jobs -->
      <div class="row q-py-sm q-px-sm bg-white" v-else-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT || responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT">
        <!-- <q-btn class="col-xs-3 text-weight-bold q-mx-sm" style="border-radius: 6px;" :ripple="false" :label="$t('decline')" color="negative" outline v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT" @click="onDecline"></q-btn>
        <q-btn class="col-xs-3 text-weight-bold q-mx-sm" style="border-radius: 6px;" :ripple="false" :label="$t('dispute')" color="negative" outline v-else-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT" @click="onDecline"></q-btn>
        <q-btn class="col-xs-8 text-weight-bold q-mx-xs" style="border-radius: 6px;" :ripple="false" :label="$t('chat.with.owner')" :color="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT  ? 'warning' : 'info'" @click="$router.push({name: 'JobChat', params: {taskId: responseInfo.id}})"></q-btn> -->
        <!-- Bottom buttons fixed -->
        <div class="fixed-bottom bg-white z999">
          <div class="row">
            <q-btn class="col-xs-4 q-py-md z999" size="md" style="border-radius: 0px;" :ripple="false" :label="$t('decline')" color="negative" outline v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT" @click="onDecline"></q-btn>
            <q-btn class="col-xs-4 q-py-md z999" size="md" style="border-radius: 0px;" :ripple="false" :label="$t('dispute')" color="negative" outline v-else-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT" @click="onDecline"></q-btn>
            <q-btn class="col-xs-8 q-py-md z999 text-white bg-primary" size="md" style="border-radius: 0px;" :ripple="false" :label="$t('chat.with.owner')" :color="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT  ? 'warning' : 'info'" @click="$router.push({name: 'JobChat', params: {taskId: responseInfo.id}})"></q-btn>
          </div>
        </div>
      </div>
    </div>
    <div style="border-top: solid 1px lightgrey" v-else-if="$q.platform.is.mobile && $route.name === 'JobChat'">
      <!-- Edit Quote -->
      <div class="row q-py-sm q-px-sm bg-white" v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT">
        <q-btn class="col-xs-12 text-weight-bold q-mx-sm" style="border-radius: 6px;" :ripple="false" :label="$t('view.your.quote')" color="primary" @click.native="$router.push({name: 'JobQuote', params: {taskId: responseInfo.id}})"></q-btn>
      </div>
    </div>

    <!-- <q-separator class="q-my-sm" style="height: 2px;" inset v-if="($route.name === 'JobSummary' || $route.name === 'MobileDashboard') && !hideBottomBar"></q-separator> -->

    <!-- Sitter/Owner name and sitter/owner avatar -->
    <q-item class="clickable" v-if="responseServiceInfo">
      <q-item-section>
        <q-item-label class="font-header-title-large">{{ responseUserInfo.username }}</q-item-label>
        <q-item-label class="text-primary" caption @click="$q.platform.is.cordova ? openProfile(true) : openNewTab(responseServiceInfo.listingUrl)" v-if="$route.name === 'Chat'">{{$t('view.pet.sitter.listing')}}</q-item-label>
        <q-item-label class="text-primary" caption v-else-if="$route.name === 'JobChat' || $route.name === 'JobSummary' || $route.name === 'MobileDashboard'" @click="$router.push({name: 'PublicProfile', params: {userId: requestInfo.requestorInfo.id}})">{{$t('view.pet.owner.profile')}}</q-item-label>
      </q-item-section>
      <q-item-section @click.native="$q.platform.is.cordova ? openProfile() : openNewTab(responseServiceInfo.listingUrl)" avatar>
        <q-avatar style="width:50px; height: 50px;">
          <img class="profile-img" :src="responseUserInfo.avatarImage" alt="User Icon" />
        </q-avatar>
      </q-item-section>
    </q-item>

    <!-- Request Service type -->
    <q-item dense>
      <q-item-section thumbnail class="text-black q-px-md">
        <q-icon name="fas fa-clipboard-check" size="18px"></q-icon>
      </q-item-section>
      <q-item-section class="font-normal ">{{$t(getServiceName(requestInfo.serviceId))}}</q-item-section>
    </q-item>

    <!-- Request Description -->
    <q-item dense>
      <q-item-section thumbnail class="text-black q-px-md">
        <q-icon name="far fa-calendar-alt" size="18px"></q-icon>
      </q-item-section>
      <q-item-section class="font-normal">{{requestInfo.requestDescriptionShort}}</q-item-section>
    </q-item>

    <!-- Request Location -->
    <q-item dense>
      <q-item-section thumbnail class="text-black q-px-md">
        <q-icon name="fas fa-map-marker-alt" size="18px"></q-icon>
      </q-item-section>
      <q-item-section class="font-normal">{{requestInfo.fullAddress}}</q-item-section>
    </q-item>

    <!-- Request time required -->
    <q-item dense>
      <q-item-section thumbnail class="text-black q-px-md">
        <q-icon name="far fa-clock" size="18px"></q-icon>
      </q-item-section>
      <q-item-section class="font-normal">{{computeTime(requestInfo.requiredTime)}}</q-item-section>
    </q-item>
    <br/>

    <!-- Listing Review-->
    <q-item class="clickable" @click.native="openNewTab(responseServiceInfo.listingUrl + '#map')" dense v-if="responseServiceInfo && responseServiceInfo.reviewInfo && $route.name !== 'Checkout'">
      <q-item-section thumbnail class="text-black q-px-md">
        <q-icon name="fas fa-star" size="18px"></q-icon>
      </q-item-section>
      <q-item-section >
        <p class="q-my-none text-primary font-normal">
          <span class="q-mr-sm">{{ responseServiceInfo.reviewInfo.reviewCount }} {{ $t('reviews') }}</span>
          <q-icon name="fas fa-star" class="star-color q-mb-xs" v-for="i in responseUserInfo.rating" :key="i"></q-icon>
        </p>
      </q-item-section>
    </q-item>

    <!-- Message Pet Sitter/Owner -->
    <q-item dense class="clickable" v-if="$route.name !== 'Checkout'">
      <q-item-section thumbnail class="text-black q-px-md">
        <q-icon name="far fa-comment-dots" size="18px"></q-icon>
      </q-item-section>
      <q-item-section @click.native="openNewTab(`tel:${getMobileCode()+(responseServiceInfo.userInfo ? responseServiceInfo.userInfo.mobileNum : requestInfo.requestorInfo.mobileNum)}`)" class="text-primary font-normal" v-if="$route.name === 'Chat'">{{$t('contact.pet.sitter')}}</q-item-section>
      <q-item-section @click.native="openNewTab(`tel:${getMobileCode()+(responseServiceInfo.userInfo ? responseServiceInfo.userInfo.mobileNum : requestInfo.requestorInfo.mobileNum)}`)" class="text-primary font-normal" v-else-if="$route.name === 'JobChat' || $route.name === 'JobSummary' || $route.name === 'MobileDashboard'">{{$t('contact.pet.owner')}}</q-item-section>

      <!-- Rebook Button -->
      <q-item-section side @click.native="onRebook" v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT">
        <q-icon name="fas fa-redo" class="bg-grey-3 text-grey-7 q-pa-sm" style="border-radius: 25px;"></q-icon>
      </q-item-section>
    </q-item>

    <!-- View Pet Sitter Profile -->
    <!-- <q-item class="clickable q-mt-sm" v-if="responseServiceInfo && $route.name !== 'Checkout'">
      <q-item-section class="text-primary" @click="$q.platform.is.cordova ? openProfile(true) : openNewTab(responseServiceInfo.listingUrl)" v-if="$route.name === 'Chat'">{{$t('view.pet.sitter.listing')}}</q-item-section>
      <q-item-section class="text-primary font-normal" v-else-if="$route.name === 'JobChat' || $route.name === 'JobSummary'" @click="$router.push({name: 'PublicProfile', params: {userId: requestInfo.requestorInfo.id}})">{{$t('view.pet.owner.profile')}}</q-item-section>
    </q-item> -->

    <q-separator class="q-my-md" style="height: 2px;" inset></q-separator>

    <!-- Tips -->
    <q-item class="q-my-sm" v-if="(($route.name === 'JobSummary' || $route.name === 'MobileDashboard') && responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_NO_RESPONSE) || ($route.name === 'Chat' && responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT)">
      <q-item-section v-if="$route.name === 'JobSummary' || $route.name === 'MobileDashboard'">
        <q-item-label lines="1" class="font-normal text-weight-bold">{{$t('job.still.open.send.quote.now')}}</q-item-label>
        <q-item-label lines="2" class="font-normal" style="color: #3E3E3E;">
          <p class="q-mt-sm q-mb-none">
            <span class="text-weight-bold"><q-icon name="fas fa-lightbulb" class="star-color q-mr-xs q-mb-xs"></q-icon>{{$t('tip')}}</span>
            {{$t('send.quote.now.to.win.job')}}
          </p>
        </q-item-label>
      </q-item-section>
      <q-item-section v-else-if="$route.name === 'Chat'">
        <q-item-label lines="2" class="font-normal text-weight-bold">{{$t('book.now.enjoy.benefits')}}</q-item-label>
        <q-item-label lines="3" class="font-normal" style="color: #3E3E3E;">
          <p class="q-mt-sm q-mb-none">
            <span class="text-weight-bold"><q-icon name="fas fa-lightbulb" class="star-color q-mr-xs q-mb-xs"></q-icon>{{$t('tip')}}</span>
            {{$t('booking.are.protected.with.insurance')}}
          </p>
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset v-if="(($route.name === 'JobSummary' || $route.name === 'MobileDashboard') && responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_NO_RESPONSE) || ($route.name === 'Chat' && responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT)"></q-separator>

    <!-- Pets to be boarded/hosted -->
    <q-item class="clickable q-my-sm" v-if="requestInfo.personalItemsInfo.items.length > 0">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{$t('pets.to.be.boarded')}}</q-item-label>
        <pet-card-horizontal v-for="pet in requestInfo.personalItemsInfo.items" :key="pet.id" :pet="pet"></pet-card-horizontal>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestInfo.personalItemsInfo.items.length > 0" ></q-separator>

    <!-- V5 form info (old questionaire) -->
    <!-- Number of Pets -->
    <q-item class="q-my-sm" v-if="$route.name !== 'Checkout' && requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 102 || question.questionId === 2) > -1">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 102 || question.questionId === 2) - 1].listingDisplay}}</q-item-label>
        <q-item-label lines="2" class="font-normal">{{ requestQuestionLists.find(question => question.questionId === 102 || question.questionId === 2).reply }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset  v-if="$route.name !== 'Checkout' && requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 102 || question.questionId === 2) > -1"></q-separator>

    <!-- Pet Type -->
    <q-item class="q-my-sm" v-if="$route.name !== 'Checkout' && requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 104 || question.questionId === 4) > -1">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 104 || question.questionId === 4) - 1].listingDisplay}}</q-item-label>
        <q-item-label lines="2" class="font-normal">{{ requestQuestionLists.find(question => question.questionId === 104 || question.questionId === 4).reply }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset  v-if="$route.name !== 'Checkout' && requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 104 || question.questionId === 4) > -1"></q-separator>

    <!-- Pet Breed -->
    <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 106 || question.questionId === 6 || question.questionId === 125) > -1">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 106 || question.questionId === 6 || question.questionId === 125) - 1].listingDisplay}}</q-item-label>
        <q-item-label lines="2" class="font-normal">{{ requestQuestionLists.find(question => question.questionId === 106 || question.questionId === 6 || question.questionId === 125).reply }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset  v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 106 || question.questionId === 6 || question.questionId === 125) > -1"></q-separator>

    <!-- Pet Size -->
    <q-item class="q-my-sm" v-if="$route.name !== 'Checkout' && requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 108 || question.questionId === 8) > -1">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 108 || question.questionId === 8) - 1].listingDisplay}}</q-item-label>
        <q-item-label lines="2" class="font-normal">{{ requestQuestionLists.find(question => question.questionId === 108 || question.questionId === 8).reply }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset  v-if="$route.name !== 'Checkout' && requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 108 || question.questionId === 8) > -1"></q-separator>

    <!-- Taxi Specific (Pick up location) -->
    <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90032 || question.questionId === 16) > -1">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90032 || question.questionId === 16) - 1].listingDisplay}}</q-item-label>
        <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90032 || question.questionId === 16).reply}}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90032 || question.questionId === 16) > -1"></q-separator>

    <!-- Taxi Specific (Drop Off location) -->
    <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90010) > -1">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90010) - 1].listingDisplay}}</q-item-label>
        <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90010).reply}}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90010) > -1"></q-separator>

    <!-- Type of Photography required -->
    <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90036) > -1">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90036) - 1].listingDisplay}}</q-item-label>
        <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90036).reply}}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90036) > -1"></q-separator>

    <!-- Preferred location of Photography -->
    <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90038) > -1">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90038) - 1].listingDisplay}}</q-item-label>
        <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90038).reply}}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90038) > -1"></q-separator>

    <!-- Preferred kind of Photography -->
    <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90040) > -1">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90040) - 1].listingDisplay}}</q-item-label>
        <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90040).reply}}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90040) > -1"></q-separator>

    <!-- Preferred Format of Photography -->
    <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90042) > -1">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90042) - 1].listingDisplay}}</q-item-label>
        <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90042).reply}}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90042) > -1"></q-separator>

    <!-- Number of edited Photography -->
    <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90044) > -1">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90044) - 1].listingDisplay}}</q-item-label>
        <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90044).reply}}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90044) > -1"></q-separator>

    <!-- Type of grooming service required -->
    <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90051) > -1">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{requestQuestionLists[requestQuestionLists.findIndex(question => question.questionId === 90051) - 1].listingDisplay}}</q-item-label>
        <q-item-label lines="2" class="font-normal">{{requestQuestionLists.find(question => question.questionId === 90051).reply}}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 90051) > -1"></q-separator>

    <!-- Date Service Required -->
    <q-item class="q-my-sm">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{$t('date.service.required')}}</q-item-label>
        <q-item-label lines="2" class="font-normal">{{ requestInfo.requiredTime | readableDate }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset></q-separator>

    <!-- Number of <units> requires -->
    <q-item class="q-my-sm">
      <q-item-section v-if="responseInfo">
        <q-item-label lines="1" class="font-normal text-weight-bold">{{ $t('number.of.units.required', {unit: responseInfo.requestInfo.unit || responseInfo.unit}) }}</q-item-label>
        <q-item-label lines="2" class="font-normal" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => question.questionId === 80004) > -1">
          {{ requestInfo.duration }} x {{requestQuestionLists.find(question => question.questionId === 80004).reply}}
        </q-item-label>
        <q-item-label lines="2" class="font-normal" v-else>
          {{ requestInfo.duration }}
        </q-item-label>
      </q-item-section>
      <div class="justified text-center" v-else ref="preLoader">
        <ComponentPreLoader></ComponentPreLoader>
      </div>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset></q-separator>

    <!-- Pick Up Service Required -->
    <q-item class="q-my-sm" v-if="requestQuestionLists && requestQuestionLists.findIndex(question => PICK_UP.indexOf(question.questionId) > -1) > -1">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{$t('pet.pickup.service.required')}}</q-item-label>
        <q-item-label lines="2" class="font-normal">{{ requestQuestionLists.find(question => PICK_UP.indexOf(question.questionId) > -1).reply }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset v-if="requestQuestionLists && requestQuestionLists.findIndex(question => PICK_UP.indexOf(question.questionId) > -1) > -1"></q-separator>

    <!-- Additional information -->
    <q-item class="q-my-sm" clickable v-if="requestQuestionLists && requestQuestionLists.findIndex(question => ADDITIONAL_INFO.indexOf(question.questionId) > -1) > -1 && requestQuestionLists.find(question => ADDITIONAL_INFO.indexOf(question.questionId) > -1).reply" @click="onCloseModalMoreInfo(true, requestQuestionLists.find(question => ADDITIONAL_INFO.indexOf(question.questionId) > -1).reply)">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{$t('additional.info.you.should.know')}}</q-item-label>
        <q-item-label lines="2" class="font-normal">{{ requestQuestionLists.find(question => ADDITIONAL_INFO.indexOf(question.questionId) > -1).reply }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon name="chevron_right"></q-icon>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset  v-if="requestQuestionLists && requestQuestionLists.findIndex(question => ADDITIONAL_INFO.indexOf(question.questionId) > -1) > -1 && requestQuestionLists.find(question => ADDITIONAL_INFO.indexOf(question.questionId) > -1).reply"></q-separator>

    <!-- Job Reference No. -->
    <q-item class="clickable q-my-sm q-mb-lg" @click.native="copiedSuccessText = $t('booking.ref.successfully.copied');onCopy((responseInfo.jobReference || requestInfo.requestReference).toUpperCase())">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold" v-if="$route.name === 'Chat' || $route.name === 'Checkout'">{{$t('booking.referece')}}</q-item-label>
        <q-item-label lines="1" class="font-normal text-weight-bold" v-else-if="$route.name === 'JobChat' || $route.name === 'JobSummary'">{{$t('job.reference')}}</q-item-label>
        <q-item-label lines="2" class="font-normal text-uppercase text-primary">{{responseInfo.jobReference || requestInfo.requestReference}}<q-icon class="q-ml-sm q-mb-sm" name="far fa-copy"></q-icon></q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset v-if="$route.name !== 'JobSummary' && $route.name !== 'JobChat' && $route.name !== 'MobileDashboard'"></q-separator>

    <!-- Payment Details -->
    <q-item class="q-my-sm" v-if="$route.name !== 'JobSummary' && $route.name !== 'JobChat' && $route.name !== 'MobileDashboard'">
      <q-item-section>
        <q-item-label lines="1" class="font-normal text-weight-bold">{{$t('payment.details')}}</q-item-label>
        <q-item-label lines="2" class="font-normal" v-if="requestQuestionLists">{{ requestQuestionLists[ADD_INFO].reply }}</q-item-label>

        <div v-if="priceInfo">
          <!-- Break down of payment info -->
          <q-item v-for="quote in priceInfo.itemsPrice" :key="quote.id" class="q-px-none">
            <q-item-section class="font-normal">
              <q-item-label lines="1">
                {{quote.quoteTitle}}
                <q-btn flat size="sm" @click="openMoreInfo(quote)" v-if="quote.quoteId === 0" :ripple="false" :round="true">
                  <q-icon name="help_outline"></q-icon>
                </q-btn>
              </q-item-label>
            </q-item-section>
            <q-item-section side class="font-normal" style="color:black;">
              <q-item-label lines="1">{{ responseInfo.offerCurrencyText }} {{ quote.quotePrice | currency }}</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Promo Code -->
          <q-item class="q-px-none" v-if="$route.name === 'Chat' || $route.name === 'Checkout'">
            <q-item-section class="font-normal">
              <q-item-label lines="1" v-if="(responseInfo.acceptanceStatus === STATUS.REQUEST_STATUS_COMPLETED || responseInfo.acceptanceStatus === STATUS.REQUEST_STATUS_CANCELLED) ? true : false">{{$t('promo.code')}}</q-item-label>
              <q-item-label lines="1" v-else>{{ $t('enter.promo.code') }}</q-item-label>
            </q-item-section>

            <q-item-section side class="font-normal" style="color:black;">
              <q-item-label lines="1" :class="{'clickable': (responseInfo.acceptanceStatus === STATUS.REQUEST_STATUS_COMPLETED || responseInfo.acceptanceStatus === STATUS.REQUEST_STATUS_CANCELLED) ? false : true }">
                <q-input @click="openPromoModal" ref="promocode" :loading="removeCodeLoader" :input-class="{'clickable': (responseInfo.acceptanceStatus === STATUS.REQUEST_STATUS_COMPLETED || responseInfo.acceptanceStatus === STATUS.REQUEST_STATUS_CANCELLED) ? false : true }" class="q-pa-none text-center" flat outlined dense :disable="(responseInfo.acceptanceStatus === STATUS.REQUEST_STATUS_COMPLETED || responseInfo.acceptanceStatus === STATUS.REQUEST_STATUS_CANCELLED) ? true : false" style="max-width: 130px;" :placeholder="$t('promo.code')" v-model="promocode">
                  <template slot="before">
                    <q-icon v-if="(responseInfo.acceptanceStatus !== STATUS.ACCEPTANCE_PARENT_ACCEPT) && (promocode !== null && promocode !== '')" size="16px" color='red' name='fas fa-times' @click="removePromoCode"></q-icon>
                  </template>
                </q-input>
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Total -->
          <q-item class="q-px-none">
            <q-item-section class="font-normal">
              <q-item-label lines="1">{{ $t('chat.total') }}</q-item-label>
            </q-item-section>

            <q-item-section side class="font-normal clickable" style="color:black;">
              <q-item-label lines="1" class="text-weight-bold">{{ responseInfo.offerCurrencyText }} {{ priceInfo.totalPrice | currency }}</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Points to be earned -->
          <!-- <q-item class="q-px-none">
            <q-item-section class="font-normal">
              <q-item-label lines="1">Earn</q-item-label>
            </q-item-section>

            <q-item-section side class="font-normal clickable" style="color:black;">
              <q-item-label lines="1" class="text-weight-bold text-yellow"><q-icon name="fas fa-coins" class="q-ml-sm"></q-icon> {{ priceInfo.pointsToEarn }} point(s)</q-item-label>
            </q-item-section>
          </q-item> -->
        </div>
        <div class="justified text-center" v-else ref="preLoader">
          <ComponentPreLoader></ComponentPreLoader>
        </div>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset v-if="$route.name !== 'JobChat' && $route.name !== 'JobSummary' && $route.name !== 'MobileDashboard'"></q-separator>

    <!-- Book Now Button -->
    <q-item class="clickable q-my-sm" v-if="$q.platform.is.desktop && (responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT) && $route.name !== 'Checkout' && $route.name !== 'JobChat' && $route.name !== 'JobSummary'">
      <q-item-section v-if="priceInfo.totalPrice !== 0">
        <q-btn :label="$t('chat.booknow')" color="primary" class="full-width q-mb-md" @click.native="$router.push($route.path + '/checkout')"></q-btn>
      </q-item-section>
      <q-item-section v-else-if="$route.params.request">
        <q-btn :loading="payWallet" :label="$t('chat.booknow')" color="primary" class="full-width q-mb-md" @click.native="takeFromWallet"></q-btn>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" style="height: 2px;" inset v-if="$q.platform.is.desktop && (responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT) && $route.name !== 'Checkout' && $route.name !== 'JobChat' && $route.name !== 'JobSummary'"></q-separator>

    <!-- Payment on PetBacker Benefits -->
    <q-item class="clickable q-my-sm" v-if="$route.name !== 'JobChat' && $route.name !== 'JobSummary' &&  $route.name !== 'MobileDashboard'">
        <q-item-section v-if="responseInfo.isMembershipQuote">
          <q-item-label lines="1" class="font-normal text-weight-bold">{{$t('chat.bookingonpetbacxker')}}:</q-item-label>
          <q-item-label>
            <ul>
              <li v-html="$t('chat.protectionpets')" class="q-my-sm"></li>
              <li v-html="$t('chat.dailyphoto')" class="q-my-sm"></li>
              <li v-html="$t('chat.discount10')" class="q-my-sm"></li>
              <li class="q-my-sm anchor-link light-paragraph" @click="open(`${$t('link.href.help.center')}/bookings/why-pay-for-your-booking-through-petbacker`)">{{ $t('chat.learnmore') }}</li>
            </ul>
          </q-item-label>
        </q-item-section>
        <q-item-section v-else>
          <q-item-label lines="1" class="font-normal text-weight-bold">{{$t('chat.payingonpetbacker')}}:</q-item-label>
          <q-item-label>
            <ul>
              <li v-html="$t('chat.protectionmoney')" class="q-my-sm"></li>
            <!--   <li v-html="$t('chat.satisfaction')" class="q-my-sm"></li> -->
              <li v-html="$t('chat.dailyphoto')" class="q-my-sm"></li>
              <li v-html="$t('chat.customercare')" class="q-my-sm"></li>
              <li v-html="$t('chat.discount10')" class="q-my-sm"></li>
              <li class="q-my-sm anchor-link light-paragraph" @click="open(`${$t('link.href.help.center')}/bookings/why-pay-for-your-booking-through-petbacker`)">{{ $t('chat.learnmore') }}</li>
            </ul>
          </q-item-label>
        </q-item-section>
    </q-item>

    <!-- Bottom buttons for job details page (Desktop) -->
    <div style="border-top: solid 1px lightgrey;" v-if="$q.platform.is.desktop && ($route.name === 'JobSummary' || $route.name === 'MobileDashboard') && !hideBottomBar">
      <!-- New Jobs -->
      <div class="row q-pa-md q-pb-lg bg-white justify-center" v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_NO_RESPONSE">
        <q-btn class="col-xs-2 text-weight-bold q-mx-sm" style="border-radius: 6px;" :ripple="false" :label="$t('decline')" color="primary" outline @click="onDecline"></q-btn>
        <q-btn class="col-xs-9 text-weight-bold q-mx-xs" style="border-radius: 6px;" :ripple="false" :label="$t('button.interested')" color="primary" @click="checkServiceMatch"></q-btn>
      </div>
      <!-- Negiotiating/hired jobs -->
      <div class="row q-pa-md q-pb-lg bg-white justify-center" v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT || responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT">
        <q-btn class="col-xs-2 text-weight-bold q-mx-sm" style="border-radius: 6px;" :ripple="false" :label="$t('decline')" color="primary" outline v-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT" @click="onDecline"></q-btn>
        <q-btn class="col-xs-2 text-weight-bold q-mx-sm" style="border-radius: 6px;" :ripple="false" :label="$t('dispute')" color="primary" outline v-else-if="responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT" @click="onDecline"></q-btn>
        <q-btn class="col-xs-9 text-weight-bold q-mx-xs" style="border-radius: 6px;" :ripple="false" :label="$t('chat.with.owner')" color="primary" @click="$router.push({name: 'JobChat', params: {taskId: responseInfo.id}})"></q-btn>
      </div>
    </div>

    <!-- Dialog more Info -->
    <dialog-moreinfo :trigger="moreInfoModal" :title="$t('additional.info.you.should.know')" :content="moreInfoContent" @on-close="onCloseModalMoreInfo"></dialog-moreinfo>

    <!-- Decline Dialog -->
    <dialog-jobdecline :trigger="declineModal" @on-decline="onDeclineJob" :bookingReference="responseInfo.jobReference" :bookStatus="responseInfo.bookStatus" :taskId="parseInt(responseInfo.id)" @on-close="closeDeclineModal" v-if="$route.name === 'JobSummary' || $route.name === 'MobileDashboard'"></dialog-jobdecline>

    <!-- Pop Up Create Listing when service type assigned to listing do not match -->
    <dialog-listingnotmatch :trigger="servicesModal" v-if="($route.name === 'JobSummary' || $route.name === 'MobileDashboard') && (requestInfo.serviceId !== responseInfo.serviceInfo.serviceId)" :taskId="parseInt(responseInfo.id)" :jobType="requestInfo.serviceId" :assignedTo="responseInfo.serviceInfo.serviceId" @on-close="closeServicesModal"></dialog-listingnotmatch>

    <!-- Service Rate Dialog -->
    <dialog-servicerates ref="first-quote-component" v-if="$route.name === 'JobSummary' || $route.name === 'MobileDashboard'" :trigger="serviceRateModal" :ratesInfo="ratesInfo || responseInfo.serviceInfo.ratesInfo" :serviceId="responseInfo.serviceInfo.serviceId" :taskId="parseInt(responseInfo.id)" @on-first-quote="onRefreshJobInfo" @on-error="triggerServerError" @on-close="closeServiceRateModal"></dialog-servicerates>

    <!-- Error Dialog -->
    <dialog-error-400 :trigger="handle400msgmodal" :message="msg400" @on-close="closeErrorModal"></dialog-error-400>

    <!-- Voucher Dialog -->
    <modal-voucher v-if="$route.name !== 'JobSummary' && $route.name !== 'MobileDashboard'" :trigger="promocodeModal" @on-close="closePromocodeModal" @on-error="showError" :countries="countries" @on-apply-promocode="applyPromoCode"></modal-voucher>

    <!-- For Your Protection Dialog -->
    <dialog-foryourprotection v-if="$route.name !== 'JobSummary' && $route.name !== 'MobileDashboard'" @trigger-updated="updateForYourProtectionState" :trigger="forYourProtection" :requestId="parseInt($route.params.request)" :responseId="parseInt($route.params.response)"></dialog-foryourprotection>

    <!-- More Info Pop Up -->
    <modal-moreinfo @on-close="updateMoreInfoTrigger" :trigger="moreInfo" :moreInfoText="moreInfoText" :quoteDescriptionLink="quoteDescriptionLink"></modal-moreinfo>

    <!-- Dynamic Error Dialog -->
    <dialog-error :trigger="serverError" :statusCode="errorStatus" :message="errorMessage" :okButtonLabel="errorOkLabel" @on-ok="overrideFirstQuote" @on-close="triggerServerError"></dialog-error>
  </div>
</template>

<script>
import moment from 'moment'
import countries from 'assets/countries.json'
import ACCEPTANCE_STATUS from 'assets/request-status.json'
import services from 'assets/services.json'
import clipboard from '../mixins/copyClipboardMixin.js'

export default {
  mixins: [clipboard],
  components: {
    'pet-card-horizontal': () => import('components/PetProfile/PetCardHorizontal.vue'),
    'modal-voucher': () => import('components/Vouchers/ModalVouchers.vue'),
    'modal-moreinfo': () => import('components/ModalMoreInfo.vue'),
    'dialog-foryourprotection': () => import('components/ModalForYourProtection.vue'),
    'dialog-error-400': () => import('components/Dialog400Error.vue'),
    'dialog-listingnotmatch': () => import('components/JobQuote/DialogServiceNotMatch.vue'),
    'dialog-servicerates': () => import('components/JobQuote/DialogServiceRates.vue'),
    'dialog-jobdecline': () => import('components/JobCenter/DialogDeclineJob.vue'),
    'dialog-error': () => import('components/DialogError.vue'),
    'dialog-moreinfo': () => import('components/DialogMoreInfo.vue')
  },
  props: {
    responseInfo: {
      type: Object,
      required: true
    },
    requestInfo: {
      required: true
    },
    priceInfo: {
      type: [Object, null],
      default: () => { return null }
    },
    mapData: {
      type: String
    }
  },
  data () {
    return {
      ADD_INFO: 6,
      ADDITIONAL_INFO: [10, 110, 119, 123, 129, 90022, 90046],
      PICK_UP: [90012],
      responseServiceInfo: null,
      responseUserInfo: null,
      requestQuestionLists: null,
      STATUS: ACCEPTANCE_STATUS,
      promocode: null,
      promocodeModal: false,
      promocodeItems: [],
      handle400msgmodal: false,
      addPromocodeModal: false,
      msg400: '',
      mobileView: false,
      payWallet: false,
      moreInfo: false,
      moreInfoText: '',
      quoteDescriptionLink: '',
      gMapMarker: null,
      gMap: null,
      forYourProtection: false,
      countries: countries,
      loader: false,
      removeCodeLoader: false,
      serviceRateModal: false,
      servicesModal: false,
      serviceId: null,
      ratesInfo: null,
      declineModal: false,
      hideBottomBar: false,
      deviceWidth: screen.width,
      serverError: false,
      errorStatus: 0,
      errorOkLabel: null,
      errorMessage: '',
      rateInfo: null,
      moreInfoModal: false,
      moreInfoContent: null,
      gmap: null,
      mapUrl: null,
      declineLoader: false
    }
  },
  filters: {
    currency: function (value) {
      if (value) {
        return Number.parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      } else {
        return value
      }
    },
    readableDate: function (value) {
      return moment(value).format('D MMM, YYYY')
    }
  },
  watch: {
    promocode (newPromocode) {
    localStorage.setItem('promocode', newPromocode)
  },
    priceInfo (value) {
      if (value.length > 0) {
        value.itemsPrice.forEach(itemPrice => {
          if (parseInt(itemPrice.quotePrice) < 0) {
            this.promocode = itemPrice.quoteSubtitle
          }
        })
      }
    },
    mapData (url) {
      this.mapUrl = url
    },
    requestInfo (value) {
      this.requestQuestionLists = JSON.parse(value.requestDescriptionJson.replace('\\', '')).question
    }
  },
  created () {
    let storedPromocode = localStorage.getItem('promocode')
    this.promocode = (storedPromocode && storedPromocode !== 'null') ? storedPromocode : ''
    this.responseServiceInfo = (this.responseInfo.serviceInfo || this.responseInfo)
    this.responseUserInfo = (this.responseServiceInfo.userInfo || this.requestInfo.requestorInfo)

    if (this.$route.query.hide) {
      this.hideBottomBar = true
    }
  },
  mounted () {
    if (this.requestInfo) {
      this.requestQuestionLists = JSON.parse(this.requestInfo.requestDescriptionJson.replace('\\', '')).question
    }

    if (this.$route.name !== 'JobSummary' && this.$route.name !== 'MobileDashboard' && this.$route.name !== 'JobChat') {
      if (this.priceInfo) {
        this.priceInfo.itemsPrice.forEach(itemPrice => {
          if (parseInt(itemPrice.quotePrice) < 0) {
            this.promocode = itemPrice.quoteSubtitle
          }
        })
      }
    }

    // Initialize the map plugin
    // if (!this.mapUrl && !this.mapData && (['MobileDashboard', 'JobSummary'].indexOf(this.$route.name) > -1)) {
    //   window.plugin.google.maps.environment.setBackgroundColor('white')
    //   this.gmap = window.plugin.google.maps.Map.getMap(this.$refs['map'])

    //   // The MAP_READY event notifies the native map view is fully ready to use.
    //   this.gmap.one(window.plugin.google.maps.event.MAP_READY, this.onMapInit)
    // } else {
    //   this.mapUrl = this.mapData
    // }
  },
  methods: {
    // onMapInit (map) {
    //   console.log('map init')
    //   map.moveCamera({
    //     target: {lat: this.requestInfo.latitude, lng: this.requestInfo.longitude},
    //     zoom: 13,
    //     bearing: 45
    //   })

    //   // add coverage circle
    //   map.addCircle({
    //     'center': {lat: this.requestInfo.latitude, lng: this.requestInfo.longitude},
    //     'radius': 1350,
    //     'strokeColor': '#947698',
    //     'strokeWidth': 1,
    //     'fillColor': '#f2e5f2'
    //   })

    //   setTimeout(() => {
    //     map.toDataURL((imageData) => {
    //       this.mapUrl = imageData
    //       this.$emit('map-image-url', imageData)
    //     })
    //   }, 855)
    // },
    onRebook () {
      let avatarInfo = ''
      if (this.$route.name === 'JobSummary' || this.$route.name === 'MobileDashboard' || this.$route.name === 'JobChat') {
        avatarInfo = this.requestInfo.requestorInfo.avatarImage.split('/')
      } else {
        avatarInfo = this.responseServiceInfo.userInfo.avatarImage.split('/')
      }
      avatarInfo = avatarInfo[avatarInfo.length - 1].split('.jpg')[0]

      let status = this.$route.name === 'JobSummary' || this.$route.name === 'MobileDashboard' || this.$route.name === 'JobChat'

      this.$router.push({
        name: 'BookAgainRequest',
        params: {
          requestId: this.requestInfo.id,
          serviceUserId: this.responseServiceInfo.id
        },
        query: {
          taskId: this.responseInfo.id,
          sitter: status,
          avatar: avatarInfo,
          ownername: this.requestInfo.requestorInfo ? this.requestInfo.requestorInfo.username : null,
          sittername: this.responseServiceInfo.userInfo ? this.responseServiceInfo.userInfo.username : null,
          uuid: this.requestInfo.requestorInfo ? this.requestInfo.requestorInfo.id : this.$store.getters['user/getUserUuidState']
        }
      })
    },
    onRefreshJobInfo () {
      this.$emit('on-first-quote')
    },
    onCloseModalMoreInfo (status, content = null) {
      if (content) {
        this.moreInfoContent = content
      }

      this.moreInfoModal = status
    },
    open (link) {
      this.openUrl(link)
    },
    openProfile (showListing = false) {
      if (showListing && this.responseUserInfo.id && this.responseServiceInfo.id) {
        this.$router.push({name: 'Listing', params: {listingId: this.responseServiceInfo.id}, query: {id: this.responseUserInfo.id, url: this.responseServiceInfo.listingUrl}})
      } else if (this.responseUserInfo.id) {
        this.$router.push({name: 'PublicProfile', params: {userId: this.responseUserInfo.id}})
      } else if (this.requestInfo.requestorInfo.id) {
        this.$router.push({name: 'PublicProfile', params: {userId: this.requestInfo.requestorInfo.id}})
      }
    },
    closeDeclineModal (value) {
      this.declineModal = value
    },
    onDeclineJob () {
      this.$emit('on-decline-job')
    },
    onDecline () {
      if (this.responseInfo.requestInfo.jobAssignedToServiceUserId === this.$store.getters['user/getUserUuidState'] || ((parseInt(this.responseInfo.acceptanceStatus) === this.STATUS.ACCEPTANCE_PARENT_ACCEPT) && parseInt(this.responseInfo.completionStatus) === this.STATUS.COMPLETION_NO_RESPONSE)) {
        this.declineModal = true
      } else {
        this.$q.dialog({
          title: this.$t('confirmation'),
          message: this.$t('are.you.sure.cancel.this.job'),
          ok: this.$t('yes'),
          cancel: this.$t('no')
        }).onOk(() => {
          this.declineLoader = true
          // decline job
          let taskInfo = {
            'taskInfo': {
              'acceptanceStatus': parseInt(this.responseInfo.bookStatus) === 1 ? this.STATUS.ACCEPTANCE_SITTER_REJECT_AFTER_BOOK : this.STATUS.ACCEPTANCE_SITTER_REJECT,
              'cancellationReason': ''
            }
          }

          this.$axios.put(`users/${this.$store.state.user.uuid}/tasks/${this.responseInfo.id}`, taskInfo, {
            headers: {
              Authorization: this.$store.getters['user/authorizationHeader']
            }
          }).then((response) => {
            this.$emit('on-decline-job')
          }).catch((error) => {
            console.error(error)
            let errorMessage = error.response.data ? error.response.data.message : this.$t('something.wrong.gateway')
            this.$q.notify({
              message: errorMessage,
              type: 'negative',
              position: 'top'
            })
          }).finally(_ => {
            setTimeout(() => {
              this.declineLoader = false
            }, 650)
          })
        }).onCancel(() => {
        })
      }
    },
    overrideFirstQuote (errorCode) {
      // check sitter have correct service id to answer job
      if (this.requestInfo.serviceId !== this.responseInfo.serviceInfo.serviceId) {
        this.servicesModal = true
        return
      }

      if (errorCode === 11) {
        // override quote
        this.$refs['first-quote-component'].onFirstQuote(this.rateInfo, true)
      }

      if (errorCode === 8) {
        this.$router.push({name: 'StepsLeft'})
      }
    },
    checkPromoUsed () {
      if (this.requestInfo.promoCodeUsed && this.requestInfo.serviceId !== this.responseInfo.serviceInfo.serviceId) {
        this.triggerServerError(true, `A discount will be given to the user, which will be reflected as an additional fees on your service fee. Please ensure your quote is enough to cover the additional cost. <br/><a href="https://www.petbacker.com/help-center/pet-service-providers/marketing-initiative-with-affiliate-partners" target="_blank">What is a collaboration booking?</a>`, 4)
      } else {
        this.checkServiceMatch()
      }
    },
    triggerServerError (status, message = null, errorCode = null, params = null) {
      if (errorCode) {
        this.errorStatus = errorCode

        if (errorCode === 8) {
          this.errorOkLabel = this.$t('find.out.steps.left')
        } else if (errorCode !== 11) {
          this.errorOkLabel = this.$t('ok')
        }
      }

      if (message) {
        this.errorMessage = message
      }

      if (params && params.rateInfo) {
        this.rateInfo = params.rateInfo
      }

      if (status === false) {
        this.errorOkLabel = null
      }

      this.serverError = status
    },
    checkServiceMatch () {
      // check sitter have correct service id to answer job
      if (this.requestInfo.serviceId === this.responseInfo.serviceInfo.serviceId) {
        this.serviceRateModal = true
      } else {
        this.servicesModal = true
      }
    },
    closeServicesModal (value) {
      this.servicesModal = value
    },
    closeServiceRateModal (value) {
      this.serviceRateModal = value
    },
    showError (errorMessage) {
      this.msg400 = errorMessage
      this.handle400msgmodal = true
    },
    closeErrorModal () {
      this.handle400msgmodal = false
    },
    openPromoModal () {
      this.promocodeModal = true
      this.$refs['promocode'].blur()
    },
    closePromocodeModal (value) {
      this.promocodeModal = value

      if (value === false) {
        this.$refs['promocode'].blur()
      }
    },
    updateForYourProtectionState (value) {
      this.forYourProtection = value
    },
    formatAge (petDOB) {
      if (petDOB === 'Invalid date' || petDOB === '') {
        return 'N/A'
      }

      let today = moment()
      return moment.utc(petDOB).local().diff(today, 'year')
    },
    computeTime (time) {
      return moment.utc(time).local().format('h:mm A')
    },
    formatTime (time) {
      return `Joined in ${moment.utc(time).local().format('MMMM YYYY')}`
    },
    getServiceName (id) {
      for (let items in services) {
        if (services[items].id === id) {
          return services[items].name
        }
      }
      return 'failed'
    },
    openNewTab (url) {
      // target self if phone number
      if (url && url.substring(0, 4) === 'tel:') {
        if (this.responseInfo.acceptanceStatus === this.STATUS.ACCEPTANCE_PARENT_ACCEPT || this.responseInfo.acceptanceStatus === this.STATUS.ACCEPTANCE_PARENT_REJECT || this.responseInfo.acceptanceStatus === this.STATUS.ACCEPTANCE_SITTER_ACCEPT || this.responseInfo.acceptanceStatus === this.STATUS.ACCEPTANCE_SITTER_REJECT) {
          // responded to job or owner's request
          if (this.$route.name === 'JobSummary' || this.$route.name === 'MobileDashboard') {
            this.$router.push({name: 'JobChat', params: {taskId: this.responseInfo.id}})
          } else if ((this.$route.name === 'Chat') && (this.responseInfo.acceptanceStatus === this.STATUS.ACCEPTANCE_SITTER_ACCEPT)) {
            this.forYourProtection = true
          } else {
            window.open(url, '_system')
          }
        } else {
          // have not responded to job
          if (this.$route.name === 'JobSummary' || this.$route.name === 'MobileDashboard') {
            this.checkServiceMatch()
          } else {
            this.forYourProtection = true
          }
        }
      } else {
        this.openUrl(url)
      }
    },
    updateMoreInfoTrigger (value) {
      this.moreInfo = value
    },
    takeFromWallet () {
      this.payWallet = true
      this.$axios.get(`users/${this.$store.state.user.uuid}/tasks/${this.$route.params.response}/paymentfromwallet`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.notify({
          message: 'You have successfully booked with ' + this.responseUserInfo.username
        })
        setTimeout(() => {
          window.location.reload()
        }, 2400)
      }).catch((error) => {
        console.error(error)
      })
    },
    getMobileCode () {
      let country = this.$_.findWhere(countries, {'id': this.responseServiceInfo.userInfo ? `${this.responseServiceInfo.userInfo.mobileCountryId}` : `${this.requestInfo.requestorInfo.mobileCountryId}`})
      if (country) {
        return country.mobileCode
      }

      // If cannot find any country
      return 1
    },
    applyPromoCode (item) {
      this.closePromocodeModal(false)
      this.removeCodeLoader = true
      this.$axios.post(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}/promocodes`, {'promoCodeInfo': {'promoCodeRef': item.referenceCode}}, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.promocode = item.referenceCode
        this.$emit('refresh-price', true)
      }).catch(e => {
        setTimeout(() => {
          if (e.response.data.message) {
            this.msg400 = e.response.data.message
            this.handle400msgmodal = true
          }
        }, 100)
      }).finally(_ => {
        setTimeout(() => {
          this.removeCodeLoader = false
        }, 500)
      })
    },
    removePromoCode () {
      if (this.promocode === '' || this.promocode === null) {
        return
      }

      localStorage.removeItem('promocode')

      this.removeCodeLoader = true
      this.$axios.delete(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}/promocodes/${this.promocode}`, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$emit('refresh-price', true)
        this.promocode = null
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.removeCodeLoader = false
      })
    },
    openMoreInfo (item) {
      //  console.log(item)
      if (item.quoteDescriptionLink) {
        this.quoteDescriptionLink = item.quoteDescriptionLink
      } else {
        this.quoteDescriptionLink = ''
      }
      this.moreInfoText = item.quoteDescription
      this.moreInfo = true
    }
  }
}
</script>
<style lang="stylus" scoped>
.z999
  z-index: 9999 !important
img.pet-profile
  object-fit: cover
  width: 100%
  height: 85px

.breed-name
  max-width: 100px

@media screen and (min-width: 370px)
  .breed-name
    max-width: 125px

@media screen and (min-width: 410px)
  .breed-name
    max-width: 133px
</style>
