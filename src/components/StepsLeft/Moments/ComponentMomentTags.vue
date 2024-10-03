<template>
    <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" transition-show="slide-left" transition-hide="slide-right">
        <q-card>
            <q-toolbar style="z-index: 5000;" class="borderline fixed-top bg-white" :class="{'q-pt-xl': $q.platform.is.ios}">
                <q-btn flat dense v-close-popup icon="chevron_left" size="lg" class="q-pl-none"/>
                <q-toolbar-title v-close-popup >
                  <h6 class="q-my-none header-title" v-if="type === 'tag-owners'">{{$t('tag.owners')}}</h6>
                  <h6 class="q-my-none header-title" v-else-if="type === 'tag-pets'">{{$t('tag.pets')}}</h6>
                  <h6 class="q-my-none header-title" v-else-if="type === 'tag-job'">{{$t('tag.jobs')}}</h6>
                </q-toolbar-title>
                <q-btn v-if="type === 'tag-job'" :loading="postLoader" style="border: 1px solid #9b89b9; padding-left: 10px; padding-right:10px ; " flat dense class="text-primary" @click="onSelect">{{$t('Clear')}}</q-btn>
                <q-btn v-if="type === 'tag-pets'" :loading="postLoader" style="border: 1px solid #9b89b9; padding-left: 10px; padding-right:10px ; " flat dense class="text-primary" @click="onSelect">{{$t('Done')}}</q-btn>
            </q-toolbar>

            <q-card-section class="q-pa-none q-my-xl q-pt-xs q-pb-lg" v-if="tagInfo">
              <q-item v-for="(tag, index) in tagInfo" class="q-mx-sm" :key="tag.id" style="border-bottom: 1px solid lightgrey;" @click.native="onJobSelect(tag)">
                  <q-item-section avatar>
                    <q-avatar style="width: 50px; height: 50px;">
                        <img :src="tag.avatar || tag.serviceIcon" height="100%" class="image-upload"/>
                    </q-avatar>
                  </q-item-section>

                  <q-item-section class="font-normal" @click="onCheck(tag.id)">
                    <q-item-label class="text-weight-bold" v-if="tag.serviceDescription">{{tag.serviceDescription}}</q-item-label>
                    <q-item-label :caption="tag.serviceDescription ? true : false">{{tag.name || tag.username || tag.bookingOwnerName}}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-icon v-if="tag.serviceDescription" name="chevron_right"></q-icon>
                    <q-checkbox :ref="`checkbox-${tag.id}`" v-else v-model="selections" :val="index"></q-checkbox>
                  </q-item-section>
              </q-item>
            </q-card-section>
            <div class="col-xs-12 q-my-xl q-pt-xs text-center" v-else>
                <ComponentPreLoader></ComponentPreLoader>
            </div>

            <!-- <div class="fixed-bottom bg-primary" v-if="$q.platform.is.mobile && type !== 'tag-job'" style="border-top-right-radius: 15px;border-top-left-radius: 15px;" @click="onSelect">
                <div class="q-pa-md q-pb-md">
                    <div class="text-white q-pb-sm text-center cursor-pointer font-header-title text-capitalize">
                        <span>{{$t('select')}}</span>
                    </div>
                </div>
            </div> -->
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
    type: {
      required: true
    }
  },

  mounted () {
    document.addEventListener('backbutton', this.onClose)
  },
  data () {
    return {
      modal: false,
      tagInfo: null,
      selections: []
    }
  },
  watch: {
    trigger (value) {
      this.modal = value

      if (value && (this.tagInfo === null)) {
        this.getTagInfo()
      }
    }
  },
  methods: {
    onClose () {
      this.$emit('on-close', false)
    },
    onJobSelect (taskInfo) {
      if (this.type !== 'tag-job') {
        return
      }

      let selectionInfo = {
        'selection': taskInfo.id,
        'display': taskInfo.jobRef,
        'type': this.type
      }

      this.$emit('on-select', selectionInfo)
      this.$emit('on-close', false)
    },
    clearCache () {
      this.tagInfo = null
    },
    onCheck (id) {
      if (this.type === 'tag-job') {
        return
      }

      this.$refs[`checkbox-${id}`][0].toggle()
    },
    onSelect () {
      let tagVal = []
      let displayVal = []

      // seperate tag value and display name
      this.selections.forEach(value => {
        tagVal.push(this.tagInfo[value].uuid || this.tagInfo[value].id)
        displayVal.push(this.tagInfo[value].username || this.tagInfo[value].name || this.tagInfo[value].jobRef)
      })

      let selectionInfo = {
        'selection': tagVal,
        'display': displayVal.join(', '),
        'type': this.type
      }

      this.$emit('on-select', selectionInfo)
      this.$emit('on-close', false)
    },
    getTagInfo () {
      let tagType = 'users'
      switch (this.type) {
        case 'tag-owners': tagType = 'users'; break
        case 'tag-pets': tagType = 'personalItems'; break
        case 'tag-job': tagType = 'jobs'
      }

      this.$axios.get(`moments/tags/${tagType}`, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).then((response) => {
        this.tagInfo = response.data.tagsInfo[tagType].items
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
<style lang="stylus">
.header-title
  margin-left: 12%
  font-size: 18px

@media screen and (min-width: 320px)
  .header-title
    margin-left: 27%

@media screen and (min-width: 350px)
  .header-title
    margin-left: 25%

@media screen and (min-width: 370px)
  .header-title
    margin-left: 25%

@media screen and (min-width: 400px)
  .header-title
    margin-left: 33%

@media screen and (min-width: 530px)
  .header-title
    margin-left: 17%
</style>
