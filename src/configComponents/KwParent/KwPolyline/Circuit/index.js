import {defineAsyncComponent, markRaw} from 'vue';

/**
 * 电路
 * */
function install() {
  fabric.Circuit = fabric.util.createClass(fabric.KwPolyline, {
    type: 'Circuit',
    strokeLineCap:'round',
    strokeLineJoin:'round',
    strokeLineCap2:'round',
    strokeLineJoin2:'round',
    speed: 0.1, //默认流速
    initialize: function (element, options = {}) {
      this.callSuper('initialize', element, options);
    },
    // 动画
    anim() {
      this.strokeDashOffset2 -= this.speed;
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        speed: this.get('speed'),
      });
    },

    _render: function (ctx) {
      this.callSuper('_render', ctx);
    },
  });
  fabric.Circuit.fromObject = function (object, callback) {
    const Circuit = new fabric.Circuit(object.points, object);
    Circuit.setControl();
    callback && callback(Circuit);
  };
  fabric.Circuit.async = true;
}

export default {
  install,
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
