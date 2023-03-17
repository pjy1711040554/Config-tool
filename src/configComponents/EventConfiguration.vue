<template>
  <kw-from-item label="跳转页面id">
    <a-input size="small" v-model:value="selectObject.objectData.clickJumpId" @change="valueChange('clickJumpId')" />
  </kw-from-item>
  <component :is="currentComp" />
</template>

<script setup>
  /**
   * 组态页面右侧样式配置文件入口
   * */
  import { computed, inject } from 'vue';
  import initFabric from './KwParent';
  import KwFromItem from '@/configComponents/otherComponents/KwFromItem.vue';

  const selectObject = inject('selectObject');

  const currentComp = computed(() => {
    return initFabric.event[selectObject.objectData.type];
  });
  const valueChange = (e) => {
    if (!selectObject.object.set) return;
    selectObject.object.set(e, selectObject.objectData[e]);
    myCanvas.renderAll();
  };
</script>

<style scoped></style>
