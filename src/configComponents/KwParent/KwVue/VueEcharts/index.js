import {defineAsyncComponent, markRaw} from 'vue';

/**
 * 普通echarts组件
 * */
function install() {
  fabric.VueEcharts = fabric.util.createClass(fabric.Vue, {
    type: 'VueEcharts',
    theme: 'light', // 默认主题
    renderType: 'canvas', // 默认渲染类型 svg/canvas
    apiUrl: '',
    apiTime: 0,
    dataHandle: `/**\n* @param option echarts配置项\n* @param result api返回值\n*/\nfunction getData(option,result) {\n    return option\n}`, //默认数据处理内容
    optionStr: `option = {
  title: {
    text: '',
    left: 'center'
  },
  tooltip: {
    show: true,
    trigger: 'axis'
  },
  grid: {
  
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
}`, // 默认配置
    initialize: function (options) {
      this.callSuper('initialize', options || {});
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        optionStr: this.get('optionStr'),
        dataHandle: this.get('dataHandle'),
        theme: this.get('theme'),
        renderType: this.get('renderType'),
        apiUrl: this.get('apiUrl'),
        apiTime: this.get('apiTime'),
      });
    },

    _render: function () {},
  });
  fabric.VueEcharts.fromObject = function (object, callback) {
    callback && callback(new fabric.VueEcharts(object));
  };
  fabric.VueEcharts.async = true;
}

export default {
  install,
  comp: markRaw(defineAsyncComponent(() => import('./index.vue'))),
  data: markRaw(defineAsyncComponent(() => import('./data.vue'))),
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
