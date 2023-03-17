<template>
  <div ref="editorDom" :style="{width:width,height:height}"></div>
</template>

<script setup>
/**
 * 代码编辑器
 * */
const props = defineProps({
  width: {
    default: "100%"
  },
  height: {
    default: "500px"
  }
});
import { nextTick, onMounted, ref } from "vue";
import * as monaco from "monaco-editor";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  }
};

let editor;
const editorDom = ref(null);
// 设置值
const setValue = (value) => {
  editor.setValue(value);//再次设置
  editor.getAction("editor.action.formatDocument").run();//自动格式化代码
  editor.setValue(editor.getValue());//再次设置
};
// 获取值
const getValue = () => {
  return editor.getValue()
};
onMounted(() => {
  // 初始化编辑器
  editor = monaco.editor.create(editorDom.value, {
    theme: "vs-dark", //官方自带三种主题vs, hc-black, or vs-dark
    value: "", //编辑器初始显示文字
    language: "javascript"
  });
});
// 导出方法
defineExpose({
  setValue,getValue
});
</script>

<style scoped>

</style>
