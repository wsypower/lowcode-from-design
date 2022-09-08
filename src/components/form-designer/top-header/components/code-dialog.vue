<template>
  <el-dialog
    title="导出代码"
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
    <el-tabs
      type="border-card"
      class="no-box-shadow no-padding"
      v-model="currentTab"
    >
      <el-tab-pane label="Vue" name="vue">
        <code-editor
          :mode="'html'"
          :readonly="true"
          v-model="vueCode"
          :user-worker="false"
        ></code-editor>
      </el-tab-pane>
      <el-tab-pane label="HTML" name="html">
        <code-editor
          :mode="'html'"
          :readonly="true"
          v-model="htmlCode"
          :user-worker="false"
        ></code-editor>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          class="copy-vue-btn"
          :data-clipboard-text="vueCode"
          @click="copyVueCode"
          >复制Vue代码</el-button
        >
        <el-button
          type="primary"
          class="copy-html-btn"
          :data-clipboard-text="htmlCode"
          @click="copyHtmlCode"
          >复制HTML代码</el-button
        >
        <el-button @click="saveVueCode">保存Vue文件</el-button>
        <el-button @click="saveHtmlCode">保存Html文件</el-button>
        <el-button @click="notifyClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import useCode from '@/hooks/useCode'
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
  vueCode,
  htmlCode,
  generateCode,
  saveVueCode,
  saveHtmlCode,
  copyVueCode,
  copyHtmlCode,
} = useCode(props.designer)
const currentTab = ref('vue')

watch(
  () => props.visible,
  (val) => {
    val && generateCode()
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
