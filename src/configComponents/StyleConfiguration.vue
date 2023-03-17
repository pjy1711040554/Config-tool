<template>
  <component :is="currentComp"></component>
</template>

<script setup>
/**
 * 组态页面右侧样式配置文件入口
 * */
import { computed, inject } from "vue";
import initFabric from "./KwParent";

const selectObject = inject("selectObject");
const currentComp = computed(() => {
  return initFabric.style[selectObject.objectData.type];
});
</script>

<style scoped>

</style>
