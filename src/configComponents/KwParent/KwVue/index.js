import {getPublicObject} from '../index';

/**
 * vue组件父类
 * */
function install() {
    fabric.Vue = fabric.util.createClass(fabric.KwObject, {
        type: 'Vue',
        hasDom: true, // 是否有dom
        width: 400,
        height: 300,
        fill: 'rgba(0,0,0,0)',
        lockRotation: true, //禁止旋转
        dataType: 1, // 1=静态 2=api
        initialize: function (options) {
            this.callSuper('initialize', options || {});
        },
        // 获取新的div定位位置
        getPosition() {
            let { width, height, top, left, scaleX, scaleY, angle, canvas, opacity } = this;
            let position = {};
            updatePosition(this.group);

            function updatePosition(group) {
              if (!group) return;
              scaleX = scaleX * group.scaleX;
              scaleY = scaleY * group.scaleY;
              top = group.top + (top + group.height / 2) * group.scaleY;
              left = group.left + (left + group.width / 2) * group.scaleX;
              angle = (group.angle + angle) % 360;
              if (group.group) updatePosition(group.group);
            }

            // position.backgroundColor = "rgba(255,255,0,0.2)"
            position.width = width + 1 + 'px';
            position.height = height + 1 + 'px';
            position.top = top * canvas.getZoom() + 'px';
            position.left = left * canvas.getZoom() + 'px';
            position.transform = `rotateZ(${angle}deg) translate(${canvas.viewportTransform[4]}px,${canvas.viewportTransform[5]}px) scale(${scaleX * canvas.getZoom()},${scaleY * canvas.getZoom()})`;
            position.transformOrigin = '0 0 0';
            position.position = 'absolute';
            position.overflow = 'hidden';
            position.opacity = opacity;
            return position;


            // https://codepen.io/rolitter/pen/qBxMmvw?editors=0010
            // https://codepen.io/pjy1711040554/pen/vYzrdmq?editors=0010
        },
        toObject: function () {
            return fabric.util.object.extend(this.callSuper('toObject'), {
                ...getPublicObject(this),
                dataType: this.get('dataType'),
            });
        },

        _render: function () {
        },
    });
    fabric.Vue.fromObject = function (object, callback) {
        callback && callback(new fabric.Vue(object));
    };
    fabric.Vue.async = true;
}

export default {
    install,
};
