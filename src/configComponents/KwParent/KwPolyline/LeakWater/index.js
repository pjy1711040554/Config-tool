import {defineAsyncComponent, markRaw} from 'vue';

/**
 * 漏水绳
 * */

function install() {
  fabric.LeakWater = fabric.util.createClass(fabric.KwPolyline, {
    type: 'LeakWater',
    LeakWaterLength: 60, //物理长度
    LeakWaterPosi: -1, // 漏水位置
    LeakWaterOffset: 0, // 偏移量
    waterPoint: {}, // 漏水坐标
    initialize: function (element, options = {}) {
      this.callSuper('initialize', element, options);
      this.updateWaterPoint();
    },
    uidDataPush(value) {
      this.set('LeakWaterPosi', value);
      this.updateWaterPoint();
    },
    updateWaterPoint() {
      //获取折线每一段长度 和总体长度
      this.getDistance();
      let point = this.LeakWaterPosi + this.LeakWaterOffset;
      //漏水位置大于物理长度 或者小于0 则终止
      if (point == this.LeakWaterLength) point -= 0.1;
      if (point >= this.LeakWaterLength || point < 0) return;
      // 漏水位置所在的百分比 在总长度位置
      let pointPosition = (point / this.LeakWaterLength) * this.pointLengthCount;
      // 得到漏水下标
      let index = this.pointLengthArr.findIndex((item) => {
        if (pointPosition - item <= 0) return true;
        pointPosition -= item;
      });
      if (index < 0) return;
      //在漏水线条的百分比位置
      let straightLineBfb = pointPosition / this.pointLengthArr[index];
      let point1 = this.points[index];
      let point2 = this.points[index + 1];
      //得到漏水的坐标
      this.waterPoint = {
        x: (point2.x - point1.x) * straightLineBfb + point1.x,
        y: (point2.y - point1.y) * straightLineBfb + point1.y,
      };
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        LeakWaterLength: this.get('LeakWaterLength'),
        LeakWaterPosi: this.get('LeakWaterPosi'),
        LeakWaterOffset: this.get('LeakWaterOffset'),
      });
    },
    // 画水滴
    drawWater(ctx) {
      if (!this.waterPoint.x || !this.waterPoint.y) return;
      const size = 8;
      ctx.fillStyle = '#00acec';
      ctx.translate(this.waterPoint.x - this.pathOffset.x, this.waterPoint.y - this.pathOffset.y);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.scale(1, -1);
      ctx.quadraticCurveTo(size, -size, size, -size * 2);
      ctx.arc(0, -size * 2, size, 0, Math.PI, true);
      ctx.quadraticCurveTo(-size, -size, 0, 0);
      ctx.fill();
    },

    _render: function (ctx) {
      this.callSuper('_render', ctx);
      // 画布模式为预览模式 则渲染水滴
      if (this.canvas.mode === 'preview') this.drawWater(ctx);
    },
  });
  fabric.LeakWater.fromObject = function (object, callback) {
    const LeakWater = new fabric.LeakWater(object.points, object);
    LeakWater.setControl();
    callback && callback(LeakWater);
  };
  fabric.LeakWater.async = true;
}

export default {
  install,
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
