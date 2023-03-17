<template>
  <div id="fabric-box" ref="fabricDom">
    <canvas ref="canvasDom" id="canvas" style="width: 100%; height: 100%"></canvas>
    <!--vue组件存放处-->
    <div id="fabricVuePre">
      <component v-for="(i, index) in componentArr" :is="i.comp" :node="i.node" :key="index" :position="i.position"/>
    </div>
  </div>
</template>

<script setup>
/**
 * 预览组件
 * */
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {fabric} from 'fabric';
import {installFabric, deepLoopObjects, CanvasDragZoomPre, setViewByType} from '@/configComponents';
import {useComp} from '@/configComponents/hooks/useComp';
import {useRoute, useRouter} from 'vue-router';
import * as echarts from 'echarts';
import {getPageById} from "@/plugins/page";


installFabric();
// 动态组件
const {componentArr, pushComponentArr, updateComponentArr} = useComp();

// 获取页面传参
const route = useRoute();
const router = useRouter();

const getPageInfo = async () => {
  if (route.query.id) {
    let result = getPageById(route.query.id)
    LoadJOSN(result?.content);
  } else if (route.query.preview === '1') {
    LoadJOSN(localStorage.previewJson);
  }
};


// 加载已有josn
let canvas
const fabricDom = ref(null)
const LoadJOSN = (json) => {
  if (!json) return;
  json = JSON.parse(json);
  if (json) json.background = '';
  canvas.loadFromJSON(json, function () {
    const BackgroundPage = canvas._objects.find((i) => i.isType('BackgroundPage')) || new fabric.BackgroundPage();
    canvas.BackgroundPage = BackgroundPage;
    BackgroundPage.shadow.color = 'rgba(0,0,0,0)'
    canvas.setViewByType();
    fabricDom.value.style.backgroundColor = BackgroundPage.backgroundColor;
    // 深度循环数据
    deepLoopObjects(canvas._objects, async function (i) {
      i.selectable = false;
      i.hasDom && pushComponentArr(i);
    });
  });
};

// 动画
let animStart = true;
const anim = () => {
  animate();

  function animate() {
    if (animStart == false) return;
    deepLoopObjects(canvas._objects, function (i) {
      i.anim && i.anim();
    });
    fabric.util.requestAnimFrame(animate, canvas.getElement());
    canvas.renderAll();
  }
};
const resizeCanvas = () => {
  if (fabricDom.value) {
    canvas.setWidth(fabricDom.value.clientWidth);
    canvas.setHeight(fabricDom.value.clientHeight);
  }
  canvas.BackgroundPage && canvas.setViewByType();
};

onMounted(async () => {
  window.echarts = echarts;
  // document.getElementById("fabricVuePre").style.pointerEvents = "none";
  window.addEventListener('resize', () => {
    setTimeout(() => resizeCanvas());
  }, false);
  window.addEventListener('mousewheel', function (e) {
    if (e.ctrlKey === true || e.metaKey) e.preventDefault();
  }, {passive: false});

  canvas = new fabric.Canvas('canvas', {
    containerClass: 'canvas',
    width: fabricDom.value.clientWidth,
    height: fabricDom.value.clientHeight,
    mode: 'preview',
  });
  canvas.selection = false; // 不允许直接从画布框选
  canvas.evented = false; // 不允许直接从画布框选
  canvas.hoverCursor = 'pointer'; //悬浮光标改成手型
  canvas.setViewByType = function () {
    setViewByType(canvas);
    updateComponentArr();
  };

  CanvasDragZoomPre(canvas, function () {
    updateComponentArr();
  });
  anim();
  await getPageInfo();
  // 更新vue组件坐标
  canvas.on({
    'object:moving': updateComponentArr,
    'object:scaling': updateComponentArr,
    'object:resizing': updateComponentArr,
    'object:rotating': updateComponentArr,
    'object:skewing': updateComponentArr,
    'object:modified': updateComponentArr,
  });

  canvas.on('mouse:up', function (e) {
    if (!e.target) return;
    if (window.event.ctrlKey) return;
  });
});
onBeforeUnmount(() => {
  animStart = false;
  window.echarts = null;
});
</script>

<style scoped lang="less">
#fabric-box {
  height: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;
}

</style>
