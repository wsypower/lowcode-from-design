import useMsg from './useMsg'

const { showMsg } = useMsg()

export default function useImport(designer) {
  const jsonTmpl = ref('')
  const importDialogVisible = ref(false)

  function showImportDialog() {
    importDialogVisible.value = true
  }

  function hideImportDialog() {
    importDialogVisible.value = false
  }

  function generateJsonTemplate() {
    if (!designer || !designer.getImportTemplate) {
      throw Error('designer 或 designer.getImportTemplate为空')
    }
    jsonTmpl.value = JSON.stringify(designer.getImportTemplate(), null, '  ')
  }

  function importJson() {
    try {
      let importObj = JSON.parse(jsonTmpl.value)

      if (!importObj || !importObj.formConfig) {
        throw new Error('无效的表单JSON格式')
      }

      let fJsonVer = importObj.formConfig.jsonVersion
      if (!fJsonVer || fJsonVer !== 3) {
        throw new Error('表单JSON版本号不匹配')
      }

      designer.loadFormJson(importObj)

      showMsg('导入JSON成功')

      designer.emitHistoryChange()
      designer.emitEvent('form-json-imported', [])
    } catch (ex) {
      showMsg(ex + '', 'error')
    }
  }

  return {
    jsonTmpl,
    importDialogVisible,
    showImportDialog,
    hideImportDialog,
    generateJsonTemplate,
    importJson,
  }
}
