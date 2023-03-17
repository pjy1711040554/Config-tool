<template>
  <xywh />
  <kw-from :formList="formList" />
</template>

<script setup>
  import Xywh from '@/configComponents/styleComponents/xywh.vue';
  import KwFrom from '@/configComponents/otherComponents/KwFrom.vue';

  const formList = [
    {
      inputType: 'textarea',
      label: 'url',
      inputAttr: 'url',
    },
    {
      inputType: 'radio',
      label: '控制器',
      inputAttr: 'videoControls',
      selectOption: [
        { label: '显示', value: true },
        { label: '隐藏', value: false },
      ],
    },
    {
      inputType: 'radio',
      label: '自动播放',
      inputAttr: 'autoplay',
      selectOption: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
  ];
</script>

<style scoped></style>
