<template>
  <a-divider orientation="left" plain style="margin: 12px 0">阴影</a-divider>
  <a-row class="position">
    <a-col :span="12">
      <kw-from-item label="颜色 ">
        <color-picker v-model="selectObject.objectData.shadow.color" size="small" show-alpha color-format="rgb" @change="valueChange2('shadow', 'color')" />
      </kw-from-item>
    </a-col>
    <a-col :span="12">
      <kw-from-item label="扩散">
        <a-input-number size="small" v-model:value="selectObject.objectData.shadow.blur" @change="valueChange2('shadow', 'blur')" />
      </kw-from-item>
    </a-col>
    <a-col :span="24">
      <kw-from-item label="偏移">
        <a-input-number size="small" v-model:value="selectObject.objectData.shadow.offsetX" @change="valueChange2('shadow', 'offsetX')" />
        <a-input-number size="small" v-model:value="selectObject.objectData.shadow.offsetY" @change="valueChange2('shadow', 'offsetY')" />
      </kw-from-item>
    </a-col>
  </a-row>
</template>

<script setup>
  /**
   * 通用阴影组件
   * */
  import ColorPicker from '@/configComponents/otherComponents/KwColorPicker/src/main.vue';
  import { inject } from 'vue';
  import KwFromItem from '@/configComponents/otherComponents/KwFromItem.vue';

  const selectObject = inject('selectObject');
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
