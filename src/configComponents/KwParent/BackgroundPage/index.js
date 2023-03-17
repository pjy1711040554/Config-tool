import { getPublicObject } from '../index';

/**
 * 画布主体组件
 * */
function install() {
  fabric.BackgroundPage = fabric.util.createClass(fabric.Object, {
    type: 'BackgroundPage',
    top: 0,
    left: 0,
    width: 1920,
    height: 1080,
    shadow: {
      color: 'rgba(0,0,0,.5)',
      blur: 2,
      offsetX: 0,
      offsetY: 0,
    },
    fill: 'transparent', // 填充色
    selectable: false, // 无选择
    hasControls: true, // 无控制器
    hasBorders: false, // 无边框
    hoverCursor: 'default', // 无鼠标样式
    imgElement: null, // 背景图片element
    useless: 0,
    styleType: 'color', // 背景样式类型
    evented: false, // 无事件
    styleColor: '#FFF', //默认背景颜色
    styleImage: '', // 默认背景图片url
    backgroundColor: '#FFF', // 页面背景颜色
    interval: 10, //格子间隔
    gridColor: '#cecece',
    gridColor2: '#ebebeb',
    girdShow: true,
    wsUrl: '',
    showMeasuringPoint: true, // 当页面为设备组态时候，是否展示测点tab
    showGiveAlarm: true, // 当页面为设备组态时候，是否展示告警tab
    showMode: 1, // 页面展示模式， 1展示工作区域，2展示所有，3默认宽高，
    stateProperties: fabric.Object.prototype.stateProperties.concat(['useless', 'styleType', 'styleColor', 'styleImage', 'interval', 'gridColor', 'gridColor2', 'girdShow']),
    cacheProperties: fabric.Object.prototype.stateProperties.concat(['useless', 'styleType', 'styleColor', 'styleImage', 'interval', 'gridColor', 'gridColor2', 'girdShow']),
    initialize: function (options) {
      options = options || {};
      this.callSuper('initialize', options);
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        styleType: this.get('styleType'),
        styleColor: this.get('styleColor'),
        styleImage: this.get('styleImage'),
        interval: this.get('interval'),
        gridColor: this.get('gridColor'),
        gridColor2: this.get('gridColor2'),
        girdShow: this.get('girdShow'),
        backgroundColor: this.get('backgroundColor'),
        wsUrl: this.get('wsUrl'),
        showMeasuringPoint: this.get('showMeasuringPoint'),
        showGiveAlarm: this.get('showGiveAlarm'),
        showMode: this.get('showMode'),
        ...getPublicObject(this),
      });
    },
    // 加载图片
    loadImage(url) {
      this.imgElement = null;
      if (!url) return;
      fabric.util.loadImage(
        url,
        (img) => {
          this.imgElement = img;
          this.set('useless', this.useless + 1);
          this.canvas.renderAll();
        },
        null,
        'Anonymous'
      );
    },

    _render: function (ctx) {
      this.callSuper('_render', ctx);
      const { width: w, height: h, styleType, styleColor, styleImage, imgElement, interval, gridColor, gridColor2, girdShow } = this;
      const x = -w / 2;
      const y = -h / 2;
      if (styleType === 'color') {
        ctx.fillStyle = styleColor;
        ctx.fillRect(x, y, w, h);
      } else if (styleType === 'image') {
        if (!imgElement) {
          this.loadImage(styleImage);
          ctx.fillStyle = styleColor;
          ctx.fillRect(x, y, w, h);
        } else {
          ctx.drawImage(imgElement, x, y, w, h);
        }
      }
      if (girdShow && this.canvas.mode !== 'preview') {
        for (let i = 0; i < parseInt(w / interval) + 1; i++) {
          ctx.beginPath();
          ctx.moveTo(i * interval + x, y);
          ctx.lineTo(i * interval + x, h / 2);
          ctx.strokeStyle = i % 5 == 0 ? gridColor : gridColor2;
          ctx.stroke();
        }

        for (let i = 0; i < parseInt(h / interval) + 1; i++) {
          ctx.beginPath();
          ctx.moveTo(x, y + i * interval);
          ctx.lineTo(w / 2, y + i * interval);
          ctx.strokeStyle = i % 5 == 0 ? gridColor : gridColor2;
          ctx.stroke();
        }
      }
    },
  });
  fabric.BackgroundPage.fromObject = function (object, callback) {
    callback && callback(new fabric.BackgroundPage(object));
  };
  fabric.BackgroundPage.async = true;
}

export default {
  install,
};
