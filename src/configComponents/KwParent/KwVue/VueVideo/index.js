import {defineAsyncComponent, markRaw} from 'vue';

/**
 *
 * */
function install() {
  fabric.VueVideo = fabric.util.createClass(fabric.Vue, {
    type: 'VueVideo',
    url: 'http://101.133.174.74:9111/video/hls2/output.m3u8',
    videoControls: true,
    autoplay: true,
    width: 600,
    height: 400,
    initialize: function (options) {
      this.callSuper('initialize', options || {});
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        url: this.get('url'),
        videoControls: this.get('videoControls'),
        autoplay: this.get('autoplay'),
      });
    },

    _render: function () {},
  });
  fabric.VueVideo.fromObject = function (object, callback) {
    callback && callback(new fabric.VueVideo(object));
  };
  fabric.VueVideo.async = true;
}

export default {
  install,
  comp: markRaw(defineAsyncComponent(() => import('./index.vue'))),
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
