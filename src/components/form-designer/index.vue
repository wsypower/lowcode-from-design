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
        <el-main
          class="form-widget-main"
          :style="designer.isH5Layout ? 'overflow: auto' : ''"
        >
          <v-form-widget
            :designer="designer"
            :form-config="designer.formConfig"
            :global-dsv="globalDsv"
            ref="formRef"
          >
          </v-form-widget>
        </el-main>
      </el-container>

      <el-aside style="max-width: 330px; display: flex; flex-direction: column">
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
import TopHeader from './top-header/index.vue'
import WidgetPanel from './widget-panel/index.vue'
import SettingPanel from './setting-panel/index.vue'
import RulerBar from './ruler-bar/index.vue'
import VFormWidget from './form-widget/index.vue'
import { createDesigner } from '@/components/form-designer/designer'
import {
  addWindowResizeHandler,
  deepClone,
  getQueryParam,
  getAllContainerWidgets,
  getAllFieldWidgets,
  traverseAllWidgets,
} from '@/utils/util'
import { MOCK_CASE_URL } from '@/utils/config'
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
          eventCollapse: true, //是否显示组件事件属性折叠面板
          widgetNameReadonly: false, //禁止修改组件名称

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
      curLangName: '',
      curLocale: '',

      vsCodeFlag: false,
      caseName: '',

      docUrl: 'https://www.vform666.com/document3.html',
      gitUrl: 'https://github.com/vform666/variant-form3-vite',
      chatUrl: 'https://www.vform666.com/chat-group.html',
      subScribeUrl: 'https://www.vform666.com/subscribe.html',

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
.el-aside.side-panel {
  width: 260px;
  overflow-y: hidden;
}

.responsive-bar-wrap {
  padding: 0;
  box-sizing: border-box;
  height: 20px;
  flex: none;
  border-bottom: 1px solid #ccc;
  background-color: #d8d8d8;
}

.el-main.form-widget-main {
  padding: 32px 0;
  position: relative;
  overflow: hidden;
  // 不可设height: 100%;!! 此元素是flex布局中的元素, 其上面是固定高度的元素,下面是它, 想要它占据父元素剩余高度,且高度不变(不被子元素撑开高度),
  // 应设置 flex: auto; height: 0; 此二者的效果与 flex: 1不同, flex: 1 会被子元素撑开高度
  // height: 100%;
  flex: auto;
  height: 0;
}

.container-scroll-bar {
  :deep(.el-scrollbar__wrap),
  :deep(.el-scrollbar__view) {
    overflow-x: hidden;
  }
  padding: 0 24px;
}
</style>
