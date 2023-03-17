import { getPublicObject } from '../index';
import {defineAsyncComponent, markRaw} from 'vue';

/**
 * 父类object
 * */
function install() {
  fabric.KwRect = fabric.util.createClass(fabric.Rect, {
    type: 'KwRect',
    width: 300,
    height: 300,
    strokeUniform: true,
    perPixelTargetFind: true,
    warningList: [{ key: '', value: '', symbol: '==', color: '' }],
    uidData: {},
    defaultFill: '',
    initialize(options) {
      this.callSuper('initialize', options || {});
      this.warningList = JSON.parse(JSON.stringify(this.warningList));
      this.uidData = JSON.parse(JSON.stringify(this.uidData));
      this.defaultFill = this.fill;
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
      if (!rep) this.set('fill', this.defaultFill);
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        warningList: this.get('warningList'),
        ...getPublicObject(this),
      });
    },
    _render(ctx) {
      this.callSuper('_render', ctx);
    },
  });
  fabric.KwRect.fromObject = (object, callback) => {
    return callback(new fabric.KwRect(object));
  };
  fabric.KwRect.async = true;
}

export default {
  install,
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
