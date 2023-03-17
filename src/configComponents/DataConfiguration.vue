<template>
  <component :is="currentComp"></component>
</template>

<script setup>
/**
 * 组态页面右侧数据配置文件入口
 * */
import { computed, inject } from "vue";
import initFabric from "./KwParent";

const selectObject = inject("selectObject");

const currentComp = computed(() => {
  return initFabric.data[selectObject.objectData.type];
});
</script>

<style scoped>

</style>
