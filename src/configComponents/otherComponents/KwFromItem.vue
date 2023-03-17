<template>
  <div v-if="inputType === 'divider'">
    <a-divider orientation="left" plain style="margin: 12px 0">{{ label }}</a-divider>
  </div>
  <div v-else class="kw-from-item" :style="{ width: width }">
    <label :style="{ width: labelWidth + 'px' }">{{ label }}</label>
    <div>
      <a-input v-if="inputType === 'text'" size="small" v-bind="inputProp" v-model:value="selectObject.objectData[inputAttr]" @change="valueChange()" />
      <a-input-number v-else-if="inputType === 'number'" v-bind="inputProp" size="small" v-model:value="selectObject.objectData[inputAttr]" @change="valueChange()" />
      <color-picker v-else-if="inputType === 'color'" v-bind="inputProp" v-model="selectObject.objectData[inputAttr]" size="small" show-alpha color-format="rgb" @change="valueChange()" />
      <a-select
        v-else-if="inputType === 'select'"
        v-bind="inputProp"
        v-model:value="selectObject.objectData[inputAttr]"
        size="small"
        :options="selectOption"
        style="width: 100%"
        @change="valueChange()"
      />
      <a-textarea v-else-if="inputType === 'textarea'" v-model:value="selectObject.objectData[inputAttr]" @change="valueChange()" auto-size v-bind="inputProp" />
      <a-radio-group v-if="inputType === 'radio'" v-model:value="selectObject.objectData[inputAttr]" v-bind="inputProp" @change="valueChange()">
        <a-radio v-for="i in selectOption" :key="i.value" :value="i.value">{{ i.label }}</a-radio>
      </a-radio-group>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
  /**
   * 自定义form-item
   * */
  import ColorPicker from '@/configComponents/otherComponents/KwColorPicker/src/main.vue';

  const props = defineProps({
    width: {
      type: String,
      default: '100%',
    },
    label: {
      type: String,
      default: '标题',
    },
    labelWidth: {
      type: String,
      default: '',
    },
    inputAttr: {
      type: String,
      default: '',
    },
    inputType: {
      type: String,
      default: '',
    },
    inputProp: {
      type: Object,
      default: () => {},
    },
    selectOption: {
      type: Array,
      default: () => [],
    },
  });
  import { inject } from 'vue';

  const emit = defineEmits(['change']);
  const selectObject = inject('selectObject');
  const valueChange = () => {
    selectObject.object.set(props.inputAttr, selectObject.objectData[props.inputAttr]);
    emit('change', selectObject.object);
    myCanvas.renderAll();
  };
</script>

<style scoped lang="less">
  .kw-from-item {
    display: inline-flex;
    align-items: center;
    min-height: 30px;
    padding: 2px 5px 2px 10px;
    width: 100%;
    overflow: hidden;

    > label {
      display: inline-block;
      width: auto;
      white-space: nowrap;
      margin-right: 5px;
    }

    > div {
      height: 100%;
      display: flex;
      align-items: center;
      flex: 1;
    }

    ::v-deep(.ant-input-number) {
      min-width: auto;
      width: auto;
    }
  }
</style>
