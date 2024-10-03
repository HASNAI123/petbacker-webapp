<template>
   <div>
        <q-item class="q-pr-none q-my-none" @click.native="triggerPetProfileModal(true)">
            <!-- Pet Image -->
            <q-item-section thumbnail class="q-pr-sm" @click="triggerPetProfileModal(true)">
                <img :src="pet.mediaInfo[0].filePath" :alt="pet.title" class="pet-profile" style="width:80px;height:80px;object-fit:cover;">
            </q-item-section>

            <!-- Pet's Info -->
            <q-item-section class="font-normal" v-if="petInfo">
                <q-item-label lines="1">{{$t('name')}} {{petInfo.question[NAME_OF_PET].reply}}</q-item-label>
                <q-item-label lines="1" class="breed-name" style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">{{$t('breed')}} {{petInfo.question[BREED_OF_PET].reply}} ({{petInfo.question[TYPE_OF_PET].reply}})</q-item-label>
                <q-item-label lines="1">{{$t('size')}} {{petInfo.question[SIZE_OF_PET].reply}}</q-item-label>
                <q-item-label lines="1" class="text-primary" @click="triggerPetProfileModal(true)">{{$t('more.info')}}</q-item-label>
            </q-item-section>

            <!-- <q-item-section class="font-normal text-left" style="color:black;" v-if="petInfo">
                <q-item-label lines="1" class="breed-name" style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">{{$t('breed')}} {{petInfo.question[BREED_OF_PET].reply}}</q-item-label>
                <q-item-label lines="1" v-if="petInfo.question[DOB_OF_PET].reply !== 'Invalid date' && petInfo.question[DOB_OF_PET].reply !== '' && formatAge(petInfo.question[DOB_OF_PET].reply) !== 'N/A'">{{$t('pet.age.old', {age: formatAge(petInfo.question[DOB_OF_PET].reply)}) }}</q-item-label>
            </q-item-section> -->
        </q-item>

        <dialog-pet-profile :trigger="petProfileModal" :petInfo="pet.itemDescription" :mediaInfo="pet.mediaInfo" :wallInfo="{likes: pet.totalLikes, comments: pet.totalComments, liked: pet.isLiked, id: pet.id}" @on-close="triggerPetProfileModal"></dialog-pet-profile>
   </div>
</template>
<script>
import moment from 'moment'

export default {
  components: {
    'dialog-pet-profile': () => import('components/PetProfile/DialogPetProfile.vue')
  },
  props: {
    pet: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      petInfo: null,
      petProfileModal: false,
      NAME_OF_PET: 1,
      TYPE_OF_PET: 3,
      BREED_OF_PET: 5,
      SIZE_OF_PET: 7,
      DOB_OF_PET: 11
    }
  },
  mounted () {
    this.petInfo = JSON.parse(this.pet.itemDescription)
  },
  methods: {
    triggerPetProfileModal (status) {
      this.petProfileModal = status
    },
    formatAge (petDOB) {
      let dob = moment.utc(petDOB).local().diff(moment(), 'year')
      if (dob === 'Invalid date' || petDOB === '' || !dob) {
        return 'N/A'
      }

      return dob
    }
  }
}
</script>
