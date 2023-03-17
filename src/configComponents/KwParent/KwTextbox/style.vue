<template>
  <xywh />
  <shadow-style />
  <a-divider orientation="left" plain style="margin: 12px 0">文本配置</a-divider>
  <kw-from :formList="formList" />
</template>

<script setup>
  import KwFrom from '../../otherComponents/KwFrom.vue';
  import Xywh from '../../styleComponents/xywh.vue';
  import ShadowStyle from '../../styleComponents/shadowStyle.vue';

  const formList = [
    {
      inputType: 'select',
      width: '100%',
      label: '字体',
      inputAttr: 'fontFamily',
      selectOption: [
        {
          label: 'monospace',
          value: 'monospace',
        },
        {
          label: 'fantasy',
          value: 'fantasy',
        },
        {
          label: '默认',
          value: '默认',
        },
      ],
    },
    {
      inputType: 'select',
      width: '100%',
      label: '对齐',
      inputAttr: 'textAlign',
      selectOption: [
        { label: 'left', value: 'left' },
        { label: 'center', value: 'center' },
        { label: 'right', value: 'right' },
      ],
    },
    { inputType: 'number', width: '50%', label: '大小', inputAttr: 'fontSize' },
    { inputType: 'number', width: '50%', label: '间距', inputAttr: 'charSpacing' },
    { inputType: 'color', width: '50%', label: '填充色', inputAttr: 'fill' },
    { inputType: 'color', width: '50%', label: '背景色', inputAttr: 'backgroundColor' },
    { inputType: 'color', width: '50%', label: '边框颜色', inputAttr: 'stroke' },
    { inputType: 'number', width: '50%', label: '粗细', inputAttr: 'strokeWidth' },
  ];
</script>

<style scoped></style>
