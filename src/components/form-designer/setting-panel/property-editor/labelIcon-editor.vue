<template>
  <div>
    <el-form-item label-width="0">
      <el-divider class="custom-divider">{{
        i18nt('designer.setting.customLabelIcon')
      }}</el-divider>
    </el-form-item>
    <el-form-item :label="i18nt('designer.setting.labelIcon')">
      <el-input type="text" v-model="optionModel.labelIcon"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import i18n from '@/utils/i18n'

export default {
  name: 'labelIcon-editor',
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
}
</script>

<style scoped></style>
