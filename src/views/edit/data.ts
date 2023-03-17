/**
 * 获取fabric坐标
 * @param opt 原生js点击的坐标信息
 * @param canvas fabric对象
 * */
export const getPoint = (opt, canvas) => {
  return {
    left: (opt.e.offsetX - canvas.viewportTransform[4]) / canvas.getZoom(),
    top: (opt.e.offsetY - canvas.viewportTransform[5]) / canvas.getZoom(),
    x: (opt.e.offsetX - canvas.viewportTransform[4]) / canvas.getZoom(),
    y: (opt.e.offsetY - canvas.viewportTransform[5]) / canvas.getZoom(),
  };
};
/**
 * 获取一个随机id
 * */
export const getUuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
