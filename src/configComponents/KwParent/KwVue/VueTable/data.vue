<template>
  <kw-from-item label="表头配置">
    <a-button size="small" @click="editOption('columnsStr')">编辑</a-button>
  </kw-from-item>
  <kw-from-item inputType="select" inputAttr="dataType" width="100%" label="数据来源" :selectOption="selectOption" />
  <kw-from-item label="数据配置" v-if="selectObject.objectData.dataType === 1">
    <a-button size="small" @click="editOption('staticDataStr')">编辑</a-button>
  </kw-from-item>
  <div v-if="selectObject.objectData.dataType === 2">
    <kw-from-item inputType="textarea" inputAttr="apiUrl" width="100%" label="api地址" />
    <kw-from-item inputType="text" inputAttr="apiTime" width="100%" label="刷新时长" :inputProp="{ min: 0, step: 1, precision: 0.1 }" />
    <kw-from-item label="数据解析">
      <a-button size="small" @click="editOption('dataHandle')">编辑</a-button>
    </kw-from-item>
  </div>
  <a-modal v-model:visible="visible" title="编辑数据" @ok="handleOk" width="800px">
    <json-editor ref="jsonEditorRef" />
  </a-modal>
</template>

<script setup>
  /**
   *
   * */
  import { inject, nextTick, ref } from 'vue';
  import JsonEditor from '@/configComponents/dataComponents/JsonEditor.vue';
  import { funEvalOption } from '@/configComponents/util';
  import KwFromItem from '@/configComponents/otherComponents/KwFromItem.vue';

  const selectOption = [
    {
      label: '静态数据',
      value: 1,
    },
    {
      label: 'api方式',
      value: 2,
    },
  ];

  const jsonEditorRef = ref(null);
  const visible = ref(false);
  const selectObject = inject('selectObject');
  let editType = null;
  // 打开编辑框
  const editOption = (e) => {
    editType = e;
    visible.value = true;
    nextTick(() => {
      jsonEditorRef.value.setValue(selectObject.object[e]);
    });
  };
  // 弹框点击确定事件
  const handleOk = () => {
    let e = jsonEditorRef.value.getValue();
    e = e.replace(new RegExp('"', 'gmi'), "'");
    let funEvalValue = funEvalOption(`function getData() {\n option =` + e + `  \nreturn option\n}\n` + 'return getData();');
    if (!funEvalValue) return;
    selectObject.object[editType] = e;
    visible.value = false;
  };
</script>

<style scoped></style>
