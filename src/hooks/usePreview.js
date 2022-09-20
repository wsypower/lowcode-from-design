import useMsg from './useMsg'
import useClipboard from '@/hooks/useClipboard'
import useSaveAsFile from '@/hooks/useSaveAsFile'
import { deepClone, generateId } from '@/utils/util'

const { copyToClipboard } = useClipboard()
const { saveAsFile } = useSaveAsFile()
const { showMsg } = useMsg()

export default function usePreview(designer) {
  const previewDialogVisible = ref(false)
  const previewFormRef = ref(null)
  const previewFormJson = ref({})
  const formDataDialogVisible = ref(false)
  const formDataJson = ref(null)
  const formDataRawJson = ref(null)

  function generateFormJson() {
    previewFormJson.value = {
      widgetList: deepClone(designer.widgetList),
      formConfig: deepClone(designer.formConfig),
    }
  }

  function showPreviewDialog() {
    previewDialogVisible.value = true
  }
  function hidePreviewDialog() {
    previewDialogVisible.value = false
  }

  function showDataDialog() {
    formDataDialogVisible.value = true
  }
  function hideDataDialog() {
    formDataDialogVisible.value = false
  }

  function resetForm() {
    previewFormRef.value.resetForm()
  }

  function getFormData() {
    previewFormRef.value
      .getFormData()
      .then((formData) => {
        formDataJson.value = JSON.stringify(formData, null, '  ')
        formDataRawJson.value = JSON.stringify(formData)
        showDataDialog()
      })
      .catch((error) => {
        showMsg(error, 'error')
      })
  }

  function copyFormData(e) {
    copyToClipboard(formDataRawJson.value, e)
  }

  function saveFormData() {
    saveAsFile(`formData${generateId()}.json`, formDataJson.value)
  }

  return {
    previewDialogVisible,
    previewFormRef,
    previewFormJson,
    formDataDialogVisible,
    formDataJson,
    formDataRawJson,
    showPreviewDialog,
    hidePreviewDialog,
    showDataDialog,
    hideDataDialog,
    generateFormJson,
    resetForm,
    getFormData,
    copyFormData,
    saveFormData,
  }
}
