<template>
    <q-page class="bg-grey-1">
        <h6 class="q-mx-md q-my-none q-pt-sm">{{$t('complete.the.required.steps')}}</h6>
        <p @click="openUrl(`${$t('link.href.help.center')}/pet-service-providers/how-to-be-a-pet-sitter-or-walker`)" class="q-mx-md q-mb-none q-mt-sm text-grey-7">
          <q-icon name="far fa-question-circle" class="q-mr-sm q-pb-xs"></q-icon>
          {{$t('how.does.approval.works')}}
        </p>

        <!-- What's Left -->
        <q-item-label class="q-px-md q-pt-lg q-mb-sm text-uppercase text-grey">{{$t('what.left')}}</q-item-label>
        <steps-left type="left"></steps-left>

        <!-- Completed -->
        <q-item-label class="q-px-md q-pt-lg q-mb-sm text-uppercase text-grey">{{$t('already.completed')}}</q-item-label>
        <steps-left type="completed"></steps-left>
    </q-page>
</template>
<script>
export default {
  components: {
    'steps-left': () => import('components/StepsLeft/StepsCheckList.vue')
  }
}
</script>
