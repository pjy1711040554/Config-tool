<template>
  <Style />
  <a-divider orientation="left" plain style="margin: 12px 0">漏水绳配置</a-divider>
  <kw-from-item inputType="number" inputAttr="LeakWaterLength" width="100%" label="物理长度">m</kw-from-item>
  <kw-from-item inputType="number" inputAttr="LeakWaterPosi" width="100%" label="漏水位置">m</kw-from-item>
  <kw-from-item inputType="number" inputAttr="LeakWaterOffset" width="100%" label="偏移量">m</kw-from-item>
</template>

<script setup>
  import Style from '../style.vue';
  import KwFromItem from '../../../otherComponents/KwFromItem.vue';
</script>

<style scoped></style>
