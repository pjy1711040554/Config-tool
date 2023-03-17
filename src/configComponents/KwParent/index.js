// 设置公共导出参数
export function getPublicObject(that) {
  return {
    id: that.get('id'), //id 前端自己生成的id用于区分元件
    uid: that.get('uid'), //uid，用于页面跳转，数据推送的id,基本上与databaseId一样，测点级别有区别
    databaseId: that.get('databaseId'), //数据库储存的id,用于回显到树上，因为测点的uid是父级id
    nodeType: that.get('nodeType'), //nodeType  1空间2设备3测点
    treeType: that.get('treeType'), //nodeType  1空间树形2监控树形
    name: that.get('name'), //名称
    thumbnailUrl: that.get('thumbnailUrl'), //缩略图
    draggable: that.get('draggable'), //是否拖拽
    selectable: that.get('selectable'), //禁止框选
    hoverCursor: that.get('hoverCursor'), //鼠标样式
    clickJumpId: that.get('clickJumpId'), //点击跳转连接
    perPixelTargetFind: that.get('perPixelTargetFind'), //点击空白位置不可选中
  };
}

// 批量获取动态组件
export function getDefault(nodes) {
  const comp = {};
  const data = {};
  const style = {};
  const event = {};
  const install = {};
  for (const key in nodes) {
    if (nodes[key].comp) comp[key] = nodes[key].comp;
    if (nodes[key].data) data[key] = nodes[key].data;
    if (nodes[key].style) style[key] = nodes[key].style;
    if (nodes[key].event) event[key] = nodes[key].event;
    if (nodes[key].install) install[key] = nodes[key].install;
  }
  return {
    install,
    comp,
    data,
    style,
    event,
  };
}

/**
 * 导出所有自定义组件
 * 导出为一个对象
 * {
 *    install, 初始化方法（必有）
 *    comp,  vue组件元件（vue类必有）
 *    style, 样式组件
 *    data,  数据组件
 *    event  事件组件
 *}
 * */

function getFile(modules) {
  let objs = {};
  Object.keys(modules).forEach((key) => {
    let objName = key.substring(0, key.lastIndexOf('/'));
    objName = objName.substring(objName.lastIndexOf('/') + 1, objName.length);
    objs[objName] = modules[key].default;
  });
  return objs;
}

function getObj(){
  let Obj = {}
  Object.assign(Obj, getFile(import.meta.globEager(`./*/*.js`)))
  Object.assign(Obj, getFile(import.meta.globEager(`./*/*/*.js`)))
  Object.assign(Obj, getFile(import.meta.globEager(`./*/*/*/*.js`)))
  Object.assign(Obj, getFile(import.meta.globEager(`./*/*/*/*/*.js`)))
  return Obj
}

export default getDefault(getObj());
