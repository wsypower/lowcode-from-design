<template>
  <el-dialog
    title="预览"
    :model-value="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    center
    width="75%"
    @close="notifyClose"
  >
    <div>
      <div class="form-render-wrapper">
        <VFormRender
          ref="previewFormRef"
          :form-json="previewFormJson"
          :form-data="previewFormData"
          :option-data="previewOptionData"
          :global-dsv="props.globalDsv"
          :preview-state="true"
        >
        </VFormRender>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="notifyClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import usePreview from '@/hooks/usePreview'

const emit = defineEmits('close')
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  designer: {
    type: Object,
    default: () => ({}),
  },
  globalDsv: {
    type: Object,
    default: () => ({}),
  },
})

const { previewFormRef, previewOptionData, previewFormData, previewFormJson } =
  usePreview(props.designer)

function notifyClose() {
  emit('close')
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  margin-top: -24px;
}
</style>
