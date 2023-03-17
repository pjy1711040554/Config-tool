<template>
  <xywh />
  <shadow-style />
  <kw-from-item inputType="divider" label="图片设置" />
  <kw-from-item label="url">
    <my-upload @success="uploadSuccessUrl">
      <a-button size="small">替换图片</a-button>
    </my-upload>
  </kw-from-item>
  <kw-from-item inputType="divider" label="报警设置" />
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
      <div class="tr" v-for="(i, index) in selectObject.objectData.pointList" :key="index">
        <div class="td">
          <a-input v-model:value="i.key" />
        </div>
        <div class="td">
          <a-select v-model:value="i.symbol" :getPopupContainer="(triggerNode) => triggerNode.parentNode.parentNode" style="width: 120px" :options="symbolOpotion" />
        </div>
        <div class="td">
          <a-input v-model:value="i.value" />
        </div>
        <!--        <div class="td">-->
        <!--          <color-picker style="width: 100%" v-model="i.color" size="small" show-alpha color-format="rgb" />-->
        <!--        </div>-->
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
  <kw-from-item inputType="divider" label="运行状态设置" />
  <div class="table">
    <div class="thead">
      <div class="tr">
        <div class="td">测点</div>
        <div class="td">符号</div>
        <div class="td">值</div>
        <div class="td">图片</div>
        <div class="td"></div>
      </div>
    </div>
    <div class="tbody">
      <div class="tr" v-for="(i, index) in selectObject.objectData.replaceList" :key="index">
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
          <my-upload @success="uploadSuccess($event, index)">
            <div style="width: 100%; height: 25px; display: flex; align-items: center; justify-content: center">
              <img v-if="i.url" :src="i.url" style="max-width: 100%; max-height: 100%; margin-top: 12px" />
              <UploadOutlined v-else />
            </div>
          </my-upload>
        </div>
        <div class="td">
          <span @click="deleteReplaceType(index)"><MinusCircleOutlined /></span>
        </div>
      </div>
    </div>
    <div style="padding: 0 5px">
      <a-button @click="replacePointType()" style="width: calc(100% - 20px)" size="small">
        <PlusOutlined />
      </a-button>
    </div>
  </div>
</template>

<script setup>
  import Xywh from '@/configComponents/styleComponents/xywh.vue';
  import ShadowStyle from '@/configComponents/styleComponents/shadowStyle.vue';
  import KwFromItem from '@/configComponents/otherComponents/KwFromItem.vue';
  // import ColorPicker from "@/components/KwColorPicker/src/main.vue";
  import MyUpload from '@/configComponents/otherComponents/MyUpload.vue';
  import { getSrc } from '@/configComponents/util';
  import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
  import { inject } from 'vue';

  const selectObject = inject('selectObject');

  const addPointType = () => {
    selectObject.objectData.pointList.push({ key: '', value: '', symbol: '==' });
  };
  const deletePointType = (index) => {
    selectObject.objectData.pointList.splice(index, 1);
  };
  const symbolOpotion = [
    { label: '=', value: '==' },
    { label: '>', value: '>' },
    { label: '<', value: '<' },
  ];
  const replacePointType = () => {
    selectObject.objectData.replaceList.push({ key: '', value: '', symbol: '==', url: '' });
  };
  const deleteReplaceType = (index) => {
    selectObject.objectData.replaceList.splice(index, 1);
  };
  const uploadSuccess = (url, index) => {
    selectObject.objectData.replaceList[index].url = getSrc(url);
  };
  const uploadSuccessUrl = (url) => {
    selectObject.object.setSrc(getSrc(url), () => {
      selectObject.object.canvas.renderAll();
    });
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
