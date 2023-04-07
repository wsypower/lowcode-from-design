<template>
  <div class="form-widget-container" :style="formWidgetStyle">
    <el-form
      class="widget-form"
      :label-position="labelPosition"
      :class="[customClass]"
      :size="size"
      :validate-on-rule-change="false"
    >
      <template v-if="designer.widgetList.length === 0">
        <div class="empty-content">
          <img src="./empty.png" alt="" />
          <p>请从左侧列表中选择一个组件，<br />然后用鼠标拖动放置于此处。</p>
        </div>
      </template>

      <div class="widget-form-inner">
        <draggable
          :list="designer.widgetList"
          item-key="id"
          v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 300 }"
          tag="transition-group"
          :component-data="{ name: 'fade' }"
          handle=".drag-handler"
          @end="onDragEnd"
          @add="onDragAdd"
          @update="onDragUpdate"
          :move="checkMove"
        >
          <template #item="{ element: widget, index }">
            <div class="transition-group-el">
              <template v-if="'container' === widget.category">
                <component
                  :is="getWidgetName(widget)"
                  :widget="widget"
                  :designer="designer"
                  :key="widget.id"
                  :parent-list="designer.widgetList"
                  :index-of-parent-list="index"
                  :parent-widget="null"
                ></component>
              </template>
              <template v-else>
                <component
                  :is="getWidgetName(widget)"
                  :field="widget"
                  :designer="designer"
                  :key="widget.id"
                  :parent-list="designer.widgetList"
                  :index-of-parent-list="index"
                  :parent-widget="null"
                  :design-state="true"
                ></component>
              </template>
            </div>
          </template>
        </draggable>
      </div>
    </el-form>
  </div>
</template>

<script>
import '@/components/form-designer/form-widget/container-widget/index'
import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
import i18n from '@/utils/i18n'
import { parseParam } from '@/utils/util'

export default {
  name: 'VFormWidget',
  componentName: 'VFormWidget',
  mixins: [i18n],
  components: {
    ...FieldComponents,
  },
  props: {
    designer: Object,
    formConfig: Object,
    optionData: {
      //prop传入的选项数据
      type: Object,
      default: () => ({}),
    },
    globalDsv: {
      type: Object,
      default: () => ({}),
    },
  },
  provide() {
    return {
      refList: this.widgetRefList,
      getFormConfig: () =>
        this.formConfig /* 解决provide传递formConfig属性的响应式更新问题！！ */,
      getGlobalDsv: () => this.globalDsv, // 全局数据源变量
      globalOptionData: this.optionData,
      getOptionData: () => this.optionData,
      getReadMode: () => false,
      globalModel: {
        formModel: this.formModel,
      },
      getSubFormFieldFlag: () => false,
      getSubFormName: () => '',
    }
  },
  inject: ['getDesignerConfig'],
  data() {
    return {
      formModel: {},
      widgetRefList: {},
    }
  },
  computed: {
    formWidgetStyle() {
      if (this.designer.isPCLayout) {
        return {
          width: this.designer.pcFormWidth + 'px',
        }
      }
      // H5
      return {
        width: this.designer.h5CurrentPhone.width + 'px',
        height: this.designer.h5CurrentPhone.height + 'px',
      }
    },

    labelPosition() {
      if (
        !!this.designer.formConfig &&
        !!this.designer.formConfig.labelPosition
      ) {
        return this.designer.formConfig.labelPosition
      }

      return 'left'
    },

    size() {
      if (!!this.designer.formConfig && !!this.designer.formConfig.size) {
        return this.designer.formConfig.size
      }

      return 'default'
    },

    customClass() {
      return this.designer.formConfig.customClass || ''
    },
  },

  created() {
    const formName = parseParam('formName')
    const formDesc = parseParam('formDesc')

    this.designer.initDesigner(
      formName,
      formDesc,
      !!this.getDesignerConfig().resetFormJson
    )
    this.designer.loadPresetCssCode(this.getDesignerConfig().presetCssCode)
  },
  mounted() {
    this.disableFirefoxDefaultDrop() /* 禁用Firefox默认拖拽搜索功能!! */
    this.designer.registerFormWidget(this)
  },
  methods: {
    getWidgetName(widget) {
      return widget.type + '-widget'
    },

    disableFirefoxDefaultDrop() {
      let isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') !== -1
      if (isFirefox) {
        document.body.ondrop = function (event) {
          event.stopPropagation()
          event.preventDefault()
        }
      }
    },

    onDragEnd(evt) {
      //console.log('drag end000', evt)
    },

    onDragAdd(evt) {
      const newIndex = evt.newIndex
      if (!!this.designer.widgetList[newIndex]) {
        this.designer.setSelected(this.designer.widgetList[newIndex])
      }

      this.designer.emitHistoryChange()
      this.designer.emitEvent('field-selected', null)
    },

    onDragUpdate() {
      /* 在VueDraggable内拖拽组件发生位置变化时会触发update，未发生组件位置变化不会触发！！ */
      this.designer.emitHistoryChange()
    },

    checkMove(evt) {
      return this.designer.checkWidgetMove(evt)
    },

    getFormData() {
      return this.formModel
    },

    getWidgetRef(widgetName, showError = false) {
      let foundRef = this.widgetRefList[widgetName]
      if (!foundRef && !!showError) {
        this.$message.error(
          this.i18nt('designer.hint.refNotFound') + widgetName
        )
      }
      return foundRef
    },

    getSelectedWidgetRef() {
      let wName = this.designer.selectedWidgetName
      return this.getWidgetRef(wName)
    },
  },
}
</script>

<style lang="scss" scoped>
.container-scroll-bar {
  :deep(.el-scrollbar__wrap),
  :deep(.el-scrollbar__view) {
    overflow-x: hidden;
  }
}

.form-widget-container {
  box-sizing: border-box;
  margin: 0 auto;
  height: 100%;
  background: #fff;
  border-radius: 3px;
  overflow: hidden;
  height: calc(100vh - 48px - 20px - 64px);

  * {
    box-sizing: border-box;
  }

  .el-form.widget-form {
    position: relative;

    height: 100%;
    overflow: auto;

    .empty-content {
      position: absolute;
      width: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        display: block;
        width: 300px;
        height: 234px;
        margin: 0 auto;
      }

      p {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        color: rgba(#303030, $alpha: 0.5);
        text-align: center;
      }
    }
  }

  .widget-form-inner {
    box-sizing: border-box;
    // 设置min-height: 100%虽然高度上显示正确，但会出现【容器中子元素未撑满高度时就出现滚动条的bug】
    // 设置固定值就不会出现这个问题。因此计算固定值
    // 最后的1px是calc计算的结果和父元素的实际高度有零点几的像素差值，所以多减1px来使其高度小于父元素的高度，避免滚动条
    // min-height: calc(100vh - 48px - 20px - 64px - 48px - 1px);
    // 取消calc, 此方案在H5布局下初始渲染时（即便表单为空）会出现滚动条
    // 改为设置其容器 widget-form-container的高度为calc，也能修复滚动条的问题，同时H5布局下也正常
    min-height: 100%;
    padding: 24px;
  }

  .el-form.widget-form :deep(.el-row) {
    padding: 2px;
    border: 1px dashed rgba(170, 170, 170, 0.75);
  }
}

.grid-cell {
  min-height: 30px;
  border-right: 1px dotted #cccccc;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
