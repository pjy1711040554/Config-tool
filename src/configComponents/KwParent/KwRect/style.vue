<template>
  <xywh />
  <kw-from :formList="formList" />

  <div class="table">
    <div class="thead">
      <div class="tr">
        <div class="td">测点</div>
        <div class="td">符号</div>
        <div class="td">值</div>
        <!--        <div class="td">颜色</div>-->
        <div class="td"></div>
      </div>
    </div>
    <div class="tbody">
      <div class="tr" v-for="(i, index) in selectObject.objectData.warningList" :key="index">
        <div class="td">
          <a-input v-model:value="i.key" />
        </div>
        <div class="td">
          <a-select v-model:value="i.symbol" :getPopupContainer="(triggerNode) => triggerNode.parentNode.parentNode" style="width: 120px" :options="symbolOpotion" />
        </div>
        <div class="td">
          <a-input v-model:value="i.value" />
        </div>
        <div class="td">
          <color-picker style="width: 100%" v-model="i.color" size="small" show-alpha color-format="rgb" />
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
  import Xywh from '@/configComponents/styleComponents/xywh.vue';
  import KwFrom from '@/configComponents/otherComponents/KwFrom.vue';
  import ColorPicker from '@/configComponents/otherComponents/KwColorPicker/src/main.vue';
  import { inject } from 'vue';
  import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';

  const selectObject = inject('selectObject');

  const symbolOpotion = [
    { label: '=', value: '==' },
    { label: '>', value: '>' },
    { label: '<', value: '<' },
  ];
  const formList = [
    { inputType: 'color', width: '100%', label: '填充色', inputAttr: 'fill' },
    { inputType: 'color', width: '100%', label: '边框颜色', inputAttr: 'stroke' },
    { inputType: 'number', width: '100%', label: '边框宽度', inputAttr: 'strokeWidth' },

    { inputType: 'number', width: '100%', label: '圆角x', inputAttr: 'rx' },
    { inputType: 'number', width: '100%', label: '圆角y', inputAttr: 'ry' },
  ];
  const addPointType = () => {
    selectObject.objectData.warningList.push({ key: '', value: '', symbol: '==', color: '' });
  };
  const deletePointType = (index) => {
    selectObject.objectData.warningList.splice(index, 1);
  };
</script>

<style scoped lang="less">
  .table {
    width: 200px;
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
        height: 25px;

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
          height: 25px;

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

      .td:nth-of-type(1) {
        width: 30%;
      }

      .td:nth-of-type(2) {
        width: 15%;
      }

      .td:nth-of-type(3) {
        width: 25%;
      }

      .td:nth-of-type(4) {
        width: 15%;
      }

      .td:nth-of-type(5) {
        width: 10%;
        cursor: pointer;
      }
    }
  }
</style>
