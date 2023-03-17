import initFabric from './KwParent';
import fabricHistory from './fabricHistory';
import { fabric } from 'fabric';

export { initFabric };

/**
 * 初始化fabric
 * */
export function installFabric() {
  //定义选中框样式
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerStyle = 'circle';
  fabric.Object.prototype.cornerColor = '#3782F7';
  fabric.Object.prototype.borderColor = '#3782F7';
  //增加默认获取绑定测点的方法
  fabric.Object.prototype.getMeasurePoints = function () {
    return [];
  };
  //增加默认uid推送接收方法
  fabric.Object.prototype.uidDataPush = function () {};
  //增加默认uid推送接收方法
  fabric.Object.prototype.setUidPoint = function () {};
  //设置默认uid数据
  fabric.Object.prototype.uidData = {};
  //加载自定义组件
  objectInstall(initFabric.install);
  // 加载历史记录方法
  fabricHistory();
}

/**
 * 批量初始化元件
 * */
export function objectInstall(nodes) {
  for (const key in nodes) {
    nodes[key]();
  }
}

/**
 * 重新定位画布位置，保持主体剧中并
 * @param canvas fabric对象
 * @param pageWidth 页面主题宽度
 * @param pageHeight 页面主题高度
 * */
export function fabricCenterView(canvas, pageWidth, pageHeight) {
  //先还原缩放比例与位置
  canvas.setZoom(1);
  canvas.absolutePan({ x: 0, y: 0 });
  const width = canvas.width;
  const height = canvas.height;
  //计算平移坐标
  const panX = (pageWidth - width) / 2;
  const panY = (pageHeight - height) / 2;
  //开始平移
  canvas.absolutePan({ x: panX, y: panY });
  //计算缩放比例
  let zoom = Math.min(width / pageWidth, height / pageHeight);
  zoom = Math.min(1, zoom);
  zoom = Math.max(0.2, zoom);
  zoom = zoom * (canvas.width > pageWidth ? 1 : 0.9);
  //计算缩放中心
  let zoomPoint = new fabric.Point(width / 2, height / 2);
  //开始缩放
  canvas.zoomToPoint(zoomPoint, zoom);
}

/**
 * 深度循环方法
 * @param arr 循环的数组
 * @param callback 回调
 * */
export const deepLoopObjects = (arr, callback) => {
  arr.forEach((item) => {
    if (item._objects) deepLoopObjects(item._objects, callback);
    callback(item);
  });
};
/**
 * 根据key查找元件
 * @param arr 循环的数组
 * @param key key
 * @param value value
 * */
export const getUidByArr = (arr, key, value) => {
  if (!value || !key || arr.length == 0) return null;
  let node = null;
  foreach(arr);

  function foreach(arr) {
    arr.forEach((item) => {
      if (item[key] === value) return (node = item);
      if (item._objects) foreach(item._objects);
    });
  }

  return node;
};
/**
 * 对齐通用方法
 * @param canvas fabrci对象
 * @param method 对齐方式
 * */
export const alignmentMethod = (canvas, method) => {
  const activeSelection = canvas.getActiveObject();
  const objects = myCanvas.getActiveObject().type === 'activeSelection' ? myCanvas.getActiveObject().getObjects() : [myCanvas.getActiveObject()];
  canvas.discardActiveObject();
  let boxPosition = {
    top: objects.length > 1 ? activeSelection.top : 0,
    left: objects.length > 1 ? activeSelection.left : 0,
    width: objects.length > 1 ? activeSelection.width : canvas.Background.width,
    height: objects.length > 1 ? activeSelection.height : canvas.Background.height,
  };
  switch (method) {
    case 'top':
      objects.forEach((i) => {
        i.set('top', boxPosition.top);
      });
      break;
    case 'left':
      objects.forEach((i) => {
        i.set('left', boxPosition.left);
      });
      break;
    case 'bottom':
      objects.forEach((i) => {
        i.set('top', boxPosition.top + boxPosition.height - i.getBoundingRect(true).height);
      });
      break;
    case 'right':
      objects.forEach((i) => {
        i.set('left', boxPosition.left + boxPosition.width - i.getBoundingRect(true).width);
      });
      break;
    case 'centerH':
      objects.forEach((i) => {
        i.set('top', boxPosition.top + boxPosition.height / 2 - i.getBoundingRect(true).height / 2);
      });
      break;
    case 'centerS':
      objects.forEach((i) => {
        i.set('left', boxPosition.left + boxPosition.width / 2 - i.getBoundingRect(true).width / 2);
      });
      break;
    default:
      break;
  }

  const sel = new fabric.ActiveSelection(objects, {
    canvas: canvas,
  });
  canvas.setActiveObject(sel);
  canvas.requestRenderAll();
  updateComponentArr();
};

/**
 * fabrci画布拖动-编辑页面
 * @param canvas fabric对象
 * @param callback 拖动的回调
 * */
export function CanvasDragZoom(canvas, callback) {
  canvas.on('mouse:wheel', function (opt) {
    opt.e.preventDefault();
    opt.e.stopPropagation();
    // @ts-ignore
    if (!window.event.ctrlKey) return;
    const delta = opt.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 50) zoom = 50;
    if (zoom < 0.2) zoom = 0.2;
    canvas.zoomToPoint(
      {
        x: opt.e.offsetX,
        y: opt.e.offsetY,
      },
      zoom
    );
    callback && callback();
  });
  canvas.on('mouse:down', function (opt) {
    const evt = opt.e;
    if (evt.ctrlKey === true) {
      canvas.isDragging = true;
      canvas.selection = false;
      canvas.lastPosX = evt.clientX;
      canvas.lastPosY = evt.clientY;
    }
  });
  canvas.on('mouse:up', function () {
    // on mouse up we want to recalculate new interaction
    // for all objects, so we call setViewportTransform
    canvas.setViewportTransform(canvas.viewportTransform);
    canvas.isDragging = false;
    canvas.selection = true;
  });
  canvas.on('mouse:move', function (opt) {
    // @ts-ignore
    if (canvas.isDragging && window.event.ctrlKey) {
      const e = opt.e;
      const vpt = canvas.viewportTransform;
      vpt[4] += e.clientX - canvas.lastPosX;
      vpt[5] += e.clientY - canvas.lastPosY;
      canvas.requestRenderAll();
      canvas.lastPosX = e.clientX;
      canvas.lastPosY = e.clientY;
      callback && callback();
    }
  });
}

/**
 * fabrci画布拖动-预览页面
 * @param canvas fabric对象
 * @param callback 拖动的回调
 * */
export function CanvasDragZoomPre(canvas, callback) {
  let fabricVuePre = document.getElementById('fabricVuePre');
  fabricVuePre.addEventListener('wheel', (event) => {
    let fabricBox = document.getElementById('fabric-box');
    const delta = event.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 50) zoom = 50;
    if (zoom < 0.2) zoom = 0.2;
    canvas.zoomToPoint(
      {
        x: event.clientX - fabricBox.offsetLeft,
        y: event.clientY - fabricBox.offsetTop,
      },
      zoom
    );
    callback && callback();
  });
  fabricVuePre.addEventListener('mousedown', (event) => {
    canvas.isDragging = true;
    canvas.selection = false;
    canvas.lastPosX = event.clientX;
    canvas.lastPosY = event.clientY;
    event.stopPropagation();
  });
  fabricVuePre.addEventListener('mousemove', (event) => {
    // @ts-ignore
    if (canvas.isDragging) {
      const e = event;
      const vpt = canvas.viewportTransform;
      vpt[4] += e.clientX - canvas.lastPosX;
      vpt[5] += e.clientY - canvas.lastPosY;
      canvas.requestRenderAll();
      canvas.lastPosX = e.clientX;
      canvas.lastPosY = e.clientY;
      callback && callback();
    }
  });
  fabricVuePre.addEventListener('mouseup', () => {
    // on mouse up we want to recalculate new interaction
    // for all objects, so we call setViewportTransform
    canvas.setViewportTransform(canvas.viewportTransform);
    canvas.isDragging = false;
    canvas.selection = true;
  });

  canvas.on('mouse:wheel', function (opt) {
    opt.e.preventDefault();
    opt.e.stopPropagation();
    const delta = opt.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 50) zoom = 50;
    if (zoom < 0.2) zoom = 0.2;
    canvas.zoomToPoint(
      {
        x: opt.e.offsetX,
        y: opt.e.offsetY,
      },
      zoom
    );
    callback && callback();
  });
  canvas.on('mouse:down', function (opt) {
    const evt = opt.e;
    canvas.isDragging = true;
    canvas.selection = false;
    canvas.lastPosX = evt.clientX;
    canvas.lastPosY = evt.clientY;
  });
  canvas.on('mouse:up', function () {
    // on mouse up we want to recalculate new interaction
    // for all objects, so we call setViewportTransform
    canvas.setViewportTransform(canvas.viewportTransform);
    canvas.isDragging = false;
    canvas.selection = true;
  });
  canvas.on('mouse:move', function (opt) {
    // @ts-ignore
    if (canvas.isDragging) {
      const e = opt.e;
      const vpt = canvas.viewportTransform;
      vpt[4] += e.clientX - canvas.lastPosX;
      vpt[5] += e.clientY - canvas.lastPosY;
      canvas.requestRenderAll();
      canvas.lastPosX = e.clientX;
      canvas.lastPosY = e.clientY;
      callback && callback();
    }
  });
}

/**
 * 调整画面位置
 * */
export function setViewByType(canvas) {
  const { width, height } = canvas;
  const { width: workWidth, height: workHeight, showMode } = canvas.BackgroundPage;
  //先还原缩放比例与位置
  canvas.setZoom(1);
  canvas.absolutePan({ x: 0, y: 0 });
  //  1展示工作区域，2展示所有，3默认宽高，
  if (showMode === 3) {
    //什么也不做
  } else if (showMode === 2) {
    //遍历所有对对象，获取最小坐标，最大坐标
    let objects = canvas.getObjects();
    let minX = '';
    let minY = '';
    let maxX = '';
    let maxY = '';
    if (objects.length > 0) {
      let rect = objects[0].getBoundingRect();
      minX = rect.left;
      minY = rect.top;
      maxX = rect.left + rect.width;
      maxY = rect.top + rect.height;
      for (let i = 1; i < objects.length; i++) {
        rect = objects[i].getBoundingRect();
        minX = Math.min(minX, rect.left);
        minY = Math.min(minY, rect.top);
        maxX = Math.max(maxX, rect.left + rect.width);
        maxY = Math.max(maxY, rect.top + rect.height);
      }
    }
    //计算平移坐标
    let panX = (maxX - minX - canvas.width) / 2 + minX;
    let panY = (maxY - minY - canvas.height) / 2 + minY;
    canvas.absolutePan({ x: panX, y: panY });
    let zoom = Math.min(canvas.width / (maxX - minX), canvas.height / (maxY - minY));
    zoom = Math.min(1, zoom);
    zoom = Math.max(0.2, zoom);
    //计算缩放中心
    // var zoomPoint = new fabric.Point((canvas.width + 30) / 2 , (canvas.height + 30) / 2);
    let zoomPoint = new fabric.Point(canvas.width / 2, canvas.height / 2);
    //开始缩放
    canvas.zoomToPoint(zoomPoint, zoom);
  } else {
    //计算平移坐标
    const panX = (workWidth - width) / 2;
    const panY = (workHeight - height) / 2;
    //开始平移
    canvas.absolutePan({ x: panX, y: panY });
    //计算缩放比例
    let zoom = Math.min(width / workWidth, height / workHeight);
    zoom = Math.min(1, zoom);
    zoom = Math.max(0.2, zoom);
    //计算缩放中心
    let zoomPoint = new fabric.Point(width / 2, height / 2);
    //开始缩放
    canvas.zoomToPoint(zoomPoint, zoom);
  }
}
