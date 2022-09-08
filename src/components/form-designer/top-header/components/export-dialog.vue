<template>
  <el-dialog
    title="导出JSON"
    :model-value="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
    :destroy-on-close="true"
    :append-to-body="true"
    width="75%"
    @close="notifyClose"
  >
    <code-editor
      :mode="'json'"
      :readonly="true"
      v-model="jsonContent"
    ></code-editor>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          class="copy-json-btn"
          :data-clipboard-text="jsonRawContent"
          @click="copyJsonToClipboard"
          >复制JSON</el-button
        >
        <el-button @click="saveFormJson">保存为文件</el-button>
        <el-button @click="notifyClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import useExport from '@/hooks/useExport'
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
  jsonContent,
  jsonRawContent,
  generateJson,
  copyJsonToClipboard,
  saveFormJson,
} = useExport(props.designer)

watch(
  () => props.visible,
  (val) => {
    val && generateJson()
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
