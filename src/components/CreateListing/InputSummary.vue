<template>
    <div>
        <q-item class="q-px-none q-pb-md" style="border-bottom: solid 1px lightgrey;" @click.native="triggerSummaryModal(true)">
            <q-item-section>
                <q-item-label class="font-normal" lines="2" caption>{{replyInfo || contentInfo}}</q-item-label>
            </q-item-section>

            <q-item-section side>
                <q-icon name="chevron_right" class="float-right"></q-icon>
            </q-item-section>
        </q-item>

        <!-- Dialog Summary -->
        <dialog-summary :trigger="summaryModal" :loader="loader" :title="title" :content="replyInfo" :placeholder="contentInfo" @on-save="onSaveSummary" @on-close="triggerSummaryModal"></dialog-summary>
    </div>
</template>
<script>
export default {
  components: {
    'dialog-summary': () => import('components/CreateListing/DialogSummary.vue')
  },
  props: {
    title: {
      type: String,
      require: true,
      default: null
    },
    replyInfo: {
      type: String,
      require: true,
      default: null
    },
    contentInfo: {
      type: String,
      require: true,
      default: null
    },
    index: {
      type: Number,
      required: true
    },
    loader: {
      type: Boolean,
      default: false,
      require: true
    }
  },
  watch: {
    loader (value) {
      if (this.pendingStatus && !value) {
        this.triggerSummaryModal(false)
      }
    }
  },
  data () {
    return {
      summaryModal: false,
      pendingStatus: false
    }
  },
  methods: {
    onSaveSummary (info) {
      this.pendingStatus = true
      this.$emit('on-save', this.index, info)
    },
    triggerSummaryModal (status) {
      this.summaryModal = status
    }
  }
}
</script>
