import {defineAsyncComponent, markRaw} from 'vue';

/**
 *
 * */
function install() {
  fabric.VuePage = fabric.util.createClass(fabric.Vue, {
    type: 'VuePage',
    fill: 'red',
    width: 1920,
    height: 1080,
    initialize: function (options) {
      this.callSuper('initialize', options || {});
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {});
    },

    _render: function () {},
  });
  fabric.VuePage.fromObject = function (object, callback) {
    callback && callback(new fabric.VuePage(object));
  };
  fabric.VuePage.async = true;
}

export default {
  install,
  comp: markRaw(defineAsyncComponent(() => import('./index.vue'))),
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
