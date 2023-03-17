import {defineAsyncComponent, markRaw} from 'vue';

/**
 * 父级文本元件
 * */
function install() {
  fabric.PointText = fabric.util.createClass(fabric.KwTextbox, {
    type: 'PointText',
    pointName: '',
    pointUnit: '',
    width: 120,
    initialize: function (text, options) {
      options || (options = {});
      this.callSuper('initialize', text, options);
      if (this.pointUnit) {
        this.set('text', 0 + ' ' + this.pointUnit);
      }
    },
    setUidPoint(data = {}) {
      this.uid = data.uid;
      this.pointName = data.point;
    },
    getMeasurePoints() {
      return [this.pointName];
    },
    uidDataPush(value) {
      if (this.pointName && value[this.pointName] !== undefined) {
        this.set('text', value[this.pointName] + ' ' + this.pointUnit);
      }
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        pointName: this.get('pointName'),
        pointUnit: this.get('pointUnit'),
      });
    },

    _render: function (ctx) {
      this.callSuper('_render', ctx);
    },
  });
  fabric.PointText.fromObject = function (options, callback) {
    callback && callback(new fabric.PointText(options.text, options));
  };
  fabric.PointText.async = true;
}

export default {
  install,
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
