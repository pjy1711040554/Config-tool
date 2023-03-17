import {defineAsyncComponent, markRaw} from 'vue';

/**
 * 指示线
 * */
function install() {
  fabric.IndicatorLine = fabric.util.createClass(fabric.KwPolyline, {
    type: 'IndicatorLine',
    text: '设备',
    textWidth: 0,
    initialize: function (options = {}) {
      this.callSuper(
        'initialize',
        options.points || [
          {
            x: 118,
            y: 104,
          },
          {
            x: 158,
            y: 131,
          },
          {
            x: 178,
            y: 209,
          },
        ],
        options
      );
      this.set('strokeWidth', options.strokeWidth || 2);
      this.set('stroke', options.stroke || 'rgba(0, 255, 255, 1)');
      this.set('stroke2', options.stroke2 || 'rgba(0, 255, 255, 1)');
      this.set('fill', options.fill || 'transparent');
      this.set('objectCaching', options.objectCaching || false);
      this.set('perPixelTargetFind', options.perPixelTargetFind || true);
      this.updateTextWidth();
      this.setControl();
    },
    updateTextWidth() {
      this.textWidth = this.getTextWidth(this.text, 16) + 40;
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        text: this.get('text'),
      });
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
      const { points, pathOffset } = this;
      const w = this.textWidth;
      const h = 35;
      const [point1] = points;
      let x = point1.x - pathOffset.x - w / 2;
      let y = point1.y - pathOffset.y - h / 2;

      const r = h / 2;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
      ctx.lineTo(x + w, y + h - r);
      ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
      ctx.lineTo(x + r, y + h);
      ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
      ctx.lineTo(x, y + r);
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
      ctx.fillStyle = 'rgba(81, 140, 77, 0.9)';
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00ffff';
      ctx.fill();
      ctx.stroke();
      ctx.closePath();

      ctx.fillStyle = '#00ffff';
      ctx.textAlign = 'center'; //文字水平居中
      ctx.font = '16px sans-serif';
      ctx.fillText(this.text, x + w / 2, y + h / 1.5);
      ctx.stroke();
    },
  });
  fabric.IndicatorLine.fromObject = function (object, callback) {
    const IndicatorLine = new fabric.IndicatorLine(object);
    IndicatorLine.setControl();
    callback && callback(IndicatorLine);
  };
  fabric.IndicatorLine.async = true;
}

export default {
  install,
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
