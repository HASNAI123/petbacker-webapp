<template>
    <q-page class="q-mt-xs q-mb-xl">
        <div :style="{'max-width': $q.platform.is.mobile ? '100%' : '1030px'}" class="margin-auto">
            <q-infinite-scroll @load="onLoad" class="row q-py-sm justify-center" :offset="1800">
                <div v-for="(blog, index) in blogInfo" :key="index" class="col-xs-11 q-mb-lg">
                  <!-- Broadcast image -->
                  <!--
                  <q-card class="col-xs-12 q-ml-sm q-mb-sm broadcast-image" style="max-height: 145px;" @click="$router.push(listing.listingUrl)" v-if="listing.parentServiceName === '1'" flat bordered>
                    <q-img :src="listing.coverImage" style="height: 145px;" class="image-offset"></q-img>
                  </q-card>
                  -->

                  <!-- Listing card -->
                  <blog-card :blogInfo="blog"></blog-card>
                </div>
                <div v-if="blogInfo.length === 0 && endOfPage">
                  <p style="margin-left: 100%;width: 100%;">{{$t('no.blogs.available')}}</p>
                </div>
                <template v-slot:loading v-if="!endOfPage">
                  <ComponentPreLoader class="margin-auto"></ComponentPreLoader>
                </template>
            </q-infinite-scroll>
        </div>
    </q-page>
</template>
<script>
export default {
  components: {
    'blog-card': () => import('components/Explore/blogCards.vue')
  },
  data () {
    return {
      blogInfo: [],
      endOfPage: false
    }
  },
  created () {
    this.getBlogs()
  },
  methods: {
    onLoad (index, done) {
      if (this.endOfPage) {
        done()
        return
      }

      setTimeout(() => {
        this.getBlogs()
        done()
      }, 2000)
    },
    getBlogs () {
      if (this.$store.getters['cached/getBlogCached'] && (this.blogInfo.length === 0)) {
        this.blogInfo = this.$store.getters['cached/getBlogCached']
      }

      let blogDomain = 'https://www.petbacker.com'
      if (this.$store.getters['user/getCurrentLanguage'] === 'zh_tw' || this.$store.getters['user/getCurrentLanguage'] === 'zh_hk' || this.$store.getters['user/getCurrentLanguage'] === 'zh_cn') {
        blogDomain = 'https://www.petbacker.com.tw'
      }
      this.$axios.get(`${blogDomain}/blog/api/get/content/articles?limit=10&offset=${this.blogInfo.length}&orderby=created&orderdir=desc&api_key=QG17246Q7Z2XZ2JS09UH`
      ).then((response) => {
        if (response.data.articles.length === 0) {
          this.endOfPage = true
        } else {
          if (this.blogInfo.length === 0) {
            this.blogInfo = response.data.articles
          }

          if (this.blogInfo.length >= 7) {
            this.blogInfo = this.blogInfo.concat(response.data.articles)
          }

          if ((JSON.stringify(this.$store.getters['cached/getBlogCached']) !== JSON.stringify(response.data.articles)) && this.blogInfo.length === 10) {
            this.$store.dispatch('cached/cacheBlogs', response.data.articles)
          }
        }
      }).catch(error => {
        console.error(error)
      })
    }
  }
}
</script>
