import {defineAsyncComponent, markRaw} from 'vue';

/**
 * 文本框
 * */

function install() {
  fabric.DeviceText = fabric.util.createClass(fabric.Object, {
    type: 'DeviceText',
    text: '设备',
    stateProperties: fabric.Object.prototype.stateProperties.concat(['useless', 'text']),
    cacheProperties: fabric.Object.prototype.stateProperties.concat(['useless', 'text']),
    initialize: function (options) {
      options = options || {};
      this.callSuper('initialize', options);
      this.set('width', options.width || 70);
      this.set('height', options.height || 35);
      this.set('useless', 0);
      this.img = null;
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        useless: this.get('useless'),
        text: this.get('text'),
      });
    },
    loadImage() {
      fabric.util.loadImage(
        'http://test.falsehood.top/img/DeviceText.svg',
        (img) => {
          this.img = img;
          this.set('useless', this.useless + 1);
          this.canvas.renderAll();
        },
        null,
        'Anonymous'
      );
    },
    getTextWidth(text, fontSize) {
      // 创建临时元素
      const _span = document.createElement('span');
      // 放入文本
      _span.innerText = text;
      // 设置文字大小
      _span.style.fontSize = fontSize + 'px';
      // span元素转块级
      _span.style.position = 'absolute';
      // span放入body中
      document.body.appendChild(_span);
      // 获取span的宽度
      let width = _span.offsetWidth;
      // 从body中删除该span
      document.body.removeChild(_span);
      // 返回span宽度
      return width;
    },

    _render: function (ctx) {
      this.callSuper('_render', ctx);
      this.set('width', this.getTextWidth(this.text, 16) + 40);
      if (!this.img) this.loadImage();
      const { width, height } = this;
      const x = -width / 2;
      const y = -height / 2;

      this.img && ctx.drawImage(this.img, x, y, width, height);
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center'; //文字水平居中
      ctx.font = '16px sans-serif';
      ctx.fillText(this.text, 0, y + height / 1.5);
    },
  });
  fabric.DeviceText.fromObject = function (object, callback) {
    callback && callback(new fabric.DeviceText(object));
  };
  fabric.DeviceText.async = true;
}

export default {
  install,
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
