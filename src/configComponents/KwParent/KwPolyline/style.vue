<template>
  <div class="position">
    <xywh />
    <kw-from-item label="填充色">
      <color-picker style="width: 100%" v-model="selectObject.objectData.fill" size="small" show-alpha color-format="rgb" @change="valueChange('fill')" />
    </kw-from-item>
    <a-divider orientation="left" plain style="margin: 12px 0">前景配置</a-divider>
    <kw-from-item label="颜色" style="width: 50%">
      <color-picker style="width: 100%" v-model="selectObject.objectData.stroke2" size="small" show-alpha color-format="rgb" @change="valueChange('stroke2')" />
    </kw-from-item>
    <kw-from-item label="宽度" style="width: 50%">
      <a-input-number size="small" v-model:value="selectObject.objectData.strokeWidth2" @change="valueChange('strokeWidth2')" />
    </kw-from-item>
    <kw-from-item label="实线" style="width: 50%">
      <a-input-number :min="0" size="small" v-model:value="selectObject.objectData.strokeDashArray2[0]" @change="valueChange2('strokeDashArray2', '0')" />
    </kw-from-item>
    <kw-from-item label="虚线" style="width: 50%">
      <a-input-number :min="0" size="small" v-model:value="selectObject.objectData.strokeDashArray2[1]" @change="valueChange2('strokeDashArray2', '1')" />
    </kw-from-item>
    <a-divider orientation="left" plain style="margin: 12px 0">背景配置</a-divider>
    <kw-from-item label="颜色" style="width: 50%">
      <color-picker style="width: 100%" v-model="selectObject.objectData.stroke" size="small" show-alpha color-format="rgb" @change="valueChange('stroke')" />
    </kw-from-item>
    <kw-from-item label="宽度" style="width: 50%">
      <a-input-number size="small" v-model:value="selectObject.objectData.strokeWidth" @change="valueChange('strokeWidth')" />
    </kw-from-item>
    <kw-from-item label="实线" style="width: 50%">
      <a-input-number :min="0" size="small" v-model:value="selectObject.objectData.strokeDashArray[0]" @change="valueChange2('strokeDashArray', '0')" />
    </kw-from-item>
    <kw-from-item label="虚线" style="width: 50%">
      <a-input-number :min="0" size="small" v-model:value="selectObject.objectData.strokeDashArray[1]" @change="valueChange2('strokeDashArray', '1')" />
    </kw-from-item>
  </div>
</template>

<script setup>
  import { inject } from 'vue';
  import Xywh from '@/configComponents/styleComponents/xywh.vue';
  import ColorPicker from '@/configComponents/otherComponents/KwColorPicker/src/main.vue';
  import KwFromItem from '@/configComponents/otherComponents/KwFromItem.vue';

  const selectObject = inject('selectObject');
  const valueChange = (e) => {
    selectObject.object.set(e, selectObject.objectData[e]);
    myCanvas.renderAll();
  };
  const valueChange2 = (e, e2) => {
    selectObject.object[e][e2] = selectObject.objectData[e][e2];
    myCanvas.renderAll();
  };
</script>

<style scoped lang="less">
  .position {
    > div {
      ::v-deep(.ant-input-number) {
        min-width: auto;
      }
    }
  }
</style>
