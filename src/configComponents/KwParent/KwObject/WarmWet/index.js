import {defineAsyncComponent, markRaw} from 'vue';

/**
 * 温湿度元件
 * */

function install() {
  fabric.WarmWet = fabric.util.createClass(fabric.KwObject, {
    type: 'WarmWet',
    warm: '0', // 默认温度
    wet: '0', // 默认湿度
    warmPointName: 'SP004053',
    wetPointName: 'SP004054',
    stateProperties: fabric.Object.prototype.stateProperties.concat(['useless', 'warm', 'wet']),
    cacheProperties: fabric.Object.prototype.stateProperties.concat(['useless', 'warm', 'wet']),
    initialize: function (options) {
      options = options || {};
      this.callSuper('initialize', options);
      this.set('width', options.width || 92);
      this.set('height', options.height || 56);
      this.set('useless', 0);
      this.img = null;
    },
    getMeasurePoints() {
      return [this.warmPointName, this.wetPointName];
    },
    uidDataPush(value) {
      // 温度测点
      if (value[this.warmPointName] !== undefined) this.set('warm', value[this.warmPointName]);
      // 湿度测点
      if (value[this.wetPointName] !== undefined) this.set('wet', value[this.wetPointName]);
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        useless: this.get('useless'),
        warm: this.get('warm'),
        wet: this.get('wet'),
        warmPointName: this.get('warmPointName'),
        wetPointName: this.get('wetPointName'),
      });
    },
    loadImage() {
      fabric.util.loadImage(
        'http://test.falsehood.top/img/WarmWet.svg',
        (img) => {
          this.img = img;
          this.set('useless', this.useless + 1);
          this.canvas.renderAll();
        },
        null,
        'Anonymous'
      );
    },

    _render: function (ctx) {
      this.callSuper('_render', ctx);
      if (!this.img) this.loadImage();
      const { width, height } = this;
      const x = -width / 2;
      const y = -height / 2;

      this.img && ctx.drawImage(this.img, x, y, width, height);
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center'; //文字水平居中
      ctx.fillText(this.warm + ' ℃', x + 60, y + height / 2.9);
      ctx.fillText(this.wet + ' rh%', x + 60, y + height / 1.2);
    },
  });
  fabric.WarmWet.fromObject = function (object, callback) {
    callback && callback(new fabric.WarmWet(object));
  };
  fabric.WarmWet.async = true;
}

export default {
  install,
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
