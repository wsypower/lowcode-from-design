<template>
  <el-config-provider :locale="elLocale">
    <VFormDesigner :global-dsv="globalDsv" />
  </el-config-provider>
</template>

<script>
import VFormDesigner from './components/form-designer/index.vue'

import zhCNLang from 'element-plus/lib/locale/lang/zh-cn'
import enUSLang from 'element-plus/lib/locale/lang/en'

export default {
  name: 'App',
  components: {
    VFormDesigner,
  },
  data() {
    return {
      // 页面中间表单区的json 及 该表单的数据
      formJson: {
        widgetList: [],
        formConfig: {
          modelName: 'formData',
          refName: 'vForm',
          rulesName: 'rules',
          labelWidth: 80,
          labelPosition: 'left',
          labelAlign: 'label-left-align',
          layoutType: 'PC',
          size: '',
          cssCode: '',
          customClass: '',
          functions: '',
          onFormCreated: '',
          onFormMounted: '',
          onFormDataChange: '',
          onFormValidate: '',
        },
      },
      formData: {},

      // 设置数据
      optionData: {},

      //全局数据源变量
      globalDsv: {
        testApiHost: 'http://www.test.com/api',
      },

      elLocaleMap: {
        'zh-CN': zhCNLang,
        'en-US': enUSLang,
      },
    }
  },
  computed: {
    elLocale() {
      let curLocale = localStorage.getItem('v_form_locale') || 'zh-CN'
      return this.elLocaleMap[curLocale]
    },
  },
}
</script>

<style lang="scss">
// 隐藏代码编辑器中的分隔线
.ace-sqlserver .ace_print-margin {
  display: none !important;
}
</style>
