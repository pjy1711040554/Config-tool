<template>
  <div class="table">
    <div class="thead">
      <div class="tr">
        <div class="td" v-for="i in columns" :key="i.key" :style="{ width: i.width }">{{ i.title }} </div>
        <div class="td"></div>
      </div>
    </div>
    <div class="tbody">
      <div class="tr" v-for="(i, index) in list" :key="index">
        <div class="td" v-for="j in columns" :style="{ width: j.width }">
          <slot :name="j.key" :row="i" :key="j.key" :value="i[j.key]" :index="index">
            <color-picker v-if="j.inputType === 'color'" v-bind="j.inputProp" v-model="i[j.key]" size="small" show-alpha color-format="rgb" />
            <a-select
              :mode="j.inputType?.mode"
              show-search
              :getPopupContainer="i.getPopupContainer"
              v-else-if="j.inputType === 'select'"
              v-model:value="i[j.key]"
              v-bind="j.inputProp"
              size="small"
              :options="j.inputProp && j.inputProp.option"
              :filterOption="filterOption"
              style="width: 100%"
              @change="(e) => j.inputProp && j.inputProp.change && j.inputProp.change(e, index)"
            />
            <a-input v-else v-model:value="i[j.key]" />
          </slot>
        </div>
        <div class="td">
          <span @click="deletePointType(index)"><MinusCircleOutlined /></span>
        </div>
      </div>
    </div>
    <div style="padding: 0 5px">
      <a-button @click="addPointType()" style="width: calc(100% - 20px)" size="small">
        <PlusOutlined />
      </a-button>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import ColorPicker from '@/configComponents/otherComponents/KwColorPicker/src/main.vue';

  const props = defineProps({
    data: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    pushData: { type: Object, default: () => ({ label: '', value: '' }) },
  });
  const list = ref(props.data);
  const emit = defineEmits(['update:data']);
  watch(
    () => props.data,
    () => {
      list.value = props.data;
    }
  );
  const addPointType = () => {
    list.value.push({ ...props.pushData });
    emit('update:data', list.value);
  };
  const deletePointType = (index) => {
    list.value.splice(index, 1);
    emit('update:data', list.value);
  };

  const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
</script>

<style scoped lang="less">
  .table {
    width: 100%;
    overflow: hidden;

    .thead {
      width: 100%;
    }

    .tbody {
      width: 100%;
    }

    .tr {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 5px;
      padding: 0 5px;

      .td {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 25px;
        white-space: nowrap;

        .ant-input {
          width: 100%;
          height: 25px;
          padding: 0;
          text-align: center;
          font-size: 12px;
        }

        :deep(.ant-select-selector) {
          padding: 0;
          text-align: center;
          min-height: 25px;

          .ant-select-selection-item {
            padding: 0;
            line-height: 23px;
          }
        }

        :deep(.ant-select-arrow) {
          display: none;
        }

        :deep(.ant-select-item) {
          padding: 0;
          text-align: center;
        }
      }

      :deep(.ant-select-multiple) {
        .ant-select-selector {
          padding: 0 5px;
        }

        .ant-select-selection-item {
          height: 18px;
          line-height: 18px !important;
        }
      }

      .td:last-of-type {
        width: 10%;
        cursor: pointer;
      }
    }
  }
</style>
