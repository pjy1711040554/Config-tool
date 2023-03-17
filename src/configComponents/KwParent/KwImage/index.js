import {getPublicObject} from '../index';

/**
 * 父级图片元件
 * */
function install() {
    fabric.KwImage = fabric.util.createClass(fabric.Image, {
        type: 'KwImage',
        initialize: function (element, options) {
            options || (options = {});
            this.callSuper('initialize', element, options);
        },

        toObject: function () {
            return fabric.util.object.extend(this.callSuper('toObject'), {
                url: this.get('url'),
                ...getPublicObject(this),
            });
        },

        _render: function (ctx) {
            this.callSuper('_render', ctx);
        },
    });
    fabric.KwImage.fromURL = function (url, callback, object) {
        fabric.util.loadImage(
            url,
            function (img, isError) {
                callback && callback(new fabric.KwImage(img, object), isError);
            },
            null,
            (object && object.crossOrigin)
        );
    };
    fabric.KwImage.fromObject = function (object, callback) {
        fabric.util.loadImage(
            object.src,
            function (img) {
                callback && callback(new fabric.KwImage(img, object));
            },
            null,
            (object && object.crossOrigin)
        );
    };
    fabric.KwImage.async = true;
}

export default {
    install,
};
