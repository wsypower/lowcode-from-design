<template>
  <div>
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
          <el-button type="primary" @click="getFormData">获取数据</el-button>
          <el-button type="primary" @click="resetForm">重置表单</el-button>
          <el-button @click="notifyClose">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <div
      v-if="formDataDialogVisible"
      v-drag="[
        '.nested-drag-dialog.el-dialog',
        '.nested-drag-dialog .el-dialog__header',
      ]"
    >
      <el-dialog
        v-model="formDataDialogVisible"
        title="表单数据"
        :show-close="true"
        custom-class="nested-drag-dialog dialog-title-light-bg"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        :append-to-body="true"
      >
        <div style="border: 1px solid #dcdfe6">
          <code-editor
            :mode="'json'"
            :readonly="true"
            v-model="formDataJson"
          ></code-editor>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button
              type="primary"
              class="copy-form-data-json-btn"
              :data-clipboard-text="formDataRawJson"
              @click="copyFormData"
              >复制JSON</el-button
            >
            <el-button @click="saveFormData">保存为文件</el-button>
            <el-button @click="hideDataDialog">关闭</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import usePreview from '@/hooks/usePreview'
import CodeEditor from '@/components/code-editor/index'

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

const {
  previewFormRef,
  previewFormJson,
  formDataDialogVisible,
  formDataJson,
  formDataRawJson,
  hideDataDialog,
  generateFormJson,
  resetForm,
  getFormData,
  copyFormData,
  saveFormData,
} = usePreview(props.designer)

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
.form-render-wrapper {
  min-height: 150px;
}
</style>
