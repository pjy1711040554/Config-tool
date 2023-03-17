<template>
  <div :style="position">
    <div ref="dom" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup>
  /**
   * echarts渲染组件
   * */
  import * as echarts from 'echarts';
  import { onMounted, ref, watch } from 'vue';
  import { funEvalOption, funEvalData } from '@/configComponents/util';
  // 传入定位、元件object
  const props = defineProps({
    position: Object,
    node: Object,
  });
  let chart = null;
  let option = null;
  const dom = ref(null);
  // 监听api返回的数据
  watch(
    () => props.node.resultData,
    (result) => {
      option = funEvalData(props.node.dataHandle, option, result);
      chart.setOption(option, true);
    }
  );
  // 监听发生改变时 重新渲染echarts
  let tiemr = null;
  watch([() => props.node.width, () => props.node.height, () => props.node.optionStr, () => props.node.dataHandle, () => props.node.theme, () => props.node.renderType], () => {
    if (tiemr) clearTimeout(tiemr);
    tiemr = setTimeout(() => {
      initChart();
    }, 400);
  });
  // 初始化echarts
  const initChart = () => {
    if (chart) chart.dispose();
    const { theme, renderType, optionStr } = props.node;
    chart = echarts.init(dom.value, theme, { renderer: renderType });
    option = funEvalOption(`function getData() {\n ` + optionStr + `  \nreturn option\n}\n` + 'return getData();');
    chart.setOption(option, true);
    chart.on('click', function () {
      nodeClick(props.node);
    });
  };
  const emit = defineEmits(['onloaded']);
  onMounted(() => {
    initChart();
    emit('onloaded');
  });
</script>

<style scoped></style>
