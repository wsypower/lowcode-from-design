<template>
  <form-item-wrapper
    :designer="designer"
    :field="field"
    :rules="rules"
    :design-state="designState"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
  >
    <el-upload
      ref="fieldEditor"
      :disabled="field.options.disabled || isReadMode"
      v-model:file-list="fileList"
      :style="styleVariables"
      :class="[
        'dynamicPseudoAfter',
        { hideUploadDiv: uploadBtnHidden || isReadMode },
      ]"
      :action="field.options.uploadURL"
      :headers="uploadHeaders"
      :with-credentials="field.options.withCredentials"
      :limit="field.options.limit"
      :multiple="field.options.multipleSelect"
      :on-exceed="onFileExceed"
      :before-upload="onBeforeUpload"
      :on-success="onUploadSuccess"
      :on-error="onUploadError"
    >
      <template #default>
        <svg-icon icon-class="el-plus" /><i
          class="el-icon-plus avatar-uploader-icon"
        ></i>
      </template>
      <template #tip>
        <div class="el-upload__tip" v-if="field.options.uploadTip">
          {{ field.options.uploadTip }}
        </div>
      </template>
      <template #file="{ file }">
        <div class="upload-file-list">
          <span class="upload-file-name" :title="file.name">{{
            file.name
          }}</span>
          <span
            class="file-action"
            :title="i18nt('render.hint.removeFile')"
            v-if="!field.options.disabled && !isReadMode"
            @click="onFileRemove(file.name, file.url, file.uid)"
            ><svg-icon icon-class="el-delete"
          /></span>
        </div>
      </template>
    </el-upload>
  </form-item-wrapper>
</template>

<script>
import FormItemWrapper from './form-item-wrapper'
import emitter from '@/utils/emitter'
import i18n, { translate } from '@/utils/i18n'
import { deepClone } from '@/utils/util'
import fieldMixin from '@/components/form-designer/form-widget/field-widget/fieldMixin'
import SvgIcon from '@/components/svg-icon/index'

let selectFileText = "'" + translate('render.hint.selectFile') + "'"

export default {
  name: 'file-upload-widget',
  componentName: 'FieldWidget', //必须固定为FieldWidget，用于接收父级组件的broadcast事件
  mixins: [emitter, fieldMixin, i18n],
  props: {
    field: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,

    designState: {
      type: Boolean,
      default: false,
    },

    subFormRowIndex: {
      /* 子表单组件行索引，从0开始计数 */ type: Number,
      default: -1,
    },
    subFormColIndex: {
      /* 子表单组件列索引，从0开始计数 */ type: Number,
      default: -1,
    },
    subFormRowId: {
      /* 子表单组件行Id，唯一id且不可变 */ type: String,
      default: '',
    },
  },
  components: {
    SvgIcon,
    FormItemWrapper,
  },
  data() {
    return {
      oldFieldValue: null, //field组件change之前的值
      fieldModel: [],
      rules: [],

      uploadHeaders: {},
      fileList: [], //上传文件列表
      uploadBtnHidden: false,

      styleVariables: {
        '--select-file-action': selectFileText,
      },
    }
  },
  computed: {
    uploadBtnHidden() {
      return this.fileList.length >= this.field.options.limit
    },
  },

  created() {
    this.registerToRefList()
    this.initFieldModel()
    this.initEventHandler()
    this.buildFieldRules()

    this.handleOnCreated()
  },

  mounted() {
    this.handleOnMounted()
  },

  beforeUnmount() {
    this.unregisterFromRefList()
  },

  methods: {
    onFileExceed() {
      let uploadLimit = this.field.options.limit
      this.$message.warning(
        this.i18nt('render.hint.uploadExceed').replace(
          '${uploadLimit}',
          uploadLimit
        )
      )
    },

    onBeforeUpload(file) {
      let fileTypeCheckResult = false
      let extFileName = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (this.field.options && this.field.options.fileTypes) {
        let uploadFileTypes = this.field.options.fileTypes
        if (uploadFileTypes.length > 0) {
          fileTypeCheckResult = uploadFileTypes.some((ft) => {
            return extFileName.toLowerCase() === ft.toLowerCase()
          })
        }
      }
      if (!fileTypeCheckResult) {
        this.$message.error(
          this.i18nt('render.hint.unsupportedFileType') + extFileName
        )
        return false
      }

      let fileSizeCheckResult = false
      let uploadFileMaxSize = 5 //5MB
      if (this.field.options && this.field.options.fileMaxSize) {
        uploadFileMaxSize = this.field.options.fileMaxSize
      }
      fileSizeCheckResult = file.size / 1024 / 1024 <= uploadFileMaxSize
      if (!fileSizeCheckResult) {
        this.$message.error(
          this.i18nt('render.hint.fileSizeExceed') + uploadFileMaxSize + 'MB'
        )
        return false
      }

      return this.execCustomBeforeUploadFn(file)
    },

    execCustomBeforeUploadFn(file) {
      if (this.field.options.onBeforeUpload) {
        let fn = new Function('file', this.field.options.onBeforeUpload)
        let result = fn.call(this, file)
        if (typeof result === 'boolean') {
          return result
        }
      }
      return true
    },

    onUploadSuccess(res, file, fileList) {
      if (file.status === 'success') {
        let customResult = null
        if (this.field.options.onUploadSuccess) {
          const fn = new Function(
            'result',
            'file',
            'fileList',
            this.field.options.onUploadSuccess
          )
          customResult = fn.call(this, res, file, fileList)
        }

        const simpleFileList = fileList.map((file) => {
          const { name, response, url } = file
          const simpleFile = {
            name,
            // 新上传的文件的url在response字段里，已上传文件在url字段里
            // 必须先取response对象，因为新上传时 url 字段也有值，但是是本地的文件路径
            url: response?.data?.url || url,
          }
          return simpleFile
        })

        this.fileList = deepClone(simpleFileList)
        this.syncFileAdd(simpleFileList, customResult, res)
      }
    },

    syncFileAdd(fileList, customResult, defaultResult) {
      let oldValue = deepClone(this.fieldModel)

      if (customResult && customResult.name && customResult.url) {
        this.fieldModel.push({
          name: customResult.name,
          url: customResult.url,
        })
      } else if (defaultResult && defaultResult.name && defaultResult.url) {
        this.fieldModel.push({
          name: defaultResult.name,
          url: defaultResult.url,
        })
      } else {
        this.fieldModel = deepClone(fileList)
      }

      this.updateFormModel(this.fieldModel)
      this.emitFieldDataChange(this.fieldModel, oldValue)
    },

    onFileRemove(fileName, fileUrl, fileUid) {
      let foundIdx = -1
      let foundFile = null
      this.fileList.forEach((file, idx) => {
        if (
          file.name === fileName &&
          (file.url === fileUrl || (fileUid && file.uid === fileUid))
        ) {
          foundIdx = idx
          foundFile = file
        }
      })

      if (foundIdx >= 0) {
        this.fileList.splice(foundIdx, 1)
        this.syncFileRemove(foundIdx, this.fileList)

        if (this.field.options.onFileRemove) {
          const fn = new Function(
            'file',
            'fileList',
            this.field.options.onFileRemove
          )
          fn.call(this, foundFile, this.fileList)
        }
      }
    },

    syncFileRemove(deletedFileIdx, fileList) {
      let oldValue = deepClone(this.fieldModel)

      this.fieldModel.splice(deletedFileIdx, 1)
      this.updateFormModel(this.fieldModel)
      this.emitFieldDataChange(this.fieldModel, oldValue)
    },

    onUploadError(err, file, fileList) {
      if (this.field.options.onUploadError) {
        const fn = new Function(
          'error',
          'file',
          'fileList',
          this.field.options.onUploadError
        )
        fn.call(this, err, file, fileList)
      } else {
        this.$message({
          message: this.i18nt('render.hint.uploadError') + err,
          duration: 3000,
          type: 'error',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../../../styles/global.scss'; /* form-item-wrapper已引入，还需要重复引入吗？ */

.full-width-input {
  width: 100% !important;
}

.dynamicPseudoAfter :deep(.el-upload.el-upload--text) {
  color: $--color-primary;
  font-size: 12px;
  .el-icon-plus:after {
    content: var(--select-file-action);
  }
}

/* 隐藏最后的图片上传按钮 */
.hideUploadDiv {
  :deep(div.el-upload--picture-card) {
    display: none;
  }

  :deep(div.el-upload--text) {
    display: none;
  }

  :deep(div.el-upload__tip) {
    display: none;
  }
}

.upload-file-list {
  font-size: 12px;

  .file-action {
    color: $--color-primary;
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>
