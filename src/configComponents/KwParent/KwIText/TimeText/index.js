import {defineAsyncComponent, markRaw} from 'vue';
import moment from 'moment';

/**
 * 父级文本元件
 * */
function install() {
  fabric.TimeText = fabric.util.createClass(fabric.KwIText, {
    type: 'TimeText',
    initialize: function (text, options) {
      options || (options = {});
      this.callSuper('initialize', text, options);
      this.set('format', options.format || 'YYYY-MM-DD HH:mm:ss');
      this.set('text', moment().format(this.format));
      setInterval(() => {
        this.set('text', moment().format(this.format));
        this.canvas && this.canvas.requestRenderAll();
      }, 1000);
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        format: this.get('format'),
      });
    },

    _render: function (ctx) {
      this.callSuper('_render', ctx);
    },
  });
  fabric.TimeText.fromObject = function (options, callback) {
    callback && callback(new fabric.TimeText(options.text, options));
  };
  fabric.TimeText.async = true;
}

export default {
  install,
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
