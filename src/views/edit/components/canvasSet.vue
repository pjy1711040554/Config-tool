<template>
  <a-row id="canvasSetBox">
    <a-divider orientation="left" plain>全局设置</a-divider>
    <kw-from-item label="全局背景">
      <color-picker style="width: 100%" v-model="canvasSet.backgroundColor" size="small" show-alpha color-format="rgb" @change="valueChange('backgroundColor')" />
    </kw-from-item>
    <kw-from-item label="展示方法">
      <a-select v-model:value="canvasSet.showMode" size="small" :options="showModeOption" style="width: 100%" @change="valueChange('showMode')" />
    </kw-from-item>
    <a-divider orientation="left" plain style="margin: 12px 0">工作区域设置</a-divider>
    <kw-from-item label="宽度">
      <a-input-number size="small" :step="10" v-model:value="canvasSet.width" style="width: 100%" @change="valueChange('width')" />
    </kw-from-item>
    <kw-from-item label="高度">
      <a-input-number size="small" :step="10" v-model:value="canvasSet.height" style="width: 100%" @change="valueChange('height')" />
    </kw-from-item>
    <kw-from-item label="背景样式">
      <a-select v-model:value="canvasSet.styleType" size="small" :options="styleType" style="width: 100%" @change="valueChange('styleType')" />
    </kw-from-item>
    <kw-from-item label="背景图片" v-show="canvasSet.styleType === 'image'">
      <my-upload @success="uploadSuccess"><a-button type="primary" size="small">上传图片</a-button></my-upload>
    </kw-from-item>
    <kw-from-item label="背景颜色" v-show="canvasSet.styleType === 'color'">
      <color-picker style="width: 100%" v-model="canvasSet.styleColor" size="small" show-alpha color-format="rgb" @change="valueChange('styleColor')" />
    </kw-from-item>
    <a-divider orientation="left" plain style="margin: 12px 0">辅助</a-divider>
    <kw-from-item label="网格">
      <a-checkbox v-model:checked="canvasSet.girdShow" @change="valueChange('girdShow')" />
      <a-input-number size="small" :min="10" :max="100" :step="10" v-model:value="canvasSet.interval" style="width: 50px; min-height: auto; margin-left: 12px" @change="valueChange('interval')" />
    </kw-from-item>
  </a-row>
</template>

<script setup>
  /**
   * 画布设置
   * */
  import { inject, reactive } from 'vue';
  import MyUpload from '@/configComponents/otherComponents/MyUpload.vue';
  import ColorPicker from '@/configComponents/otherComponents/KwColorPicker/src/main.vue';
  import { getSrc } from '@/configComponents/util';
  import KwFromItem from '@/configComponents/otherComponents/KwFromItem.vue';

  const pageInfo = inject('pageInfo');

  const styleType = [
    { label: '填充颜色', value: 'color' },
    { label: '填充图片', value: 'image' },
  ];
  const showModeOption = [
    { label: '展示工作区域', value: 1 },
    { label: '展示所有', value: 2 },
    { label: '默认', value: 3 },
  ];
  const canvasSet = reactive({});

  const valueChange = (e) => {
    myCanvas.Background.set(e, canvasSet[e]);
    if (e == 'backgroundColor') {
      myCanvas.backgroundColor = canvasSet[e];
    }
    myCanvas.renderAll();
  };
  const uploadSuccess = (e) => {
    let url = getSrc(e);
    myCanvas.Background.styleImage = url;
    myCanvas.Background.loadImage(url);
  };
  const setCanvasSet = (data) => {
    Object.assign(canvasSet, data);
  };
  defineExpose({
    setCanvasSet,
  });
</script>

<style scoped lang="less">
  .ant-divider-horizontal.ant-divider-with-text-left {
    &::before {
      top: 0;
    }

    &::after {
      top: 0;
    }
  }
</style>
