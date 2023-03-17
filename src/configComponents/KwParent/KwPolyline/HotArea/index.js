import {defineAsyncComponent, markRaw} from 'vue';

/**
 * 电路
 * */
function install() {
  fabric.HotArea = fabric.util.createClass(fabric.KwPolyline, {
    type: 'HotArea',
    fill: 'rgba(133,207,255,0.3)',
    name: '线条',
    stroke: 'rgba(255,255,255,0)',
    stroke2: 'rgba(255,255,255,0)',
    strokeWidth: 10,
    strokeWidth2: 1,
    objectCaching: false,
    strokeDashArray: [],
    strokeDashArray2: [],
    perPixelTargetFind: true,
    warningList: [{ key: '', value: '', symbol: '==', color: '' }],
    uidData: {},
    initialize: function (element, options = {}) {
      this.callSuper('initialize', element, options);
      this.warningList = JSON.parse(JSON.stringify(this.warningList));
      this.uidData = JSON.parse(JSON.stringify(this.uidData));

      this.on('mouseover', function () {
        if (this.canvas.mode === 'edit') return;
        this.set('fill', 'rgba(133,207,255,0.8)');
      });

      this.on('mouseout', function () {
        if (this.canvas.mode === 'edit') return;
        this.set('fill', 'rgba(133,207,255,0.3)');
      });
    },
    getMeasurePoints() {
      return this.warningList.map((i) => i.key);
    },
    uidDataPush(result) {
      const { uidData } = this;
      Object.assign(uidData, result);

      let rep = false;
      this.warningList.forEach(({ key, value, symbol, color }) => {
        if (uidData[key] !== undefined && symbol && value && color) {
          const flag = new Function(`return ${uidData[key]} ${symbol} ${value}`)();
          if (flag) {
            this.set('fill', color);
            rep = true;
          }
        }
      });
      if (!rep) this.set('fill', 'rgba(133,207,255,0.5)');
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        warningList: this.get('warningList'),
      });
    },

    _render: function (ctx) {
      this.callSuper('_render', ctx);
    },
  });
  fabric.HotArea.fromObject = function (object, callback) {
    const HotArea = new fabric.HotArea(object.points, object);
    HotArea.setControl();
    callback && callback(HotArea);
  };
  fabric.HotArea.async = true;
}

export default {
  install,
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
