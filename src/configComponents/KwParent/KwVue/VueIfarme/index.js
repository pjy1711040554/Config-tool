import {defineAsyncComponent, markRaw} from 'vue';

/**
 *
 * */
function install() {
  fabric.VueIfarme = fabric.util.createClass(fabric.Vue, {
    type: 'VueIfarme',
    url: 'https://m.baidu.com/',
    fill: 'red',
    width: 600,
    height: 600,
    initialize: function (options) {
      this.callSuper('initialize', options || {});
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        url: this.get('url'),
      });
    },

    _render: function () {},
  });
  fabric.VueIfarme.fromObject = function (object, callback) {
    callback && callback(new fabric.VueIfarme(object));
  };
  fabric.VueIfarme.async = true;
}

export default {
  install,
  comp: markRaw(defineAsyncComponent(() => import('./index.vue'))),
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
