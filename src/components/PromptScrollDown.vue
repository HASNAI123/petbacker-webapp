<template>
    <div class="arrow-container animated fadeInDown" v-if="visibility">
        <div class="arrow-2 animated bounce infinite" @click="scrollDown">
            <i class="fa fa-angle-down"></i>
        </div>
        <div class="arrow-1 animated hinge infinite zoomIn"></div>
    </div>
</template>

<script>
import { throttle } from 'quasar'
export default {
  data () {
    return {
      visibility: true
    }
  },
  mounted () {
    if (this.$route.name === 'MobileDashboard') {
      this.scrollEventParent = throttle(this.scrollEventParent, 500)
      this.$parent.$parent.$el.addEventListener('scroll', this.scrollEventParent)
    } else {
      this.scrollEventDocument = throttle(this.scrollEventDocument, 500)
      window.addEventListener('scroll', this.scrollEventDocument)
    }
  },
  beforeDestroy () {
    if (this.$route.name === 'MobileDashboard') {
      this.$parent.$parent.$el.removeEventListener('scroll', this.scrollEventParent)
    } else {
      window.removeEventListener('scroll', this.scrollEventDocument)
    }
  },
  methods: {
    scrollDown () {
      if (this.$route.name === 'MobileDashboard') {
        this.$parent.$parent.$el.scrollBy({
          top: screen.height / 2,
          behavior: 'smooth'
        })
      } else {
        window.scrollBy({
          top: screen.height / 2,
          behavior: 'smooth'
        })
      }
    },
    scrollEventParent () {
      if (this.$parent.$parent.$el.scrollTop >= 15) {
        this.visibility = false
      }
    },
    scrollEventDocument () {
      if (document.documentElement.scrollTop >= 15) {
        this.visibility = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.arrow-container{
  width: 100px;
  height: 100px;
  margin: 0 auto;
  position: fixed;
  z-index: 1200;
  bottom: 25px;
  left: 0;
  right: 0;
}

.arrow-1{
  width: 100px;
  height: 100px;
  background: $primary;
  opacity: 0.5;
  border-radius: 50%;
  position: absolute;
}

.arrow-2{
  width: 60px;
  height: 60px;
  background: $primary;
  border-radius: 50%;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  display: table;
}

.arrow-2:before{
  width: 50px;
  height: 50px;
  content: "";
  border: 2px solid white;
  border-radius: 50%;
  position: absolute;
  top: 5px;
  left: 5px;
}

.arrow-2 i.fa{
  font-size: 30px;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  color: white;
}

/* Custom Animate.css */
.bounce {
    animation-name: bounce-2;
    animation-duration: 2s;
    animation-timing-function: cubic-bezier(0.280, 0.840, 0.320, 1);
}
@keyframes bounce-2 {
    0%  { transform: translateY(0); }
    30%  { transform: translateY(-25px); }
    50%  { transform: translateY(20px); }
    100% { transform: translateY(0); }
 }
.animated.hinge {
  -webkit-animation-duration: 2s;
          animation-duration: 2s;
}

@-webkit-keyframes zoomIn {
  0% {
    opacity: 0;
    -webkit-transform: scale3d(.4, .4, .4);
            transform: scale3d(.4, .4, .4);
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 0;
  }
}

@keyframes zoomIn {
  0% {
    opacity: 0;
    -webkit-transform: scale3d(.4, .4, .4);
            transform: scale3d(.4, .4, .4);
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 0;
  }
}

.zoomIn {
  -webkit-animation-name: zoomIn;
          animation-name: zoomIn;
}
</style>
