import { ElMessage } from 'element-plus'

export default function useMsg() {
  function showMsg(message, type = 'success') {
    ElMessage({
      message,
      type,
    })
  }

  return {
    showMsg,
  }
}
