<template>
  <el-scrollbar class="side-scroll-bar" :style="{ height: scrollerHeight }">
    <div>
      <el-tabs v-model="currentTab" class="tabs-wrap">
        <el-tab-pane v-for="tab in tabs" :name="tab.name">
          <template #label>
            <span>{{ tab.label }}</span>
          </template>
          <el-collapse
            v-loading="!loaded"
            v-model="tab.currentCollapse"
            class="widget-collapse"
          >
            <template v-for="item in tab.widgetsList" :key="item.typeValue">
              <el-collapse-item
                v-if="item.list.length"
                :name="item.typeValue"
                :title="item.typeLabel"
              >
                <draggable
                  tag="ul"
                  :list="item.list"
                  item-key="key"
                  :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                  ghost-class="ghost"
                  :sort="false"
                  :move="item.isContainer ? checkContainerMove : checkFieldMove"
                  :clone="
                    item.isContainer
                      ? handleContainerWidgetClone
                      : handleFieldWidgetClone
                  "
                >
                  <template #item="{ element: elem }">
                    <li
                      class="container-widget-item"
                      :title="elem.label"
                      @dblclick="
                        item.isContainer
                          ? addContainerByDbClick(elem)
                          : addFieldByDbClick(elem)
                      "
                    >
                      <svg-icon
                        :icon-class="elem.icon"
                        class-name="widget-icon"
                      />
                      <span>{{ elem.options.label }}</span>
                    </li>
                  </template>
                </draggable>
              </el-collapse-item>
            </template>
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
  basicFieldsConfig,
} from './widgetsConfig'
import { customFields } from './customWidgetsConfig'
import { addWindowResizeHandler, generateId, deepClone } from '@/utils/util'
import i18n from '@/utils/i18n'

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
      loaded: false,
      designerConfig: this.getDesignerConfig(),

      tabs: [
        {
          // 基础组件
          name: 'basicWidgets',
          label: '基础组件',
          widgetsList: [],
          currentCollapse: [],
        },
      ],
      currentTab: 'basicWidgets',

      scrollerHeight: 0,

      // 自定义组件
      customFields: [],
    }
  },
  created() {
    this.initBasicWidgets()
    this.getCustomWidgets().then((res) => {
      this.tabs.unshift({
        name: 'customWidgets',
        label: '自定义组件',
        widgetsList: res,
        currentCollapse: res[0].typeValue,
      })
      this.currentTab = this.tabs[0].name
      this.loaded = true
    })
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
    initBasicWidgets() {
      const containers = CONS.map((con) => {
        return {
          key: generateId(),
          ...con,
        }
      }).filter((con) => {
        return !con.internal && !this.isBanned(con.type)
      })

      const basicFields = BFS.map((fld) => {
        return {
          key: generateId(),
          ...fld,
        }
      }).filter((fld) => {
        return !this.isBanned(fld.type)
      })

      const advancedFields = AFS.map((fld) => {
        return {
          key: generateId(),
          ...fld,
        }
      }).filter((fld) => {
        return !this.isBanned(fld.type)
      })

      this.tabs[0].widgetsList = [
        {
          typeValue: '1',
          typeLabel: '容器',
          list: containers,
          isContainer: true,
        },
        {
          typeValue: '2',
          typeLabel: '基础字段',
          list: basicFields,
        },
        {
          typeValue: '3',
          typeLabel: '高级字段',
          list: advancedFields,
        },
      ]
      this.tabs[0].currentCollapse = ['1']
    },

    getCustomWidgets() {
      return new Promise((resolve) => {
        const fields = customFields.map((category) => {
          const list = category.list.map((item) => {
            const { type } = item
            const fieldConfig = basicFieldsConfig[type]

            if (!fieldConfig) {
              return item
            }

            return {
              ...fieldConfig,
              ...item,
              options: {
                ...fieldConfig.options,
                ...item.options,
              },
            }
          })

          return {
            ...category,
            list,
          }
        })

        resolve(fields)
      })
    },

    isBanned(wName) {
      return this.getBannedWidgets().indexOf(wName) > -1
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

    addContainerByDbClick(container) {
      this.designer.addContainerByDbClick(container)
    },

    addFieldByDbClick(widget) {
      this.designer.addFieldByDbClick(widget)
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
      display: flex;
      align-items: center;
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
