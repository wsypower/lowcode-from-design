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
      <span>表单宽度:</span>
      <el-select v-model="formSize" @change="onFormSizeChange" can-edit>
        <el-option
          v-for="(size, index) in designer.formWidthList"
          :key="size"
          :label="index !== 0 ? `${size}px` : size"
          :value="size"
        />
      </el-select>
      <el-input-number
        v-model="designer.formWidth"
        :disabled="!designer.isFormWidthCustomize"
        controls-position="right"
      />
    </div>
    <div class="right">
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
      <el-tooltip effect="light" content="上传数据" placement="bottom">
        <svg-icon
          icon-class="op-upload"
          class-name="upload-icon"
          @click="uploadJson"
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
import usePreview from '@/hooks/usePreview'
import useImport from '@/hooks/useImport'
import useExport from '@/hooks/useExport'
import useCode from '@/hooks/useCode'
import SvgIcon from '@/components/svg-icon/index'
import PreviewDialog from './components/preview-dialog'
import ImportDialog from './components/import-dialog'
import ExportDialog from './components/export-dialog'
import CodeDialog from './components/code-dialog'

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

const formSize = ref(props.designer.formWidth)

const { previewDialogVisible, showPreviewDialog, hidePreviewDialog } =
  usePreview()

const { importDialogVisible, showImportDialog, hideImportDialog } = useImport(
  props.designer
)

const {
  exportDialogVisible,
  jsonRawContent,
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

watch(
  () => props.designer.formWidth,
  (val) => {
    formSize.value = val
  }
)

function undo() {
  props.designer.undoHistoryStep()
}

function redo() {
  props.designer.redoHistoryStep()
}

function notifySettingSizeChange(size) {
  emit('sizeChange', size)
}

function onFormSizeChange(formSize) {
  if (typeof formSize === 'number') {
    props.designer.changeFormCustomize(false)
    props.designer.changeformWidth(formSize)
  } else {
    props.designer.changeFormCustomize(true)
  }
}

function clearFormWidget() {
  props.designer && props.designer.clearDesigner()
}

function uploadJson() {
  generateJson()
  console.log(jsonRawContent.value)
  console.log('数据上传成功！')
}
</script>

<style lang="scss" scoped>
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
      width: 100px;
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

    .icon-multi-wrap {
      width: 25px;
      display: flex;
      align-items: center;
      justify-content: center;

      .svg-icon {
        width: 18px;
        height: 18px;
      }
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
