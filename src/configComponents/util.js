import {notification} from 'ant-design-vue';
import html2Canvas from 'html2canvas';
import router from '@/router';
import axios from 'axios';

/**
 * 处理option方法
 * @param value option字段
 * */
export const funEvalOption = (value) => {
    let result = {};
    try {
        result = new Function(value)();
        return result;
    } catch (error) {
        console.error(error);
        notification.error({
            message: 'Error',
            description: error.message,
        });
        return null;
    }
};
/**
 * 预览时处理option方法
 * @param value 处理的内容
 * @param option option对象
 * @param res api返回的对象
 * */
export const funEvalData = (value, option, res) => {
    let result = option;
    try {
        if (!option) return;
        const fun = new Function(value + `return getData(this.option,this.result);`).bind({
            result: res,
            option,
        });
        result = fun();
    } catch (error) {
        console.error(error);
        notification.error({
            message: 'Error',
            description: error.message,
        });
    }
    return result;
};
/**
 * 预览时处理table方法
 * @param value 处理的内容
 * @param res api返回的对象
 * */
export const funEvalTableData = (value, res) => {
    let result = option;
    try {
        if (!option) return;
        const fun = new Function(value + `return getData(this.result);`).bind({result: res});
        result = fun();
    } catch (error) {
        console.error(error);
        notification.error({
            message: 'Error',
            description: error.message,
        });
    }
    return result;
};

// 截屏
export const getJpeg = (dom, fabricCanvas) => {
    return new Promise((resolve) => {
        html2Canvas(dom).then((canvas) => {
            console.log()
            console.log(fabricCanvas.viewportTransform)
            let area = {
                x: fabricCanvas.viewportTransform[4] * 1.5,
                y: fabricCanvas.viewportTransform[5] * 1.5,
                w: fabricCanvas.Background.cacheWidth,
                h: fabricCanvas.Background.cacheHeight,
            };
            console.log(area)
            const data = canvas.getContext('2d').getImageData(area.x, area.y, area.w, area.h);
            canvas.width = area.w;
            canvas.height = area.h;
            const context = canvas.getContext('2d');
            context.putImageData(data, 0, 0);
            const jpeg = canvas.toDataURL('image/png', 0.5);


            const canvas2 = document.createElement('canvas');
            const ctx = canvas2.getContext('2d');
            const img = new Image();
            img.src = jpeg;
            img.onload = function() {
                canvas2.width = img.width;
                canvas2.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);


                let quality = 0.7; // 压缩质量，0 到 1 之间的数值，越小压缩率越高，但图片质量也越低
                const type = 'image/jpeg'; // 压缩后的图片类型
                const maxFileSize = 70 * 1024; // 最大文件大小，单位为字节
                let compressedDataUrl = canvas.toDataURL(type, quality);
                while (compressedDataUrl.length > maxFileSize) {
                    quality -= 0.1;
                    compressedDataUrl = canvas.toDataURL(type, quality);
                }
                resolve({
                    base64: compressedDataUrl,
                    file: base64ToFile(compressedDataUrl),
                });
            }





        });
    });
};
// base64转化为file文件
export const base64ToFile = (urlData) => {
    const arr = urlData.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bytes = atob(arr[1]);
    let n = bytes.length;
    const ia = new Uint8Array(n);
    while (n--) {
        ia[n] = bytes.charCodeAt(n);
    }
    return new File([ia], new Date().getTime() + '.png', {type: mime});
};

/**
 * 获取图片地址
 * @param src src
 * */
export const getSrc = (src) => {
    if (!src) return '';
    return src.indexOf('http') === -1 ? import.meta.env.VITE_FILE_SERVE_URL + src : src;
};

/**
 * 跳转预览页面
 * @param query 页面传参
 * @param newPage 打开新页面
 * */
export function toConfiguration(query, newPage = false) {
    const route = {path: '/preview', query: query};
    if (newPage) {
        const newpage = router.resolve(route);
        window.open(newpage.href, '_blank');
    } else {
        router.push(route);
    }
}

/**
 * 基数接口定义
 * @param url
 * @param data
 * @returns {Promise<undefined|*>}
 */
export function postActionBoot(url, data) {
    return actionBoot(url, data, 'post');
}

export function getActionBoot(url, data) {
    return actionBoot(url, data, 'get');
}

export async function actionBoot(url, data, methods) {
    const kingweb_boot = import.meta.env.VITE_GLOB_DOMAIN_URL_BOOT;
    try {
        const {data: result} = await axios({
            method: methods,
            url: kingweb_boot + url,
            data: data,
            params: data,
            headers: getBootHeaders(),
        });
        return result;
    } catch (e) {
        let result = e.response?.data;
        return result;
    }
}

export function getBootHeaders() {
    return {
        'X-Access-Token': getQueryString('token') || undefined,
    };
}

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
