<template>
  <p-style />
  <a-divider orientation="left" plain style="margin: 12px 0">文本配置</a-divider>
  <kw-from-item inputType="text" inputAttr="text" width="100%" label="文本" @change="change" />
</template>

<script setup>
  import PStyle from '../style.vue';
  import KwFromItem from '@/configComponents/otherComponents/KwFromItem.vue';
  import { inject } from 'vue';

  const selectObject = inject('selectObject');
  const change = () => {
    selectObject.object.updateTextWidth();
    selectObject.object.canvas.requestRenderAll();
  };
</script>

<style scoped lang="less"></style>
