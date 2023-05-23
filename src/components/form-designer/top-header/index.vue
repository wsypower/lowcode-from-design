<template>
  <el-header class="top-header">
    <div class="left">
      <svg-icon icon-class="logo" class-name="logo" />
      <i class="divider"></i>

      <el-tooltip effect="light" content="撤销" placement="bottom">
        <svg-icon
          icon-class="op-undo"
          :class-name="`undo ${undoDisabled ? 'disabled' : ''}`"
          @click="undo"
      /></el-tooltip>

      <el-tooltip effect="light" content="重做" placement="bottom">
        <svg-icon
          icon-class="op-redo"
          :class-name="`redo ${redoDisabled ? 'disabled' : ''}`"
          @click="redo"
        />
      </el-tooltip>
    </div>
    <div class="middle">
      <el-tooltip effect="light" content="PC端" placement="bottom">
        <svg-icon
          icon-class="op-pc"
          :class-name="designer.isPCLayout ? 'active' : ''"
          @click="designer.setPCLayout()"
      /></el-tooltip>

      <el-tooltip effect="light" content="移动端" placement="bottom">
        <svg-icon
          icon-class="op-mobile"
          :class-name="designer.isH5Layout ? 'active' : ''"
          @click="designer.setH5Layout()"
        />
      </el-tooltip>

      <template v-if="designer.isPCLayout">
        <el-select
          :model-value="
            designer.isFormWidthCustomize ? '自定义' : designer.pcFormWidth
          "
          @change="onPCSizeChange"
          can-edit
        >
          <el-option
            v-for="(size, index) in designer.screenWidthList"
            :key="size"
            :label="index !== 0 ? `${size}px` : size"
            :value="size"
          />
        </el-select>
        <el-input-number
          v-model="designer.pcFormWidth"
          v-if="designer.isFormWidthCustomize"
          controls-position="right"
        />
      </template>
      <template v-else>
        <el-select
          :model-value="designer.h5CurrentPhone.name"
          @change="onPhoneChange"
          can-edit
        >
          <el-option
            v-for="(phone, index) in designer.phoneSizeList"
            :key="phone.name"
            :label="phone.name"
            :value="index"
          />
        </el-select>
      </template>
    </div>
    <div class="right">
      <v-form-render
        v-if="designerMounted"
        :form-json="formJson"
        ref="renderRef"
        style="position: absolute; top: -200%; left：200%;"
      >
      </v-form-render>

      <el-tooltip effect="light" content="清空表单组件" placement="bottom">
        <svg-icon
          icon-class="op-delete"
          class-name="delete-icon"
          @click="clearFormWidget"
      /></el-tooltip>
      <i class="divider"></i>

      <el-tooltip effect="light" content="预览表单" placement="bottom">
        <svg-icon icon-class="op-preview" @click="showPreviewDialog"
      /></el-tooltip>
      <el-tooltip effect="light" content="导入JSON" placement="bottom">
        <svg-icon icon-class="op-import" @click="showImportDialog"
      /></el-tooltip>
      <el-tooltip effect="light" content="导出JSON" placement="bottom">
        <svg-icon icon-class="op-export" @click="showExportDialog"
      /></el-tooltip>
      <el-tooltip effect="light" content="导出代码" placement="bottom">
        <svg-icon icon-class="op-code" @click="showCodeDialog"
      /></el-tooltip>

      <template v-if="hasId">
        <i class="divider" style="margin-right: 0"></i>
        <el-tooltip effect="light" content="保存" placement="bottom">
          <el-icon v-if="isSaving" class="loading-icon is-loading">
            <Loading />
          </el-icon>
          <svg-icon
            v-else
            icon-class="op-save"
            :class-name="`upload-icon ${
              !hasWidgets || isPublished ? 'disabled' : ''
            }`"
            @click="onSave"
        /></el-tooltip>

        <el-tooltip
          effect="light"
          content="发布"
          placement="bottom"
          v-if="isFormMode"
        >
          <el-icon v-if="isPublishing" class="loading-icon is-loading">
            <Loading />
          </el-icon>
          <svg-icon
            v-else
            icon-class="op-upload"
            :class-name="`upload-icon ${
              !hasWidgets || isPublished ? 'disabled' : ''
            }`"
            @click="publishForm"
        /></el-tooltip>
      </template>

      <!-- 调整设置面板组件尺寸 -->
      <!-- <i class="divider"></i> -->
      <!-- <el-select v-model="settingSize" @change="notifySettingSizeChange">
        <el-option
          v-for="size in settingSizes"
          :key="size"
          :label="size"
          :value="size"
        />
      </el-select> -->
    </div>

    <preview-dialog
      :visible="previewDialogVisible"
      :designer="designer"
      :globalDsv="globalDsv"
      @close="hidePreviewDialog"
    />

    <import-dialog
      :visible="importDialogVisible"
      :designer="designer"
      :globalDsv="globalDsv"
      @close="hideImportDialog"
    />

    <export-dialog
      :visible="exportDialogVisible"
      :designer="designer"
      :globalDsv="globalDsv"
      @close="hideExportDialog"
    />

    <code-dialog
      :visible="codeDialogVisible"
      :designer="designer"
      :globalDsv="globalDsv"
      @close="hideCodeDialog"
    />
  </el-header>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import axios from '@/api/request'
import usePreview from '@/hooks/usePreview'
import useImport from '@/hooks/useImport'
import useExport from '@/hooks/useExport'
import useCode from '@/hooks/useCode'
import useMsg from '@/hooks/useMsg'
import SvgIcon from '@/components/svg-icon/index.vue'
import PreviewDialog from './components/preview-dialog.vue'
import ImportDialog from './components/import-dialog.vue'
import ExportDialog from './components/export-dialog.vue'
import CodeDialog from './components/code-dialog.vue'
import { parseParam } from '@/utils/util'
import { getForm, saveForm, getTemplate, saveTemplate } from '@/api/template'

const { showMsg, showConfirm } = useMsg()

const emit = defineEmits(['sizeChange'])
const props = defineProps({
  designer: {
    type: Object,
    default: () => ({}),
  },
  globalDsv: {
    type: Object,
    default: () => ({}),
  },
})

// const settingSize = ref(localStorage.getItem('v_form_settingSize') || 'default')
// const settingSizes = ref(['default', 'large', 'small'])
// const formSize = ref(props.designer.pcFormWidth)
// function notifySettingSizeChange(size) {
//   emit('sizeChange', size)
// }

const { previewDialogVisible, showPreviewDialog, hidePreviewDialog } =
  usePreview()

const { importDialogVisible, showImportDialog, hideImportDialog } = useImport(
  props.designer
)

const {
  exportDialogVisible,
  showExportDialog,
  hideExportDialog,
  generateJson,
} = useExport(props.designer)

const { codeDialogVisible, showCodeDialog, hideCodeDialog } = useCode(
  props.designer
)

const undoDisabled = computed(() =>
  props.designer && props.designer.undoEnabled
    ? !props.designer.undoEnabled()
    : false
)
const redoDisabled = computed(() =>
  props.designer && props.designer.redoEnabled
    ? !props.designer.redoEnabled()
    : false
)


function undo() {
  props.designer.undoHistoryStep()
}

function redo() {
  props.designer.redoHistoryStep()
}

function onPCSizeChange(formSize) {
  if (typeof formSize === 'number') {
    props.designer.setFormCustomize4PC(false)
    props.designer.changeFormWidth4PC(formSize)
  } else {
    props.designer.setFormCustomize4PC(true)
  }
}
function onPhoneChange(phoneIndex) {
  props.designer.selectPhone(phoneIndex)
}

function clearFormWidget() {
  props.designer && props.designer.clearDesigner()
}

// 页面是否已渲染完成，
// 待页面渲染完后再去加载vrender，否则render会获取不到designer.widgetList
const designerMounted = ref(false)
// render form ref, 其getFormData()方法貌似有bug，当表单模板实时更新时，该方法得到的数据不是实时的，是上一次的
const renderRef = ref(null)

// 是否正在持久化
const isSaving = ref(false)
// 是否存在未持久化的变更
const hasUnsavedChange = ref(false)

// 发布
const isPublishing = ref(false)
const isPublished = ref(false)
const formId = ref('')
const templateId = ref('')
const templateInfo = ref({})
const formInfo = ref({})

const hasId = computed(() => !!formId.value || !!templateId.value)
const isFormMode = computed(() => !!formId.value)
const hasWidgets = computed(() => props.designer.widgetList.length > 0)
const formJson = computed(() => {
  return {
    widgetList: props.designer.widgetList,
    formConfig: props.designer.formConfig,
  }
})

watch(() => props.designer.widgetList, () => {
  hasUnsavedChange.value = true
}, { deep: true })

onMounted(() => {
  designerMounted.value = true
  formId.value = parseParam('formId')
  templateId.value = parseParam('templateId')

  if (formId.value) {
    loadForm()
    return
  }

  if (templateId.value) {
    loadTemplate()
  }
})

function loadForm() {
  getForm(formId.value)
    .then((res) => {
      // 当id匹配到表单时才解析并赋值
      if (res) {
        formInfo.value = res
        isPublished.value = res.status === '3' 

        if (!res.formJson) {
          formInfo.value.formJson = {
            formConfig: {
              formName: res.name,
              formDesc: res.description,
            },
          }
        } else if (typeof res.formJson === 'string') {
          formInfo.value.formJson = JSON.parse(res.formJson)
        }

        res.formJson && props.designer.loadFormJson(res.formJson)
      }
    })
    .catch(() => {})
}

function loadTemplate() {
  getTemplate(templateId.value)
    .then((res) => {
      // 当id匹配到模板时才解析并赋值
      if (res) {
        templateInfo.value = res
        const json = res.templateJson || {}

        if (!json.formConfig) {
          json.formConfig = {
            formName: res.name,
            formDesc: res.description,
          }
        }

        props.designer.loadFormJson(json)
      }
    })
    .catch(() => {})
}

async function onSave() {
  isFormMode.value ? persistForm() : persistTempalte()
}

async function persistTempalte() {
  if (isSaving.value || !hasWidgets.value) {
    return
  }

  isSaving.value = true

  const { widgetList, formConfig } = props.designer
  const data = {
    ...templateInfo.value,
    name: formConfig.formName,
    description: formConfig.formDesc,
    templateJson: {
      widgetList,
      formConfig,
    },
  }

  saveTemplate(data).then(() => {
    isSaving.value = false
    showMsg('模板保存成功~')
  })
}

async function persistForm() {
  if (!renderRef.value || !hasWidgets.value || isPublished.value || isSaving.value) {
    return
  }

  isSaving.value = true

  const { widgetList, formConfig } = props.designer
  const { formName, formDesc } = formConfig

  const data = {
    name: formName,
    description: formDesc,
    formJson: {
      widgetList,
      formConfig,
    },
    // 表单项的值与类型
    formWidgets: await renderRef.value.getFieldWidgets(),
  }

  if (formId.value) {
    data.id = formId.value
  }

  // 发送请求
  return saveForm(data)
    .then((res) => {
      formId.value = res
      showMsg('模板保存成功~')
      isSaving.value = false
      hasUnsavedChange.value = false
    })
    .catch((err) => {
      showMsg(err, 'error')
      isSaving.value = false
    })
}

function publishForm() {
  if (isPublished.value || !formId.value || !hasWidgets.value) {
    return
  }

  showConfirm({
    title: '提示',
    msg: '模板发布后不可再更改，是否确认发布？',
  })
    .then(async () => {
      if (hasUnsavedChange.value) {
        await persistForm()
      }

      isPublishing.value = true
      axios
        .post(`/design/publish?id=${formId.value}`)
        .then(() => {
          isPublishing.value = false
          isPublished.value = true
          openRender()
        })
        .catch((err) => {
          isPublishing.value = false
          showMsg(err, 'error')
        })
    })
    .catch(() => {})
}

// 打开渲染器，查看表单效果
function openRender() {
  window.open(`${import.meta.env.VITE_RENDER_URL}?formId=${formId.value}`)
}
</script>

<style lang="scss" scoped>
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 48px;
  min-width: 800px;
  background: #f0f0f0;
  border-bottom: 1px solid rgb(204, 204, 204);

  :deep(.el-input__inner) {
    height: 26px;
    line-height: 26px;
  }
  :deep(.el-input-number) {
    width: 100px;
    height: 28px;
    outline: none;
  }
  :deep(.el-input-number.is-controls-right .el-input-number__decrease) {
    bottom: 0;
    top: auto;
    height: 12px;
    font-size: 12px;
    line-height: 1;
  }
  :deep(.el-input-number.is-controls-right .el-input-number__increase) {
    top: 4px;
    bottom: auto;
    height: 12px;
    font-size: 12px;
    line-height: 1;
  }
  :deep(.el-input-number .el-icon) {
    position: relative;
    top: 3px;
  }

  .svg-icon {
    outline: none;
    &.disabled {
      color: rgba(48, 48, 48, 0.3) !important;
      cursor: default !important;
    }
  }

  .logo {
    width: 102px;
  }

  .left,
  .right,
  .middle {
    display: flex;
    align-items: center;
  }

  .left {
    width: 420px;

    .logo {
      margin-right: 16px;
      height: 18px;
      width: 82px;
    }

    .svg-icon {
      margin: 0;
      padding: 5px;
      cursor: pointer;
      color: rgba(48, 48, 48, 1);

      &.disabled {
        color: rgba(48, 48, 48, 0.3) !important;
      }
    }
    .undo {
      margin-right: 16px;
    }
  }

  .middle {
    flex: 1;
    justify-content: center;
    font-size: 12px;

    :deep(.el-select) {
      margin: 0 16px 0 8px;
      width: 180px;
      line-height: 26px;
    }

    :deep(.el-input-number__increase .el-icon) {
      position: relative;
      top: -1px;
    }
    :deep(.el-input-number__decrease .el-icon) {
      position: relative;
      top: 2px;
    }
    :deep(.svg-icon) {
      width: 1.4em;
      height: 1.4em;
      outline: none;
      cursor: pointer;
    }
    :deep(.svg-icon.active) {
      color: var(--el-color-primary);
      cursor: default;
    }
  }

  .right {
    width: 420px;
    justify-content: flex-end;

    .svg-icon {
      margin-left: 20px;
      cursor: pointer;

      &:first-of-type,
      &:nth-of-type(2) {
        margin-left: 0;
      }
    }
    .delete-icon {
      color: #e34d59;
    }
    .upload-icon,
    .loading-icon {
      color: var(--el-color-primary);
    }

    .loading-icon {
      margin-left: 20px;
      margin-right: 0.35em;
      svg {
        width: 1.1em;
        height: 1.1em;
      }
    }

    :deep(.el-select) {
      width: 100px;
      height: 28px;
      line-height: 28px;
    }
  }

  // 分隔线
  .divider {
    margin: 0 24px;
    width: 1px;
    height: 25px;
    background-color: #ccc;
  }
}
</style>
