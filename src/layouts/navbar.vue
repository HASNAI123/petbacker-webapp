<template>
  <q-header flat v-if="$store.getters['user/getNavbarVisibility'] && $store.state.user.access" style="border-bottom: 1px solid #E0E0E0;" class="bg-white">
    <!-- Appear when screen is larger than xs -->
    <q-toolbar class="bg-white gt-md" v-if="false">
    <a :href="$t('link.href.petbacker')" target="_blank" rel="noreferrer noopener">
      <img src="statics/images/petbacker-logo-v2.png" alt="Petbacker Logo" class="logo-icon gt-sm cursor-pointer fixed-top" >
    </a>
    <q-toolbar-title class="text-right">
      <q-btn-group flat>
        <q-btn-dropdown :label="$t('navbar.services')" v-bind:class="$route.name === 'CreateRequest' ? 'selected' : ''" color="black" flat>
          <q-list highlight separator link style="max-width: 350px" class="row">
            <div v-for="service in navbarServices" :key="service.id" class="col-md-6">
              <q-item v-if="service.id !== 0" clickable v-ripple v-close-popup @click.native="$router.push(service.link)">
                <q-item-section avatar>
                  <q-avatar square style="width: 45px; height: 45px;">
                    <img :src='service.icon'/>
                  </q-avatar>
                </q-item-section>
                <q-item-section>{{$t(service.name)}}</q-item-section>
              </q-item>
              <q-item v-else clickable v-close-popup v-ripple @click.native="openNewTab($t('services.explore.link'))" rel="noreferrer noopener">
                <q-item-section avatar>
                  <q-avatar style="width: 45px; height: 45px;">
                    <img :src="'statics/images/explore.png'"/>
                  </q-avatar>
                </q-item-section>
                <q-item-section>{{$t('services.explore')}}</q-item-section>
              </q-item>
            </div>
          </q-list>
        </q-btn-dropdown>
        <!--Sign up NavBar-->
        <q-btn flat color="black" :label="$t('signup')" v-bind:class="activeTab('signup')" :ripple="false" v-if="!$store.state.user.access" @click.native="$router.push({path: '/signup', query: $route.query})"/>
        <q-btn flat color="black" :label="$t('login')" v-bind:class="activeTab('login')" :ripple="false" v-if="!$store.state.user.access" @click.native="$router.push({path: '/', query: $route.query})" />
        <!--END-->
        <q-btn flat color="black" :label="$t('navbar.requests')" v-bind:class="activeTab('requests')" :ripple="false" @click.native="$router.push('/requests')" v-if="$store.state.user.access" />
        <q-btn flat color="black" :label="$t('navbar.moments')" v-bind:class="activeTab('moments')" :ripple="false" @click.native="$router.push('/moments')" v-if="$store.state.user.access" />
        <q-btn flat color="black" :label="$t('mobile.navbar.jobs')" v-bind:class="activeTab('jobs')" :ripple="false" @click.native="$router.push('/jobs')" v-if="$store.state.user.access" />
        <div class="group">
          <!-- Vouchers -->
          <q-btn flat color="black" @click.native="$router.push('/referrals'), $q.cookies.set('linkVoucher', 'clicked', 100)" :ripple="false" @mouseover.native="mouseOver" @mouseleave.native="mouseLeave" v-bind:class="activeTab('referrals')" v-if="$store.state.user.access">
            <span v-if="this.voucher != null">{{ this.voucher }}</span> {{ "&nbsp;" + $t('navbar.referrals') }} <span class="notification-dot" v-if="!$q.cookies.get('linkVoucher')"></span>
            <!-- drop down on hover -->
            <q-tooltip v-if="this.voucher != null" anchor="bottom right" self="top right" class="dropdown" content-style="background-color: white; color: black">
              <p style="font-size: 12px">{{ $t('tooltip.voucher', {voucher:this.voucher}) }}</p>
              <a>{{ $t('invite.more') }}</a>
            </q-tooltip>
          </q-btn>
        </div>
        <q-btn flat color="black" :ripple="false" @click.native="$router.push('/messages')" v-bind:class="activeTab('messages')" v-if="$store.state.user.access">
          {{ $t('navbar.messages') }} <span class="notification-dot" v-if="$store.getters['user/getUnreadRequestMessageCount'] > 0 || $store.getters['user/getUnreadJobsMessageCount'] > 0 || $store.getters['user/getUnreadNotificationsCount'] > 0"></span>
        </q-btn>
        <!-- Languages selector-->
        <q-btn flat color="black" :ripple="false">
          <img style="height: 22px;width: 22px;" :src="languageIcon">
          <q-icon class ="material-icons" name="expand_more" style="color: black"/><br/>
          <q-menu anchor="bottom right" self="top right" auto-close>
            <q-list highlight separator link style="max-width: 300px" class="row">
              <q-item v-for="language in languageOptions" :key="language.label" class="col-md-6" clickable @click.native="updateLanguage(language.value)">
                <q-item-section avatar >
                  <q-avatar>
                    <img :src="language.icon"/>
                  </q-avatar>
                </q-item-section>
                <q-item-section>{{$t(language.label)}}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-btn-group>

      <!-- Avatar Dropdown menu -->
      <q-btn round style="height: 32px;width: 32px; background-size: cover;"
        :style="{ 'background-image': 'url(' + $store.state.user.avatarImage + ')' }"
        v-if="$store.state.user.access">
        <q-menu anchor="bottom right" self="top right" auto-close>
          <q-list separator link>
            <q-item clickable>
              <q-item-section @click.native="$router.push('/profile')">{{$t('navbar.profile')}}</q-item-section>
            </q-item>
            <!-- <q-item v-close-popup>
              <q-item-main @click.native="$router.push('/notifications')" :label="$t('navbar.notifications')"></q-item-main>
            </q-item> -->
            <q-item clickable>
              <q-item-section @click.native="$router.push({name: 'MyPets'})">{{$t('navbar.my.pets')}}</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section @click.native="$router.push('/chat/support-help')">{{$t('navbar.talk.support')}}</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section @click.native="$router.replace('/logout')">{{$t('navbar.logout')}}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar-title>
  </q-toolbar>

  <!-- <div class="q-pa-9 float-left full-width" style="background: #FFF9C4" v-if="this.$route.name === 'CreateRequest' && this.$route.query.avatar && this.$route.query.servname">
    <img class='owner-img float-left' :src="'https://assets.petbacker.com/user-images/320/' + this.$route.query.avatar + '.jpg'">
    <div class="float-left owner-text q-ml-md">You are contacting {{$route.query.servname}}</div>
  </div> -->
  <!-- <div class="full-width text-center notification_bar" v-if='showNotificationBar && !notShowNotificationBarInRoute.includes(this.$route.name) && !$q.platform.is.safari && !$q.platform.is.cordova' style="background: green; color:#fff">
    <span v-if="$q.platform.is.mobile">{{$t('push.notification.msg.mobile')}} </span>
    <span v-else-if="$q.platform.is.desktop">{{$t('push.notification.msg.desktop')}} </span>
    <ul class="notification_ul">
      <li><span @click="enableNotification()">{{$t('enable.notification')}}</span></li>&nbsp;
      <li><span @click="askNextTime()"> {{$t('ask.me.next.time')}} </span></li>&nbsp;
    </ul>
  </div>
  <div class="full-width text-center notification_bar" v-if='showDownloadAppBar && !$q.cookies.get("hideDownloadAppBar") && !notShowNotificationBarInRoute.includes(this.$route.name) && !$q.platform.is.safari && !$q.platform.is.cordova' style="background: green; color:#fff">
    <span v-if="$q.platform.is.mobile">{{$t('download.app.msg')}} </span>
    <span v-else-if="$q.platform.is.desktop">{{$t('download.app.msg')}} </span>
    <ul class="notification_ul">
      <li><span @click="downloadApp()">{{$t('download.now')}}</span></li>&nbsp;
      <li><span @click="askNextTimeDownloadApp()"> {{$t('ask.me.next.time')}} </span></li>&nbsp;
    </ul>
  </div> -->

  <!-- Mobile View Navbar -->
  <!-- Appear when screen is xs -->
  <div class="q-py-none row" style="height: 45px;max-height: 45px;">
    <!-- <h5 v-if="this.$route.path == '/products/subscriptions'" class="q-mt-sm z-fab text-black-7 font-title" style="text-align: center;margin-top: 10%;">
      <span v-html="$t('notifications.promotions')"></span>
    </h5> -->
    <!--
    <h5 class="q-mt-sm fixed-top z-fab lt-md text-grey-7" style="top: 4px; left: 80px;">
      <span v-html="$t('download.app.header')"></span>
    </h5>
    -->
    <!-- Back Button (Top Left) -->
    <q-btn :loading="loader" v-if="$route.name === 'CreateListing' && count <= 6" :ripple="false" flat class="font-header-title z-fab back-arrow q-mb-sm" style="color:black; margin-left: 10px;" @click="pressBackButton" icon="chevron_left"></q-btn>
    <q-btn :loading="loader" v-else-if="hideLeftArrow.indexOf($route.name) === -1 && $route.name !== 'CreateListing'" :ripple="false"  flat class="font-header-title z-fab back-arrow q-mb-sm" style="color:black; margin-left: 10px;" @click="pressBackButton" icon="chevron_left"></q-btn>
    <q-btn v-else-if="$route.name === 'RequestSubmitted'" :ripple="false" flat class="font-header-title z-fab back-arrow q-mb-sm" style="color:black; margin-left: 10px;"></q-btn>
    <!-- Dashboard (Top Left) -->
    <template v-else>
      <div class="z-fab col-9 text-left font-header-title" v-if="hideLeftArrow.indexOf($route.name) > -1" style="width: 200px;">
        <!-- PetBacker Logo (Explore Page) -->
        <img src="statics/images/petbacker-logo.png" alt="PetBacker Logo" class="z-fab cursor-pointer  q-px-sm q-ml-xs q-py-xs" style="padding-top: 3.6%;" width="150px" height="36.5px" loading="lazy" decoding="async"/>
        <!-- <img src="statics/images/petbacker-logo.png" alt="PetBacker Logo" v-if="$store.getters['user/getUserCurrentMobileTab'] === 'services.explore'"  class="z-fab cursor-pointer lt-md q-px-sm q-ml-xs q-py-xs" style="padding-top: 3.6%;" width="150px" height="36.5px" loading="lazy" decoding="async"/> -->

        <!-- Dashboard Title -->
        <!-- <h5 class="q-my-none q-ml-md q-mt-xs text-weight-medium text-secondary text-capitalize" v-else>{{$t($store.getters['user/getUserCurrentMobileTab'])}}</h5> -->
      </div>
      <!-- <div v-if="!$q.platform.is.cordova">
        <div v-for="(domain, index) in domains" :key="index">
          <div v-if="$store.state.user.uuid">
            <img rel="preconnect" :src="`${domain}?cookieee=${cookieee}`" style="display:none;">
          </div>
          <div v-else>
            <img rel="preconnect" :src="`${domain}?cookieee=`" style="display:none;">
          </div>
        </div>
      </div> -->
    </template>
    <!-- Support Help and Enquiry text -->
    <div class="lt-md bg-white z-fab col-9 text-center font-header-title" style="margin-top: 8px;" v-if="$q.platform.is.mobile && ($route.name === 'ChatSupportEnquiry' || $route.name === 'ChatSupportHelp' || $route.name === 'ChatSupport' )">
      <h5 class="font-header-title q-my-none" :style="$store.getters['user/getCurrentLanguage'] === 'idid' ? 'font-size:16px !important; margin-top: -1px;' : ''">{{$t('how_can_we_help')}}</h5>
    </div>
    <!-- Chat Navbar -->
    <div class="lt-md z-fab col-9" v-if="$q.platform.is.mobile && ($route.name === 'Chat' || $route.name === 'JobChat')">
      <q-item class="q-py-none" v-if="responseInfo">
        <q-item-section side @click="$q.platform.is.cordova ? openBackerListing() : openNewTab(responseInfo.serviceInfo.listingUrl)">
          <q-avatar size="33px">
            <img :src="responseInfo.serviceInfo.userInfo ? responseInfo.serviceInfo.userInfo.avatarImage : responseInfo.requestInfo.requestorInfo.avatarImage" class="image-upload"/>
          </q-avatar>
        </q-item-section>
        <q-item-section >
          <q-item-label class="font-header-title" style="color: black; max-width:175px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;" >{{(responseInfo.serviceInfo.userInfo ? responseInfo.serviceInfo.userInfo.username : responseInfo.requestInfo.requestorInfo.username)}}</q-item-label>
        </q-item-section>
      </q-item>
    </div>

    <!-- Services -->
    <div v-else-if="$q.platform.is.mobile && $route.name === 'Services'" class="lt-md z-fab col-9 text-center"  style="margin-top: 8px;">
      <h5 class="font-header-title q-my-none">{{$t('app.footer.petservices')}}</h5>
    </div>
    <!-- Create Request -->
    <div v-else-if="$q.platform.is.mobile && ($route.name === 'CreateRequest')" class="col-9">
      <q-linear-progress :value="percentage" class="primary lt-md z-fab margin-auto" style="margin-top: 6%;width: 150px;"></q-linear-progress>
    </div>
    <!-- Request Submitted -->
    <div v-else-if="$q.platform.is.mobile && $route.name === 'RequestSubmitted'" class="lt-md col-9 text-center"  style="margin-top: 10px;">
      <p class="font-header-title" style="margin:0px;">{{$t('quotes.are.on.the.way')}}</p>
    </div>
    <!-- Subscription Navbar -->
    <div v-if="$q.platform.is.mobile && $route.name === 'Subscription'" class="lt-md col-9 text-center"  style="margin-top: 6px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('notifications.promotions')}}</h5>
    </div>
    <!-- Nearby Backers Listings-->
    <div v-if="$q.platform.is.mobile && $route.name === 'BackersNearby'" class="lt-md z-fab text-center col-9">
      <h5 style="margin:0px;margin-top: 8px;" class="font-header-title" v-if="searchInfo === null">{{$t('backers.nearby')}}</h5>
      <div class="q-py-none margin-auto" style="width: 200px;height: 30px;border-radius: 20px;" v-else>
        <q-input v-model="searchInfo" rounded borderless style="border-radius: 20px;" ref="searchInput" @focus="triggerSearchDialog" class="input" dense>
          <template v-slot:prepend>
            <q-icon name="search" ></q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <!-- Backers Listing-->
    <div class="lt-md bg-white z-fab q-pl-lg col-9" v-if="$q.platform.is.mobile && ($route.name === 'Listing' || $route.name === 'EditListing')">
      <q-item class="q-py-none" style="padding-top: 4%;" dense>
        <q-item-section>
          <q-item-label class="font-header-title text-center" style="color: black; max-width:90%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;" >{{listingName}}</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <!-- About Me -->
    <div v-if="$q.platform.is.mobile && $route.name === 'AboutMe'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('about.me.title')}}</h5>
    </div>
    <!-- Help Center -->
    <div v-if="$q.platform.is.mobile && $route.name === 'HelpCenter'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('help.center')}}</h5>
    </div>
    <!-- Request Help -->
    <div v-if="$q.platform.is.mobile && $route.name === 'RequestHelp'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('how.to.make.a.request')}}</h5>
    </div>
    <!-- My Favorites -->
    <div v-if="$q.platform.is.mobile && $route.name === 'FavoritedListings'" class="lt-md z-fab text-center font-header-title col-9" style="margin-top: 7px;">
      <h5 style="margin-top:0px;" class="font-header-title">{{$t('profile.my.favorites')}}</h5>
    </div>
    <!-- Edit Profile -->
    <div v-if="$q.platform.is.mobile && $route.name === 'EditProfile'" class="lt-md z-fab text-center font-header-title col-9" style="margin-top: 7px;">
      <h5 style="margin-top:0px;" class="font-header-title">{{$t('edit.profile')}}</h5>
    </div>
    <!-- Settings -->
    <div v-if="$q.platform.is.mobile && $route.name === 'Settings'" class="lt-md z-fab text-center font-header-title col-9" style="margin-top: 7px;">
      <h5 style="margin-top:0px;" class="font-header-title">{{$t('account.settings.title')}}</h5>
    </div>
    <!-- FAQ -->
    <div v-if="$q.platform.is.mobile && $route.name === 'Faq'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 7px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('scam.alert')}}</h5>
    </div>
    <!-- Edit Request -->
    <div v-if="$q.platform.is.mobile && $route.name === 'EditRequest'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 7px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('btn.editrequest')}}</h5>
    </div>
    <!-- Request Details -->
    <div v-if="$q.platform.is.mobile && $route.name === 'ViewRequest'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 7px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('request.details')}}</h5>
    </div>
    <!-- Checkout -->
    <div v-if="$q.platform.is.mobile && $route.name === 'Checkout'" class="lt-md z-fab text-center font-header-title col-9" style="margin-top: 8px;x">
      <h5 style="margin:0px;" class="font-header-title">{{$t('navbar.checkout')}}</h5>
    </div>
    <!-- Bank Transfer -->
    <div v-if="$q.platform.is.mobile && $route.name === 'BankTransfer'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('checkout.bank.transfer')}}</h5>
    </div>
    <!-- Request Summary -->
    <div v-if="$q.platform.is.mobile && $route.name === 'RequestSummary'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('request.summary')}}</h5>
    </div>
    <!-- Job Summary -->
    <div v-if="$q.platform.is.mobile && $route.name === 'JobSummary'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('job.summary')}}</h5>
    </div>
    <!-- Job Quote -->
    <div v-if="$q.platform.is.mobile && $route.name === 'JobQuote'" class="lt-md z-fab font-header-title col-9 text-center"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('your.quotes')}}</h5>
    </div>
    <!-- Job Calendar -->
    <div v-if="$q.platform.is.mobile && $route.name === 'JobCalendar'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('calendar')}}</h5>
    </div>
    <!-- Messages (Inbox) -->
    <div v-if="$q.platform.is.mobile && $route.name === 'Messages'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('inbox')}}</h5>
    </div>
    <!-- My Pets -->
    <div v-if="$q.platform.is.mobile && $route.name === 'MyPets'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('navbar.my.pets')}}</h5>
    </div>
    <!-- Pet Profile -->
    <div v-if="$q.platform.is.mobile && $route.name === 'PetProfile'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('navbar.pet.profile')}}</h5>
    </div>
    <!-- Public Profile -->
    <div v-if="$q.platform.is.mobile && $route.name === 'PublicProfile'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 class="font-header-title q-my-none">{{$t('navbar.profile')}}</h5>
    </div>
    <!-- Moment Post -->
    <div v-if="$q.platform.is.mobile && ($route.name === 'MomentPost' ||  $route.name === 'MomentsProfile')" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('navbar.moments')}}</h5>
    </div>
    <!-- Account History -->
    <div v-if="$q.platform.is.mobile && $route.name === 'AccountHistory'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('profile.wallet')}}</h5>
    </div>
    <!-- Payout -->
    <div v-if="$q.platform.is.mobile && $route.name === 'Payout'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('payout')}}</h5>
    </div>
    <!-- Pets in Community -->
    <div v-if="$q.platform.is.mobile && $route.name === 'PetsInCommunity'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('pets.in.community')}}</h5>
    </div>
    <!-- Blogs -->
    <div v-if="$q.platform.is.mobile && $route.name === 'Blogs'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('blogs')}}</h5>
    </div>
    <!-- Blogs -->
    <div v-if="$q.platform.is.mobile && $route.name === 'BlockedAccounts'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('blocked.accounts')}}</h5>
    </div>
    <!-- Service Name (Create Listing) -->
    <div v-if="$q.platform.is.mobile && $route.name === 'CreateListing' && count === 0" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('service.name')}}</h5>
    </div>
    <!-- Service Info (Create Listing) -->
    <div v-if="$q.platform.is.mobile && $route.name === 'CreateListing' && count === 1" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('describe.your.service')}}</h5>
    </div>
    <!-- Service Rates (Create Listing) -->
    <div v-if="$q.platform.is.mobile && $route.name === 'CreateListing' && count === 2" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('service.rates.title')}}</h5>
    </div>
    <!-- Service Location (Create Listing) -->
    <div v-if="$q.platform.is.mobile && $route.name === 'CreateListing' && count === 3" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('add.location')}}</h5>
    </div>
    <!-- Upload Photos (Create Listing) -->
    <div v-if="$q.platform.is.mobile && $route.name === 'CreateListing' && (count === 5 || count === 6)" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('upload.photos')}}</h5>
    </div>
    <!-- Identity Verification -->
    <div v-if="$q.platform.is.mobile && $route.name === 'IdentityVerification'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 8px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('identification.document')}}</h5>
    </div>
    <!-- Badges -->
    <div v-if="$q.platform.is.mobile && $route.name === 'Badges'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 7px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('profile.my.badges')}}</h5>
    </div>
    <!-- Referrals -->
    <div v-if="$q.platform.is.mobile && $route.name === 'Referrals'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 7px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('profile.referral.program')}}</h5>
    </div>
    <!-- Rewards -->
    <div v-if="$q.platform.is.mobile && $route.name === 'Rewards'" class="lt-md z-fab text-center font-header-title col-9"  style="margin-top: 7px;">
      <h5 style="margin:0px;" class="font-header-title">{{$t('rewards.points')}}</h5>
    </div>
    <!-- Chat (Top Right) -->
    <div flat class="z-fab lt-md" v-if="$q.platform.is.mobile && ($route.name === 'Chat' || $route.name === 'JobChat') && responseInfo !== null">
      <a :href="`tel:${this.getMobileCode()}${(responseInfo.serviceInfo.userInfo ? responseInfo.serviceInfo.userInfo.mobileNum : responseInfo.requestInfo.requestorInfo.mobileNum)}`" target="_system" v-if="(responseInfo && ((responseInfo.serviceInfo.userInfo && responseInfo.serviceInfo.userInfo.mobileNum) || (responseInfo.requestInfo.requestorInfo && responseInfo.requestInfo.requestorInfo.mobileNum))) && responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT">
        <q-icon style="color: black;" class="phone font-title"  name="phone"></q-icon>
      </a>
      <a v-else @click="$store.commit('user/updateopenModalQuoteDetailsState', Math.random())">
        <q-icon style="color: black;" class="phone font-title"  name="phone"></q-icon>
      </a>
      <div @click="modalMoreOptions = true">
        <q-icon style="color: black; font-size: 20px;" class="moreOptions" name="more_vert"></q-icon>
      </div>
    </div>
    <!-- Messages (Top Right) -->
    <div v-if="$q.platform.is.mobile && $route.name === 'Messages'" class="z-fab lt-md topMessage moreOptions q-px-none" style="right: 10px;width: 65px;" :style="$store.getters['user/getMessageTabIndex'] === 'tab-notifications' ? 'right: 0px;' : ''">
      <div v-if="['tab-requests', 'tab-jobs'].indexOf($store.getters['user/getMessageTabIndex']) > -1">
        <q-btn flat @click="onEditRates" :label="$t('done')" :ripple="false" v-if="onEdit" class="q-pa-none text-capitalize" style="color: black; font-size: 16px;" ></q-btn>
        <q-btn flat @click="onEditRates" :label="$t('button.edit')" :ripple="false" v-else class="q-pa-none text-capitalize" style="color: black; font-size: 16px;" ></q-btn>
      </div>
      <div v-else-if="$store.getters['user/getMessageTabIndex'] === 'tab-notifications'">
        <q-icon @click="triggerPromptDialog(true, $t('mark.all.notifications.as.read'), $t('mark.all.read'), 2)" name="task_alt" id="cross" style="color: black;margin-top: 6px;position: absolute;right: 20px;"></q-icon>
      </div>
    </div>
    <!-- Create Request 'X' (Top Right) -->
    <q-btn flat class="z-fab lt-md topMessage moreOptions q-px-none" style="width: 55px; right: -5px;" @click="closeRequest" v-if="$route.name === 'CreateRequest'">
      <q-icon name="close" id="cross" style="color: black"></q-icon>
    </q-btn>
    <!-- Request Submitted 'X' (Top Right) -->
    <q-btn flat class="z-fab lt-md topMessage moreOptions q-px-none" style="width: 55px; right: -5px;"  @click="refreshAndNavigate('MobileDashboard')" v-if="$route.name === 'RequestSubmitted'">
      <q-icon name="close" id="cross" style="color: black"></q-icon>
    </q-btn>
    <!-- Request Summary '?' (Top Right) -->
    <!-- <q-btn flat class="z-fab lt-md topMessage moreOptions q-px-none" style="width: 55px; right: -5px;" v-if="$q.platform.is.mobile && $route.name === 'RequestSummary'" @click="downloadModal = true">
      <q-icon name="help_outline" id="cross" style="color: black"></q-icon>
    </q-btn> -->
    <!-- Pet Profile More Options (Top Right) -->
    <q-btn flat  class="z-fab lt-md topMessage moreOptions q-px-none" style="width: 55px; right: -5px;" v-if="$q.platform.is.mobile && $route.name === 'PetProfile'" @click="modalMoreOptions = true">
      <q-icon style="color: black;" name="more_vert"></q-icon>
    </q-btn>
    <!-- Create Request Button '+' (Top Right) -->
    <!-- <q-btn flat class="z-fab lt-md createRequest" style="margin-right: 20px;" @click="$router.push('/services')" v-if="!$store.state.user.access">
      <q-icon name="add" id="cross" style="color: black"></q-icon>
    </q-btn> -->
    <!-- Job Quote Button '+' (Top Right)  -->
    <div flat  class="z-fab lt-md topMessage moreOptions" style="bottom: 10px;right: 0px;width: 35px;" @click="onAddQuoteItem" v-if="$q.platform.is.mobile && $route.name === 'JobQuote' && responseInfo && responseInfo.completionStatus !== 1">
      <q-icon name="add" id="cross" style="color: black"></q-icon>
    </div>
    <!-- Service Rates (Create Listing) More Option (Top Right) -->
    <div class="z-fab lt-md moreOptions" style="width: 50px; right: 0px;" @click="modalMoreOptions = true" v-if="$q.platform.is.mobile && $route.name === 'CreateListing' && count === 2">
      <q-icon style="color: black; font-size: 20px;margin-top: 6px; margin-left: 93%;" name="more_vert"></q-icon>
    </div>
    <!-- Upload Photos (Create Listing) Edit/Done Button (Top Right) -->
    <div class="z-fab lt-md topMessage moreOptions modifier" v-if="$q.platform.is.mobile && $route.name === 'CreateListing' && (count === 5 || count === 6)">
      <q-btn flat :label="$t('done')" :ripple="false" @click="onEditRates" v-if="onEdit" class="q-pa-none text-capitalize" style="color: black; font-size: 16px;" ></q-btn>
      <q-btn flat :label="$t('button.edit')" :ripple="false" @click="onEditRates" v-else class="q-pa-none text-capitalize" style="color: black; font-size: 16px;" ></q-btn>
    </div>
    <!-- Settings Logout (Top Right) -->
    <q-btn flat class="z-fab lt-md topMessage moreOptions text-capitalize" @click="triggerPromptDialog(true, $t('logout.prompt'), $t('navbar.logout'), 1)" color="primary" :label="$t('navbar.logout')" style="padding: none; margin: none;width: 120px;right: -20px;" v-if="$q.platform.is.mobile && $route.name === 'Settings'" :ripple="false"></q-btn>
    <!-- Create New Moment Post (Top Right) -->
    <!-- <q-btn flat color="primary" label="New Post" @click="modalMoreOptions = true" style="width: 115px;right: 0px;" class="z-fab lt-md topMessage moreOptions" v-else-if="$store.state.user.access && ($store.getters['user/getUserCurrentMobileTab'] === 'navbar.moments') && $route.name === 'MobileDashboard'"></q-btn> -->
    <!-- Inbox (message icon) Top Right -->
    <q-btn flat color="black" icon="img:statics/images/new-icons/inbox.png" @click="navigateTo('Messages')" class="z-fab  topMessage moreOptions q-px-none" style="width: 55px; right: -5px;" v-else-if="$store.state.user.access && showInbox.indexOf($route.name) > -1" :ripple="false">
      <span style="width: 10px; height: 10px; position: absolute; top: 6px;right: 10px;background-color: red; border-radius: 100px;" v-if="($store.getters['user/getUnreadRequestMessageCount'] > 0 || $store.getters['user/getUnreadNotificationsCount'] > 0 || $store.getters['user/getUnreadJobsMessageCount'] > 0)"></span>
    </q-btn>
    <!-- Profile Settings Icon (Top Right) -->
    <q-btn flat color="black" icon="settings" @click="navigateTo('Settings')" class="q-mt-xs z-fab lt-md topMessage moreOptions" style="width: 55px;right: 33px;" v-if="$store.state.user.access && $route.name === 'MobileDashboard' && $store.getters['user/getUserCurrentMobileTab'] === 'navbar.profile'" :ripple="false"></q-btn>
    <!-- Wallet (Top Right) -->
    <q-btn flat color="black" icon="fas fa-university" @click="$router.push({name: 'Payout'})" class="z-fab lt-md topMessage moreOptions" style="width: 50px; right: 0px;" v-else-if="$route.name === 'AccountHistory'" :ripple="false"></q-btn>
    <!-- Create Listing Done Button (Top Right) -->
    <q-btn flat color="primary" :label="$t('done')" :ripple="false" @click="onCreateListingDone" style="width: 70px;right: 0px;" class="z-fab lt-md topMessage moreOptions" v-else-if="$route.name === 'CreateListing' && count === 10"></q-btn>
    <!-- Public Profile More Options (Top Right) -->
    <q-btn flat class="z-fab lt-md createRequest" :ripple="false" style="width: 30px; right: 0px;" v-else-if="$q.platform.is.mobile && $route.name === 'PublicProfile' && ($route.params.userId !== $store.getters['user/getUserUuidState'])" @click="modalMoreOptions = true">
      <q-icon style="color: black; font-size: 20px;" name="more_vert"></q-icon>
    </q-btn>
    <!-- Backers Nearby Favorites (Top Right) -->
    <q-btn flat color="black" icon="favorite_border" @click="$router.push({name: 'FavoritedListings'})" class="z-fab lt-md topMessage moreOptions" style="width: 50px; right: 0px;" v-if="$route.name === 'BackersNearby'" :ripple="false"></q-btn>
    <!-- Backers Nearby Search (Top Right) -->
    <q-btn flat color="black" icon="search" class="z-fab lt-md topMessage moreOptions" style="width: 50px; right: 35px;" @click="triggerSearchDialog" v-if="$route.name === 'BackersNearby' && searchInfo === null" :ripple="false"></q-btn>
    <!-- Backers Listing (Top Right)-->
    <div class="z-fab lt-md" v-if="$q.platform.is.mobile && $route.name === 'Listing'">
      <!-- Favorite Button -->
      <div @click="onFavorite">
        <q-icon style="font-size: 20px;" class="phone font-title" :style="{'color': favoriteStatus ? 'red' : 'black'}" :name="favoriteStatus ? 'favorite' : 'favorite_border'"></q-icon>
      </div>
      <!-- More Options -->
      <div @click="modalMoreOptions = true">
        <q-icon style="color: black; font-size: 20px;" class="moreOptions" name="more_vert"></q-icon>
      </div>
    </div>
    <!-- Edit Listing (Top Right)-->
    <div class="z-fab lt-md" v-if="$q.platform.is.mobile && $route.name === 'EditListing'">
      <!-- Favorite Button -->
      <div @click="openShareDialog('', listingShareUrl.includes('https://') ? listingShareUrl : $t('link.href.petbacker') + listingShareUrl)">
        <q-icon style="font-size: 20px;color: black;" class="phone font-title" name="ios_share"></q-icon>
      </div>
      <!-- More Options -->
      <div @click="modalMoreOptions = true">
        <q-icon style="color: black; font-size: 20px;" class="moreOptions" name="more_vert"></q-icon>
      </div>
    </div>
    <!--
    <q-btn flat class="q-mt-sm fixed-top z-fab lt-md createRequest" @click="$router.push('/services')" v-if="this.hideCreateRequest.indexOf($route.name) < 0">
      <q-icon name="add" id="cross" style="color: black"></q-icon>
    </q-btn>
    -->
  </div>
  <!-- <push-notification ref="pushnotification" v-if="!$q.platform.is.cordova"></push-notification> -->

  <!-- More options modal -->
  <q-dialog v-model="modalMoreOptions" auto-close position="bottom" class="moreOptions"  style="width: 220px; border-top-right-radius: 15px;border-top-left-radius: 15px;">
    <q-card style="padding-top: 0px;">
      <!-- Service Rates (Create Listing) -->
      <q-card-section v-if="$route.name === 'CreateListing' && count === 2">
        <q-btn flat class="full-width q-my-sm text-weight-medium" style="margin-top:8px" @click="onEditRates" no-caps v-if="showEditButton">
          <p v-if="onEdit">{{$t('done')}}</p>
          <p v-else>{{$t('button.edit')}}</p>
        </q-btn>
        <q-btn flat class="full-width q-my-sm text-weight-medium" style="margin-top:8px" @click="onAddServiceRate" no-caps><p>{{$t('add.service.rate.title')}}</p></q-btn>
        <div><q-separator/></div>
        <q-btn flat class="full-width q-my-md text-weight-bold" text-color="black" id="closeBtn" no-caps>{{$t('close')}}</q-btn>
      </q-card-section>

      <!-- Public Profile Options -->
      <q-card-section v-if="$route.name === 'PublicProfile'">
        <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="red" style="margin-top:8px" @click.native="onBlock" no-caps><p>{{$t('block')}}</p></q-btn>
        <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="red" style="margin-top:8px" @click.native="onReport($route.params.userId)" no-caps><p>{{$t('report')}}</p></q-btn>
        <div><q-separator/></div>
        <q-btn flat class="full-width q-my-md text-weight-bold" text-color="black" id="closeBtn" no-caps>{{$t('close')}}</q-btn>
      </q-card-section>

      <!-- Listings More Options -->
      <q-card-section v-else-if="$route.name === 'Listing'">
        <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="red" style="margin-top:8px" @click.native="onBlock" no-caps v-if="$route.query.id !== $store.getters['user/getUserUuidState']"><p>{{$t('block')}}</p></q-btn>
        <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="red" style="margin-top:8px" @click.native="onReport($route.query.id)" no-caps v-if="$route.query.id !== $store.getters['user/getUserUuidState']"><p>{{$t('report')}}</p></q-btn>
        <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="black" style="margin-top:8px" @click.native="openShareDialog('', listingShareUrl.includes('https://') ? listingShareUrl : $t('link.href.petbacker') + listingShareUrl)" no-caps><p>{{$t('share')}}</p></q-btn>
        <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="black" style="margin-top:8px" @click.native="$router.push({name: 'PublicProfile', params: {userId: $route.query.id}})" no-caps><p>{{$t('view.profile')}}</p></q-btn>
        <q-btn flat class="full-width q-my-sm text-weight-medium" v-if="onEdit" text-color="black" @click="$router.push({name: 'EditListing', params: {listingId: $route.params.listingId}})" style="margin-top:8px" no-caps><p>{{$t('listing.edit.info.option')}}</p></q-btn>
        <div><q-separator/></div>
        <q-btn flat class="full-width q-my-md text-weight-bold" text-color="black" id="closeBtn" no-caps>{{$t('close')}}</q-btn>
      </q-card-section>

      <!-- Edit Listing More Options -->
      <q-card-section v-else-if="$route.name === 'EditListing'">
        <q-btn flat class="full-width q-my-sm text-capitalize text-weight-medium" text-color="red" style="margin-top:8px" @click.native="onCloseListing" no-caps><p>{{$t('permanently.close.listing')}}</p></q-btn>
        <q-btn flat class="full-width q-my-sm text-capitalize text-weight-medium" text-color="red" style="margin-top:8px" @click.native="onPauseListing" v-if="responseInfo && responseInfo.isPaused === 0" no-caps><p>{{$t('pause.listing')}}</p></q-btn>
        <q-btn flat class="full-width q-my-sm text-capitalize text-weight-medium" text-color="black" style="margin-top:8px" @click.native="onHideListing" v-if="responseInfo && responseInfo.status === 1" no-caps><p>{{$t('hide.listing')}}</p></q-btn>
        <q-btn flat class="full-width q-my-sm text-capitalize text-weight-medium" text-color="black" style="margin-top:8px" @click.native="onResumeListing" v-if="responseInfo && (responseInfo.isPaused === 1 || responseInfo.status === 0)" no-caps><p>{{$t('resume.listing')}}</p></q-btn>
        <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="black" style="margin-top:8px" @click.native="openShareDialog('', listingShareUrl.includes('https://') ? listingShareUrl : $t('link.href.petbacker') + listingShareUrl)" no-caps><p>{{$t('share')}}</p></q-btn>
        <div><q-separator/></div>
        <q-btn flat class="full-width q-my-md text-weight-bold" text-color="black" id="closeBtn" no-caps>{{$t('close')}}</q-btn>
      </q-card-section>

      <!-- Pet Profile More Options -->
      <q-card-section v-else-if="$route.name === 'PetProfile'">
        <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="negative" style="margin-top:8px" @click.native="onDeletePet" v-if="showEditButton" no-caps><p>{{$t('delete')}}</p></q-btn>
        <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="black" style="margin-top:8px" @click.native="openShareDialog(`Join me in the best app for your pets!`, `${$t('link.href.petbacker')}/pet-sitting-boarding-and-dog-walking-app-on-mobile`)" no-caps><p>{{$t('share')}}</p></q-btn>
        <div><q-separator/></div>
        <q-btn flat class="full-width q-my-md text-weight-bold" text-color="black" id="closeBtn" no-caps>{{$t('close')}}</q-btn>
      </q-card-section>

      <!-- Moments Post Options --><!-- Translation needed -->
      <!-- <q-card-section v-else-if="$store.getters['user/getUserCurrentMobileTab'] === 'navbar.moments'">
        <q-btn flat class="full-width q-my-sm  text-weight-medium" text-color="black" style="margin-top:8px" @click.native="futureUpdateModal = true" no-caps><p>{{$t('new.moment')}}</p></q-btn>
        <q-btn flat class="full-width q-mt-md text-weight-medium" text-color="black" style="margin-top:8px" @click.native="createStoryModal = true" no-caps><p>{{$t('new.story')}}</p></q-btn>
        <q-btn flat class="full-width q-mt-md text-weight-medium" text-color="black" style="margin-top:8px" @click.native="openDrafts" no-caps><p>{{$t('saved.drafts')}}</p></q-btn>
        <div><q-separator/></div>
        <q-btn flat class="full-width q-my-md text-weight-bold" text-color="black" id="closeBtn" no-caps>{{$t('close')}}</q-btn>
      </q-card-section> -->

      <!-- Job Quote Add Item Options -->
      <q-card-section v-else-if="$route.name === 'JobQuote'">
        <q-btn flat class="full-width q-py-sm text-weight-medium" text-color="black" no-caps @click="quoteDetailModal = true"><p class="q-my-none font-normal" >{{$t('add.quote.item')}}</p></q-btn>
        <q-btn flat class="full-width q-py-sm text-weight-medium" text-color="black" no-caps  @click="discountDetailModal = true"><p class="q-my-none font-normal">{{$t('discount.title')}}</p></q-btn>
        <div class="q-my-md"><q-separator/></div>
        <q-btn flat class="full-width q-my-md text-weight-bold" text-color="black" id="closeBtn" no-caps><p class="q-my-none font-normal">{{$t('close')}}</p></q-btn>
      </q-card-section>

      <!-- Request/Job (CHAT) More Options -->
      <q-card-section v-else-if="this.responseInfo !== null">
        <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="red" style="margin-top:8px" @click.native="onBlock" no-caps><p class="q-my-none font-normal">{{$t('block')}}</p></q-btn>
        <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="red" style="margin-top:8px" @click.native="onReport(responseInfo.serviceInfo.id)" no-caps><p class="q-my-none font-normal">{{$t('report')}}</p></q-btn>
        <q-btn flat v-if="$route.params.taskId && (this.responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_NO_RESPONSE || this.responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT || this.responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT) && this.responseInfo.completionStatus === STATUS.COMPLETION_NO_RESPONSE" @click.native="toCancel" class="full-width q-my-sm text-weight-medium" no-caps><p class="q-my-none font-normal">{{ $t('cancel.this.job') }}</p></q-btn>
        <q-btn flat v-else-if="(this.responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT || this.responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_PARENT_ACCEPT || this.responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_NO_RESPONSE) && this.responseInfo.completionStatus === STATUS.COMPLETION_NO_RESPONSE" class="full-width q-my-sm text-weight-medium" text-color="black" @click.native="toCancel" no-caps>
          <p class="q-my-none font-normal">
            {{responseInfo.requestInfo.status ? $t('requests.page.cancelrequest') : $t('decline')}}
          </p>
        </q-btn>
        <q-btn flat v-if="$route.params.request && (this.responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_NO_RESPONSE || this.responseInfo.acceptanceStatus === STATUS.ACCEPTANCE_SITTER_ACCEPT)" class="full-width q-my-sm text-weight-medium" text-color="black" @click.native="toEditScreen()" no-caps><p class="q-my-none font-normal">{{$t('edit.this.booking')}}</p></q-btn>
        <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="black" style="margin-top:8px" @click.native="$router.push({name: 'JobQuote', params:{taskId: responseInfo.id}})" v-if="$route.name === 'JobChat'" no-caps><p class="q-my-none font-normal">{{$t('view.your.quote')}}</p></q-btn>
        <q-btn flat class="full-width q-my-sm text-weight-medium" v-if="$route.name === 'JobChat'" @click="shareBooking" no-caps><p class="q-my-none font-normal">{{ $t('share.booking') }}</p></q-btn>
        <q-btn flat @click="$q.platform.is.cordova ? openProfile() : openNewTab(responseInfo.serviceInfo.listingUrl)" class="full-width q-my-sm text-weight-medium" no-caps><p class="q-my-none font-normal">{{$t('view.backers.profile')}}</p></q-btn>
        <q-btn flat class="full-width q-my-sm text-weight-medium" text-color="black" style="margin-top:8px" @click.native="toViewScreen()" no-caps><p class="q-my-none font-normal">{{ $route.name === 'Chat' ? $t('view.request.header') : $t('view.job.details')}}</p></q-btn>
        <div class="q-my-md"><q-separator/></div>
        <q-btn flat class="full-width q-my-md text-weight-bold" text-color="black" id="closeBtn" no-caps><p class="q-my-none font-normal">{{$t('close')}}</p></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Quote Dialog to add new quote items from job quote page -->
  <dialog-quotedetails
    v-if="$route.name === 'JobQuote'"
    :trigger="quoteDetailModal"
    :quoteTypes="quoteTypes"
    :currency="$store.getters['user/getUserPrefferedCurrency']"
    @refresh="onRefreshQuoteDetail"
    @on-close="closeQuoteDetail"
    @on-error="triggerServerError"></dialog-quotedetails>

  <!-- Discount Dialog to add new discount items from job quote page -->
  <dialog-discountdetails
    v-if="$route.name === 'JobQuote'"
    :trigger="discountDetailModal"
    :currency="$store.getters['user/getUserPrefferedCurrency']"
    @refresh="onRefreshQuoteDetail"
    @on-close="closeDiscountDetail"></dialog-discountdetails>

  <!-- Download app modal (from request summary) -->
  <q-dialog v-model="downloadModal" maximized persistent transition-show="slide-left" transition-hide="slide-right">
    <q-card>
      <q-toolbar style="border-bottom: 1px solid lightgrey;">
        <q-btn flat round dense v-close-popup class="font-header-title" icon="keyboard_arrow_left" style="margin-left:-1%;"/>
        <q-toolbar-title class="font-header-title" style="margin-left:24%;">
          {{ $t('what.next') }}
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section style="padding: 20px;">
        <q-card-section>
          <big>
            <a :href="$t('petbacker.app.link')" style="color: black; text-decoration: none;"><strong>{{$t('download.mobile.apps')}}</strong></a>
          </big>
        </q-card-section>
        <q-card-section>
          <a :href="$t('petbacker.app.link')" target="_blank"><q-img :src="downloadBanner"></q-img></a>
        </q-card-section>
        <q-card-section >
          <!--<p v-html="$t('first.request.text.edit')"></p>-->
          <div>
            <a href="/referrals" target="_blank">
              <q-btn color="primary" class="q-mt-sm" outline>{{ $t('chat.whypaywithpetbacker') }}</q-btn>
            </a>
            <a :href="$t('petbacker.app.link')" target="_blank" rel="noreferrer noopener">
              <q-btn color="primary" class="q-mt-sm">{{ $t('button.download.app') }}</q-btn>
            </a>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Dialog Prompt (logout) -->
  <dialog-prompt :trigger="promptModal" :message="promptMessage" :type="promptType" :okButtonLabel="promptOkLabel" @on-ok="onPromptOk" @on-close="triggerPromptDialog"></dialog-prompt>

  <!-- Pop up use app instead -->
  <download-app-modal :trigger="downloadAppModal" @close="downloadAppModal = false"></download-app-modal>

  <!-- Dialog Login/Sign Up Now -->
  <dialog-guestmode :trigger="guestModeModal" :message="guestModeMessage" @on-close="triggerGuestModeModal"></dialog-guestmode>

  <!-- For your protection modal -->
  <dialog-foryourprotection @trigger-updated="updateForYourProtectionState" :trigger="forYourProtection" :requestId="parseInt($route.params.request)" :responseId="parseInt($route.params.response)"></dialog-foryourprotection>

  <!-- Error Dialog -->
  <dialog-error :trigger="modalError" :title="errorTitle" :message="errorMessage" :statusCode="errorCode" :okButtonLabel="errorOkLabel" @on-ok="onOkBtn" @on-close="triggerServerError"></dialog-error>

  <!-- Cancellation Dialog -->
  <dialog-cancellation v-if="$route.name === 'Chat' && responseInfo" :status="responseInfo.requestInfo.status || responseInfo.bookStatus" :trigger="cancelBooking" :requestId="parseInt($route.params.request)" :responseId="parseInt($route.params.response)" :requestRef="responseInfo.requestInfo.id.toString()" :bookingRef="responseInfo.jobReference" @on-close="onTriggerCancellationModal"></dialog-cancellation>

  <!-- Decline Dialog -->
  <dialog-jobdecline :trigger="declineModal" @on-decline="onDecline" :bookingReference="responseInfo.jobReference" v-if="responseInfo && responseInfo.jobReference" :bookStatus="parseInt(responseInfo.acceptanceStatus) === STATUS.ACCEPTANCE_PARENT_ACCEPT ? 1 : 0" :taskId="parseInt(responseInfo.id)" @on-close="closeDeclineModal"></dialog-jobdecline>

  <!-- Share Dialog (From Pet Profile) -->
  <q-dialog v-model="sharingDialog" auto-close  position="bottom" class="moreOptions" transition-show="slide-up">
    <share-card :detail="shareText" :shareLink="shareLink" @on-shared="sharingDialog = false"></share-card>
  </q-dialog>

  <!-- Future Updates Dialog -->
  <dialog-future-update :trigger="futureUpdateModal" :message="'We are working hard on making posting on moments a better experience for you, while waiting try out other features of the app!'" @on-close="onCloseFutureUpdateModal"></dialog-future-update>

  <!-- Block Dialog -->
  <dialog-block v-if="$route.params.userId || $route.query.id || responseInfo" :trigger="blockModal" :blockUserUuid="$route.params.userId || $route.query.id || ((responseInfo.serviceInfo && responseInfo.serviceInfo.userInfo) ? responseInfo.serviceInfo.userInfo.id : null)" @on-close="triggerBlockModal" @on-block-user="onBlockUser"></dialog-block>

    <!-- Prompt notification before initialization -->
    <dialog-permission :trigger="promptPermission" :promptOptions="promptOptions" @on-close="closePrompt" @on-ok="onPermissionPromptOK"></dialog-permission>

    <notification-card v-if="notificationCardShow"></notification-card>

  </q-header>
  <q-header v-else>
    <!-- Prompt notification before initialization -->
    <dialog-permission :trigger="promptPermission" :promptOptions="promptOptions" @on-close="closePrompt" @on-ok="onPermissionPromptOK"></dialog-permission>

    <notification-card v-if="notificationCardShow"></notification-card>
  </q-header>
</template>

<script>
import languageSwitcherMixin from '../mixins/languageSwitcherMixin.js'
import chatMixin from '../mixins/chatMixin.js'
import services from 'assets/services.json'
import servicesTwo from 'assets/services_2.json'
import countries from 'assets/countries.json'
import requestStatus from 'assets/request-status.json'
import clipboard from '../mixins/copyClipboardMixin.js'
import { throttle } from 'quasar'

const CHAT_ROUTES = ['Chat', 'JobChat']

export default {
  mixins: [clipboard, languageSwitcherMixin, chatMixin],
  name: 'layout-navbar',
  components: {
    'dialog-future-update': () => import('components/DialogFutureUpdate.vue'),
    //  PushNotification: () => import('pages/PushNotification.vue'),
    RequestTargetNotification: () => import('components/RequestTargetNotification.vue'),
    'dialog-foryourprotection': () => import('components/ModalForYourProtection.vue'),
    'share-card': () => import('components/DialogShare.vue'),
    'dialog-quotedetails': () => import('components/JobQuote/DialogQuoteDetails.vue'),
    'dialog-discountdetails': () => import('components/JobQuote/DialogAddDiscount.vue'),
    'dialog-jobdecline': () => import('components/JobCenter/DialogDeclineJob.vue'),
    'dialog-cancellation': () => import('components/Cancellation/DialogCancellation.vue'),
    'dialog-guestmode': () => import('components/DialogLoginSignUpNow.vue'),
    'dialog-block': () => import('components/DialogBlock.vue'),
    'dialog-error': () => import('components/DialogError.vue'),
    'dialog-prompt': () => import('components/DialogPrompt.vue'),
    'dialog-permission': () => import('components/DialogPermission.vue'),
    'download-app-modal': () => import('components/DialogDownloadApp.vue'),
    'notification-card': () => import('components/PushNotification/NotificationCard.vue')
  },
  props: {
    count: Number,
    responseInfo: Object,
    percentage: Number,
    serviceTitle: String,
    quoteTypes: Array
  },
  data () {
    return {
      modalError: false,
      errorMessage: null,
      errorOkLabel: '',
      errorCode: 0,
      errorTitle: 'Oops!',
      discountDetailModal: false,
      quoteDetailModal: false,
      downloadAppModal: false,
      createStoryModal: false,
      forYourProtection: false,
      navbarServices: null,
      languageIcon: null,
      countries: [
        'MY',
        'GB',
        'SG'
      ],
      hideLeftArrow: [
        'Explore',
        'Requests',
        'Jobs',
        'Moments',
        'Profile',
        'MobileDashboard',
        'Login',
        'LoginEmail',
        'Signup',
        'SignupEmail',
        'ReferralSignup',
        'AlternativeReferralSignup',
        'LoginFacebook',
        'OAuthFacebook',
        'Index',
        'RequestSubmitted'
      ],
      showInbox: [
        'MobileDashboard',
        'Explore',
        'Requests',
        'Jobs',
        'Moments',
        'Profile'
      ],
      requestParams: [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'gclid',
        'fbclid'
      ],
      domains: [
        'https://www.petbacker.com'
      ],
      notShowNotificationBarInRoute: ['Services', 'CreateRequest', 'ServiceFormJson'],
      voucher: null,
      // showNotificationBar: !this.$store.getters['user/getUserNotificationsState'],
      showNotificationBar: false,
      showDownloadAppBar: true,
      userCount: 0,
      modalMoreOptions: false,
      STATUS: requestStatus,
      readInterval: null,
      failedMessageInterval: null,
      downloadModal: false,
      cancelBooking: false,
      downloadBanner: null,
      serviceList: null,
      cancelPage: 0,
      cancelMessage: null,
      sharingDialog: false,
      shareText: null,
      shareLink: null,
      listingName: null,
      favoriteStatus: null,
      listingShareUrl: null,
      searchInfo: null,
      onEdit: false,
      showEditButton: false,
      declineModal: false,
      reportedReasons: '',
      futureUpdateModal: false,
      guestModeModal: false,
      guestModeMessage: '',
      blockModal: false,
      loader: false,
      promptModal: false,
      promptMessage: '',
      promptOkLabel: this.$t('navbar.logout'),
      promptType: 0,
      onBackground: false,
      resendTitle: null,
      promptPermission: false,
      promptOptions: {},
      notificationCardShow: false,
      previousRoute: null
    }
  },
  computed: {
    // languageChanged () {
    //   return this.$store.state.user.language
    // },
    // cookieee () {
    //   return Base64.encodeURI(JSON.stringify(this.$store.state.user, null, 2))
    // },
    adminState () {
      return this.$store.state.user.admin
    },
    loginState () {
      return this.$store.state.user.access
    }
  },
  watch: {
    // languageChanged (newValue, oldValue) {
    //   this.updateLanguageIcon()
    //   this.downloadBanner = 'dog_walk_banner_' + newValue + '.jpg'
    // },
    '$route' (to, from) {
    this.previousRoute = from
  },
    serviceTitle (newValue, oldValue) {
      this.serviceList = newValue
    },
    adminState (newValue, oldValue) {
      if (newValue) {
        clearInterval(this.readInterval)
      }
    },
    loginState (newValue, oldValue) {
      if (newValue && !this.readInterval) {
        this.getReadStatus()

        // Check if have new messages every 30 sec
        this.getReadStatus = throttle(this.getReadStatus, 30000)
        this.readInterval = setInterval(this.getReadStatus, 30000)
      } else {
        clearInterval(this.readInterval)
      }
    }
  },
  created () {
    this.failedMessageInterval = setInterval(this.resendFailedMessages, 15000)
    document.addEventListener('deviceready', this.onDeviceReady, false)

    this.$store.commit('user/updateUserReviewState', false)
    // this.updateRequestStates()
    // this.checkLocation()

    // setup proper language images and icons
    // if (this.$store.state.user.language) {
    //   this.languageIcon = this.$_.findWhere(this.languageOptions, {'value': this.$store.state.user.language}).icon
    //   this.downloadBanner = 'statics/images/gif/dog_walk_banner_' + this.$store.state.user.language + '.jpg'
    // }

    if (this.$store.getters['user/getUserAccessState']) {
      this.getReadStatus()

      // Check if have new messages every 30 sec
      this.getReadStatus = throttle(this.getReadStatus, 30000)
      this.readInterval = setInterval(this.getReadStatus, 30000)
    }

    // this.ifIncognito(true, () => { this.showNotificationBar = false })
    if (this.$route.query._gac) {
      let _gac = this.$route.query._gac.split('.')
      let gclid = _gac[_gac.length - 1]
      this.$store.commit('request/updateRequestGclidState', gclid)
    } else if (this.$route.query.gclid) {
      let gclid = this.$route.query.gclid
      this.$store.commit('request/updateRequestGclidState', gclid)
    } else {
      let gclid = this.$store.getters['request/getRequestGclidState']
      this.$store.commit('request/updateRequestGclidState', gclid)
    }
  },
  beforeDestroy () {
    document.removeEventListener('deviceready', this.onDeviceReady, false)
    if (this.readInterval) {
      clearInterval(this.readInterval)
    }
    clearInterval(this.failedMessageInterval)
  },
  methods: {
    async resendFailedMessages () {
      for (var a in localStorage) {
        if (a.indexOf('resend||users') === 0) {
          if (CHAT_ROUTES.includes(this.$route.name)) {
            let resendTitle = null
            switch (this.$route.name) {
              case 'Chat':
                resendTitle = `resend||users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.$route.params.response}/messages`
                // resendTitle = `resend-${this.$route.params.request}-${this.$route.params.response}`
                break
              case 'JobChat':
                resendTitle = `resend||users/${this.$store.state.user.uuid}/tasks/${this.$route.params.taskId}/messages`
                // resendTitle = `resend-${this.$route.params.taskId}-${this.$store.state.user.uuid}`
                break
            }
            if (resendTitle === a) continue // if failedMessage of this route then skip from here it will handle in route component
          }
          // alert('called')
          let b = a.split('||')
          let failedMessages = this.$q.localStorage.getItem(a)
          if (failedMessages.failedMessages.length) {
            console.log(b)
            this.$q.localStorage.set(a, {failedMessages: []})
            this.messageBox = failedMessages.failedMessages
            // this.resendTitle = b[2]
            this.pictureUploading = false
            await this.sendMessage(this.pictureUploading, 0, [], {apiLink: b[1]})
          }
        }
      }
    },
    shareBooking () {
      let requestRef = parseInt(this.responseInfo.requestInfo.id).toString(32).toUpperCase()
      let jobRef = parseInt(this.responseInfo.id).toString(32).toUpperCase()

      this.copiedSuccessText = this.$t('link.successfully.copied')
      this.onCopy(`${this.$t('link.href.petbacker')}/t/c${requestRef}.${jobRef}`)
    },
    onCreateListingDone () {
      history.pushState('ThankYou', 'ThankYou', this.$router.resolve({ name: 'ThankYou' }))
      this.$router.push({name: 'MobileDashboard'})
    },
    onPromptOk (type) {
      switch (type) {
        // logout
        case 1: this.$router.push('/logout'); break
        // mark all notifications as read
        case 2: this.onReadAllNotifications(); break
      }
    },
    onReadAllNotifications () {
      this.$q.loading.show({spinnerColor: 'primary', backgroundColor: 'white'})
      this.$axios.post(`users/${this.$store.getters['user/getUserUuidState']}/notifications/readall`, {}, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$store.commit('user/updateUserUnreadNotificationState', 0)
        this.$emit('refresh-view')
      }).catch((error) => {
        console.error(error)
      }).finally(_ => {
        this.$q.loading.hide()
      })
    },
    refreshAndNavigate (routeName) {
      this.$router.push({ name: routeName })
      this.$store.commit('user/updateUserCurrentMobileTab', 'mobile.navbar.requests')
    },
    triggerPromptDialog (status, message = null, okLabel = null, type = 0) {
      if (message) {
        this.promptMessage = message
      }

      if (okLabel) {
        this.promptOkLabel = okLabel
      }

      if (type === 1) {
        this.sendImpression('loggout intiated')
      }
      this.promptType = type
      this.promptModal = status
    },
    loadingStatus (status) {
      this.loader = status
    },
    onResumeListing () {
      this.onOkBtn(-4)
    },
    onCloseListing () {
      this.triggerServerError(true, this.$t('permanently.close.listing'), this.$t('close.listing.description'), this.$t('permanently.close.listing'), -3)
    },
    onHideListing () {
      this.triggerServerError(true, this.$t('hide.listing'), this.$t('hide.listing.description'), this.$t('hide.listing'), -2)
    },
    onPauseListing () {
      this.triggerServerError(true, this.$t('pause.listing'), this.$t('pause.listing.description'), this.$t('pause.listing'), -1)
    },
    onOkBtn (statusCode) {
      this.$q.loading.show({
        spinnerColor: 'primary',
        backgroundColor: 'white'
      })
      let serviceInfo = {}
      let promptMessage = this.$t('listing.paused')
      switch (statusCode) {
        case -1:
          // pause listing
          serviceInfo = {
            'serviceInfo': {
              'isPaused': 1
            }
          }
          promptMessage = this.$t('listing.paused')
          break
        case -2:
          // hide listing
          serviceInfo = {
            'serviceInfo': {
              'status': 0
            }
          }
          promptMessage = this.$t('listing.hide.successfully')
          break
        case -4:
          // resume listing
          serviceInfo = {
            'serviceInfo': {
              'status': 1,
              'isPaused': 0
            }
          }
          promptMessage = this.$t('listing.resume')
      }

      if (statusCode === -3) {
        // to archived a listing
        this.$axios.delete(`users/${this.$store.getters['user/getUserUuidState']}/services/${this.$route.params.listingId}`, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.$q.notify({
            message: this.$t('listing.permanently.closed'),
            position: 'top',
            type: 'negative',
            timeout: 2500
          })

          // this.$router.go(-1)
          this.$router.replace('/')
        }).catch((error) => {
          console.error(error)
          if (error.response.data && error.response.data.message) {
            this.$q.notify({
              message: error.response.data.message,
              position: 'top',
              type: 'negative',
              timeout: 2500
            })
          }
        }).finally(_ => {
          this.$q.loading.hide()
        })
      } else if (statusCode === -1 || statusCode === -2 || statusCode === -4) {
        // update listing status
        this.$axios.put(`users/${this.$store.getters['user/getUserUuidState']}/services/${this.$route.params.listingId}`, serviceInfo, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.$q.notify({
            message: promptMessage,
            position: 'top',
            type: 'positive',
            timeout: 1700
          })
          this.$emit('refresh-responseInfo', response.data.serviceInfo)
        }).catch((error) => {
          console.error(error)
          if (error.response.data && error.response.data.message) {
            this.$q.notify({
              message: error.response.data.message,
              position: 'top',
              type: 'negative',
              timeout: 2000
            })
          }
        }).finally(_ => {
          setTimeout(() => {
            this.$q.loading.hide()
          }, 100)
        })
      } else {
        this.$q.loading.hide()
      }
    },
    triggerServerError (status, label = null, message = null, title = null, errorCode = null) {
      if (label) {
        this.errorOkLabel = label
      }

      if (message) {
        this.errorMessage = message
      }

      if (title) {
        this.errorTitle = title
      }

      if (errorCode) {
        this.errorCode = errorCode
      }

      this.modalError = status
    },
    triggerBlockModal (status) {
      this.blockModal = status
    },
    onNewPost (postInfo) {
      this.$emit('refresh-view', postInfo)
    },
    onTriggerCancellationModal (status) {
      this.cancelBooking = status
    },
    navigateTo (routeName) {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        if (routeName === 'Messages') {
          this.triggerGuestModeModal(true, this.$t('guest.mode.messages.prompt'))
        } else if (routeName === 'Settings') {
          this.triggerGuestModeModal(true, this.$t('guest.mode.create.listing'))
        }
        return
      }

      this.$router.push({name: routeName})
    },
    triggerGuestModeModal (status, message = null) {
      if (message) {
        this.guestModeMessage = message
      }

      this.guestModeModal = status
    },
    async checkPermissions () {
      if (this.$q.cookies.get('hideLocationPrompt')) {
        return
      }
      if (this.$q.platform.is.cordova) {
        cordova.plugins.diagnostic.getLocationAuthorizationStatus((status) => {
          console.log('location service status: ' + status)
          console.log('check the status now', status)
          if (status === 'not_determined' || status === cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED) {
            this.promptOptions.text1 = this.$t('location.permission.prompt.text1')
            this.promptOptions.text2 = this.$t('location.permission.prompt.text2')
            this.promptOptions.image = 'statics/images/walk-map.jpg'
            this.promptOptions.tip_image = 'statics/images/gps-icon.png'
            this.promptOptions.ok_btn_text = this.$t('enable.location.services')
            this.promptOptions.type = 'location'
            this.promptPermission = true
          } else {
            this.notificationCardShow = true
          }
        }, (error) => {
          console.error(error)
          return true
        })
      }
    },
    async onDeviceReady () {
      console.log('device ready 123')
      await this.checkPermissions()
      // depending on how many things you are rendering on your webview, you might want to add an artificial wait
      setTimeout(() => {
        console.log('check if navigator splash to ide wkrking', navigator.splashscreen)
        navigator.splashscreen.hide()
      }, 350)

      // this.$store.dispatch('user/cacheGeoLocation')

      if (this.$q.platform.is.ios) {
        document.addEventListener('resign', this.onPause, false)
        document.addEventListener('active', this.onResume, false)
      } else {
        document.addEventListener('pause', this.onPause, false)
        document.addEventListener('resume', this.onResume, false)
      }
    },
    onPause () {
      if (this.readInterval) {
        clearInterval(this.readInterval)
      }

      this.onBackground = true
    },
    onResume () {
      if (!window.db) {
        this.$store.dispatch('user/init').then(() => {
          if (this.$q.cookies.get('hideLocationPrompt')) {
          } else {
            this.$store.dispatch('geolocation/cacheGeoLocation')
          }
        }).then(() => {
          if (this.$store.getters['user/getUserAccessState']) {
            this.getReadStatus()

            // Check if have new notifications every 30 sec
            this.getReadStatus = throttle(this.getReadStatus, 30000)
            this.readInterval = setInterval(this.getReadStatus, 30000)
          }
        }).catch((error) => {
          console.error(error)
        })
      } else {
        setTimeout(() => {
          if (this.$store.getters['user/getUserAccessState']) {
            this.getReadStatus()

            // Check if have new notifications every 30 sec
            this.getReadStatus = throttle(this.getReadStatus, 30000)
            this.readInterval = setInterval(this.getReadStatus, 30000)
          }
        })
      }

      this.onBackground = false
    },
    onCloseFutureUpdateModal (status) {
      this.futureUpdateModal = status
    },
    openBackerListing () {
      switch (this.$route.name) {
        case 'JobChat':
          this.$router.push({name: 'PublicProfile', params: {userId: this.responseInfo.requestInfo.requestorInfo.id}})
          break
        case 'Chat':
          if (this.responseInfo && this.responseInfo.serviceInfo.id) {
            this.$router.push({name: 'Listing', params: {listingId: parseInt(this.responseInfo.serviceInfo.id)}, query: {id: this.responseInfo.serviceInfo.userInfo.id, url: this.responseInfo.serviceInfo.listingUrl, status: this.responseInfo.acceptanceStatus}})
          }
          break
      }
    },
    openProfile () {
      switch (this.$route.name) {
        case 'JobSummary':
        case 'JobChat':
          this.$router.push({name: 'PublicProfile', params: {userId: this.responseInfo.requestInfo.requestorInfo.id}})
          break
        case 'Chat':
          this.$router.push({name: 'PublicProfile', params: {userId: this.responseInfo.serviceInfo.userInfo.id}})
          break
      }
    },
    closeDeclineModal (status) {
      this.declineModal = status
    },
    onDecline () {
      this.$emit('refresh-view')
    },
    updateEditButton (value) {
      this.onEdit = value
    },
    showEditRateButton (status) {
      this.showEditButton = status
    },
    onEditRates () {
      if (this.onEdit) {
        this.onEdit = false
      } else {
        this.onEdit = true
      }

      this.$emit('on-edit-service-rate', this.onEdit)
    },
    onAddServiceRate () {
      this.$emit('trigger-add-service-rate')
    },
    onBlock () {
      this.triggerBlockModal(true)
    },
    onReport (userId) {
      this.$q.dialog({
        title: this.$t('report'),
        message: this.$t('why.are.you.reporting.this.post'),
        prompt: {
          model: this.reportedReasons,
          isValid: val => val.length > 2, // << here is the magic
          type: 'text'
        },
        cancel: true
      }).onOk(data => {
        this.reportSubmit(data, userId)
        this.reportedReasons = ''
      }).onCancel(() => {
      })
    },
    reportSubmit (reportReason, userId) {
      let info = {
        'reportInfo': {
          'comment': reportReason
        }
      }

      this.$axios.post(`users/${this.$store.getters['user/getUserUuidState']}/report/${userId}`, info, {
        headers: {
          Authorization: this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.$q.notify({
          message: this.$t('report.submitted.successful'),
          position: 'top',
          timeout: 1700
        })
      }).catch((error) => {
        console.error(error)
        if (error.response.data.message) {
          this.$q.notify({
            message: error.response.data.message,
            position: 'top',
            timeout: 2000
          })
        }
      })
    },
    onFavorite () {
      this.$emit('on-favorite')
    },
    headerBreadcrumbs (searchInfo) {
      this.searchInfo = searchInfo
    },
    openShareDialog (shareText, shareLink) {
      this.shareText = shareText
      this.shareLink = shareLink
      this.sharingDialog = true
    },
    insertListingUrl (url) {
      this.listingShareUrl = url
    },
    showListingIsFavorite (status) {
      this.favoriteStatus = status
    },
    updateListingName (name) {
      this.listingName = name
    },
    triggerSearchDialog () {
      if (this.$refs['searchInput']) {
        this.$refs['searchInput'].blur()
      }
      this.$emit('on-search-dialog', true)
    },
    onDeletePet () {
      this.$emit('on-delete-personalItems', this.$route.params.petId)
      this.modalMoreOptions = false
    },
    openDiscountDialog () {
      this.discountDetailModal = true
    },
    openQuoteDetail () {
      console.log('trigger navbar quote detail')
      this.quoteDetailModal = true
    },
    closeDiscountDetail (value) {
      this.discountDetailModal = value
    },
    onRefreshQuoteDetail () {
      this.$emit('refresh-quotedetails')
    },
    closeQuoteDetail (value) {
      this.quoteDetailModal = value
    },
    onAddQuoteItem () {
      this.modalMoreOptions = true
    },
    updateForYourProtectionState () {
      this.forYourProtection = false
    },
    closeRequest () {
      this.$emit('cancel-request')
    },
    openDownloadModal () {
      this.sendImpression('Button Click', 'Request Summary', 'Download App')
      this.downloadModal = true
    },
    checkLocation () {
      if (typeof (this.$store.state.geolocation.data) === 'undefined' || this.$store.state.geolocation.data === null) {
        let data = {
          geoplugin_countryCode: 'MY'
        }
        this.$store.commit('geolocation/updateDataState', data)
      }

      if (this.$q.platform.is.desktop) {
        if (this.countries.indexOf(this.$store.state.geolocation.data.geoplugin_countryCode) > -1) {
          this.navbarServices = servicesTwo
          let exploreService = {
            id: 0,
            name: 'services.explore',
            header: 'statics/images/servicecovers/dog-boarding.jpg',
            link: '/s'
          }
          this.navbarServices.splice(2, 0, exploreService)
        } else {
          this.navbarServices = services
        }
      }
    },
    toRequestSummary () {
      console.log('this fucntion for back 2')
      this.cancelPage = 0
      this.$router.push({ name: 'RequestSummary', params: {requestId: this.$route.params.request} })
      setTimeout(() => {
        this.cancelPage = 0
      }, 500)
    },
    incrementCancelPage () {
      this.cancelPage = this.cancelPage + 2
    },
    toRequestMessages () {
      this.$store.commit('user/updateMessageTabIndexState', 'tab-requests')
      this.$router.push({name: 'Messages'})
    },
    toRequestNotifications () {
      this.$store.commit('user/updateMessageTabIndexState', 'tab-notifications')
      this.$router.push({name: 'Messages'})
    },
    toViewScreen () {
      console.log('this fucntion for back')
      if (this.responseInfo !== -1) {
        if (this.$route.name === 'Chat') {
          this.$router.push({ name: 'RequestSummary', params: {requestId: this.$route.params.request} })
        } else if (this.$route.name === 'JobChat') {
          this.$router.push({name: 'JobSummary', params: {taskId: this.$route.params.taskId}, query: {hide: 1}})
        }
      } else {
        console.error('[Request.vue] Current request is empty')
      }
    },
    toEditScreen () {
      if (this.responseInfo !== -1) {
        this.$router.push({ name: 'EditRequest', params: {requestId: this.$route.params.request} })
      } else {
        console.error('[Request.vue] Current request is empty')
      }
    },
    cancelHiredRequest () {
      this.messageBox = 'Hi! I need help on cancelling booking reference no: ' + this.responseInfo.jobReference
      this.sendSupportMessage()
      setTimeout(() => {
        this.$router.push({name: 'ChatSupport'})
      }, 550)
    },
    toCancel () {
      if (this.responseInfo !== -1) {
        if (this.responseInfo.acceptanceStatus === this.STATUS.ACCEPTANCE_PARENT_ACCEPT) {
          if (this.$route.params.request) {
            this.cancelBooking = true
          } else if (this.$route.params.taskId) {
            this.declineModal = true
          }
        } else {
          if (this.$route.params.request) {
            //  this.onCancelRequest(this.$route.params.request, this.responseInfo.serviceInfo.services.serviceName)
            this.cancelBooking = true
          } else if (this.$route.params.taskId) {
            //  this.onCancelJob()
            this.declineModal = true
          }
        }
      } else {
        console.error('[Request.vue] Current request is empty')
      }
    },
    onCancelJob () {
      let confirmation = this.$t('confirmation')
      let message = this.$t('confirmation.job.cancelled', {requestorName: this.responseInfo.requestInfo.requestorInfo.username})
      let yes = this.$t('yes')
      let no = this.$t('no')
      this.$q.dialog({
        title: confirmation,
        message: message,
        ok: yes,
        cancel: no
      }).onOk(() => {
        this.$axios.delete(`users/${this.$store.state.user.uuid}/tasks/${this.$route.params.taskId}`, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          this.$emit('refresh-view')
          this.messageBox = null
          let vm = this
          this.$q.notify({
            message: this.$t('job.cancelled', {requestInfo: vm.responseInfo.requestInfo.requestorInfo.username}),
            type: 'positive'
          })
        }).catch(e => {
          console.log(e)
          this.$q.notify({
            message: this.$t('request.fail.cancelled', {requestServiceName: `${this.responseInfo.requestInfo.requestorInfo.username}'s`}),
            type: 'negative'
          })
        })
      }).onCancel(() => {})
    },
    onCancelSitter () {
      let cancelInfo = {
        'responseInfo': {
          'acceptanceStatus': 4,
          'completionStatus': 0
        }
      }
      let confirmation = this.$t('confirmation')
      let message = this.$t('confirmation.sitter.cancelled', {sitterName: this.responseInfo.serviceInfo.userServiceName})
      let yes = this.$t('yes')
      let no = this.$t('no')
      this.$q.dialog({
        title: confirmation,
        message: message,
        ok: yes,
        cancel: no
      }).onOk(() => {
        this.$axios.put(`users/${this.$store.state.user.uuid}/requests/${this.$route.params.request}/responses/${this.responseInfo.id}`, cancelInfo, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then((response) => {
          //  this.incrementCancelPage()
          if (this.cancelMessage !== null) {
            this.messageBox = this.cancelMessage
            this.sendSupportMessage()
          }
          this.$emit('refresh-view')
          this.messageBox = null
          let vm = this
          this.$q.notify({
            message: this.$t('sitter.cancelled', {sitterName: vm.responseInfo.serviceInfo.userServiceName}),
            type: 'positive'
          })
        }).catch(e => {
          console.log(e)
          this.$q.notify({
            message: this.$t('request.fail.cancelled', {requestServiceName: this.responseInfo.serviceInfo.userServiceName}),
            type: 'negative'
          })
        })
      }).onCancel(() => {})
    },
    onCancelRequest (requestId, requestServiceName) {
      let title = this.$t('confirmation')
      let message = this.$t('confirmation.cancel.request', {requestServiceName: requestServiceName})
      let yes = this.$t('yes')
      let no = this.$t('no')
      this.$q.dialog({
        title: title,
        message: message,
        ok: yes,
        cancel: no
      }).onOk(() => {
        this.$axios.delete(`users/${this.$store.state.user.uuid}/requests/${requestId}`, {
          headers: {
            Authorization: this.$store.getters['user/authorizationHeader']
          }
        }).then(response => {
          //  this.incrementCancelPage()

          if (this.cancelMessage !== null) {
            this.messageBox = this.cancelMessage
            this.sendSupportMessage()
          }
          this.messageBox = null
          this.modalMoreOptions = false
          this.$emit('refresh-view')
          this.$q.notify({
            message: this.$t('request.succesfully.cancelled', {requestServiceName: requestServiceName}),
            type: 'positive'
          })
        }).catch(error => {
          console.log(error)
          this.$q.notify({
            message: this.$t('request.fail.cancelled', {requestServiceName: requestServiceName}),
            type: 'negative'
          })
        })
      }).onCancel(() => {})
    },
    getMobileCode () {
      let countryInfo = this.$_.findWhere(countries, {'id': this.responseInfo.serviceInfo.userInfo ? `${this.responseInfo.serviceInfo.userInfo.mobileCountryId}` : `${this.responseInfo.requestInfo.requestorInfo.mobileCountryId}`})
      if (countryInfo) {
        return countryInfo.mobileCode
      }

      // If cannot find any country
      return 1
    },
    pressBackButton () {
      // console.log(document.referrer)
      // console.log(location.href)
      if (document.referrer.includes('[object%20Object]')) {
        this.$router.replace('/')
      } else if (this.count === 0 && this.$route.name === 'CreateRequest') {
        this.$emit('back-clicked', 8) //  to get back to pet selection screen
        this.sendImpression('Exited Listing', 'Create Listing track')
      } else if (this.$route.name === 'Listing' && location.href.includes('explore/backers-nearby')) {
        this.$router.go(-1)
      } else if (this.count === null && this.$route.name === 'EditListing') {
        if (this.$router.history.length > 1) {
          this.$router.go(-1) // go back to previous route
        } else {
          this.$router.replace('/') // replace current route with home page
        }
      } else if (this.count === 6 && this.$route.name === 'CreateRequest') {
        this.$router.go(-1)
      } else if (this.count > 1 && this.$route.name === 'CreateRequest') {
        this.$emit('back-clicked', this.count)
      } else if (!this.$store.getters['user/getUserAccessState'] && this.$store.getters['user/getUserCurrentPage'] === 'Services') {
        this.$router.replace('/')
      } else if (this.$route.name === 'PromptPhone') {
        console.log('page')
        console.log('check request info', this.$q.localStorage.getItem('localStorageRequestInfo'))
        console.log('check prop value', this.$route.params.settings)
        if (this.$route.params.settings === 'yes') {
  this.$router.go(-1)
  return
}
        console.log(this.$route.fullPath)
        if (this.$q.localStorage.getItem('localStorageRequestInfo')) {
        this.submitRequestForm(this.$q.localStorage.getItem('localStorageRequestInfo'))
      } else {
        if (this.$route.query.redirect) {
          // If user still hasn't filled up about me
          if (!this.$store.getters['user/getAboutMe'] && this.$route.query.redirect === 'CreateListing') {
            this.$router.replace({ name: 'AboutMe', query: { redirect: 'CreateListing', serviceId: this.$route.query.serviceId } })
            return
          }
          this.$router.replace({ name: this.$route.query.redirect, params: { serviceId: this.$route.query.serviceId } })
        } else {
          this.$router.replace({ name: 'ThankYou' })
        }
      }
      } else {
        this.$router.go(-1)
        console.log(this.$route.path)
        this.sendImpression(`back button Pressed at (${this.$route.name})`, 'Create Listing track')
      }
    },
    updateRequestStates () {
      if (typeof this.$route.query !== 'undefined' && !this.$q.platform.is.cordova) {
        Object.keys(this.$route.query).forEach(key => {
          if (this.requestParams.includes(key)) {
            this.$store.commit('request/updateRequest' + this.cleanCamel(key) + 'State', this.$route.query[key])
          }
        })
      }
    },
    updateLanguage (languageValue) {
      this.$emit('toggleLanguageChange')
      this.$store.commit('user/updateUserLanguageState', languageValue)
      this.$route.query.lang = languageValue
      this.updateLanguageIcon()
    },
    updateLanguageIcon () {
      //  check language change from url
      if (typeof (this.$route.query.lang) !== 'undefined') {
        this.$store.state.user.language = this.$route.query.lang
      }

      switch (this.$store.getters['user/getCurrentLanguage']) {
        case 'zhcn': this.$store.state.user.language = 'zh_cn'; break
        case 'zh_cn': break
        case 'zhtw': this.$store.state.user.language = 'zh_tw'; break
        case 'zh_tw': break
        case 'zhhk': this.$store.state.user.language = 'zh_hk'; break
        case 'zh_hk': break
        case 'de': this.$store.state.user.language = 'dede'; break
        case 'dede': break
        case 'th': this.$store.state.user.language = 'thth'; break
        case 'thth': break
        case 'fr': this.$store.state.user.language = 'frfr'; break
        case 'frfr': break
        case 'es': this.$store.state.user.language = 'eses'; break
        case 'eses': break
        case 'it': this.$store.state.user.language = 'itit'; break
        case 'itit': break
        case 'sk': this.$store.state.user.language = 'sksk'; break
        case 'sksk': break
        case 'ja': this.$store.state.user.language = 'jajp'; break
        case 'jajp': break
        case 'cs': this.$store.state.user.language = 'cscz'; break
        case 'cscz': break
        case 'id': this.$store.state.user.language = 'idid'; break
        case 'idid': break
        case 'ms': this.$store.state.user.language = 'msmy'; break
        case 'msmy': break
        case 'el': this.$store.state.user.language = 'elel'; break
        case 'elel': break
        case 'pt': this.$store.state.user.language = 'ptpt'; break
        case 'ptpt': break
        default: this.$store.state.user.language = 'en'
      }

      //  update language ICON
      this.languageIcon = this.$_.findWhere(this.languageOptions, {'value': this.$store.state.user.language}).icon

      //  update database
      this.switchLocale(this.$store.state.user.language, true)
    },
    cleanCamel (str) {
      let string = str.replace(/^([A-Z])|[\s-_]+(\w)/g, function (match, p1, p2, offset) {
        if (p2) return p2.toUpperCase()
        return p1.toLowerCase()
      })
      return string.charAt(0).toUpperCase() + string.substring(1)
    },
    openNewTab (link) {
      this.openUrl(link)
    },
    activeTab (currentRoute) {
      if (this.$route.fullPath === '/' && currentRoute === '/') {
        return 'selected'
      }

      if (this.$route.fullPath === `/${currentRoute}`) {
        return 'selected'
      }
      return ''
    },
    registerpush () {
      let accountInfo = {
        'accountInfo': {
          'pushId': this.$store.state.user.pushid,
          'vendor': this.$q.platform.is.cordova ? (this.$q.platform.is.ios ? 7 : 6) : 5,
          'osVersion': this.$q.platform.is.cordova ? window.device.version : this.$q.platform.is.versionNumber,
          'platform': this.$q.platform.is.cordova ? window.device.platform : 'WEB',
          'model': this.$q.platform.is.cordova ? window.device.model : this.$q.platform.is.name,
          'screenWidth': screen.width,
          'screenHeight': screen.height,
          'appVersion': process.env.APP_VERSION,
          'deviceId': this.$q.platform.is.cordova ? window.device.uuid : this.$q.cookies.get('device-uuid')
        }
      }
      this.$axios.post(`account/enablepush`, accountInfo, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        if (response.status === 200) {
          console.log(response)
          console.log('Push is enabled')
        } else {
          throw new Error('Unexpected status code: ' + response.status)
        }
      }).catch((error) => {
        console.error(error)
      })
    },
    getReadStatus () {
      if (this.$store.state.user.access && !this.$store.getters['user/getUserAdminState'] && this.$store.getters['user/getUserTokenState']) {
        this.$axios.get(`users/${this.$store.state.user.uuid}/onresume`, {
          headers: {
            'Authorization': this.$store.getters['user/authorizationHeader']
          }
        }).then(response => {
          console.log('check pushapi', response.data.resumeInfo)
          console.log('check pushapi in mobile', this.$store.state.user.pushid)
          if (response.data.resumeInfo.pushId !== this.$store.state.user.pushid) {
            console.log('push registeration APi initaited', this.$store.state.user.pushid)
            this.registerpush()
          }
          this.$store.dispatch('user/onResume', response.data.resumeInfo)
        }).catch(error => {
          if (error.message === 'Network Error' && (this.onBackground === false)) {
            // no need this popup anymore
            // if (this.$route.name !== 'JobChat' && this.$route.name !== 'Chat') {
            //   this.triggerServerError(true, 'Check Back Later', error.message)
            // }
          }
          clearInterval(this.readInterval)
          this.forceLogout(error)
          console.error(error)
        })
      }
    },
    onBlockUser () {
      this.$router.push({name: 'MobileDashboard'})
    },
    closePrompt (status) {
      this.promptPermission = false
      this.promptOptions = {}
      this.$q.cookies.set('hideLocationPrompt', true, {'expires': 7})
      this.notificationCardShow = true
    },
    async onPermissionPromptOK (type) {
      this.promptPermission = false
      this.promptOptions = {}
      if (type === 'location') {
        if (this.$q.cookies.get('hideLocationPrompt')) {
          return
        }
        await this.$store.dispatch('user/cacheGeoLocation')
        setTimeout(() => {
          this.notificationCardShow = true
          this.$q.cookies.set('hideLocationPrompt', true, {'expires': 7})
        }, 500)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.createRequest
  margin-left: auto
  margin-top: 6px
  margin-right: 10px
  height: 25px
  width: 25px

.addQuote
  margin-left: auto
  margin-top: 10px
  margin-right: 16px
  height: 25px
  width: 25px

.stopRequest
  margin-left: auto
  margin-top: 2px
  margin-right: 10px
  height: 25px
  width: 25px

.topMessage
  margin-left: auto
  margin-top: 6px
  margin-right: 8px
  height: 25px
  width: 40px

#cross
  margin-left: auto
  margin-right: auto
  font-size: 25px

.back-arrow
  height: 30px
  width: 40px

.phone
  position: absolute
  right: 35px
  bottom: 15px

.moreOptions
  position: absolute
  right: 12px
  bottom: 15px

@media screen and (min-width: 370px)
  .phone
    position: absolute
    right: 50px
  .moreOptions
    position: absolute
    right: 15px
  .frfr .moreOptions.modifier
    right: 32px

@media screen and (min-width: 400px)
  .phone
    position: absolute
    right: 60px
  .moreOptions
    right: 20px
</style>
