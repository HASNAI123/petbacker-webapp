<template>
    <div>
      <h6 class="q-mb-none q-mt-sm" @click="onToggle">
        <span class="text-capitalize">{{$t('pet.walk.tasks.title', {username: taskInfo.requestorInfo.username})}}</span> (#{{taskInfo.jobReference}})
        <q-checkbox v-if="taskInfo.personalItemsInfo === null" class="float-right" ref="checkbox" v-model="taskCheckbox" @input="onToggle" val="true"></q-checkbox>
      </h6>
      <personal-item-card v-for="petInfo in taskInfo.personalItemsInfo" :personalItemInfo="petInfo" :key="petInfo.id" @on-select="onSelect"></personal-item-card>
    </div>
</template>
<script>
export default {
  components: {
    'personal-item-card': () => import('components/DogWalk/PersonalItemCard.vue')
  },
  props: {
    taskInfo: {
      required: true,
      type: Object
    },
    index: {
      required: true,
      type: Number
    }
  },
  data () {
    return {
      selectedPets: [],
      taskCheckbox: false
    }
  },
  methods: {
    onToggle () {
      if (this.taskCheckbox) {
        this.onRemoveTask()
        this.taskCheckbox = false
      } else {
        this.onAddTask()
        this.taskCheckbox = true
      }
    },
    onAddTask () {
      this.$emit('add-task', this.taskInfo.id, this.index)
    },
    onRemoveTask () {
      this.$emit('remove-task', this.taskInfo.id, this.index)
    },
    onSelect (personalItemInfo) {
      let index = this.selectedPets.indexOf(personalItemInfo.id)
      if (index > -1) {
        this.selectedPets.splice(index, 1)

        // last pet remove for this task
        if (this.selectedPets.length === 0) {
          this.onRemoveTask()
        }
      } else {
        this.selectedPets.push(personalItemInfo.id)

        // first pet added for this task
        if (this.selectedPets.length === 1) {
          this.onAddTask()
        }
      }
      this.$emit('on-select', personalItemInfo)
    }
  }
}
</script>
