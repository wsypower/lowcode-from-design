<template>
  <el-dialog
    title="导入JSON"
    :model-value="visible"
    :show-close="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
    @close="notifyClose"
  >
    <el-alert
      type="info"
      title="导入的JSON内容须符合下述格式，以保证顺利导入"
      show-icon
      class="alert-padding"
    ></el-alert>
    <code-editor
      :mode="'json'"
      :readonly="false"
      v-model="jsonTmpl"
    ></code-editor>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="onImport">导入</el-button>
        <el-button @click="notifyClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import useImport from '@/hooks/useImport'
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

const { jsonTmpl, generateJsonTemplate, importJson } = useImport(props.designer)

watch(
  () => props.visible,
  (val) => {
    val && generateJsonTemplate()
  }
)

function onImport() {
  importJson()
  notifyImport()
  notifyClose()
}

function notifyImport() {
  emit('import')
}

function notifyClose() {
  emit('close')
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  margin-top: -24px;
}
</style>
