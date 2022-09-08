import Clipboard from 'clipboard'
import useMsg from '@/hooks/useMsg'

const { showMsg } = useMsg()

export default function useClipboard() {
  function copyToClipboard(
    content,
    clickEvent,
    successMsg = '',
    errorMsg = ''
  ) {
    const clipboard = new Clipboard(clickEvent.target, {
      text: () => content,
    })

    clipboard.on('success', () => {
      showMsg('复制JSON成功')
      clipboard.destroy()
    })

    clipboard.on('error', () => {
      showMsg('复制JSON失败', 'error')
      clipboard.destroy()
    })

    clipboard.onClick(clickEvent)
  }

  return {
    copyToClipboard,
  }
}
