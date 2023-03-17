<template>
  <a-row class="position">
    <a-col :span="12" v-show="showXY">
      <kw-from-item label="X" label-width="20">
        <a-input-number size="small" v-model:value="selectObject.objectData.left" @change="valueChange('left')" />
      </kw-from-item>
    </a-col>
    <a-col :span="12" v-show="showXY">
      <kw-from-item label="Y" label-width="20">
        <a-input-number size="small" v-model:value="selectObject.objectData.top" @change="valueChange('top')" />
      </kw-from-item>
    </a-col>
    <a-col :span="12" v-show="showWH">
      <kw-from-item label="W" label-width="20">
        <a-input-number :min="0" size="small" v-model:value="selectObject.objectData.width" @change="valueChange('width')" />
      </kw-from-item>
    </a-col>
    <a-col :span="12" v-show="showWH">
      <kw-from-item label="H" label-width="20">
        <a-input-number :min="0" size="small" v-model:value="selectObject.objectData.height" @change="valueChange('height')" />
      </kw-from-item>
    </a-col>
    <a-col :span="12" v-show="showSXSY">
      <kw-from-item label="SX" label-width="20">
        <a-input-number :min="0" :max="10" :step="0.1" size="small" v-model:value="selectObject.objectData.scaleX" @change="valueChange('scaleX')" />
      </kw-from-item>
    </a-col>
    <a-col :span="12" v-show="showSXSY">
      <kw-from-item label="SY" label-width="20">
        <a-input-number :min="0" :max="10" :step="0.1" size="small" v-model:value="selectObject.objectData.scaleY" @change="valueChange('scaleY')" />
      </kw-from-item>
    </a-col>
    <a-col :span="24" v-show="showOpacity">
      <kw-from-item label="透明度">
        <a-slider v-model:value="selectObject.objectData.opacity" :tooltipVisible="false" :min="0" :max="1" :step="0.01" style="width: calc(100% - 100px)" @change="valueChange('opacity')" />
        <span style="margin-top: 4px; display: inline-block; width: 40px; text-align: right"> {{ selectObject.objectData.opacity * 100 }}% </span>
      </kw-from-item>
    </a-col>
  </a-row>
  <kw-from-item label="名称" v-show="showName">
    <a-input size="small" v-model:value="selectObject.objectData.name" @change="valueChange('name')" />
  </kw-from-item>
</template>

<script setup>
  /**
   * 通用组件 宽、高、X、Y、SX、SY、透明度、名称、id
   * */
  import { inject, nextTick, watch } from 'vue';
  import KwFromItem from '@/configComponents/otherComponents/KwFromItem.vue';

  const selectObject = inject('selectObject');
  const treeData = inject('treeData');
  const emits = defineEmits(['change']);

  defineProps({
    showXY: { type: Boolean, default: true },
    showWH: { type: Boolean, default: true },
    showSXSY: { type: Boolean, default: true },
    showOpacity: { type: Boolean, default: true },
    showOption: { type: Boolean, default: true },
    showName: { type: Boolean, default: true },
    showUid: { type: Boolean, default: true },
  });

  const valueChange = (e) => {
    if (!selectObject.object.set) return;
    nextTick(() => {
      selectObject.object.set(e, selectObject.objectData[e]);
      selectObject.object.hasDom && updateComponentArr();
      myCanvas.renderAll();
      emits('change', e);
    });
  };

  watch(
    () => treeData.okNum,
    () => {
      const selectedRow = treeData.selectedRows[0] || {};
      const id = selectedRow.key || selectedRow.id;
      const nodeType = selectedRow.nodeType;
      const treeType = treeData.treeType;
      selectObject.object.set('treeType', id ? treeType : '');
      selectObject.object.set('nodeType', id ? nodeType : '');
      selectObject.object.set('databaseId', id ? id : '');
      //属性接口的返回值中 有standardId 表示这个是测点
      if (selectedRow.standardId && selectObject.object && selectObject.object.setUidPoint) {
        selectObject.object.setUidPoint({ uid: selectedRow.parentId, point: selectedRow.standardId });
      } else {
        selectObject.object.set('uid', id);
      }
      selectObject.objectData = selectObject.object.toJSON();
      emits('change', 'uid');
    }
  );


</script>

<style scoped lang="less">
  .position {
    > div {
      :deep(.ant-input-number) {
        min-width: auto;
      }
    }
  }

  :deep(.seach-input .ant-input) {
    height: 24px;
    font-size: 12px;
    padding: 0;
    text-align: left;
  }
</style>
