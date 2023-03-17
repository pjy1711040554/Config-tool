import { getPublicObject } from '../index';
import {defineAsyncComponent, markRaw} from 'vue';

/**
 * 父级文本元件
 * */
function install() {
  fabric.KwTextbox = fabric.util.createClass(fabric.Textbox, {
    type: 'KwTextbox',
    initialize: function (text, options) {
      options || (options = {});
      this.callSuper('initialize', text, options);
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        ...getPublicObject(this),
      });
    },

    _render: function (ctx) {
      this.callSuper('_render', ctx);
    },
  });
  fabric.KwTextbox.fromObject = function (options, callback) {
    callback && callback(new fabric.KwTextbox(options.text, options));
  };
  fabric.KwTextbox.async = true;
}

export default {
  install,
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
