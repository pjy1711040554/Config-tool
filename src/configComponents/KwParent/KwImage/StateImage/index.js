import {defineAsyncComponent, markRaw} from 'vue';

/**
 * 自定义图片元件，图片会根据宽高拉伸
 * 状态图片
 * 告警会有小圆点
 * 其他多态替换图片
 * */
function install() {
  fabric.StateImage = fabric.util.createClass(fabric.KwImage, {
    type: 'StateImage',
    pointColor: '',
    pointList: [{ key: '', value: '', symbol: '==' }],
    replaceImage: '',
    replaceList: [{ key: '', value: '', symbol: '==', url: '' }],
    initialize: function (element, options) {
      options || (options = {});
      this.callSuper('initialize', element, options);
      this.pointList = JSON.parse(JSON.stringify(this.pointList));
      this.replaceList = JSON.parse(JSON.stringify(this.replaceList));
      this.uidData = JSON.parse(JSON.stringify(this.uidData));
    },
    getMeasurePoints() {
      return [].concat(
        this.pointList.map((i) => i.key),
        this.replaceList.map((i) => i.key)
      );
    },
    uidDataPush(result) {
      const { uidData } = this;
      Object.assign(uidData, result);

      const pointResult = this.pointList.some(({ key, value, symbol }) => {
        if (uidData[key] !== undefined && symbol && value !== undefined) {
          return new Function(`return ${uidData[key]} ${symbol} ${value}`)();
        }
        return false;
      });
      this.pointColor = pointResult ? 'red' : '';

      let rep = false;
      this.replaceList.forEach(({ key, value, symbol, url }) => {
        if (uidData[key] != undefined && symbol && value !== undefined && url) {
          const flag = new Function(`return ${uidData[key]} ${symbol} ${value}`)();
          if (flag) {
            this.loadImage(url);
            rep = true;
          }
        }
      });
      if (!rep) this.loadImage(this.src);
    },
    // 加载图片
    loadImage(url) {
      url &&
        fabric.util.loadImage(
          url,
          (img) => {
            this._element = img;
          },
          null,
          'Anonymous'
        );
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        pointList: this.get('pointList'),
        replaceList: this.get('replaceList'),
      });
    },

    _render: function (ctx) {
      const { width, height, pointColor } = this;
      this._element && ctx.drawImage(this._element, -width / 2, -height / 2, width, height);

      if (pointColor) {
        ctx.beginPath(); //按照下边参数开始绘制新路径
        ctx.arc(width / 2 - 10, -height / 2 + 10, 5, 0, Math.PI * 2, true);
        ctx.closePath(); //关闭路径
        ctx.fillStyle = pointColor; //设置填充颜色
        ctx.fill(); //开始填充
      }
    },
  });
  fabric.StateImage.fromURL = function (url, callback, object) {
    fabric.util.loadImage(
      url,
      function (img, isError) {
        callback && callback(new fabric.StateImage(img, object), isError);
      },
      null,
      (object && object.crossOrigin) || 'Anonymous'
    );
  };
  fabric.StateImage.fromObject = function (object, callback) {
    fabric.util.loadImage(
      object.src,
      function (img) {
        callback && callback(new fabric.StateImage(img, object));
      },
      null,
      (object && object.crossOrigin) || 'Anonymous'
    );
  };
  fabric.StateImage.async = true;
}

export default {
  install,
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
