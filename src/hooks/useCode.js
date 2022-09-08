import useClipboard from '@/hooks/useClipboard'
import useSaveAsFile from '@/hooks/useSaveAsFile'
import { generateCode as genFullCode } from '@/utils/code-generator'
import { generateId } from '@/utils/util'

const { copyToClipboard } = useClipboard()
const { saveAsFile } = useSaveAsFile()

export default function useImport(designer) {
  const codeDialogVisible = ref(false)
  const vueCode = ref('')
  const htmlCode = ref('')

  const formJson = computed(() => {
    return {
      widgetList: JSON.parse(JSON.stringify(designer.widgetList)),
      formConfig: JSON.parse(JSON.stringify(designer.formConfig)),
    }
  })

  function showCodeDialog() {
    codeDialogVisible.value = true
  }
  function hideCodeDialog() {
    codeDialogVisible.value = false
  }

  function generateCode() {
    vueCode.value = genFullCode(formJson.value)
    htmlCode.value = genFullCode(formJson.value, 'html')
  }

  function copyVueCode(e) {
    copyToClipboard(vueCode.value, e, '复制Vue代码成功', '复制Vue代码失败')
  }

  function copyHtmlCode(e) {
    copyToClipboard(htmlCode.value, e, '复制HTML代码成功', '复制HTML代码失败')
  }

  function saveVueCode() {
    saveAsFile(`vform${generateId()}.vue`, vueCode.value)
  }

  function saveHtmlCode() {
    saveAsFile(`vform${generateId()}.html`, htmlCode.value)
  }

  return {
    vueCode,
    htmlCode,
    codeDialogVisible,
    showCodeDialog,
    hideCodeDialog,
    generateCode,
    copyVueCode,
    copyHtmlCode,
    saveVueCode,
    saveHtmlCode,
  }
}
