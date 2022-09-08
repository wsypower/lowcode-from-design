<template>
  <p></p>
  <img alt="alt" :src="props.imgSrc" data-fancybox="gallery" class="img" />
  <div class="tips">{{props.tipsText}}</div>
</template>

<script setup>
  const props = defineProps({
    imgSrc: {
      type: String
    },
    tipsText: {
      type: String,
      default: () => {
        return '点击图片可放大查看'
      }
    }
  })
</script>

<style lang="scss" scoped>
.img {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.tips {
  color: #999;
  display: inline-block;
  text-align: left;
  font-size: 12px;
}
</style>
