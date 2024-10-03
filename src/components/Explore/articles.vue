<template>
    <div class="row no-wrap q-px-md justify-left hide-scrollbar" style="overflow: auto;">
        <!-- Pet Owners -->
        <div style="width: 200px;" class="col-12 q-mr-md">
            <h6 class="q-my-none text-weight-light">{{$t('for.pet.owners')}}</h6>
            <q-separator class="q-my-sm"></q-separator>

            <h6 class="q-my-none font-normal" @click="openUrl(`${$t('link.href.help')}/pet-parents/why-pay-through-petbacker`, false, 'Explore Footer', 'Stay Safe with PetBacker')">Stay Safe with PetBacker</h6>
            <p class="text-grey-7" @click="openUrl(`${$t('link.href.help')}/pet-parents/why-pay-through-petbacker`, false, 'Explore Footer', 'Stay Safe with PetBacker')">Keeping you and your pets safe</p>
            <q-separator class="q-my-sm"></q-separator>

            <h6 class="q-my-none font-normal" @click="openUrl(`${$t('link.href.help')}/cancellation/reservation-guarantee`, false, 'Explore Footer', 'Cancellation Options')">Cancellation Options</h6>
            <p class="text-grey-7" @click="openUrl(`${$t('link.href.help')}/cancellation/reservation-guarantee`, false, 'Explore Footer', 'Cancellation Options')">Learn what's covered</p>
            <q-separator class="q-my-sm"></q-separator>

            <h6 class="q-my-none font-normal" @click="openUrl($t('link.href.help'), false, 'Explore Footer', 'Help Center')">{{$t('app.footer.helpcenter')}}</h6>
            <p class="text-grey-7" @click="openUrl($t('link.href.help'), false, 'Explore Footer', 'Help Center')">Get Support</p>
        </div>

        <!-- Pet Sitters -->
        <div style="width: 230px;" class="col-12 q-mx-md">
            <h6 class="q-my-none text-weight-light">{{$t('for.backers')}}</h6>
            <q-separator class="q-my-sm"></q-separator>

            <h6 class="q-my-none font-normal" @click="openUrl(`${$t('link.href.help')}/pet-service-providers/how-to-be-a-pet-sitter-or-walker`, false, 'Explore Footer', 'How to list services')">How to list services</h6>
            <p class="text-grey-7" @click="openUrl(`${$t('link.href.help')}/pet-service-providers/how-to-be-a-pet-sitter-or-walker`, false, 'Explore Footer', 'How to list services')">Offering pet services</p>
            <q-separator class="q-my-sm"></q-separator>

            <h6 class="q-my-none font-normal" @click="openUrl(`${$t('link.href.help')}/pet-service-providers/how-do-i-get-hired`, false, 'Explore Footer', 'How to accept jobs')">How to accept jobs</h6>
            <p class="text-grey-7" @click="openUrl(`${$t('link.href.help')}/pet-service-providers/how-do-i-get-hired`, false, 'Explore Footer', 'How to accept jobs')">Getting approved and accepting jobs</p>
            <q-separator class="q-my-sm"></q-separator>

            <h6 class="q-my-none font-normal" @click="openUrl(`${$t('link.href.help')}/pet-service-providers/how-do-i-get-paid`, false, 'Explore Footer', 'How to get paid')">How to get paid</h6>
            <p class="text-grey-7" @click="openUrl(`${$t('link.href.help')}/pet-service-providers/how-do-i-get-paid`, false, 'Explore Footer', 'How to get paid')">Set up payout accounts</p>
        </div>

        <!-- Pet Sitters -->
        <div style="width: 200px;" class="col-12 q-mx-md">
            <h6 class="q-my-none text-weight-light">{{$t('more')}}</h6>
            <q-separator class="q-my-sm"></q-separator>

            <!-- <h6 class="q-my-none font-normal">How to list services</h6>
            <p class="text-grey-7">Offering pet services</p>
            <q-separator class="q-my-sm"></q-separator> -->

            <h6 class="q-my-none font-normal" @click="openUrl(`${$t('link.href.petbacker')}/pet-shelter-pet-adoption-and-pet-rescue-programme`, false, 'Explore Footer', 'Make a Donation')">Make a Donation</h6>
            <p class="text-grey-7" @click="openUrl(`${$t('link.href.petbacker')}/pet-shelter-pet-adoption-and-pet-rescue-programme`, false, 'Explore Footer', 'Make a Donation')">Support nonprofit organizations</p>

        </div>
    </div>
</template>
