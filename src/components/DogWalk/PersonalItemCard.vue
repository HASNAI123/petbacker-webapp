<template>
    <q-item class="q-mt-md justify-center input" @click.native="toggle">
        <q-item-section thumbnail style="margin-left: 0px;" >
            <img v-if="personalItemInfo" :src="personalItemInfo.mediaInfo[0].filePath" class="image-upload" style="width: 85px; height: 85px;border-radius: 7px" />
        </q-item-section>

        <q-item-section>
            <q-item-label class="text-capitalize">
                {{personalItemInfo.title}}
                <q-icon name="female" v-if="personalItemInfo.gender === 'Female'"></q-icon>
                <q-icon name="male" v-else-if="personalItemInfo.gender === 'Male'"></q-icon>
            </q-item-label>
            <q-item-label v-if="personalItemInfo.breed">{{$t('breed')}} {{ personalItemInfo.breed }}</q-item-label>
            <q-item-label v-if="personalItemInfo.weight">{{$t('weight')}}: {{ personalItemInfo.weight }}</q-item-label>
        </q-item-section>

        <q-item-section side>
            <q-checkbox ref="checkbox" v-model="displaySelected" @input="onSelect" val="true"></q-checkbox>
        </q-item-section>
    </q-item>
</template>
<script>
export default {
  props: {
    personalItemInfo: {
      required: true,
      type: Object
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      displaySelected: false
    }
  },
  methods: {
    toggle () {
      this.$refs['checkbox'].toggle()
    },
    onSelect () {
      this.$emit('on-select', this.personalItemInfo, this.index)
    }
  }
}
</script>
