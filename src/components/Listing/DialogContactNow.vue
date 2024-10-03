<template>
    <q-dialog v-model="modal" position="bottom" @hide="onClose">
      <q-card style="border-top-right-radius: 15px;border-top-left-radius: 15px;" >
        <q-toolbar class="bg-white">
          <q-toolbar-title v-close-popup >
            <h6 class="q-my-none">{{$t('what.next')}}</h6>
          </q-toolbar-title>
          <q-btn flat dense v-close-popup icon="close" class="q-pl-none"/>
        </q-toolbar>

        <!-- Images -->
        <q-card-section class="q-py-sm row" v-if="images">
          <div class="row full-width">
            <div class="col-xs-4" style="height: 120px; width: 120px;">
              <q-img :src="userInfo.avatarImage" class="image-upload" style="height: 100%;"></q-img>
            </div>
            <div class="col-xs-5 q-ml-sm" v-if="images.length > 0">
              <div class="row">
                <div v-for="index in (images.length < 9 ? images.length : 9)" :key="index" class="col-xs-3 q-ml-sm q-mb-sm" style="max-width: 50px;max-heigth: 50px;">
                  <q-img :src="images[index - 1].thumbnail" class="image-upload" style="height: 100%;"></q-img>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="row" v-if="userInfo">
          <p class="q-my-none font-normal" v-html="$t('contact.pet.sitter.direct', {sitterName: userInfo.username})"></p>
          <q-checkbox v-model="broadcast" :label="$t('would.like.others.too.checkbox.label')">
            <q-icon name="help_outline" class="q-ml-sm" size="18px" @click.stop="openUrl(`${$t('link.href.help')}/pet-parents/how-to-make-a-private-only-request`)"></q-icon>
          </q-checkbox>
        </q-card-section>

        <q-card-section class="q-pb-lg">
          <q-btn :label="$t('button.next')" @click="contactNow" color="primary" class="full-width"></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>
<script>
export default {
  props: {
    trigger: {
      required: true,
      type: Boolean
    },
    userInfo: {
      required: true
    },
    images: {
      required: true
    },
    serviceUri: {
      required: true
    },
    listingInfo: {
      required: true
    }
  },
  data () {
    return {
      modal: false,
      broadcast: true
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    }
  },
  methods: {
    contactNow () {
      console.log(this.broadcast)
      this.$router.push({
        name: 'CreateRequest',
        params: {uri: this.serviceUri},
        query: {
          broadcast: this.broadcast ? 1 : 0,
          servname: this.listingInfo.listingName,
          serv: this.listingInfo.id,
          avatar: this.parseAvatarUrl(this.userInfo.avatarImage),
          ref: this.listingInfo.uuid,
          reqlocation: this.listingInfo.serviceLocation[0].city + '--' + this.listingInfo.serviceLocation[0].country,
          lat: this.listingInfo.serviceLocation[0].latitude,
          lon: this.listingInfo.serviceLocation[0].longitude,
          country_id: this.listingInfo.serviceLocation[0].countryId
        }
      })
    },
    parseAvatarUrl (imageUrl) {
      return imageUrl.split('/')[5].replace('.jpg', '')
    },
    onClose () {
      this.$emit('on-close', false)
    }
  }
}
</script>
<style lang="stylus">
.contact-title
  margin-left: 12%
  font-size: 18px

@media screen and (min-width: 320px)
  .contact-title
    margin-left: 22%

@media screen and (min-width: 350px)
  .contact-title
    margin-left: 28%

@media screen and (min-width: 370px)
  .contact-title
    margin-left: 28%

@media screen and (min-width: 400px)
  .contact-title
    margin-left: 30%
</style>
