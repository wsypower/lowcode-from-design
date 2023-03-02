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
          v-model="designer.pcFormWidth"
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
        v-if="designermounted"
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

      <i class="divider" style="margin-right: 0"></i>
      <el-tooltip effect="light" content="保存模板" placement="bottom">
        <svg-icon
          icon-class="op-save"
          class-name="upload-icon"
          @click="saveTemplate"
      /></el-tooltip>
      <el-tooltip effect="light" content="发布模板" placement="bottom">
        <svg-icon
          icon-class="op-upload"
          class-name="upload-icon"
          @click="publishTemplate"
      /></el-tooltip>

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
import axios from 'axios'
import usePreview from '@/hooks/usePreview'
import useImport from '@/hooks/useImport'
import useExport from '@/hooks/useExport'
import useCode from '@/hooks/useCode'
import SvgIcon from '@/components/svg-icon/index.vue'
import PreviewDialog from './components/preview-dialog.vue'
import ImportDialog from './components/import-dialog.vue'
import ExportDialog from './components/export-dialog.vue'
import CodeDialog from './components/code-dialog.vue'

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

const settingSize = ref(localStorage.getItem('v_form_settingSize') || 'default')
const settingSizes = ref(['default', 'large', 'small'])

const formSize = ref(props.designer.pcFormWidth)

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

// watch(
//   () => props.designer.pcFormWidth,
//   (val) => {
//     formSize.value = val
//   }
// )

function undo() {
  props.designer.undoHistoryStep()
}

function redo() {
  props.designer.redoHistoryStep()
}

/*************************** 中间部分 START *************************/
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

// function notifySettingSizeChange(size) {
//   emit('sizeChange', size)
// }

/*************************** 中间部分 END *************************/

function clearFormWidget() {
  props.designer && props.designer.clearDesigner()
}

// 表单模板id，保存后由后端返回，更新及上传时要携带
const templateId = ref(null)

/* ====================== 加载功能 start ====================== */
onMounted(() => {
  const query = window.location.search.substr(1)
  if (query) {
    templateId.value = query.substr(3)
    loadTemplate()
  }
})

function loadTemplate() {
  axios
    .get(
      `http://172.16.33.237:10240/lowcode-form/design/viewMeta?id=${templateId.value}`
    )
    .then((res) => {
      props.designer.loadFormJson(JSON.parse(res.data.data))
    })
}
/* ====================== 加载功能 end ====================== */

/* ======================上传功能start ====================== */
// 页面是否已渲染完成，
// 待页面渲染完后再去加载vrender，否则render会获取不到designer.widgetList
const designermounted = ref(false)
// render form ref, 其getFormData()方法貌似有bug，当表单模板实时更新时，该方法得到的数据不是实时的，是上一次的
const renderRef = ref(null)
// 表单json
const formJson = ref({})

onMounted(() => {
  genFormJson()
  designermounted.value = true
})

function genFormJson() {
  formJson.value = {
    widgetList: props.designer.widgetList,
    formConfig: props.designer.formConfig,
  }
}

watch(() => props.designer.widgetList, genFormJson, {
  deep: true,
})

async function saveTemplate() {
  if (!renderRef.value) {
    return
  }

  const { widgetList, formConfig } = props.designer
  const templateData = {
    formJson: {
      widgetList,
      formConfig,
    },
    // 表单项，用formFields更合适
    formWidgets: await renderRef.value.getFieldWidgets(),
  }
  if (templateId.value) {
    templateData.id = templateId.value
  }

  // 发送请求
  axios
    .post('http://172.16.33.237:10240/lowcode-form/design/draft', templateData)
    .then((res) => {
      console.log('响应', res.data)
      templateId.value = res.data.data
    })
}
/* ======================上传功能end ====================== */

/* ====================== 发布功能 start ====================== */
function publishTemplate() {
  console.log('publish')
}
/* ====================== 上传功能 end ====================== */
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
  }
  :deep(.el-input-number.is-controls-right .el-input-number__decrease) {
    height: 14px;
  }
  :deep(.el-input-number.is-controls-right .el-input-number__increase) {
    height: 14px;
  }
  :deep(.el-input-number .el-icon) {
    position: relative;
    top: 3px;
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
        color: rgba(48, 48, 48, 0.3);
      }
    }
    .undo {
      margin-right: 20px;
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
      margin-left: 24px;
      cursor: pointer;

      &:first-of-type,
      &:nth-of-type(2) {
        margin-left: 0;
      }
    }
    .delete-icon {
      color: #e34d59;
    }
    .upload-icon {
      color: var(--el-color-primary);
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
