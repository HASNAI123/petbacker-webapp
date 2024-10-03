<template>
  <div class="fixed-bottom text-center bottom110" v-if="hide && parseInt(serviceId) === 16">
    <!-- <q-page-sticky  @click.native="onWalkPets" position="bottom" :offset="[0, 150]" v-if="hide && parseInt(serviceId) === 16">
        <q-btn class="text-capitalize" @click.native="onWalkPets" :label="$t('start.pet.walk')" color="primary" rounded></q-btn>
    </q-page-sticky> -->
    <span class="text-capitalize bg-primary text-white span-btn" @click="onWalkPets" :label="$t('start.pet.walk')" color="primary" rounded>{{$t('start.pet.walk')}}</span>
  </div>
</template>
<script>
export default {
  props: {
    serviceId: {
      type: Number,
      require: true
    },
    taskId: {
      type: Number,
      require: true,
      default: null
    },
    personalItems: {
      type: Array
    },
    hide: {
      type: Boolean
    }
  },
  mounted () {
    console.log(this.taskId)
  },
  methods: {
    generatePetInfo () {
      let selectedPets = []
      let petIds = []

      for (const pet of this.personalItems) {
        let innerJson = JSON.parse(pet.itemDescription).question

        let petInfo = {
          'id': pet.id,
          'title': pet.title,
          'breed': pet.breed,
          'weight': innerJson[7].reply || '',
          'gender': innerJson[5].reply || '',
          'mediaInfo': [pet.mediaInfo[0]],
          'personalItemId': pet.personalItemId,
          'taskId': this.taskId.toString()
        }
        selectedPets.push(petInfo)
        petIds.push(pet.id)
      }

      return {petIds: petIds, selectedPets: selectedPets}
    },
    onWalkPets () {
      let generatedPetInfo = this.generatePetInfo()

      // save dog walk info in local storage
      let dogWalkInfo = {
        'petIds': generatedPetInfo.petIds,
        'selectedPets': generatedPetInfo.selectedPets,
        'started': false,
        'taskId': [this.taskId]
      }
      this.$q.localStorage.set('dogWalkInfo', dogWalkInfo)

      this.$router.push({name: 'DogWalk'})
    }
  }
}
</script>
<style lang="stylus" scoped>
.bottom110 {
  bottom : 110px
}
.span-btn{
      display: inline-flex;
    flex-direction: column;
    align-items: stretch;
    position: relative;
    outline: 0;
    border: 0;
    vertical-align: middle;
    padding: 5px 15px;
    font-size: 14px;
    line-height: 1.715em;
    text-decoration: none;
    font-weight: 500;
    text-align: center;
    width: auto;
    border-radius: 28px;
    height: auto;
    box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
}
</style>
