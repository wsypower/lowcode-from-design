<template>
  <div ref="rulerWrapRef" class="rulers-wrap">
    <div
      v-for="(ruler, index) in rulerDatas"
      :key="index"
      :style="{ width: `${ruler.width}px`, left: `${ruler.left}px` }"
      class="ruler"
      @click="designer.changeformWidth(ruler.width)"
    >
      {{ ruler.width }}px
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  designer: {
    type: Object,
    default: null,
  },
})

const rulerWrapRef = ref(null)
const rulerWrapWidth = ref(0)
const rulerDatas = ref([])

onMounted(() => {
  generateRulerDatas()
  window.addEventListener('resize', generateRulerDatas, false)
})

onUnmounted(() => {
  window.removeEventListener('resize', generateRulerDatas, false)
})

function generateRulerDatas() {
  if (!rulerWrapRef.value) {
    return []
  }

  rulerWrapWidth.value = rulerWrapRef.value.offsetWidth

  const widthList = props.designer.commonScreenWidths
  let startIndex = -1

  for (let i = 0, len = widthList.length; i < len; i++) {
    const width = widthList[i]
    if (rulerWrapWidth.value > width) {
      startIndex = i
      break
    }
  }

  if (startIndex === -1) {
    return []
  }

  const displaySizes = widthList.slice(startIndex)
  props.designer.changeFormWidthList(displaySizes)

  rulerDatas.value = displaySizes.map((size, index) => {
    return {
      width: size,
      left:
        index === 0
          ? (rulerWrapWidth.value - size) / 2
          : (displaySizes[index - 1] - size) / 2,
    }
  })

  // left值累加
  rulerDatas.value = rulerDatas.value.map((item, index) => {
    if (index > 0) {
      item.left += rulerDatas.value[index - 1].left
    }
    return item
  })
}
</script>

<style lang="scss" scoped>
.rulers-wrap {
  position: relative;
  color: pink;
}
.ruler {
  position: absolute;
  z-index: 0;
  top: 0;
  height: 19px;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
  text-indent: -10000px;
  color: #303030;
  cursor: pointer;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 19px;
    background-color: #f0f0f0;
  }

  &::after {
    left: auto;
    right: 0;
  }

  &:hover {
    text-indent: 0;
    background-color: #ccc;
  }
}
</style>
