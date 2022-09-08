import useMsg from './useMsg'
import useClipboard from '@/hooks/useClipboard'
import { deepClone } from '@/utils/util'

const { copyToClipboard } = useClipboard()
const { showMsg } = useMsg()

export default function usePreview(designer) {
  const previewDialogVisible = ref(false)
  const previewFormRef = ref(null)
  const previewOptionData = ref({})
  const previewFormDataJson = ref({})
  const previewFormDataJsonRaw = ref({})

  const previewFormData = computed(async () => {
    if (!previewFormRef.value) {
      return {}
    }
    return await previewFormRef.value.getFormData()
  })

  const previewFormJson = computed(() => {
    return {
      widgetList: deepClone(designer.widgetList),
      formConfig: deepClone(designer.formConfig),
    }
  })

  function showPreviewDialog() {
    previewDialogVisible.value = true
  }

  function hidePreviewDialog() {
    previewDialogVisible.value = false
  }

  function getFormData() {
    previewFormRef.value
      .getFormData()
      .then((formData) => {
        previewFormDataJson.value = JSON.stringify(formData, null, '  ')
        previewFormDataJsonRaw.value = JSON.stringify(formData)
        previewDialogVisible.value = true
      })
      .catch((error) => {
        showMsg(error, 'error')
      })
  }

  function resetForm() {
    previewFormRef.value.resetForm()
  }

  function disableForm() {
    previewFormRef.value.disableForm()
  }

  function enableForm() {
    previewFormRef.value.enableForm()
  }

  function copyFormDataJson(e) {
    copyToClipboard(formDataRawJson.value, e, '复制JSON成功', '复制JSON失败')
  }

  return {
    previewDialogVisible,
    previewFormRef,
    previewOptionData,
    previewFormData,
    previewFormJson,
    showPreviewDialog,
    hidePreviewDialog,
    getFormData,
    resetForm,
    disableForm,
    enableForm,
    copyFormDataJson,
  }
}
