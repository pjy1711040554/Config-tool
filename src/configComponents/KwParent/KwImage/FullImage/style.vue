<template>
  <xywh />
  <shadow-style />
  <kw-from-item label="url">
    <my-upload @success="uploadSuccessUrl">
      <a-button size="small">替换图片</a-button>
    </my-upload>
  </kw-from-item>
  <kw-from-item
    inputType="radio"
    label="下行控制"
    inputAttr="DownlinkControl"
    :selectOption="[
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ]"
  />
  <kw-from-item inputType="text" inputAttr="DownlinkControlPoint" width="100%" label="下行控制测点" />
  <kw-from-item inputType="text" inputAttr="DownlinkControlTitle" width="100%" label="下行控制标题" />
</template>

<script setup>
  import Xywh from '@/configComponents/styleComponents/xywh.vue';
  import ShadowStyle from '@/configComponents/styleComponents/shadowStyle.vue';
  import { getSrc } from '@/configComponents/util';
  import MyUpload from '@/configComponents/otherComponents/MyUpload.vue';
  import KwFromItem from '@/configComponents/otherComponents/KwFromItem.vue';
  import { inject } from 'vue';

  const selectObject = inject('selectObject');
  const uploadSuccessUrl = (url) => {
    selectObject.object.setSrc(getSrc(url), () => {
      selectObject.object.canvas.renderAll();
    });
  };
</script>

<style scoped></style>
