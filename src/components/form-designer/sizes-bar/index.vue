<template>
  <div class="sizes-bar">hello</div>
</template>

<script setup>
const props = defineProps({
  designer: {
    type: Object,
    default: null,
  },
})
</script>

<style lang="scss" scoped>
.sizes-bar {
  color: rebeccapurple;
}
</style>
