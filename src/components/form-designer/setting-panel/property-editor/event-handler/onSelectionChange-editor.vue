<template>
  <el-form-item label="onSelectionChange" label-width="150px">
    <el-button
      type="info"
      icon="Edit"
      plain
      round
      @click="editEventHandler('onSelectionChange', eventParams)"
    >
      {{ i18nt('designer.setting.addEventHandler') }}</el-button
    >
  </el-form-item>
</template>

<script>
import i18n from '@/utils/i18n'
import eventMixin from '@/components/form-designer/setting-panel/property-editor/event-handler/eventMixin'

export default {
  name: 'onSelectionChange-editor',
  mixins: [i18n, eventMixin],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  data() {
    return {
      eventParams: ['selection', 'selectedIndices'],
    }
  },
}
</script>

<style scoped></style>
