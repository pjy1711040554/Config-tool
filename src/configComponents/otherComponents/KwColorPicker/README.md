# color-picker

## 前言

ant-design-vue的UI框架中，并没有colorPicker颜色选择器，但是在实际工作中又需要使用到，翻阅了其源码，组件中虽能见到color-picker的声影，但是却是使用不了的，在借鉴element-plus的color-picker的源码下封装了该组件。

效果

![](http://cloud-fae.oss-cn-shenzhen.aliyuncs.com/cyz_admin/color-picker.png)

## 文档

### Attributes

| 参数          | 说明                  | 类型    | 可选值                                                       | 默认值                                                |
| ------------- | --------------------- | ------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| value/v-model | 绑定值                | string  | —                                                            | —                                                     |
| size          | 尺寸                  | string  | large/default/small                                          | default                                               |
| show-alpha    | 是否支持透明度选择    | boolean | —                                                            | false                                                 |
| color-format  | 写入v-model的颜色格式 | string  | hsl/hsv/hex/rgb                                              | hex（show-alpha 为 false）/ rgb（show-alpha 为 true） |
| predefine     | 预定义颜色            | array   | —                                                            | —                                                     |
| placement     | 颜色选择器弹出位置    | string  | `top` `left` `right` `bottom` `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom` | top                                                   |

### Events

| 事件名称      | 说明                               | 回调参数         |
| ------------- | ---------------------------------- | ---------------- |
| change        | 当绑定值变化时触发                 | 当前值           |
| active-change | 面板中当前显示的颜色发生改变时触发 | 当前显示的颜色值 |

