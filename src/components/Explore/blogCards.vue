<template>
    <q-card flat bordered style="border-radius: 11px;" :style="$route.name === 'MobileDashboard' ? 'width: 260px;height: 147px;' : ''" @click="openNewTab">
        <!-- Image -->
        <q-img native-context-menu v-if="blogInfo.images" class="image-upload" placeholder-src="statics/images/graphic-placeholder.jpg" basic :src="blogInfo.images.image_intro" :style="{height: $route.name === 'MobileDashboard' ? '145px' : '200px'}">
            <!-- Blog Title -->
            <div class="absolute-bottom" style="padding: 7px;">
              <q-item dense class="q-pa-none">
                <q-item-section class="q-pa-none">
                  <q-item-label lines="2">{{blogInfo.title}}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
        </q-img>
        <q-skeleton v-else width="260px" height="140px"></q-skeleton>
    </q-card>
</template>
<script>
export default {
  props: {
    blogInfo: {
      type: [Object, null]
    }
  },
  methods: {
    openNewTab () {
      if (this.blogInfo.url) {
        this.openUrl(`${this.blogInfo.url}`)
      } else {
        let blogDomain = 'https://www.petbacker.com'
        if (this.$store.getters['user/getCurrentLanguage'] === 'zh_tw' || this.$store.getters['user/getCurrentLanguage'] === 'zh_hk' || this.$store.getters['user/getCurrentLanguage'] === 'zh_cn') {
          blogDomain = 'https://www.petbacker.com.tw'
        }
        this.openUrl(`${blogDomain}/blog/index.php?option=com_content&id=${this.blogInfo.id}&view=article`)
      }
    }
  }
}
</script>
