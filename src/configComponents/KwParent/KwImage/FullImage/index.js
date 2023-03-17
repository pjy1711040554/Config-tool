import {defineAsyncComponent, markRaw} from 'vue';

/**
 * 自定义图片元件，图片会根据宽高拉伸
 * */
function install() {
    fabric.FullImage = fabric.util.createClass(fabric.KwImage, {
        type: 'FullImage',

        initialize: function (element, options) {
            options || (options = {});
            this.callSuper('initialize', element, options);
        },

        toObject: function () {
            return fabric.util.object.extend(this.callSuper('toObject'), {});
        },

        _render: function (ctx) {
            const {width, height} = this;
            this._element && ctx.drawImage(this._element, -width / 2, -height / 2, width, height);
        },
    });
    fabric.FullImage.fromURL = function (url, callback, object) {
        fabric.util.loadImage(
            url,
            function (img, isError) {
                callback && callback(new fabric.FullImage(img, object), isError);
            },
            null,
            (object && object.crossOrigin)
        );
    };
    fabric.FullImage.fromObject = function (object, callback) {
        fabric.util.loadImage(
            object.src,
            function (img) {
                callback && callback(new fabric.FullImage(img, object));
            },
            null,
            (object && object.crossOrigin)
        );
    };
    fabric.FullImage.async = true;
}

export default {
    install,
    style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
