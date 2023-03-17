<template>
  <div>
    <br />
    <kw-from-item label="对齐方式">
      <a-select size="small" :options="alignmentList" style="width: 100%" @change="alignmentChange" />
    </kw-from-item>
    <br />
    <kw-from-item label="横向间隔">
      <a-input-number size="small" :step="10" v-model:value="transverseSpacing" style="width: 100%" @change="transverseChange()" />
    </kw-from-item>
    <br />
    <kw-from-item label="纵向间隔">
      <a-input-number size="small" :step="10" v-model:value="verticalSpacing" style="width: 100%" @change="verticalChange()" />
    </kw-from-item>
  </div>
</template>

<script setup>
  /**
   *  多选时右侧配置
   * */
  import { ref, unref } from 'vue';
  import { alignmentMethod } from '@/configComponents';
  import KwFromItem from '@/configComponents/otherComponents/KwFromItem.vue';

  // 对齐方式
  const alignmentList = [
    { label: '左对齐', value: 'left' },
    { label: '水平居中', value: 'centerH' },
    { label: '右对齐', value: 'right' },
    { label: '顶对齐', value: 'top' },
    { label: '垂直居中', value: 'centerS' },
    { label: '底对齐', value: 'bottom' },
  ];
  const alignmentChange = (e) => {
    alignmentMethod(myCanvas, e);
  };
  //横向间隔
  const transverseSpacing = ref('');
  const transverseChange = () => {
    if (unref(transverseSpacing) === null) return;
    const activeSelection = myCanvas.getActiveObject();
    const objects = myCanvas.getActiveObject().type === 'activeSelection' ? myCanvas.getActiveObject().getObjects() : [myCanvas.getActiveObject()];
    myCanvas.discardActiveObject();
    let num = parseFloat(activeSelection.left);
    objects.forEach((i) => {
      i.set('left', num);
      num = num + parseFloat(i.getBoundingRect(true).width) + parseFloat(unref(transverseSpacing));
    });
    const sel = new fabric.ActiveSelection(objects, {
      canvas: myCanvas,
    });
    myCanvas.setActiveObject(sel);
    myCanvas.requestRenderAll();
  };
  //纵向间隔
  const verticalSpacing = ref('');
  const verticalChange = () => {
    if (unref(verticalSpacing) === null) return;
    const activeSelection = myCanvas.getActiveObject();
    const objects = myCanvas.getActiveObject().type === 'activeSelection' ? myCanvas.getActiveObject().getObjects() : [myCanvas.getActiveObject()];
    myCanvas.discardActiveObject();
    let num = parseFloat(activeSelection.top);
    objects.forEach((i) => {
      i.set('top', num);
      num = num + parseFloat(i.getBoundingRect(true).height) + parseFloat(unref(verticalSpacing));
    });
    const sel = new fabric.ActiveSelection(objects, {
      canvas: myCanvas,
    });
    myCanvas.setActiveObject(sel);
    myCanvas.requestRenderAll();
  };
</script>

<style scoped></style>
