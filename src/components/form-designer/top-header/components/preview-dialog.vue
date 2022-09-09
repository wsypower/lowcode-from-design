<template>
  <el-dialog
    title="预览"
    :model-value="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    :destroy-on-close="true"
    center
    width="75%"
    @close="notifyClose"
  >
    <div>
      <div class="form-render-wrapper">
        <VFormRender
          ref="previewFormRef"
          :preview-state="true"
          :form-json="previewFormJson"
          :global-dsv="props.globalDsv"
        >
        </VFormRender>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="resetForm">重置表单</el-button>
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

const { previewFormRef, previewFormJson, generateFormJson, resetForm } =
  usePreview(props.designer)

watch(
  () => props.visible,
  (val) => {
    if (val) {
      generateFormJson()
    }
  }
)

function notifyClose() {
  emit('close')
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  margin-top: -24px;
}
</style>
