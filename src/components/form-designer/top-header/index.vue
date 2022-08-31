<template>
  <el-header class="top-header">
    <div class="left">
      <img src="../../../assets/lowcode-logo.png" class="logo" />
      <i class="divider"></i>
      <svg-icon icon-class="op-undo" class-name="undo disabled" />
      <svg-icon icon-class="op-redo" class-name="redo" />
    </div>
    <div class="middle">
      <span>尺寸:</span>
      <el-select v-model="formSize">
        <el-option
          v-for="size in formSizes"
          :key="size"
          :label="size"
          :value="size"
        />
      </el-select>

      <el-input v-model="formWidth" />
      <span class="icon-multi-wrap">
        <svg-icon icon-class="op-close" />
      </span>
      <el-input v-model="formHeight" />
    </div>
    <div class="right">
      <svg-icon icon-class="op-delete" />
      <i class="divider"></i>

      <svg-icon icon-class="op-preview" />
      <svg-icon icon-class="op-import" />
      <svg-icon icon-class="op-export" />
      <svg-icon icon-class="op-code" />
      <i class="divider"></i>

      <el-select
        class="setting-sizes-drop"
        v-model="settingSize"
        @change="notifySettingSizeChange"
      >
        <el-option
          v-for="size in settingSizes"
          :key="size"
          :label="size"
          :value="size"
        />
      </el-select>
    </div>
  </el-header>
</template>

<script setup>
import { ref } from 'vue'
import SvgIcon from '@/components/svg-icon/index'

const emit = defineEmits(['sizeChange'])
const props = defineProps({
  designer: {
    type: Object,
    default: null,
  },
  globalDsv: {
    type: Object,
    default: null,
  },
})

const formWidth = ref(834)
const formHeight = ref(1194)
const formSize = ref('自适应')
const formSizes = ref([
  '自适应',
  '800 x 1200',
  '980 x 1360',
  '1024 x 1580',
  '1208 x 1800',
  '1580 x 1960',
])

const settingSize = ref('default')
const settingSizes = ref(['default', 'large', 'small'])

function notifySettingSizeChange(size) {
  emit('sizeChange', size)
}
</script>

<style lang="scss" scoped>
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px !important;
  min-width: 800px;
  background: #f0f0f0;
  border-bottom: 1px solid rgb(204, 204, 204);

  .left,
  .right,
  .middle {
    display: flex;
    align-items: center;
  }

  .left {
    width: 280px;

    .logo {
      margin-right: 16px;
      height: 18px;
      width: 82px;
    }

    .svg-icon {
      margin: 0;
      padding: 5px;
      cursor: pointer;
      color: rgba(48, 48, 48, 1);

      &.disabled {
        color: rgba(48, 48, 48, 0.3);
      }
    }
    .undo {
      margin-right: 20px;
    }
  }

  .middle {
    flex: 1;
    justify-content: center;
    font-size: 12px;

    .el-select {
      margin: 0 16px 0 8px;
      width: 110px;

      .el-input__wrapper {
        height: 28px;
        background-color: #f0f0f0;
      }
    }

    .el-input {
      width: 54px;
      height: 28px;
      border-radius: 6px;
    }

    .icon-multi-wrap {
      width: 25px;
      display: flex;
      align-items: center;
      justify-content: center;

      .svg-icon {
        width: 18px;
        height: 18px;
      }
    }
  }

  .right {
    width: 360px;
    justify-content: flex-end;

    .svg-icon {
      margin-left: 24px;
      cursor: pointer;

      &:first-of-type,
      &:nth-of-type(2) {
        margin-left: 0;
      }
    }

    .setting-sizes-drop {
      width: 100px;
      height: 28px;
      overflow: hidden;
    }
  }

  // 分隔线
  .divider {
    margin: 0 24px;
    width: 1px;
    height: 25px;
    background-color: #ccc;
  }
}
</style>
