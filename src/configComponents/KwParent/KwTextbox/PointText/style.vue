<template>
  <xywh />
  <shadow-style />
  <a-divider orientation="left" plain style="margin: 12px 0">文本配置</a-divider>
  <kw-from :formList="formList" />
  <a-divider orientation="left" plain style="margin: 12px 0">测点</a-divider>
  <kw-from-item inputType="text" inputAttr="pointName" width="100%" label="测点名称" />
  <kw-from-item inputType="text" inputAttr="pointUnit" width="100%" label="测点单位" @change="change" />
</template>

<script setup>
  import KwFrom from '@/configComponents/otherComponents/KwFrom.vue';
  import KwFromItem from '@/configComponents/otherComponents/KwFromItem.vue';
  import Xywh from '@/configComponents/styleComponents/xywh.vue';
  import ShadowStyle from '@/configComponents/styleComponents/shadowStyle.vue';
  import { inject } from 'vue';

  const selectObject = inject('selectObject');

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
  const change = () => {
    selectObject.object.set('text', '0 ' + selectObject.object.pointUnit);
  };
</script>

<style scoped></style>
