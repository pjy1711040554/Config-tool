import {defineAsyncComponent, markRaw} from 'vue';

/**
 * 温湿度元件
 * */

function install() {
  fabric.CustomTable = fabric.util.createClass(fabric.KwObject, {
    type: 'CustomTable',
    objectCaching: false,
    // perPixelTargetFind: true,
    row: 3, //行
    col: 2, //列
    colWidth: 120, //列宽
    rowHeight: 50, //行高
    stroke: '#838384',
    strokeWidth: 2,
    tableList: [{}, {}, {}],
    stateProperties: fabric.Object.prototype.stateProperties.concat(['row', 'col', 'colWidth', 'rowHeight']),
    cacheProperties: fabric.Object.prototype.stateProperties.concat(['row', 'col', 'colWidth', 'rowHeight']),
    initialize: function (options) {
      options = options || {};
      this.updateWidthHeight();
      this.callSuper('initialize', options);
      this.tableList = JSON.parse(JSON.stringify(this.tableList));
    },

    getMeasurePoints() {
      return this.tableList.map((i) => i.pointName);
    },
    uidDataPush(result) {
      this.tableList.forEach((i) => {
        if (result[i.pointName] !== undefined) {
          i.pointValue = result[i.pointName];
        }
      });
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        row: this.get('row'),
        col: this.get('col'),
        colWidth: this.get('colWidth'),
        rowHeight: this.get('rowHeight'),
        tableList: this.get('tableList'),
      });
    },
    updateWidthHeight() {
      this.width = this.col * +this.colWidth;
      this.height = this.row * +this.rowHeight;
    },

    _render: function (ctx) {
      this.callSuper('_render', ctx);
      const { width, height } = this;
      ctx.beginPath();
      for (var i = 0; i <= height; i += this.rowHeight) {
        ctx.moveTo(-width / 2, i - height / 2);
        ctx.lineTo(width / 2, i - height / 2);
      }
      for (var i = 0; i <= width; i += this.colWidth) {
        ctx.moveTo(i - width / 2, -height / 2);
        ctx.lineTo(i - width / 2, height / 2);
      }
      ctx.lineWidth = this.strokeWidth;
      ctx.strokeStyle = this.stroke;

      ctx.stroke();
      ctx.closePath();
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center'; //文字水平居中
      ctx.font = '16px sans-serif';
      this.tableList.forEach((i, index) => {
        ctx.fillText(i.title || '', -this.colWidth / 2, 30 + -height / 2 + index * 50);
        ctx.fillText((i.pointValue || '0') + ' ' + (i.pointUnit || ''), this.colWidth / 2, 30 + -height / 2 + index * 50);
      });
    },
  });
  fabric.CustomTable.fromObject = function (object, callback) {
    callback && callback(new fabric.CustomTable(object));
  };
  fabric.CustomTable.async = true;
}

export default {
  install,
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
};
