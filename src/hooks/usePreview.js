import useMsg from './useMsg'
import useClipboard from '@/hooks/useClipboard'
import { deepClone } from '@/utils/util'

const { copyToClipboard } = useClipboard()
const { showMsg } = useMsg()

export default function usePreview(designer) {
  const previewDialogVisible = ref(false)
  const previewFormRef = ref(null)
  const previewFormJson = ref({})

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

  function resetForm() {
    previewFormRef.value.resetForm()
  }

  return {
    previewDialogVisible,
    previewFormRef,
    previewFormJson,
    showPreviewDialog,
    hidePreviewDialog,
    generateFormJson,
    resetForm,
  }
}
