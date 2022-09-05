<template>
  <el-header class="top-header">
    <div class="left">
      <img src="../../../assets/lowcode-logo.png" class="logo" />
      <i class="divider"></i>
      <svg-icon icon-class="op-undo" class-name="undo disabled" />
      <svg-icon icon-class="op-redo" class-name="redo" />
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
      <svg-icon icon-class="op-delete" @click="clearFormWidget" />
      <i class="divider"></i>

      <svg-icon icon-class="op-preview" @click="showPreviewDialog" />
      <svg-icon icon-class="op-import" @click="importJson" />
      <svg-icon icon-class="op-export" @click="exportJson" />
      <svg-icon icon-class="op-code" @click="exportCode" />
      <i class="divider"></i>

      <el-select v-model="settingSize" @change="notifySettingSizeChange">
        <el-option
          v-for="size in settingSizes"
          :key="size"
          :label="size"
          :value="size"
        />
      </el-select>
    </div>

    <div
      v-if="previewDialogVisible"
      class=""
      v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
    >
      <el-dialog
        :title="i18nt('designer.toolbar.preview')"
        v-model="previewDialogVisible"
        :show-close="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center
        :destroy-on-close="true"
        :append-to-body="true"
        custom-class="drag-dialog small-padding-dialog"
        width="75%"
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
            <el-button type="primary" @click="getFormData">{{
              i18nt('designer.hint.getFormData')
            }}</el-button>
            <el-button type="primary" @click="resetForm">{{
              i18nt('designer.hint.resetForm')
            }}</el-button>
            <el-button type="primary" @click="setFormDisabled">{{
              i18nt('designer.hint.disableForm')
            }}</el-button>
            <el-button type="primary" @click="setFormEnabled">{{
              i18nt('designer.hint.enableForm')
            }}</el-button>
            <el-button type="primary" plain @click="switchReadMode">{{
              i18nt('designer.hint.switchReadMode')
            }}</el-button>
            <el-button @click="previewDialogVisible = false">{{
              i18nt('designer.hint.closePreview')
            }}</el-button>
            <el-button v-if="false" @click="testSetFormJson"
              >setFormJson</el-button
            >
            <el-button v-if="false" @click="testSubFormHide"
              >Test SFH</el-button
            >
            <el-button v-if="false" @click="testSetFormData"
              >Test SFD</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>
  </el-header>
</template>

<script setup>
import { ref } from 'vue'
import useI18n from '@/hooks/useI18n'
import usePreview from '@/hooks/usePreview'
import SvgIcon from '@/components/svg-icon/index'

const { i18nt } = useI18n()

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

const {
  previewDialogVisible,
  previewFormRef,
  previewOptionData,
  previewFormData,
  previewFormJson,
  clearFormWidget,
  getFormData,
  showPreviewDialog,
} = usePreview(props.designer)

const settingSize = ref(localStorage.getItem('v_form_settingSize') || 'default')
const settingSizes = ref(['default', 'large', 'small'])

const formSize = ref(props.designer.formWidth)

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

  .left,
  .right,
  .middle {
    display: flex;
    align-items: center;
  }

  .left {
    width: 280px;

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
    width: 500px;
    justify-content: flex-end;

    .svg-icon {
      margin-left: 24px;
      cursor: pointer;

      &:first-of-type,
      &:nth-of-type(2) {
        margin-left: 0;
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
