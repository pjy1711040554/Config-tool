<template>
  <div class="page">
    <!--头部-->
    <div class="header">
      <div>
        <my-upload @success="uploadSuccess">
          <a-tooltip placement="bottom">
            <template #title>上传图片</template>
            <div class="icon-span">
              <i class="iconfont icon-shangchuantupian"></i>
            </div>
          </a-tooltip>
        </my-upload>
      </div>
      <div v-if="selectObject.objects.length > 0">
        <alignment>
          <div class="icon-span">
            <i class="iconfont icon-zuoduiqi"></i>
          </div>
        </alignment>
      </div>
      <div>
        <a-tooltip placement="bottom">
          <template #title>预览</template>
          <div class="icon-span" @click="previewJson">
            <i class="iconfont icon-yulan" style="font-size: 23px"></i>
          </div>
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template #title>保存到本地</template>
          <div class="icon-span" @click="saveJSON">
            <i class="iconfont icon-baocun"></i>
          </div>
        </a-tooltip>
      </div>
    </div>
    <!--主体-->
    <div class="main">
      <!--左侧-->
      <div class="left">
        <div class="left-item">
          <div class="left-item-title">
            <p>组件</p>
          </div>
          <div class="left-item-cont">
            <a-collapse ghost>
              <a-collapse-panel :header="i.type" v-for="i in elementList">
                <div class="elements">
                  <div class="icons-item" v-for="j in i.res" :key="j.id" :class="{ active: lineActive.id === j.id }"
                       @click="iconClick(j)">
                    <div class="img" :draggable="j.content?.draggable" @dragstart="dragEvent(j)">
                      <img v-if="j.thumbnailUrl" :src="j.thumbnailUrl" alt="" draggable="false"/>
                      <span v-if="!j.thumbnailUrl">{{ j.name }}</span>
                    </div>
                    <!--                    <p>{{ j.thumbnailUrl ? j.name : '' }}</p>-->
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>

          </div>
        </div>
        <div class="left-item">
          <div class="left-item-title">
            <p>组件</p>
          </div>
          <div class="left-item-cont">
            <yuansu-tree :treeList="objectList"/>
          </div>
        </div>
      </div>
      <main id="workspace">
        <div class="container" ref="container">
          <!--主体画布-->
          <canvas id="design"></canvas>
          <!--刻度尺-->
          <a-scale mode="horizontal" :options="aScaleOtions"
                   :style="{ width:'10000px',opacity:aScaleOtions.show ? 1 : 0}"/>
          <a-scale mode="vertical" :options="aScaleOtions"
                   :style="{ height:'10000px',opacity:aScaleOtions.show ? 1 : 0}"/>
          <!--vue组件存放处-->
          <div id="fabricVue">
            <component v-for="(i, index) in componentArr" :key="index" :is="i.comp" :node="i.node"
                       :position="i.position"/>
          </div>
          <menu-box :position="menuPostion" @change="menuClick"/>
        </div>
      </main>
      <!--右侧-->
      <div class="right" :style="rightStyle">
        <!--        <div class="drag-line" @mousedown.left="dragLineDraging"></div>-->
        <canvas-set ref="canvasSetRef" v-show="selectObject.objects.length === 0"/>
        <multiple-set v-show="selectObject.objects.length > 1"/>
        <a-tabs style="height: 100%" size="small" type="card" v-show="selectObject.objects.length == 1">
          <a-tab-pane key="1" tab="样式">
            <style-configuration/>
          </a-tab-pane>
          <a-tab-pane key="2" tab="数据">
            <data-configuration/>
          </a-tab-pane>
          <!--          <a-tab-pane key="3" tab="事件">-->
          <!--            <event-configuration />-->
          <!--          </a-tab-pane>-->
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup name="configurationTool-edit">
import {onBeforeUnmount, onMounted, provide, reactive, ref, toRaw, unref} from 'vue';
import {fabric} from 'fabric';
import {useRoute} from 'vue-router';
import axios from 'axios';
import {installFabric, CanvasDragZoom, fabricCenterView, deepLoopObjects} from '@/configComponents';
import StyleConfiguration from '@/configComponents/StyleConfiguration.vue';
import DataConfiguration from '@/configComponents/DataConfiguration.vue';
import EventConfiguration from '@/configComponents/EventConfiguration.vue';
import MyUpload from '@/configComponents/otherComponents/MyUpload.vue';
import {useComp} from '@/configComponents/hooks/useComp';
import {getJpeg, getSrc, toConfiguration} from '@/configComponents/util';
import {getPoint, getUuid} from './data';
import CanvasSet from './components/canvasSet.vue';
import AScale from './components/AScale.vue';
import MenuBox from './components/menuBox.vue';
import YuansuTree from './components/yuansuTree.vue';
import Alignment from './components/alignment.vue';
import MultipleSet from './components/multipleSet.vue';
import * as echarts from 'echarts';
import {getPositionList} from "@/views/element/data";
import {defHttp, getPageById, updatePage} from "@/plugins/page";
import {getelementList} from "@/plugins/element";
import {message} from 'ant-design-vue';

const route = useRoute();
// 页面信息
const pageInfo = reactive({
  id: route.query.id,
});
provide('pageInfo', pageInfo);
// 初始化fabric
installFabric();
// 动态组件
const {componentArr, pushComponentArr, updateComponentArr, clearComponentArr} = useComp();
// 右键菜单
const menuPostion = reactive({
  show: false,
  top: 0,
  left: 0,
});
//树形弹出框
const treeData = reactive({
  show: false, //展示树选择
  okNum: 0, // 点击ok的次数，用来监听点击了确定
  treeType: 1, //树的类型
  selectedKeys: [], //已选中节点id集合
  selectedRows: [], //已选中节点行集合
  expandedKeys: [], //已展开节点
});
provide('treeData', treeData);

// 左侧元件列表
const elementList = ref([]);
elementList.value = mapLoction(getelementList().map(i => {
  return {
    ...i,
    content: JSON.parse(i.content)
  }
}), 'type')

function mapLoction(arr, name) {
  var newArr = [];
  arr.forEach(function (oldData, i) {
    var index = -1;
    var alreadyExists = newArr.some(function (newData, j) {
      if (oldData[name] === newData[name]) {
        index = j;
        return true;
      }
    });
    if (!alreadyExists) {
      newArr.push({
        [name]: oldData[name],
        res: [oldData]
      });
    } else {
      newArr[index].res.push(oldData);
    }
  });
  return newArr;
};

// canvas对象
let myCanvas = null;
// 定义当前选中元素
const selectObject = reactive({
  object: {},
  objectData: {},
  objects: [],
});
provide('selectObject', selectObject);
// canvas   dom
const container = ref(null);
// 画布设置dom
const canvasSetRef = ref(null);

// 拖拽事件
function dragEvent(item) {
  lineActive.start = false;
  lineActive.id = '';
  myCanvas.dragItem = JSON.parse(JSON.stringify(item));
}

// 刻度尺
const aScaleOtions = reactive({
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  show: true,
});
//当前元素集合
const objectList = ref([]);
const updateObjectList = () => {
  objectList.value = myCanvas
      .getObjects()
      .reverse()
      .filter((i) => !i.isType('BackgroundPage'));
};
//创建元件
const createNode = (point, item) => {
  const dragItem = JSON.parse(JSON.stringify(item));
  const defaultValue = dragItem.content;
  const {type} = defaultValue;
  let option = {
    ...defaultValue,
    left: point.left,
    top: point.top,
    shadow: defaultValue.shadow ?? {},
    id: getUuid(),
    // uid: getUuid(),
    name: dragItem.name,
    thumbnailUrl: dragItem.thumbnailUrl,
  };
  switch (type) {
    case 'KwImage':
    case 'StateImage':
    case 'FullImage':
    case 'HoverImage':
      fabric[type].fromURL(
          option.url || option.src,
          (image) => {
            myCanvas.add(image); // 将图片加入到画布
            myCanvas.saveHistory();
          },
          option
      );
      break;
    case 'KwIText':
    case 'PointText':
    case 'TimeText':
    case 'KwTextbox':
      let text = new fabric[type]('text', option);
      myCanvas.add(text);
      myCanvas.saveHistory();
      break;
    default:
      try {
        const node = new fabric[type](option);
        myCanvas.add(node);
        myCanvas.saveHistory();
        if (node.hasDom) pushComponentArr(node);
      } catch (e) {
        console.error(e);
        alert('发生异常');
      }
      break;
  }
};

// 选中元素更新或者变化
const selectionUpdate = () => {
  if (!myCanvas.getActiveObject()) {
    Object.assign(selectObject, {
      activeObject: {},
      object: {},
      objectData: {},
      objects: [],
    });
  } else {
    const selected = myCanvas.getActiveObject().type === 'activeSelection' ? myCanvas.getActiveObject().getObjects() : [myCanvas.getActiveObject()];
    selectObject.activeObject = myCanvas.getActiveObject();
    selectObject.object = selected[0];
    selectObject.objectData = selected[0].toJSON();
    selectObject.objects = selected;
  }
};
// 重新设置canvas宽度
const resizeCanvas = () => {
  myCanvas.setWidth(unref(container)?.clientWidth);
  myCanvas.setHeight(unref(container)?.clientHeight);
};
// 更新刻度尺
const undateAScaleOtions = () => {
  aScaleOtions.offsetX = -myCanvas.viewportTransform[4];
  aScaleOtions.offsetY = -myCanvas.viewportTransform[5];
  aScaleOtions.scale = myCanvas.viewportTransform[0];
};
const setBackGround = () => {
  let Background = myCanvas._objects.find((i) => i.isType('BackgroundPage'));
  if (!Background) {
    Background = new fabric.BackgroundPage();
    myCanvas.add(Background);
    myCanvas.sendToBack(Background);
  }
  canvasSetRef.value.setCanvasSet(Background.toObject());
  myCanvas.Background = Background;
  myCanvas.backgroundColor = Background.backgroundColor;
  fabricCenterView(myCanvas, myCanvas.Background.width, myCanvas.Background.height);
  undateAScaleOtions();
};
// 加载已有josn
const LoadJOSN = (json, callback) => {
  let types = JSON.parse(json).objects.map(i => i.type)
  types.forEach(i => {
    if (!fabric[i]) console.log(i)
  })
  clearComponentArr();
  myCanvas.loadFromJSON(json, function () {
    callback && callback();
    deepLoopObjects(myCanvas._objects, function (i) {
      if (i.hasDom) pushComponentArr(i);
    });
    updateObjectList();
  });
};
//线条操作
const lineActive = reactive({
  id: '',
  start: false,
  firstDown: false,
  defaultValue: {},
  line: '',
  points: [],
});
// 左侧元件点击事件
const iconClick = (item) => {
  if (item.content.draggable) return;
  if (lineActive.id === item.id) {
    Object.assign(lineActive, {
      id: '',
      start: false,
      firstDown: false,
      defaultValue: {},
      line: '',
      points: [],
    });
  } else {
    Object.assign(lineActive, {
      id: item.id,
      start: true,
      firstDown: false,
      defaultValue: item.content,
      line: '',
      points: [],
    });
  }
};
// 初始化
const init = async () => {
  myCanvas = new fabric.Canvas('design', {
    containerClass: 'design',
    fireRightClick: true, // 启用右键，button的数字为3
    stopContextMenu: true, // 禁止默认右键菜单
    includeDefaultValues: false, // 指示toObject/toDatalessObject是否应该包含默认值，如果设置为false，则优先于对象值
    preserveObjectStacking: true, // 选中时保持原有层级
    drag: {},
    FX_DURATION: 1,
    mode: 'edit',
  });
  resizeCanvas();
  window.myCanvas = myCanvas;
  myCanvas.backgroundColor = 'rgb(245 245 245)';
  Object.assign(pageInfo, getPageById(pageInfo.id));
  if (pageInfo.content) {
    LoadJOSN(pageInfo.content, function () {
      setBackGround();
      myCanvas.saveHistory();
    });
  } else {
    setBackGround();
    myCanvas.saveHistory();
  }

  window.onresize = function () {
    resizeCanvas();
  };
  window.updateComponentArr = updateComponentArr;
  //画布缩放拖动
  CanvasDragZoom(myCanvas, function () {
    undateAScaleOtions();
    updateComponentArr();
  });
  // 更新当前选中元素
  myCanvas.on({
    'selection:created': selectionUpdate,
    'selection:updated': selectionUpdate,
    'object:moving': selectionUpdate,
    'object:scaling': selectionUpdate,
    'object:resizing': selectionUpdate,
    'object:rotating': selectionUpdate,
    'object:skewing': selectionUpdate,
    'object:modified': selectionUpdate,
    'selection:cleared': selectionUpdate,
    drop: function (opt) {
      const point = getPoint(opt, myCanvas);
      createNode(point, myCanvas.dragItem);
    },
    'mouse:up': function (opt) {
      if (opt.e.which == 3 && opt.target && !lineActive.start) {
        myCanvas.setActiveObject(opt.target);
        setTimeout(() => {
          menuPostion.show = true;
          menuPostion.left = opt.e.offsetX;
          menuPostion.top = opt.e.offsetY;
        });
      }
    },
  });
  //历史记录

  myCanvas.on({
    'object:modified': myCanvas.saveHistory,
    'object:added': updateObjectList,
    'object:removed': updateObjectList,
  });

  // 画线
  myCanvas.on({
    'mouse:up': function (opt) {
      if (!lineActive.start) return;
      const point = getPoint(opt, myCanvas);
      const {which} = opt.e;
      if (which == 1) {
        if (!lineActive.firstDown) {
          const option = {
            id: getUuid(),
            ...JSON.parse(JSON.stringify(lineActive.defaultValue)),
          };
          lineActive.points = [
            {x: point.x, y: point.y},
            {x: point.x, y: point.y},
          ];
          lineActive.line = new fabric[lineActive.defaultValue.type](lineActive.points, option);
          myCanvas.add(lineActive.line);
          lineActive.firstDown = true;
        } else {
          lineActive.points.push({x: point.x, y: point.Y});
        }
      } else if (which == 3) {
        lineActive.line._setPositionDimensions({});
        lineActive.line.setControl();
        myCanvas.saveHistory();
        Object.assign(lineActive, {
          id: '',
          start: false,
          firstDown: false,
          defaultValue: {},
          line: '',
          points: [],
        });
      }
      myCanvas.renderAll();
    },
    'mouse:move': function (opt) {
      if (!lineActive.start) return;
      const point = getPoint(opt, myCanvas);
      if (lineActive.line) {
        let points = lineActive.points;
        let newPoint = {
          x: point.x,
          y: point.y,
        };
        points[points.length - 1].x = newPoint.x;
        points[points.length - 1].y = newPoint.y;
      }
      myCanvas.renderAll();
    },
  });
  // 更新vue组件坐标
  myCanvas.on({
    'object:moving': updateComponentArr,
    'object:scaling': updateComponentArr,
    'object:resizing': updateComponentArr,
    'object:rotating': updateComponentArr,
    'object:skewing': updateComponentArr,
    'object:modified': updateComponentArr,
  });
};
// 导出json
const saveJSON = () => {
  if (!pageInfo.id) return;
  // 取消fabrci选择
  myCanvas.discardActiveObject();
  myCanvas.renderAll();
  // 拿到当前fabrci的json
  const canvasData = myCanvas.toJSON();
  localStorage.previewJson = JSON.stringify(canvasData);
  // 隐藏刻度尺、隐藏网格
  aScaleOtions.show = false;
  const girdShow = myCanvas.Background.girdShow;
  myCanvas.Background.set('girdShow', false);
  myCanvas.renderAll();
  // 画布居中显示
  fabricCenterView(myCanvas, myCanvas.Background.width, myCanvas.Background.height);
  // 更新vue
  updateComponentArr();
  setTimeout(async () => {
    // 获取截屏照片
    const base = await getJpeg(document.getElementById('workspace'), myCanvas);


    const formData = new FormData();
    formData.append('file', base.file);
    const imgResult = await axios.post('http://43.143.72.33:3999/api/file/upload', formData, {
      'Content-type': 'multipart/form-data',
      headers: {'X-Access-Token': ''},
    });
    // 修改
    updatePage({
      id: pageInfo.id,
      content: JSON.stringify(canvasData),
      thumbnailUrl: imgResult.data.data,
    })
    message.success('保存成功')
    // 展示刻度尺
    aScaleOtions.show = true;
    // 恢复网格设置
    myCanvas.Background.set('girdShow', girdShow);
    myCanvas.renderAll();
  },);
};
// 预览
const previewJson = () => {
  localStorage.previewJson = JSON.stringify(myCanvas.toJSON());
  toConfiguration(
      {
        preview: 1,
      },
      true
  );
};
// 上传图片
const uploadSuccess = (url) => {
  url = getSrc(url);
  createNode(
      {top: 0, left: 0},
      {
        name: '图片',
        content: {
          type: 'FullImage',
          url: url,
          draggable: true,
        },
        thumbnailUrl: url,
      }
  );
};
// 右键菜单点击事件
const menuClick = async (type) => {
  const selected = toRaw(selectObject.objects);
  const objects = myCanvas.getActiveObject();
  if (!selected) return;
  switch (type) {
    case 'del':
      // 删除
      delObject();
      break;
    case 'make':
      // 组合
      let group = myCanvas.getActiveObject().toGroup();
      group.id = getUuid();
      break;
    case 'split':
      objects.toActiveSelection();
      // 拆分
      break;
    case 'locking':
      // 锁定
      selected.forEach((i) => {
        i.set({
          selectable: false,
          hoverCursor: 'default',
        });
      });
      myCanvas.discardActiveObject();
      break;
    case 'Unlock':
      selected.forEach((i) => {
        i.set({
          selectable: true,
          hoverCursor: 'move',
        });
      });
      // 解锁
      break;
    case 'bringToFront':
    case 'sendToBack':
    case 'bringForward':
    case 'sendBackwards':
      myCanvas[type](objects);
      if (type === 'sendToBack') myCanvas.bringForward(objects);
      updateObjectList();
      break;
    case 'save':
      // 另存为
      if (selected.length > 1) return;
      objects.includeDefaultValues = false;
      let json = objects.toJSON();
      if (!json.draggable) {
        json.points = undefined;
        json.width = undefined;
        json.height = undefined;
      }
      json.top = undefined;
      json.left = undefined;
      json.id = undefined;
      json.uid = undefined;
      await defHttp.post({
        url: '/cfgtool/cfgtoolComponent/add',
        params: {
          name: json.name,
          thumbnailUrl: json.thumbnailUrl,
          content: JSON.stringify(json),
          type: '1',
        },
      });
      await getLeftList();
      break;
    default:
      break;
  }
  selectionUpdate();
  myCanvas.requestRenderAll();
};
//删除元素
const delObject = () => {
  let selected = toRaw(selectObject.objects);
  myCanvas.discardActiveObject();
  deepLoopObjects(selected, function (e) {
    if (e.hasDom) {
      const index = componentArr.value.findIndex((i) => i.id === e.id);
      index >= 0 && componentArr.value.splice(index, 1);
    }
    myCanvas.remove(e);
  });
  myCanvas.saveHistory();
};
onMounted(() => {
  window.echarts = echarts;
  init();
  document.onkeydown = function (e) {
    if (document.activeElement.nodeName !== 'BODY') return;
    const {keyCode, ctrlKey} = e;
    switch (keyCode) {
      case 46:
        // Check pressed button is Delete  删除
        delObject();
        e.preventDefault();
        break;
      default:
        break;
    }
    if (!ctrlKey) return;
    switch (keyCode) {
      case 67:
        // Check pressed button is C - Ctrl+C.  复制
        if (!myCanvas.getActiveObject()) return;
        myCanvas.getActiveObject().clone(function (cloned) {
          myCanvas._clipboard = cloned;
        });
        e.preventDefault();
        break;
      case 86:
        // Check pressed button is V - Ctrl+V.  粘贴
        if (!myCanvas._clipboard) return;
        myCanvas._clipboard.clone(function (clonedObj) {
          myCanvas.discardActiveObject();
          clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
          });
          if (clonedObj.type === 'activeSelection') {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = myCanvas;
            clonedObj.forEachObject(function (obj) {
              myCanvas.add(obj);
            });
            // this should solve the unselectability
            clonedObj.setCoords();
          } else {
            myCanvas.add(clonedObj);
          }
          myCanvas._clipboard.top += 10;
          myCanvas._clipboard.left += 10;
          myCanvas.setActiveObject(clonedObj);
          myCanvas.requestRenderAll();

          let selected = toRaw(selectObject.objects);
          deepLoopObjects(selected, function (e) {
            e.id = getUuid();
            if (e.hasDom) pushComponentArr(e);
          });
          selectionUpdate();
        });
        e.preventDefault();
        break;
      case 90:
        // Check pressed button is Z - Ctrl+Z. 撤回
        myCanvas.undo(function (json) {
          LoadJOSN(json);
        });
        e.preventDefault();
        break;
      case 89:
        e.preventDefault();
        break;
      case 83:
        // Check pressed button is S - Ctrl+S. 保存
        saveJSON();
        e.preventDefault();
        break;
      default:
        break;
    }
  };
  document.onmousedown = function () {
    menuPostion.show = false;
  };
});
onBeforeUnmount(() => {
  window.echarts = null;
  window.myCanvas = null;
  window.updateComponentArr = null;
  document.onkeydown = null;
  document.onmousedown = null;
});
const rightStyle = reactive({
  width: '200px',
});
</script>
<style scoped lang="less">
@import './index.less';
@import './iconfont.css';
</style>
