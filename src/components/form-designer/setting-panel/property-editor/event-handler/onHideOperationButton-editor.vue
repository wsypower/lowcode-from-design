<template>
  <el-form-item label="onHideOperationButton" label-width="150px">
    <el-button
      type="info"
      icon="Edit"
      plain
      round
      @click="editEventHandler('onHideOperationButton', eventParams)"
    >
      {{ i18nt('designer.setting.addEventHandler') }}</el-button
    >
  </el-form-item>
</template>

<script>
import i18n from '@/utils/i18n'
import eventMixin from '@/components/form-designer/setting-panel/property-editor/event-handler/eventMixin'

export default {
  name: 'onHideOperationButton-editor',
  mixins: [i18n, eventMixin],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  data() {
    return {
      eventParams: ['buttonConfig', 'rowIndex', 'row'],
    }
  },
}
</script>

<style scoped></style>
