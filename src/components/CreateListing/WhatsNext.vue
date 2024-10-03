<template>
    <div>
        <div>
            <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/app-process-header.png" class="image-upload"></q-img>
        </div>
        <div class="bg-amber q-pa-md">
            <p class="q-my-none" v-html="$t('application.through.strict.approval.process')"></p>
        </div>
        <q-separator class="q-my-sm"></q-separator>
        <!-- ID verification -->
        <div>
            <table id="one" style="font-family:Arial, Helvetica, sans-serif; width:100%; background-color:white;">
                <tr>
                    <td style="width:10%; text-align:center;">
                        <strong style="font-size:40px">1</strong>
                    </td>
                    <td style="width:60%;" class="q-pl-md">
                        <p style="margin-top:10px; margin-bottom:0px;">
                        <strong style="font-size:20px">{{$t('id.verification')}}</strong>
                        <br/><br/>
                        <span v-html="$t('send.photocopy.government.id')"></span>
                        <br/><br/>
                        <span class="anchor-link font-normal" @click="openUrl(`${$t('link.href.help')}/pet-service-providers/how-do-i-submit-my-identification-and-documents-as-trust-points-for-verification`)">{{$t('find.out.more')}}</span>
                        </p>
                    </td>
                    <td style="width:30%; text-align:center;">
                        <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/app-process2.png"></q-img>
                    </td>
                </tr>
            </table>
        </div>
        <q-separator class="q-my-sm"></q-separator>
        <!-- Testimonial -->
        <div>
            <table id="two" style="font-family:Arial, Helvetica, sans-serif; width:100%; background-color:white;">
                <tr>
                    <td style="width:10%; text-align:center;">
                        <strong style="font-size:40px">2</strong>
                    </td>
                    <td style="width:60%;" class="q-pl-md">
                        <p style="margin-top:10px; margin-bottom:0px;"><strong style="font-size:20px">{{$t('testimonials')}}</strong>
                        <br/><br/>
                        {{$t('testimonials.description')}}
                        <br/><br/>
                        <span class="anchor-link font-normal" @click="openUrl(`${$t('link.href.help')}/pet-service-providers/how-do-i-get-reviews`)">{{$t('find.out.more')}}</span>
                        </p>
                    </td>
                    <td style="width:30%; text-align:center;">
                        <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/app-process1.png"></q-img>
                    </td>
                </tr>
            </table>
        </div>
        <q-separator class="q-my-sm"></q-separator>
        <!-- PetBacker Intro Test -->
        <div>
            <table id="three" style="font-family:Arial, Helvetica, sans-serif; width:100%; background-color:white;">
                <tr>
                    <td style="width:10%; text-align:center;">
                        <strong style="font-size:40px">3</strong>
                    </td>
                    <td style="width:60%;" class="q-pl-md">
                        <p style="margin-top:10px; margin-bottom:0px;" ><strong style="font-size:20px">{{$t('pet.sitter.intro.test')}}</strong>
                        <br/><br/>
                        {{$t('pet.sitter.intro.test.description')}}
                        <br/><br/>
                        <span class="anchor-link font-normal" @click="openUrl(`${$t('link.href.petbacker')}/pet-sitter-intro?uuid=${$store.getters['user/getUserUuidState']}`)">{{$t('find.out.more')}}</span>
                        </p>
                    </td>
                    <td style="width:30%; text-align:center;">
                        <q-img src="https://storage.googleapis.com/petbacker/images/cms/icons/petbacker-intro-test.png"></q-img>
                    </td>
                </tr>
            </table>
        </div>
        <div class="q-pa-sm q-mt-lg q-px-md bg-amber">
            <p class="q-my-none" v-html="$t('first.time.read.this.footer', {link: `${$t('link.href.blog')}/how-to/the-essential-guide-for-the-first-time-pet-sitter`})"></p>
        </div>
        <p class="q-my-xl"></p>
    </div>
</template>
