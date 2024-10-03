<template>
    <q-card class="justify-center">
        <q-toolbar :class="this.$q.platform.is.mobile ? 'fixed-top bg-white' : 'bg-white modal-header-desktop responsive'" style="z-index: 10;border-bottom: solid 1px lightgrey;">
          <q-btn flat round dense icon="chevron_left" style="font-size: 1.3em;" v-close-popup></q-btn>
          <q-toolbar-title style="font-size: 18px;" class="text-header" v-close-popup>
            <h6 class="q-my-none font-normal">Saved Drafts</h6>
          </q-toolbar-title>
          <q-btn flat round dense :ripple="false" :label="$t('requests.page.editrequest')" style="margin-right:10px;" v-if="!editDraft" @click="onEdit"></q-btn>
          <q-btn flat round dense :ripple="false" :label="$t('done')" style="margin-right:10px;" v-else @click="onEdit"></q-btn>
        </q-toolbar>

        <q-card-section class="q-px-none q-mt-xl" v-if="stories && stories.length > 0">
          <q-list class="q-mx-md" separator>

            <!-- Draft Item -->
            <q-item v-for="(story, index) in stories" :key="index" clickable @click="openSavedDraft(index)">
              <!-- Delete Button to show on edit -->
              <q-item-section avatar v-if="editDraft" class="q-pa-none" style="min-width: 40px;">
                <q-icon name="fas fa-trash" size="20px" class="col-12" color="negative" @click="onDelete(index)"></q-icon>
              </q-item-section>

              <!-- Draft Title and Summary -->
              <q-item-section>
                <q-item-label>{{story.title}}</q-item-label>
                <q-item-label caption lines="2">{{story.summary}}</q-item-label>
              </q-item-section>

              <!-- Draft Image -->
              <q-item-section avatar v-if="story.coverImage !== null">
                <q-avatar rounded style="height:65px; width: 65px;border:none;">
                  <img :src="story.coverImage.url" class="image-upload" />
                </q-avatar>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <!-- No draft available -->
        <q-card-section class="q-px-none q-mt-xl" v-else>
          <div class="q-my-lg text-center ">
            <img src="statics/images/logo-mid.jpg" class="image-upload q-mb-md" width="25%"/>
            <p>No drafts stored. <br/>Create a story or moment now and start posting!</p>
            <q-btn color="primary" outline label="Create Your First Post" @click="onCreate"></q-btn>
          </div>
        </q-card-section>
    </q-card>
</template>
<script>
export default {
  data () {
    return {
      stories: null,
      createStoryModal: false,
      selectedDraft: null,
      editDraft: false
    }
  },
  created () {
    this.getDrafts()
  },
  methods: {
    onEdit () {
      if (this.editDraft) {
        this.editDraft = false
      } else {
        this.editDraft = true
      }
    },
    onDelete (index) {
      let drafts = this.$q.localStorage.getItem('storyDrafts').items

      // remove item and update
      drafts.splice(0, index + 1)
      this.stories = drafts

      // update local storage
      this.$q.localStorage.set('storyDrafts', {items: drafts})
    },
    onCreate () {
      this.$emit('create-post', true)
    },
    openSavedDraft (index) {
      if (this.editDraft === false) {
        this.selectedDraft = this.stories[index]
        this.selectedDraft['index'] = index
        this.createStoryModal = true
        this.$emit('open-saved-drafts', this.selectedDraft)
      }
    },
    getDrafts () {
      if (this.$q.localStorage.has('storyDrafts')) {
        this.stories = this.$q.localStorage.getItem('storyDrafts').items
      }
    }
  }
}
</script>
<style lang="stylus">
.text-header
  margin-left: 17%

.modal-header-desktop
  position: fixed
  max-width: 520px

@media screen and (min-width: 360px)
    .text-header
      margin-left: 22%

@media screen and (min-width: 410px)
    .text-header
      margin-left: 24%

@media screen and (min-width: 600px)
    .text-header
      margin-left: 31%

</style>
