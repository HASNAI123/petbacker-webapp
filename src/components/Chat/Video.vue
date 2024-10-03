<template>
    <div class="col-xs-9 q-ml-lg" style="margin-left: 0px;">
        <q-chat-message
        :name="messageInfo.userInfo.id === $store.state.user.uuid ? '' : capitalized(messageInfo.userInfo.username)"
        :sent="messageInfo.userInfo.id === $store.state.user.uuid ? true : false"
        :bg-color="messageInfo.userInfo.id === $store.state.user.uuid ? 'green-5' : 'grey-3'"
        :avatar="messageInfo.userInfo.id === $store.state.user.uuid ? '' : messageInfo.userInfo.avatarImage"
        >
          <div>
            <video
                preload="auto"
                class="video-uploaded"
                poster="statics/images/graphic-placeholder.jpg"
                @loadstart="videoLoader = true"
                @loadeddata="videoLoader = false"
                @ended="videoPlaying = false;replay = true; $refs[messageInfo.id].webkitExitFullScreen()"
                @click="pauseVideo(messageInfo.id)"
                :ref="messageInfo.id"
            >
              <source :src="`${messageInfo.content}#t=1`" type="video/mp4">
            </video>

            <ComponentPreLoader style="position: absolute;top: 40%;left: 40%;" v-if="videoLoader"></ComponentPreLoader>
            <q-btn round flat v-else-if="!videoPlaying && !replay" icon="far fa-play-circle" size="xl" class="text-white play-button q-px-md q-py-sm" @click="playVideo(messageInfo.id)"></q-btn>
            <q-btn round flat v-else-if="replay" icon="fas fa-redo" size="xl" class="text-white play-button q-px-md q-py-sm" @click="playVideo(messageInfo.id)"></q-btn>
          </div>
        </q-chat-message>
        <div><small class="text-neutral" style="margin-left: 16%" :style="{float: messageInfo.userInfo.id === $store.state.user.uuid? 'right' : 'left'}">{{ formattedTime }}</small></div>
    </div>
</template>
<script>
export default {
  props: {
    messageInfo: {
      required: true,
      type: Object
    },
    formattedTime: {
      type: String
    }
  },
  data () {
    return {
      videoPlaying: false,
      replay: false,
      videoLoader: false
    }
  },
  methods: {
    pauseVideo (num) {
      if (this.videoPlaying) {
        this.videoPlaying = false
        this.$refs[num].pause()
      } else {
        this.playVideo(num)
      }
    },
    playVideo (num) {
      if (!this.videoPlaying) {
        this.videoPlaying = true

        let playPromise = null
        if (this.$refs[num]) {
          if (this.$refs[num][0]) {
            playPromise = this.$refs[num][0].play()
          } else {
            playPromise = this.$refs[num].play()
          }
        }

        if (playPromise !== null) {
          playPromise.catch(_ => {
            this.videoPlaying = false
          })
        }
        this.replay = false
      } else {
        this.videoPlaying = false
      }
    },
    capitalized (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
}
</script>
<style lang="stylus">
.play-button
  position: absolute
  top: 50%
  left: 50%

.video-uploaded
  width: 100%
  object-fit: cover
</style>
