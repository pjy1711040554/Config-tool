import {defineAsyncComponent, markRaw} from 'vue';

/**
 * 普通echarts组件
 * */
function install() {
  fabric.VueEchartsMap = fabric.util.createClass(fabric.Vue, {
    type: 'VueEchartsMap',
    width: 600,
    height: 600,
    cityCode: 'china',
    cityName: '全国',
    styleType: '1',
    renderType: 'canvas',
    theme: 'light',
    initialize(options) {
      options.styles = options.styles || {};
      this.callSuper('initialize', options || {});
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        cityCode: this.get('cityCode'),
        cityName: this.get('cityName'),
        styleType: this.get('styleType'),
        renderType: this.get('renderType'),
        theme: this.get('theme'),
      });
    },
    _render(ctx) {
      this.callSuper('_render', ctx);
    },
  });
  fabric.VueEchartsMap.fromObject = (object, callback) => {
    return callback(new fabric.VueEchartsMap(object));
  };
  fabric.VueEchartsMap.async = true;
}

export default {
  install,
  comp: markRaw(defineAsyncComponent(() => import('./index.vue'))),
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
