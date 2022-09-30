import useClipboard from '@/hooks/useClipboard'
import useSaveAsFile from '@/hooks/useSaveAsFile'
import { generateId } from '@/utils/util'

const { copyToClipboard } = useClipboard()
const { saveAsFile } = useSaveAsFile()
const exportDialogVisible = ref(false)
const jsonContent = ref('')
const jsonRawContent = ref('')

export default function useExport(designer) {
  function showExportDialog() {
    exportDialogVisible.value = true
  }

  function hideExportDialog() {
    exportDialogVisible.value = false
  }

  function generateJson() {
    let widgetList = designer.widgetList
    let formConfig = designer.formConfig
    jsonContent.value = JSON.stringify({ widgetList, formConfig }, null, '  ')
    jsonRawContent.value = JSON.stringify({ widgetList, formConfig })
  }

  function copyJsonToClipboard(e) {
    copyToClipboard(jsonRawContent.value, e, '复制JSON成功', '复制JSON失败')
  }

  function saveFormJson() {
    saveAsFile(`vform${generateId()}.json`, jsonContent.value)
  }

  return {
    jsonContent,
    jsonRawContent,
    exportDialogVisible,
    showExportDialog,
    hideExportDialog,
    generateJson,
    copyJsonToClipboard,
    saveFormJson,
  }
}
