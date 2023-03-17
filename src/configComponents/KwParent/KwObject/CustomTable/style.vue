<template>
  <xywh />
  <kw-from-item inputType="divider" label="列表设置" />
  <div class="table">
    <div class="thead">
      <div class="tr">
        <div class="td">标题</div>
        <div class="td">测点</div>
        <div class="td">单位</div>
        <div class="td"></div>
      </div>
    </div>
    <div class="tbody">
      <div class="tr" v-for="(i, index) in selectObject.objectData.tableList" :key="index">
        <div class="td">
          <a-input v-model:value="i.title" @change="inputChange" />
        </div>
        <div class="td">
          <a-input v-model:value="i.pointName" @change="inputChange" />
        </div>
        <div class="td">
          <a-input v-model:value="i.pointUnit" @change="inputChange" />
        </div>
        <div class="td">
          <span v-show="selectObject.objectData.tableList.length > 1" @click="deletePointType(index)"><MinusCircleOutlined /></span>
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
  import KwFromItem from '@/configComponents/otherComponents/KwFromItem.vue';
  import Xywh from '@/configComponents/styleComponents/xywh.vue';
  import { inject } from 'vue';
  import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';

  const selectObject = inject('selectObject');

  const addPointType = () => {
    selectObject.object.set('row', selectObject.object.row + 1);
    selectObject.object.updateWidthHeight();
    selectObject.object.canvas.requestRenderAll();
    selectObject.objectData.tableList.push({});
  };
  const deletePointType = (index) => {
    selectObject.object.set('row', selectObject.object.row - 1);
    selectObject.object.updateWidthHeight();
    selectObject.object.canvas.requestRenderAll();
    selectObject.objectData.tableList.splice(index, 1);
  };
  const inputChange = () => {
    selectObject.object.canvas.requestRenderAll();
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
      }

      .td:nth-of-type(1) {
        width: 40%;
      }

      .td:nth-of-type(2) {
        width: 30%;
      }

      .td:nth-of-type(3) {
        width: 20%;
      }

      .td:nth-of-type(4) {
        width: 7%;
        cursor: pointer;
      }
    }
  }
</style>
