import { createI18n } from '@/utils/smart-vue-i18n/index'

import enLocaleElement from 'element-plus/lib/locale/lang/en'
import zhLocaleElement from 'element-plus/lib/locale/lang/zh-cn'
//import locale from "element-plus/lib/locale"

import enLocale from '@/lang/en-US'
import zhLocale from '@/lang/zh-CN'
import enLocale_render from '@/lang/en-US_render'
import zhLocale_render from '@/lang/zh-CN_render'
import enLocale_extension from '@/lang/en-US_extension'
import zhLocale_extension from '@/lang/zh-CN_extension'

const langResources = {
  'en-US': {
    something: {
      //...
    },
    ...enLocaleElement,
    ...enLocale,
    ...enLocale_render,
    ...enLocale_extension,
  },

  'zh-CN': {
    something: {
      //...
    },
    ...zhLocaleElement,
    ...zhLocale,
    ...zhLocale_render,
    ...zhLocale_extension,
  },
}

const i18n = createI18n({
  locale: localStorage.getItem('v_form_locale') || 'zh-CN',
  messages: langResources,
})

export default function useI18n() {
  function translate(key) {
    return i18n.$st(key)
  }

  function changeLocale(langName) {
    i18n.setLang(langName)
    localStorage.setItem('v_form_locale', langName)
  }

  function i18nt(key) {
    return i18n.$st(key)
  }

  function i18n2t(key1, key2) {
    return i18n.$st2(key1, key2)
  }

  return {
    translate,
    changeLocale,
    i18nt,
    i18n2t,
  }
}
