/* eslint-disable */
import { getPublicObject } from "../index";
import {defineAsyncComponent, markRaw} from 'vue';

/**
 * @function 线条父类
 * 自定义控制器来自 http://fabricjs.com/custom-controls-polygon
 * */
function install() {
  // define a function that can locate the controls.
  // this function will be used both for drawing and for interaction.
  function polygonPositionHandler(dim, finalMatrix, fabricObject) {
    if (!fabricObject.canvas) return;
    var x = (fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x),
      y = (fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y);
    return fabric.util.transformPoint({
        x: x,
        y: y
      },
      fabric.util.multiplyTransformMatrices(
        fabricObject.canvas.viewportTransform,
        fabricObject.calcTransformMatrix()
      )
    );
  }

  function getObjectSizeWithStroke(object) {
    var stroke = new fabric.Point(
      object.strokeUniform ? 1 / object.scaleX : 1,
      object.strokeUniform ? 1 / object.scaleY : 1
    ).multiply(object.strokeWidth);
    return new fabric.Point(object.width + stroke.x, object.height + stroke.y);
  }

  // define a function that will define what the control does
  // this function will be called on every mouse move after a control has been
  // clicked and is being dragged.
  // The function receive as argument the mouse event, the current trasnform object
  // and the current position in canvas coordinate
  // transform.target is a reference to the current object being transformed,
  function actionHandler(eventData, transform, x, y) {
    var polygon = transform.target,
      currentControl = polygon.controls[polygon.__corner],
      mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), "center", "center"),
      polygonBaseSize = getObjectSizeWithStroke(polygon),
      size = polygon._getTransformedDimensions(0, 0),
      finalPointPosition = {
        x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
        y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
      };
    polygon.points[currentControl.pointIndex] = finalPointPosition;
    polygon.canvas.fire("object:moving");
    return true;
  }

  // define a function that can keep the polygon in the same position when we change its
  // width/height/top/left.
  function anchorWrapper(anchorIndex, fn) {
    return function(eventData, transform, x, y) {
      var fabricObject = transform.target,
        absolutePoint = fabric.util.transformPoint({
          x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
          y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y)
        }, fabricObject.calcTransformMatrix()),
        actionPerformed = fn(eventData, transform, x, y),
        newDim = fabricObject._setPositionDimensions({}),
        polygonBaseSize = getObjectSizeWithStroke(fabricObject),
        newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
        newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
      fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
      return actionPerformed;
    };
  }

  function lineControl(obj) {
    if (!obj.points) return fabric.Object.prototype.controls;
    var lastControl = obj.points.length - 1;
    obj.hasBorders = false;
    obj.cornerStyle = "circle";
    obj.cornerColor = "red";
    obj.transparentCorners = false;
    return obj.points.reduce(function(acc, point, index) {
      acc["p" + index] = new fabric.Control({
        positionHandler: polygonPositionHandler,
        actionHandler: anchorWrapper(index > 0 ? index - 1 : lastControl, actionHandler),
        actionName: "lineControl",
        pointIndex: index,
        mouseUpHandler: function(e) {
          obj.editClicknum += 1;
          if (obj.editClicknum == 2 && obj.points.length > 2) {
            obj.points.splice(index, 1);
            obj.controls = lineControl(obj);
            obj.canvas.requestRenderAll();
          }
          setTimeout(() => {
            obj.editClicknum = 0;
          }, 400);
        }
      });
      return acc;
    }, {});
  }

  fabric.KwPolyline = fabric.util.createClass(fabric.Polyline, {
    type: "KwPolyline",
    fill: "transparent",
    objectCaching: false, // 对象缓存
    perPixelTargetFind: true,  //空白区域不可选中

    // 背景线条配置
    strokeDashArray: [1, 0], // 实线虚线占比
    stroke: "rgba(255,255,255,0.01)",//
    strokeWidth: 10,
    strokeDashOffset: 0,

    // 前景线条配置
    stroke2: "red",
    strokeDashArray2: [1, 0],
    strokeWidth2: 1,
    strokeDashOffset2: 0,

    pointLengthArr: [], // 每段线条长度
    pointLengthCount: 0, // 总长度

    initialize: function(element, options = {}) {
      this.callSuper("initialize", element, options);

      // 双击新加点
      this.on("mousedblclick", function(opt) {
        if (this.canvas.mode === "preview") return;
        const {
          points,
          pathOffset,
          top,
          left,
          width,
          height,
          strokeWidth
        } = this;
        const offsetX = left - pathOffset.x + width / 2 + strokeWidth / 2;
        const offsetY = top - pathOffset.y + height / 2 + strokeWidth / 2;
        const pointIndex = points.findIndex((point, i) => {
          if (i != 0) {
            const point1 = {
              x: points[i].x + offsetX,
              y: points[i].y + offsetY
            };
            const point2 = {
              x: points[i - 1].x + offsetX,
              y: points[i - 1].y + offsetY
            };
            const line = new fabric.Line([point1.x, point1.y, point2.x, point2.y
            ], {
              fill: "red",
              stroke: "red",
              strokeWidth: strokeWidth + 1,
              selectable: false,
              evented: false,
              originX: "center",
              originY: "center"
            });
            // line.containsPoint(opt.absolutePointer) && canvas.add(line)
            return line.containsPoint(opt.absolutePointer);
          }
        });
        if (pointIndex == -1) return;
        points.splice(pointIndex, 0, {
          x: opt.absolutePointer.x - offsetX,
          y: opt.absolutePointer.y - offsetY
        });
        this.controls = lineControl(this);
        this.canvas.requestRenderAll();
      });
    },
    // 设置控制器
    setControl() {
      this.controls = lineControl(this);
    },
    // 获取长度
    getDistance() {
      const { points } = this;
      let arr = points.map((item, index) => {
        if (index >= 0 && index < points.length - 1) {
          let point1 = points[index];
          let point2 = points[index + 1];
          let dx = Math.abs(point1.x - point2.x);
          let dy = Math.abs(point1.y - point2.y);
          return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        }
        return 0;
      });
      this.pointLengthCount = arr.reduce((x, y) => x + y);
      this.pointLengthArr = arr;
    },
    toObject: function() {
      return fabric.util.object.extend(this.callSuper("toObject"), {
        strokeDashArray: this.get("strokeDashArray"),
        strokeDashArray2: this.get("strokeDashArray2"),
        stroke2: this.get("stroke2"),
        strokeWidth2: this.get("strokeWidth2"),
        strokeDashOffset2: this.get("strokeDashOffset2"),
        strokeLineCap2: this.get("strokeLineCap2"),
        perPixelTargetFind: this.get("perPixelTargetFind"),
        objectCaching: this.get("objectCaching"),
        pointLengthCount: this.get("pointLengthCount"),
        ...getPublicObject(this)
      });
    },

    _render: function(ctx) {
      this.callSuper("_render", ctx);
      ctx.save();
      ctx.beginPath();
      const {
        points,
        pathOffset
      } = this;
      // 画背景线条
      points.forEach(point => {
        ctx.lineTo(point.x - pathOffset.x, point.y - pathOffset.y);
      });
      ctx.lineCap = this.strokeLineCap2;
      ctx.lineDashOffset = this.strokeDashOffset2;
      ctx.lineWidth = this.strokeWidth2;
      ctx.strokeStyle = this.stroke2;
      ctx.setLineDash(this.strokeDashArray2);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }
  });

  fabric.KwPolyline.fromObject = function(object, callback) {
    const KwPolyline = new fabric.KwPolyline(object.points, object);
    KwPolyline.setControl();
    callback && callback(KwPolyline);
  };

  fabric.KwPolyline.async = true;
}

export default {
  install,
  style: markRaw(defineAsyncComponent(() => import("./style.vue")))
};
