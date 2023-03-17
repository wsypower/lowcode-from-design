<template>
  <el-form-item label-width="0">
    <el-divider class="custom-divider-margin-top">{{
      i18nt('designer.setting.optionsSetting')
    }}</el-divider>
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.labelKeyName')">
    <el-input v-model="optionModel.labelKey"></el-input>
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.valueKeyName')">
    <el-input v-model="optionModel.valueKey"></el-input>
  </el-form-item>
  <el-form-item
    v-if="hasConfig('childrenKey')"
    :label="i18nt('designer.setting.childrenKeyName')"
  >
    <el-input v-model="optionModel.childrenKey"></el-input>
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.dsEnabled')">
    <el-switch v-model="optionModel.dsEnabled"></el-switch>
  </el-form-item>
  <el-form-item
    v-if="!!optionModel.dsEnabled"
    :label="i18nt('designer.setting.dsName')"
  >
    <el-select
      v-model="optionModel.dsName"
      filterable
      clearable
      @change="(dsName) => onDsNameChange(dsName)"
    >
      <el-option
        v-for="(item, idx) in dataSourceList"
        :key="idx"
        :title="item.description"
        :label="item.uniqueName"
        :value="item.uniqueName"
      ></el-option>
    </el-select>
  </el-form-item>
  <el-form-item v-if="!optionModel.dsEnabled" label-width="0">
    <option-items-setting
      :designer="designer"
      :selected-widget="selectedWidget"
    ></option-items-setting>
  </el-form-item>
</template>

<script>
import i18n from '@/utils/i18n'
import OptionItemsSetting from '@/components/form-designer/setting-panel/option-items-setting'
import propertyMixin from '@/components/form-designer/setting-panel/property-editor/propertyMixin'
import {
  getDSByName,
  runDataSourceRequest,
  translateOptionItems,
} from '@/utils/util'
import { ElMessage } from 'element-plus'

export default {
  name: 'optionItems-editor',
  mixins: [i18n, propertyMixin],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  components: {
    OptionItemsSetting,
  },

  data() {
    return {
      testaaa: 1233,
    }
  },

  computed: {
    dataSourceList() {
      if (!this.designer.formConfig || !this.designer.formConfig.dataSources) {
        return []
      } else {
        return this.designer.formConfig.dataSources
      }
    },
  },

  methods: {
    // 当dsName（数据源名称）更改时，应同步更新该组件的optionsItems为所选数据源的数据
    async onDsNameChange(dsName) {
      // 清空原有选项
      this.optionModel.optionItems.splice(
        0,
        this.optionModel.optionItems.length
      )

      let curDS = getDSByName(this.designer.formConfig, dsName)
      if (curDS) {
        let localDsv = {
          widgetName: this.optionModel.name,
        }
        let dsResult = null
        try {
          dsResult = await runDataSourceRequest(
            // 为了拿到ds url
            curDS,
            localDsv,
            null,
            false,
            ElMessage
          )
          this.loadOptions(dsResult)
        } catch (err) {
          ElMessage.error(err.message)
        }
      }
    },

    loadOptions(options) {
      this.optionModel.optionItems = translateOptionItems(
        options,
        this.selectedWidget.type,
        this.optionModel.labelKey || 'label',
        this.optionModel.valueKey || 'value'
      )
    },
  },
}
</script>

<style scoped></style>
