import {defineAsyncComponent, markRaw} from 'vue';

/**
 * 自定义图片元件，图片会根据宽高拉伸
 * */
function install() {
  fabric.HoverImage = fabric.util.createClass(fabric.KwImage, {
    type: 'HoverImage',

    initialize: function (element, options) {
      options || (options = {});
      this.callSuper('initialize', element, options);

      this.set({
        originX: 'center',
        originY: 'center',
        initscaleX: this.scaleX,
        initscaleY: this.scaleY,
      });
      this.on('mouseover', function () {
        if (this.canvas.mode === 'edit') return;
        this.set({
          scaleX: this.initscaleX * 1.1,
          scaleY: this.initscaleY * 1.1,
        });
        this.canvas.renderAll();
      });

      this.on('mouseout', function () {
        if (this.canvas.mode === 'edit') return;
        this.set({
          scaleX: this.initscaleX,
          scaleY: this.initscaleY,
        });
        this.canvas.renderAll();
      });
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {});
    },

    _render: function (ctx) {
      this.callSuper('_render', ctx);
    },
  });
  fabric.HoverImage.fromURL = function (url, callback, object) {
    fabric.util.loadImage(
      url,
      function (img, isError) {
        callback && callback(new fabric.HoverImage(img, object), isError);
      },
      null,
      (object && object.crossOrigin) || 'Anonymous'
    );
  };
  fabric.HoverImage.fromObject = function (object, callback) {
    fabric.util.loadImage(
      object.src,
      function (img) {
        callback && callback(new fabric.HoverImage(img, object));
      },
      null,
      (object && object.crossOrigin) || 'Anonymous'
    );
  };
  fabric.HoverImage.async = true;
}

export default {
  install,
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
