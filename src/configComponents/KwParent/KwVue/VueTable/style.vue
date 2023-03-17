<template>
  <xywh />
  <kw-from :formList="formList" />
</template>

<script setup>
  import Xywh from '@/configComponents/styleComponents/xywh.vue';
  import KwFrom from '@/configComponents/otherComponents/KwFrom.vue';

  const formList = [
    {
      inputType: 'divider',
      label: '表格设置',
    },
    {
      inputType: 'number',
      label: '横向间距',
      inputAttr: 'tranSpacing',
    },
    {
      inputType: 'number',
      label: '竖向间距',
      inputAttr: 'vertSpacing',
    },
    {
      inputType: 'radio',
      label: '自动滚动',
      inputAttr: 'autoScroll',
      selectOption: [
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        },
      ],
    },
    {
      inputType: 'divider',
      label: '表头设置',
    },
    {
      inputType: 'number',
      label: '行高',
      inputAttr: 'TheadTdHeight',
    },
    {
      inputType: 'select',
      label: '字体',
      inputAttr: 'TheadTdFontFamily',
      selectOption: [
        {
          label: '默认',
          value: '默认',
        },
        {
          label: '楷体',
          value: '楷体',
        },
        {
          label: '宋体',
          value: '宋体',
        },
        {
          label: '黑体',
          value: '黑体',
        },
      ],
    },
    {
      inputType: 'number',
      label: '字体大小',
      inputAttr: 'TheadTdFontSize',
    },
    {
      inputType: 'color',
      label: '文字颜色',
      inputAttr: 'TheadTdColor',
    },
    {
      inputType: 'color',
      label: '背景颜色',
      inputAttr: 'TheadTdBgColor',
    },
    {
      inputType: 'select',
      label: '对齐方式',
      inputAttr: 'TheadTdBgAlign',
      selectOption: [
        {
          label: 'left',
          value: 'left',
        },
        {
          label: 'center',
          value: 'center',
        },
        {
          label: 'right',
          value: 'right',
        },
      ],
    },
    {
      inputType: 'divider',
      label: '表体设置',
    },
    {
      inputType: 'number',
      label: '行高',
      inputAttr: 'TbodyTdHeight',
    },
    {
      inputType: 'select',
      label: '字体',
      inputAttr: 'TbodyTdFontFamily',
      selectOption: [
        {
          label: '默认',
          value: '默认',
        },
        {
          label: '楷体',
          value: '楷体',
        },
        {
          label: '宋体',
          value: '宋体',
        },
        {
          label: '黑体',
          value: '黑体',
        },
      ],
    },
    {
      inputType: 'number',
      label: '字体大小',
      inputAttr: 'TbodyTdFontSize',
    },
    {
      inputType: 'color',
      label: '文字颜色',
      inputAttr: 'TbodyTdColor',
    },
    {
      inputType: 'color',
      label: '背景颜色',
      inputAttr: 'TbodyTdBgColor',
    },
    {
      inputType: 'select',
      label: '对齐方式',
      inputAttr: 'TbodyTdBgAlign',
      selectOption: [
        {
          label: 'left',
          value: 'left',
        },
        {
          label: 'center',
          value: 'center',
        },
        {
          label: 'right',
          value: 'right',
        },
      ],
    },
  ];
</script>

<style scoped></style>
