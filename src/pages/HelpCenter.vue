<template>
    <q-page class="bg-grey-1" style="min-height: 100%;">
        <latest-ticket></latest-ticket>

        <!-- FAQs -->
        <q-item-label class="q-px-md q-pt-lg q-mb-sm text-uppercase text-grey">{{$t('help.centers.faq')}}</q-item-label>
        <q-list separator style="border: 1px solid lightgrey;" class="full-width q-pl-md bg-white">
            <!-- Pet Owner FAQ -->
            <q-item clickable class="q-pl-none" @click.native="openUrl($t('help.center.pet.owner.href'), false, 'Help Center', 'Pet Owners')">
                <q-item-section>
                    <q-item-label class="font-normal">{{$t('pet.owners')}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chevron_right"></q-icon>
                </q-item-section>
            </q-item>

            <!-- Pet Sitters FAQ -->
            <q-item clickable class="q-pl-none" @click.native="openUrl($t('help.center.pet.sitter.href'), false, 'Help Center', 'Pet Sitters')">
                <q-item-section>
                    <q-item-label class="font-normal">{{$t('pet.sitters')}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chevron_right"></q-icon>
                </q-item-section>
            </q-item>

            <!-- Payment FAQ -->
            <q-item clickable class="q-pl-none" @click.native="openUrl($t('help.center.payments.href'), false, 'Help Center', 'Payments')">
                <q-item-section>
                    <q-item-label class="font-normal">{{$t('payments')}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chevron_right"></q-icon>
                </q-item-section>
            </q-item>

            <!-- Booking FAQ-->
            <q-item clickable class="q-pl-none" @click.native="openUrl($t('help.center.bookings.href'), false, 'Help Center', 'Bookings')">
                <q-item-section>
                    <q-item-label class="font-normal">{{$t('notifications.bookings')}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chevron_right"></q-icon>
                </q-item-section>
            </q-item>

            <!-- Listings FAQ -->
            <q-item clickable class="q-pl-none" @click.native="$router.push({name: 'ListingsFaq'}, false, 'Help Center', 'Listings')">
                <q-item-section>
                    <q-item-label class="font-normal">{{$t('listings')}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chevron_right"></q-icon>
                </q-item-section>
            </q-item>

            <!-- Service User Rules -->
            <q-item clickable class="q-pl-none" @click.native="$router.push({name: 'ServiceUserRules'}, false, 'Help Center', 'Service User Rules')">
                <q-item-section>
                    <q-item-label class="font-normal">{{$t('service.user.rules.title')}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chevron_right"></q-icon>
                </q-item-section>
            </q-item>

            <!-- Premium Protection Coverage -->
            <q-item clickable class="q-pl-none" @click.native="openUrl($t('help.center.premium.coverage.href'), false, 'Help Center', 'Premium Protection Coverage')">
                <q-item-section>
                    <q-item-label class="font-normal">{{$t('premium.protection.coverage')}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chevron_right"></q-icon>
                </q-item-section>
            </q-item>

            <!-- PetBacker Sponsors -->
            <q-item clickable class="q-pl-none" @click.native="openUrl($t('help.center.sponsor.href'), false, 'Help Center', 'Sponsor Program')">
                <q-item-section>
                    <q-item-label class="font-normal">{{$t('help.center.sponsor.program')}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chevron_right"></q-icon>
                </q-item-section>
            </q-item>

            <!-- Cancellation -->
            <q-item clickable class="q-pl-none" @click.native="openUrl($t('help.center.cancellations.href'), false, 'Help Center', 'Cancellation')">
                <q-item-section>
                    <q-item-label class="font-normal">{{$t('cancellation')}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chevron_right"></q-icon>
                </q-item-section>
            </q-item>

            <!-- Unfortunate Events -->
            <q-item clickable class="q-pl-none" @click.native="openUrl($t('help.center.unfortunate.events.href'), false, 'Help Center', 'Unfortunate Events')">
                <q-item-section>
                    <q-item-label class="font-normal">{{$t('unfortunate.events')}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chevron_right"></q-icon>
                </q-item-section>
            </q-item>

        </q-list>

        <!-- Contact Us -->
        <q-item-label class="q-px-md q-pt-lg q-mb-sm text-uppercase text-grey">{{$t('app.footer.contactus')}}</q-item-label>
        <q-list separator style="border: 1px solid lightgrey;" class="full-width q-pl-md bg-white q-mb-xl">
            <!-- Email Support -->
            <q-item clickable class="q-pl-none" @click="emailSupport">
                <q-item-section>
                    <q-item-label class="font-normal">
                        {{$t('email.support')}}
                        <q-badge floating color="red" rounded class="q-mr-sm q-mt-xs" v-if="$store.getters['user/getUnreadSupportMessage'] > 0">{{$store.getters['user/getUnreadSupportMessage']}}</q-badge>
                        <!-- <span style="height: 10px;width: 10px;top: 10px;right: 10px;background: red;border-radius: 100px;position: absolute;" v-if="$store.getters['user/getUnreadSupportMessage'] > 0"></span> -->
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chevron_right"></q-icon>
                </q-item-section>
            </q-item>

            <!-- Call Support -->
            <q-item clickable class="q-pl-none" @click="callSupport" v-if="$store.getters['user/getCurrentLanguage'] === 'elel'">
                <q-item-section>
                    <q-item-label class="font-normal">
                        {{$t('call.support')}}
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-icon name="chevron_right"></q-icon>
                </q-item-section>
            </q-item>
        </q-list>

        <p class="q-py-md"></p>

        <!-- Dialog Login/Sign Up Now -->
        <dialog-guestmode :trigger="guestModeModal" :message="$t('guest.mode.create.listing')" @on-close="triggerGuestModeModal"></dialog-guestmode>
    </q-page>
</template>
<script>
export default {
  components: {
    'latest-ticket': () => import('components/HelpCenter/HeaderTicket.vue'),
    'dialog-guestmode': () => import('components/DialogLoginSignUpNow.vue')
  },
  data () {
    return {
      guestModeModal: false
    }
  },
  methods: {
    emailSupport () {
      if (this.$store.getters['user/getUserUuidState'] === null) {
        this.triggerGuestModeModal(true)
        return
      }

      this.$router.push({name: 'ChatSupportHelp'})
    },
    callSupport () {
      window.open('tel:306938645981', '_system')
    },
    triggerGuestModeModal (status) {
      this.guestModeModal = status
    }
  }
}
</script>
