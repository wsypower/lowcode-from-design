import { ElMessageBox } from 'element-plus'
import { saveAs } from 'file-saver'

export default function useSaveAsFile() {
  function saveAsFile(filename, fileContent) {
    return ElMessageBox.prompt('保存为文件', '文件名：', {
      closeOnClickModal: false,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入文件名',
      inputValue: filename,
    })
      .then(({ value }) => {
        if (!value) {
          value = defaultFileName
        }

        const fileBlob = new Blob([fileContent], {
          type: 'text/plain;charset=utf-8',
        })

        saveAs(fileBlob, value)
      })
      .catch(() => {})
  }

  return {
    saveAsFile,
  }
}
