<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->

<template>
  <div class="main-container">
    <top-header
      ref="topRef"
      :designer="designer"
      :global-dsv="globalDsv"
      @sizeChange="onSettingSizeChange"
    />

    <el-container>
      <el-aside class="side-panel">
        <widget-panel :designer="designer" />
      </el-aside>

      <el-container class="center-layout-container">
        <el-header class="responsive-bar-wrap">
          <ruler-bar :designer="designer" />
        </el-header>
        <el-main class="form-widget-main">
          <el-scrollbar
            class="container-scroll-bar"
            :style="{ height: scrollerHeight }"
          >
            <v-form-widget
              :designer="designer"
              :form-config="designer.formConfig"
              :global-dsv="globalDsv"
              ref="formRef"
            >
            </v-form-widget>
          </el-scrollbar>
        </el-main>
      </el-container>

      <el-aside style="max-width: 330px;">
        <setting-panel
          :designer="designer"
          :selected-widget="designer.selectedWidget"
          :global-dsv="globalDsv"
          :form-config="designer.formConfig"
          @edit-event-handler="testEEH"
        />
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import TopHeader from './top-header/index'
import WidgetPanel from './widget-panel/index'
import SettingPanel from './setting-panel/index'
import RulerBar from './ruler-bar/index'
import VFormWidget from './form-widget/index'
import { createDesigner } from '@/components/form-designer/designer'
import {
  addWindowResizeHandler,
  deepClone,
  getQueryParam,
  getAllContainerWidgets,
  getAllFieldWidgets,
  traverseAllWidgets,
} from '@/utils/util'
import { MOCK_CASE_URL, VARIANT_FORM_VERSION } from '@/utils/config'
import i18n, { changeLocale } from '@/utils/i18n'
import axios from 'axios'
import SvgIcon from '@/components/svg-icon/index'

export default {
  name: 'VFormDesigner',
  componentName: 'VFormDesigner',
  mixins: [i18n],
  components: {
    SvgIcon,
    TopHeader,
    RulerBar,
    WidgetPanel,
    SettingPanel,
    VFormWidget,
  },
  props: {
    /* 后端字段列表API */
    fieldListApi: {
      type: Object,
      default: null,
    },

    /* 禁止显示的组件名称数组 */
    bannedWidgets: {
      type: Array,
      default: () => [],
    },

    /* 设计器配置参数 */
    designerConfig: {
      type: Object,
      default: () => {
        return {
          externalLink: true, //是否显示GitHub、文档等外部链接
          formTemplates: true, //是否显示表单模板
          eventCollapse: true, //是否显示组件事件属性折叠面板
          widgetNameReadonly: false, //禁止修改组件名称

          clearDesignerButton: true, //是否显示清空设计器按钮
          previewFormButton: true, //是否显示预览表单按钮
          importJsonButton: true, //是否显示导入JSON按钮
          exportJsonButton: true, //是否显示导出JSON器按钮
          exportCodeButton: true, //是否显示导出代码按钮
          generateSFCButton: true, //是否显示生成SFC按钮

          toolbarMaxWidth: 420, //设计器工具按钮栏最大宽度（单位像素）
          toolbarMinWidth: 300, //设计器工具按钮栏最小宽度（单位像素）

          productName: 'LowCode', //自定义表单设计器名称，对应“VForm Pro”（仅Pro）
          productTitle: '', //自定义表单设计器标题，对应“表单设计器”（仅Pro）

          presetCssCode: '', //设计器预设CSS样式代码
          languageName: 'zh-CN', //界面语言，默认显示中文

          resetFormJson: false, //是否在设计器初始化时将表单内容重置为空
        }
      },
    },

    /* 全局数据源变量 */
    globalDsv: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // vFormVersion: VARIANT_FORM_VERSION,
      curLangName: '',
      curLocale: '',

      vsCodeFlag: false,
      caseName: '',

      docUrl: 'https://www.vform666.com/document3.html',
      gitUrl: 'https://github.com/vform666/variant-form3-vite',
      chatUrl: 'https://www.vform666.com/chat-group.html',
      subScribeUrl: 'https://www.vform666.com/subscribe.html',

      scrollerHeight: 0,

      designer: createDesigner(this),

      fieldList: [],
    }
  },
  provide() {
    return {
      serverFieldList: this.fieldList,
      getDesignerConfig: () => this.designerConfig,
      getBannedWidgets: () => this.bannedWidgets,
    }
  },
  created() {
    this.vsCodeFlag = getQueryParam('vscode') == 1
    this.caseName = getQueryParam('case')
  },
  mounted() {
    this.initLocale()

    let logoHeaderHeight = 48
    this.scrollerHeight = window.innerHeight - logoHeaderHeight - 40 + 'px'
    addWindowResizeHandler(() => {
      this.$nextTick(() => {
        this.scrollerHeight = window.innerHeight - logoHeaderHeight - 40 + 'px'
      })
    })

    this.loadCase()
    this.loadFieldListFromServer()
  },
  methods: {
    onSettingSizeChange(size) {
      this.designer.changeSettingSize(size)
    },

    testEEH(eventName, eventParams) {
      console.log('test', eventName)
      console.log('test222222', eventParams)
    },

    openUrl(event, url) {
      if (!!this.vsCodeFlag) {
        const msgObj = {
          cmd: 'openUrl',
          data: {
            url,
          },
        }
        window.parent.postMessage(msgObj, '*')
      } else {
        let aDom = event.currentTarget
        aDom.href = url
        //window.open(url, '_blank') //直接打开新窗口，会被浏览器拦截
      }
    },

    loadCase() {
      if (!this.caseName) {
        return
      }

      axios
        .get(MOCK_CASE_URL + this.caseName + '.txt')
        .then((res) => {
          if (!!res.data.code) {
            this.$message.error(this.i18nt('designer.hint.sampleLoadedFail'))
            return
          }

          this.setFormJson(res.data)
          this.$message.success(this.i18nt('designer.hint.sampleLoadedSuccess'))
        })
        .catch((error) => {
          this.$message.error(
            this.i18nt('designer.hint.sampleLoadedFail') + ':' + error
          )
        })
    },

    initLocale() {
      this.curLocale = localStorage.getItem('v_form_locale')
      if (!!this.vsCodeFlag) {
        this.curLocale = this.curLocale || 'en-US'
      } else {
        this.curLocale = this.curLocale || 'zh-CN'
      }
      this.curLangName = this.i18nt('application.' + this.curLocale)
      changeLocale(this.curLocale)
    },

    loadFieldListFromServer() {
      if (!this.fieldListApi) {
        return
      }

      let headers = this.fieldListApi.headers || {}
      axios
        .get(this.fieldListApi.URL, { headers: headers })
        .then((res) => {
          let labelKey = this.fieldListApi.labelKey || 'label'
          let nameKey = this.fieldListApi.nameKey || 'name'

          this.fieldList.splice(0, this.fieldList.length) //清空已有
          res.data.forEach((fieldItem) => {
            this.fieldList.push({
              label: fieldItem[labelKey],
              name: fieldItem[nameKey],
            })
          })
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },

    setFormJson(formJson) {
      let modifiedFlag = false
      if (!!formJson) {
        if (typeof formJson === 'string') {
          modifiedFlag = this.designer.loadFormJson(JSON.parse(formJson))
        } else if (formJson.constructor === Object) {
          modifiedFlag = this.designer.loadFormJson(formJson)
        }

        if (modifiedFlag) {
          this.designer.emitHistoryChange()
        }
      }
    },

    getFormJson() {
      return {
        widgetList: deepClone(this.designer.widgetList),
        formConfig: deepClone(this.designer.formConfig),
      }
    },

    clearDesigner() {
      this.$refs.topRef.clearFormWidget()
    },

    /**
     * 刷新表单设计器
     */
    refreshDesigner() {
      //this.designer.loadFormJson( this.getFormJson() )  //只有第一次调用生效？？

      let fJson = this.getFormJson()
      this.designer.clearDesigner(true) //不触发历史记录变更
      this.designer.loadFormJson(fJson)
    },

    /**
     * 预览表单
     */
    previewForm() {
      this.$refs.topRef.previewForm()
    },

    /**
     * 导入表单JSON
     */
    importJson() {
      this.$refs.topRef.importJson()
    },

    /**
     * 导出表单JSON
     */
    exportJson() {
      this.$refs.topRef.exportJson()
    },

    /**
     * 导出Vue/HTML代码
     */
    exportCode() {
      this.$refs.topRef.exportCode()
    },

    /**
     * 生成SFC代码
     */
    generateSFC() {
      this.$refs.topRef.generateSFC()
    },

    /**
     * 获取所有字段组件
     * @returns {*[]}
     */
    getFieldWidgets(widgetList = null) {
      return !!widgetList
        ? getAllFieldWidgets(widgetList)
        : getAllFieldWidgets(this.designer.widgetList)
    },

    /**
     * 获取所有容器组件
     * @returns {*[]}
     */
    getContainerWidgets(widgetList = null) {
      return !!widgetList
        ? getAllContainerWidgets(widgetList)
        : getAllContainerWidgets(this.designer.widgetList)
    },

    /**
     * 升级表单json，以补充最新的组件属性
     * @param formJson
     */
    upgradeFormJson(formJson) {
      if (!formJson.widgetList || !formJson.formConfig) {
        this.$message.error('Invalid form json!')
        return
      }

      traverseAllWidgets(formJson.widgetList, (w) => {
        this.designer.upgradeWidgetConfig(w)
      })
      this.designer.upgradeFormConfig(formJson.formConfig)

      return formJson
    },

    getWidgetRef(widgetName, showError = false) {
      return this.$refs['formRef'].getWidgetRef(widgetName, showError)
    },

    getSelectedWidgetRef() {
      return this.$refs['formRef'].getSelectedWidgetRef()
    },

    /**
     * 添加数据源对象
     * @param dsObj
     */
    addDataSource(dsObj) {
      this.designer.formConfig.dataSources.push(dsObj)
    },

    //TODO: 增加更多方法！！
  },
}
</script>

<style lang="scss" scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #dedede;
  overflow-y: hidden;

  :deep(aside) {
    /* 防止aside样式被外部样式覆盖！！ */
    margin: 0;
    padding: 0;
    background: #f0f0f0;
  }
}

.center-layout-container {
  min-width: 680px;
  border-left: 1px solid rgb(204, 204, 204);
  border-right: 1px solid rgb(204, 204, 204);
}

.responsive-bar-wrap {
  padding: 0;
  height: 19px;
  border-bottom: 1px solid #ccc;
  background-color: #d8d8d8;
}

.el-aside.side-panel {
  width: 260px;
  overflow-y: hidden;
}

.el-main.form-widget-main {
  padding: 0;
  position: relative;
  overflow-x: hidden;
}

.container-scroll-bar {
  :deep(.el-scrollbar__wrap),
  :deep(.el-scrollbar__view) {
    overflow-x: hidden;
  }
  padding: 0 24px;
}
</style>
