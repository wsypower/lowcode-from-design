import { ElMessage } from 'element-plus'

import { ElMessageBox } from 'element-plus'

function showConfirm({
  msg,
  title,
  type = 'warning',
  confirmButtonText = '确定',
  cancelButtonText = '取消',
}) {
  return ElMessageBox.confirm(msg, title, {
    confirmButtonText,
    cancelButtonText,
    // success / info / warning / error
    type,
  })
}

function showMsg(message, type = 'success') {
  ElMessage({
    message,
    type,
  })
}

export default function useMsg() {
  return {
    showMsg,
    showConfirm,
  }
}
