<template>
  <div :style="position">
    <iframe class="iframe" scrolling="no" :src="src"></iframe>
  </div>
</template>

<script setup>
  /**
   *
   * */
  import { computed, onMounted } from 'vue';
  // 传入定位、元件object
  const props = defineProps({
    position: Object,
    node: Object,
  });
  const src = computed(() => {
    return props.node.url;
  });

  onMounted(() => {});
</script>

<style scoped>
  .iframe {
    width: 100%;
    height: 100%;
  }
</style>
