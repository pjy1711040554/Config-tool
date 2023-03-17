<template>
  <a-popover trigger="hover" overlayClassName="kw-popover" v-model:visible="show">
    <template #content>
      <ul>
        <li v-for="i in list" @click="liClick(i)">{{ i.label }}</li>
      </ul>
    </template>
    <slot></slot>
  </a-popover>

</template>

<script setup>
/**
 * 对齐组件
 * */
import { inject, ref } from "vue";
import { alignmentMethod } from '@/configComponents';

const selectObject = inject("selectObject");
const list = ref([
  { label: "左对齐", value: "left" },
  { label: "水平居中", value: "centerH" },
  { label: "右对齐", value: "right" },
  { label: "顶对齐", value: "top" },
  { label: "垂直居中", value: "centerS" },
  { label: "底对齐", value: "bottom" }
]);
const show = ref(false);
const liClick = (item) => {
    show.value = false;
    alignmentMethod(myCanvas, item.value);
  }
;
</script>

<style lang="less">
.kw-popover {
  .ant-popover-arrow {
    border-top-color: rgb(51, 51, 51) !important;
    border-left-color: rgb(51, 51, 51) !important;
  }

  .ant-popover-inner {
    min-width: 200px;
    background: rgb(51, 51, 51);
    box-shadow: rgb(0 0 0 / 30%) 0px 2px 8px;
    border-radius: 4px;
    color: rgb(242, 244, 245);
    border: 1px solid rgb(69, 70, 71);

    .ant-popover-inner-content {
      padding: 0;
    }
  }
}
</style>
<style scoped lang="less">
ul {
  margin-bottom: 0;

  li {
    position: relative;
    height: 30px;
    padding-left: 16px;
    padding-right: 14px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    color: rgb(255, 255, 255);
    cursor: pointer;
    justify-content: space-between;

    .shortcut-key {
      display: inline-block;
      text-align: center;
      min-width: 12px;
      color: rgb(153, 153, 153);
      font-family: Inter;
    }
  }

  li:hover {
    background: rgb(102, 102, 102);
  }
}
</style>
