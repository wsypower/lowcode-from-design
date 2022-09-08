<template>
  <el-scrollbar class="side-scroll-bar" :style="{ height: scrollerHeight }">
    <div>
      <el-tabs v-model="firstTab" class="tabs-wrap">
        <el-tab-pane name="componentLib">
          <template #label>
            <span
              ><svg-icon icon-class="widget-lib" />
              {{ i18nt('designer.componentLib') }}</span
            >
          </template>

          <el-collapse v-model="activeNames" class="widget-collapse">
            <el-collapse-item
              name="1"
              :title="i18nt('designer.containerTitle')"
            >
              <draggable
                tag="ul"
                :list="containers"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :clone="handleContainerWidgetClone"
                ghost-class="ghost"
                :sort="false"
                :move="checkContainerMove"
                @end="onContainerDragEnd"
              >
                <template #item="{ element: ctn }">
                  <li
                    class="container-widget-item"
                    :title="ctn.displayName"
                    @dblclick="addContainerByDbClick(ctn)"
                  >
                    <span
                      ><svg-icon
                        :icon-class="ctn.icon"
                        class-name="widget-icon"
                      />{{
                        i18n2t(
                          `designer.widgetLabel.${ctn.type}`,
                          `extension.widgetLabel.${ctn.type}`
                        )
                      }}</span
                    >
                  </li>
                </template>
              </draggable>
            </el-collapse-item>

            <el-collapse-item
              name="2"
              :title="i18nt('designer.basicFieldTitle')"
            >
              <draggable
                tag="ul"
                :list="basicFields"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :move="checkFieldMove"
                :clone="handleFieldWidgetClone"
                ghost-class="ghost"
                :sort="false"
              >
                <template #item="{ element: fld }">
                  <li
                    class="field-widget-item"
                    :title="fld.displayName"
                    @dblclick="addFieldByDbClick(fld)"
                  >
                    <span
                      ><svg-icon
                        :icon-class="fld.icon"
                        class-name="widget-icon"
                      />{{
                        i18n2t(
                          `designer.widgetLabel.${fld.type}`,
                          `extension.widgetLabel.${fld.type}`
                        )
                      }}</span
                    >
                  </li>
                </template>
              </draggable>
            </el-collapse-item>

            <el-collapse-item
              name="3"
              :title="i18nt('designer.advancedFieldTitle')"
            >
              <draggable
                tag="ul"
                :list="advancedFields"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :move="checkFieldMove"
                :clone="handleFieldWidgetClone"
                ghost-class="ghost"
                :sort="false"
              >
                <template #item="{ element: fld }">
                  <li
                    class="field-widget-item"
                    :title="fld.displayName"
                    @dblclick="addFieldByDbClick(fld)"
                  >
                    <span
                      ><svg-icon
                        :icon-class="fld.icon"
                        class-name="widget-icon"
                      />{{
                        i18n2t(
                          `designer.widgetLabel.${fld.type}`,
                          `extension.widgetLabel.${fld.type}`
                        )
                      }}</span
                    >
                  </li>
                </template>
              </draggable>
            </el-collapse-item>

            <el-collapse-item
              name="4"
              :title="i18nt('designer.customFieldTitle')"
            >
              <draggable
                tag="ul"
                :list="customFields"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :move="checkFieldMove"
                :clone="handleFieldWidgetClone"
                ghost-class="ghost"
                :sort="false"
              >
                <template #item="{ element: fld }">
                  <li
                    class="field-widget-item"
                    :title="fld.displayName"
                    @dblclick="addFieldByDbClick(fld)"
                  >
                    <span>
                      <svg-icon
                        :icon-class="fld.icon"
                        class-name="widget-icon"
                      />{{
                        i18n2t(
                          `designer.widgetLabel.${fld.type}`,
                          `extension.widgetLabel.${fld.type}`
                        )
                      }}</span
                    >
                  </li>
                </template>
              </draggable>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-scrollbar>
</template>

<script>
import SvgIcon from '@/components/svg-icon'
import {
  containers as CONS,
  basicFields as BFS,
  advancedFields as AFS,
  customFields as CFS,
} from './widgetsConfig'
import { addWindowResizeHandler, generateId } from '@/utils/util'
import i18n from '@/utils/i18n'
import axios from 'axios'

export default {
  name: 'FieldPanel',
  mixins: [i18n],
  components: {
    SvgIcon,
  },
  props: {
    designer: Object,
  },
  inject: ['getBannedWidgets', 'getDesignerConfig'],
  data() {
    return {
      designerConfig: this.getDesignerConfig(),

      firstTab: 'componentLib',

      scrollerHeight: 0,

      activeNames: ['1', '2', '3', '4'],

      containers: [],
      basicFields: [],
      advancedFields: [],
      customFields: [],
    }
  },
  computed: {
    //
  },
  created() {
    this.loadWidgets()
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 48 + 'px'
    addWindowResizeHandler(() => {
      this.$nextTick(() => {
        this.scrollerHeight = window.innerHeight - 48 + 'px'
      })
    })
  },
  methods: {
    isBanned(wName) {
      return this.getBannedWidgets().indexOf(wName) > -1
    },

    showFormTemplates() {
      if (this.designerConfig['formTemplates'] === undefined) {
        return true
      }

      return !!this.designerConfig['formTemplates']
    },

    loadWidgets() {
      this.containers = CONS.map((con) => {
        return {
          key: generateId(),
          ...con,
          displayName: this.i18n2t(
            `designer.widgetLabel.${con.type}`,
            `extension.widgetLabel.${con.type}`
          ),
        }
      }).filter((con) => {
        return !con.internal && !this.isBanned(con.type)
      })

      this.basicFields = BFS.map((fld) => {
        return {
          key: generateId(),
          ...fld,
          displayName: this.i18n2t(
            `designer.widgetLabel.${fld.type}`,
            `extension.widgetLabel.${fld.type}`
          ),
        }
      }).filter((fld) => {
        return !this.isBanned(fld.type)
      })

      this.advancedFields = AFS.map((fld) => {
        return {
          key: generateId(),
          ...fld,
          displayName: this.i18n2t(
            `designer.widgetLabel.${fld.type}`,
            `extension.widgetLabel.${fld.type}`
          ),
        }
      }).filter((fld) => {
        return !this.isBanned(fld.type)
      })

      this.customFields = CFS.map((fld) => {
        return {
          key: generateId(),
          ...fld,
          displayName: this.i18n2t(
            `designer.widgetLabel.${fld.type}`,
            `extension.widgetLabel.${fld.type}`
          ),
        }
      }).filter((fld) => {
        return !this.isBanned(fld.type)
      })
    },

    handleContainerWidgetClone(origin) {
      return this.designer.copyNewContainerWidget(origin)
    },

    handleFieldWidgetClone(origin) {
      return this.designer.copyNewFieldWidget(origin)
    },

    /* draggable组件的move钩子是在内部子组件被拖放到其他draggable组件时触发！！ */
    checkContainerMove(evt) {
      return this.designer.checkWidgetMove(evt)
    },

    /* draggable组件的move钩子是在内部子组件被拖放到其他draggable组件时触发！！ */
    checkFieldMove(evt) {
      return this.designer.checkFieldMove(evt)
    },

    onContainerDragEnd(evt) {
      //console.log('Drag end of container: ')
      //console.log(evt)
    },

    addContainerByDbClick(container) {
      this.designer.addContainerByDbClick(container)
    },

    addFieldByDbClick(widget) {
      this.designer.addFieldByDbClick(widget)
    },

    loadFormTemplate(jsonUrl) {
      this.$confirm(
        this.i18nt('designer.hint.loadFormTemplateHint'),
        this.i18nt('render.hint.prompt'),
        {
          confirmButtonText: this.i18nt('render.hint.confirm'),
          cancelButtonText: this.i18nt('render.hint.cancel'),
        }
      )
        .then(() => {
          axios
            .get(jsonUrl)
            .then((res) => {
              let modifiedFlag = false
              if (typeof res.data === 'string') {
                modifiedFlag = this.designer.loadFormJson(JSON.parse(res.data))
              } else if (res.data.constructor === Object) {
                modifiedFlag = this.designer.loadFormJson(res.data)
              }
              if (modifiedFlag) {
                this.designer.emitHistoryChange()
              }

              this.$message.success(
                this.i18nt('designer.hint.loadFormTemplateSuccess')
              )
            })
            .catch((error) => {
              this.$message.error(
                this.i18nt('designer.hint.loadFormTemplateFailed') + ':' + error
              )
            })
        })
        .catch((error) => {
          console.error(error)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.side-scroll-bar {
  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
    background-color: #f0f0f0;
  }
}

.tabs-wrap {
  padding-bottom: 20px;

  :deep(.el-tabs__header) {
    // 消除tab-header与tab-content之间的margin
    margin-bottom: 0;
    font-size: 12px;
    line-height: 1.5;
    // 为tab-headers设置背景色
    background: #dbdbdb;
  }

  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
    background-color: #ccc;
  }

  :deep(.el-tabs__nav) {
    padding: 0;
  }

  :deep(.el-tabs__active-bar) {
    display: none;
  }

  :deep(.el-tabs__item) {
    padding: 0 16px !important;
    color: rgba(48, 48, 48, 0.5);
    background: #dbdbdb;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }

  :deep(.el-tabs__item.is-active) {
    color: rgba(48, 48, 48, 1);
    background: #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
  }
}

.el-collapse-item :deep(ul) > li {
  list-style: none;
}

ul {
  padding-inline-start: 0;
  margin-block-start: 0;
  margin-block-end: 0;
}

.widget-collapse {
  border-top-width: 0;
  font-size: 12px;
  color: rgba(48, 48, 48, 1);

  :deep(.el-collapse-item__header) {
    flex-direction: row-reverse;
    justify-content: flex-end;
    height: 40px;
    font-weight: 700;
    background-color: inherit;
  }

  :deep(.el-collapse-item__arrow) {
    margin: 0 8px 0 12px;
  }

  :deep(.el-icon svg) {
    width: 32px;
    height: 32px;
  }

  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
    background-color: inherit;
  }

  :deep(.el-collapse-item__content) {
    padding-bottom: 0;

    .container-widget-item,
    .field-widget-item {
      padding-left: 32px;
      height: 32px;
      line-height: 32px;
      margin-top: 4px;
      cursor: move;
    }

    .container-widget-item:last-of-type {
      margin-bottom: 4px;
    }

    .container-widget-item:hover,
    .field-widget-item:hover {
      background: #d8d8d8;
    }

    .widget-icon {
      margin-left: 0;
      margin-right: 8px;
      width: 18px;
      height: 18px;
    }

    .drag-handler {
      position: absolute;
      top: 0;
      left: 160px;
      background-color: #dddddd;
      border-radius: 5px;
      padding-right: 5px;
      font-size: 11px;
      color: #666666;
    }
  }
}
</style>
