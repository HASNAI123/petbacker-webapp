<template>
    <q-dialog v-model="trigger" persistent>
      <q-card style="width: 330px; height: fit-content">
        <q-card-section>
          <div class="text-h6" style="text-align: center">{{$t('download.now')}}!</div>
          <p style="text-align: center">{{message}}</p>
        </q-card-section >
        <q-card-section class="row justify-center">
          <div class="col-12 text-center" @click="openUrl($t('petbacker.app.link'))">
            <img id="yBtn" style="height: 350px" src="https://storage.googleapis.com/petbacker/images/cms/articles/pet-sitter-dog-walker-app.png" alt="Pet Sitting and Dog Walking app on phone">
          </div>
          <a href="https://play.google.com/store/apps/details?id=com.petbacker.android" target="blank" class="q-mr-md" rel="noreferrer noopener">
            <img src="https://storage.googleapis.com/petbacker/images/cms/icons/playstore-badge.png" alt="appstore" >
          </a>
          <a href="https://itunes.apple.com/us/app/petbacker-book-pet-boarding/id1168037472?mt=8" target="blank" rel="noreferrer noopener">
            <img src="https://storage.googleapis.com/petbacker/images/cms/icons/appstore-badge.png" alt="playstore" >
          </a>
        </q-card-section>
        <q-card-section class="row justify-center q-py-lg q-mx-auto">
          <q-btn color="primary" :label="'CLOSE'" v-close-popup @click="$emit('close')"/>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      default: false,
      required: true
    },
    message: {
      type: String,
      default: 'Download Our App To Create New Moment Post'
    }
  }
}
</script>
