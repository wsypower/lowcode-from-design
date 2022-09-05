import { ref, computed } from 'vue'
import useMsg from './useMsg'
import { deepClone, copyToClipboard } from '@/utils/util'

const showMsg = useMsg()

export default function usePreview(designer) {
  const previewDialogVisible = ref(false)
  const previewFormRef = ref(null)
  const previewOptionData = ref({})
  const previewFormData = ref({})
  const previewFormDataJson = ref({})
  const previewFormDataJsonRaw = ref({})

  const previewFormJson = computed(() => {
    return {
      widgetList: deepClone(designer.widgetList),
      formConfig: deepClone(designer.formConfig),
    }
  })

  function showPreviewDialog() {
    previewDialogVisible.value = true
  }

  function clearFormWidget() {
    designer && designer.clearDesigner()
  }

  function getFormData() {
    previewFormRef.value
      .getFormData()
      .then((formData) => {
        previewFormDataJson.value = JSON.stringify(formData, null, '  ')
        previewFormDataJsonRaw.value = JSON.stringify(formData)
        previewDialogVisible.value = true
        console.log('formdata', formData)
      })
      .catch((error) => {
        showMsg(error, 'error')
      })
  }

  function copyFormDataJson(e) {
    copyToClipboard(
      formDataRawJson.value,
      e,
      showMsg,
      i18nt('designer.hint.copyJsonSuccess'),
      i18nt('designer.hint.copyJsonFail')
    )
  }

  return {
    previewDialogVisible,
    previewFormRef,
    previewOptionData,
    previewFormData,
    previewFormJson,
    showPreviewDialog,
    clearFormWidget,
    getFormData,
    copyFormDataJson,
  }
}
