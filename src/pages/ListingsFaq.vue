<template >
    <div style="background-color:#f5f5f5;min-height: 100%;" class="q-py-xl">
        <q-card class="q-mx-md" flat style="overflow: visible; border-radius: 20px;background-color:#ffffff; border:1px solid #ffffff; padding: 20px 15px 0px 15px; border-radius:5px;">
            <q-card-section class="q-px-none q-py-sm">
                <div class="tip-bulb">
                    <img src="https://storage.googleapis.com/petbacker/images/cms/paw-white-border.png" style="width:60px; margin-top: -30px;" class="tip-bulb-image">
                </div>
                <div class="bg-white q-mt-sm" v-html="$t('faq.listings')"></div>
            </q-card-section>
        </q-card>
    </div>
</template>
