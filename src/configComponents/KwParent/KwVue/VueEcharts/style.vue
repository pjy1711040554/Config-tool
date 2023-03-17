<template>
  <xywh />
  <kw-from-item label="主题">
    <a-select v-model:value="selectObject.objectData.theme" size="small" :options="themeList" style="width: 100%" @change="valueChange('theme')" />
  </kw-from-item>
  <kw-from-item label="渲染">
    <a-select v-model:value="selectObject.objectData.renderType" size="small" :options="renderTypeList" style="width: 100%" @change="valueChange('renderType')" />
  </kw-from-item>
</template>

<script setup>
  import { inject } from 'vue';
  import Xywh from '@/configComponents/styleComponents/xywh.vue';

  import KwFromItem from '@/configComponents/otherComponents/KwFromItem.vue';

  const selectObject = inject('selectObject');
  const themeList = [
    {
      label: '明亮',
      value: 'light',
    },
    {
      label: '黑夜',
      value: 'dark',
    },
  ];
  const renderTypeList = [
    {
      label: 'canvas',
      value: 'canvas',
    },
    {
      label: 'svg',
      value: 'svg',
    },
  ];
  const valueChange = (e) => {
    if (!selectObject.object.set) return;
    selectObject.object.set(e, selectObject.objectData[e]);
    myCanvas.renderAll();
  };
</script>

<style scoped></style>
