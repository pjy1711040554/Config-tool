<template>
  <xywh />
  <shadow-style />
  <kw-from :formList="formList" />
</template>

<script setup>
  import Xywh from '@/configComponents/styleComponents/xywh.vue';
  import ShadowStyle from '@/configComponents/styleComponents/shadowStyle.vue';
  import KwFrom from '@/configComponents/otherComponents/KwFrom.vue';
  const formList = [
    { inputType: 'text', width: '100%', label: '温度测点名称', inputAttr: 'warmPointName' },
    { inputType: 'text', width: '100%', label: '湿度测点名称', inputAttr: 'wetPointName' },
  ];
</script>

<style scoped></style>
