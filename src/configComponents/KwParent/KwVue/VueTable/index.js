import {defineAsyncComponent, markRaw} from 'vue';

/**
 *
 * */
function install() {
  fabric.VueTable = fabric.util.createClass(fabric.Vue, {
    type: 'VueTable',
    width: 400,
    height: 300,
    autoScroll: 0,
    tranSpacing: 0, // 横向间距
    vertSpacing: 0, // 竖向间距

    TheadTdHeight: 30,
    TheadTdFontSize: 12,
    TheadTdFontFamily: '默认',
    TheadTdColor: '#cde0ff',
    TheadTdBgColor: 'rgba(68,86,119,1)',
    TheadTdBgAlign: 'center',

    TbodyTdHeight: 30,
    TbodyTdFontSize: 12,
    TbodyTdFontFamily: '默认',
    TbodyTdColor: '#cde0ff',
    TbodyTdBgColor: 'rgba(68,86,119,1)',
    TbodyTdBgAlign: 'center',

    TableBorder: 'transparent',

    apiUrl: 'http://43.143.72.33:3999/api/zutai/table?columns=name,age,address&count=10',
    apiTime: 3,
    //默认数据处理内容
    dataHandle: `/**
* @param result api返回值
*/
function getData(result) {
    return result
}`,
    columnsStr: `[
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age"
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address"
  }
]`,
    staticDataStr: `[
  {
    name: "John Brown",
    age: 32,
    address: "Sidney No. 1 Lake Park"
  },
  {
    name: "Jim Green",
    age: 42,
    address: "Sidney No. 2 Lake Park"
  },
  {
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 3 Lake Park"
  },
  {
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 4 Lake Park"
  },
  {
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 5 Lake Park"
  },
  {
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 6 Lake Park"
  },
  {
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 7 Lake Park"
  }
]
`,
    initialize: function (options) {
      this.callSuper('initialize', options || {});
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        columnsStr: this.get('columnsStr'),
        staticDataStr: this.get('staticDataStr'),
        autoScroll: this.get('autoScroll'),
        apiUrl: this.get('apiUrl'),
        apiTime: this.get('apiTime'),
        dataHandle: this.get('dataHandle'),
        tranSpacing: this.get('tranSpacing'),
        vertSpacing: this.get('vertSpacing'),

        TheadTdHeight: this.get('TheadTdHeight'),
        TheadTdFontSize: this.get('TheadTdFontSize'),
        TheadTdFontFamily: this.get('TheadTdFontFamily'),
        TheadTdColor: this.get('TheadTdColor'),
        TheadTdBgColor: this.get('TheadTdBgColor'),
        TheadTdBgAlign: this.get('TheadTdBgAlign'),

        TbodyTdHeight: this.get('TbodyTdHeight'),
        TbodyTdFontSize: this.get('TbodyTdFontSize'),
        TbodyTdFontFamily: this.get('TbodyTdFontFamily'),
        TbodyTdColor: this.get('TbodyTdColor'),
        TbodyTdBgColor: this.get('TbodyTdBgColor'),
        TbodyTdBgAlign: this.get('TbodyTdBgAlign'),

        TableBorder: this.get('TableBorder'),
      });
    },

    _render: function () {},
  });
  fabric.VueTable.fromObject = function (object, callback) {
    callback && callback(new fabric.VueTable(object));
  };
  fabric.VueTable.async = true;
}

export default {
  install,
  comp: markRaw(defineAsyncComponent(() => import('./index.vue'))),
  style: markRaw(defineAsyncComponent(() => import('./style.vue'))),
  data: markRaw(defineAsyncComponent(() => import('./data.vue'))),
};
