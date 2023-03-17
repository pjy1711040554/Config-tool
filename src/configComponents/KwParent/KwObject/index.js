import { getPublicObject } from '../index';

/**
 * 父类object
 * */
function install() {
  fabric.KwObject = fabric.util.createClass(fabric.Object, {
    type: 'KwObject',
    initialize(options) {
      this.callSuper('initialize', options || {});
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        ...getPublicObject(this),
      });
    },
    _render(ctx) {
      this.callSuper('_render', ctx);
    },
  });
  fabric.KwObject.fromObject = (object, callback) => {
    return callback(new fabric.KwObject(object));
  };
  fabric.KwObject.async = true;
}

export default {
  install,
};
