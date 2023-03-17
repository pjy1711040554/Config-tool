<template>
  <div :style="position">
    <div ref="dom" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup>
  /**
   * echarts渲染组件
   * */
  import { onMounted, ref, watch } from 'vue';
  import * as echarts from 'echarts';

  const props = defineProps({
    position: Object,
    node: Object,
  });
  const dom = ref(null);
  let myChart = null;
  let myOption = {};
  // 监听发生改变时 重新渲染echarts
  watch([() => props.node.cityCode, () => props.node.styleType, () => props.node.theme, () => props.node.renderType], () => {
    getData();
  });
  // 监听发生改变时 重新渲染echarts
  let tiemr;
  watch([() => props.node.width, () => props.node.height], () => {
    if (tiemr) clearTimeout(tiemr);
    tiemr = setTimeout(() => {
      chartResize();
    }, 400);
  });
  const setOption = () => {
    myChart.setOption(myOption, true);
  };

  const chartResize = () => {
    myChart.resize();
  };

  const getData = () => {
    const xhr = new XMLHttpRequest();
    const { cityCode } = props.node;
    xhr.open('get', `http://test.falsehood.top/json/${cityCode}.json`, true);
    xhr.send(null);
    xhr.onreadystatechange = () => {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        if (!xhr.responseText) return;
        try {
          const data = JSON.parse(xhr.responseText);
          setData(data, cityCode);
        } catch (e) {}
      } else {
        alert(xhr.status);
      }
    };
  };
  const geos = {
    1: [
      {
        map: 'yns',
        zlevel: -1,
        zoom: 1.0,
        silent: true,
        aspectScale: 1.2,
        layoutCenter: ['50%', '50%'],
        layoutSize: '100%',
        roam: false,
        itemStyle: {
          normal: {
            borderColor: 'rgba(192,245,249,.8)',
            borderWidth: 3,
            shadowColor: '#6FFDFF',
            shadowOffsetY: 0,
            shadowBlur: 10,
            // areaColor: 'rgba(29,85,139,.6)',
          },
        },
        label: {
          normal: {
            //静态的时候展示样式
            show: false, //是否显示地图省份得名称
            textStyle: {
              color: '#fff',
              fontSize: 12,
              fontFamily: 'Arial',
            },
          },
          emphasis: {
            //动态展示的样式
            show: false,
            color: '#fff',
          },
        },
      },
      {
        show: true,
        map: 'yns',
        zoom: 1.0,
        aspectScale: 1.2,
        layoutCenter: ['50%', '50%'],
        layoutSize: '100%',
        label: {
          normal: {
            //静态的时候展示样式
            show: true, //是否显示地图省份得名称
            textStyle: {
              color: '#fff',
              fontSize: 12,
              fontFamily: 'Arial',
            },
          },
          emphasis: {
            //动态展示的样式
            color: '#fff',
          },
        },

        blur: {
          label: { show: true, color: '#000' },
        },
        roam: false, // 是否开启鼠标滚轮缩放
        itemStyle: {
          normal: {
            label: {
              show: true,
              color: '#fff',
            },
            color: '#fff',
            borderColor: '#32CBE0',
            borderWidth: 1.5,
            areaColor: {
              type: 'linear-gradient',
              x: 0,
              y: 1000,
              x2: 0,
              y2: 0,
              colorStops: [
                {
                  offset: 0.5,
                  color: '#2b2b2c', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#53C9C7', // 100% 处的颜色
                },
              ],
              global: true, // 缺省为 false
            },
          },
          emphasis: {
            label: {
              show: true,
              color: '#fff',
            },
            borderWidth: 3,
            borderColor: 'rgba(255, 230, 175,0.8)',
            shadowColor: 'rgba(255, 230, 175,0.5)',
            shadowBlur: 30,
            textStyle: {
              color: '#fff',
              fontSize: 12,
              backgroundColor: 'transparent',
            },
            areaColor: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: '#1cfbfe',
                },
                {
                  offset: 1,
                  color: '#3348e7',
                },
              ],
              false
            ),
          },
        },
      },
      {
        type: 'map',
        map: 'yns',
        zlevel: -2,
        zoom: 1.0,
        aspectScale: 1.2,
        layoutCenter: ['50%', '51.4%'],
        layoutSize: '100%',
        roam: false,
        silent: true,
        itemStyle: {
          normal: {
            borderColor: 'rgba(35, 161, 184,0.5)',
            shadowColor: 'rgba(35, 161, 184,0.8)',
            shadowOffsetY: 5,
            shadowBlur: 15,
            areaColor: '#257AB2',
          },
        },
      },
      {
        type: 'map',
        map: 'yns',
        zlevel: -3,
        zoom: 1.0,
        aspectScale: 1.2,
        layoutCenter: ['50%', '52.4%'],
        layoutSize: '100%',
        roam: false,
        silent: true,
        itemStyle: {
          normal: {
            borderColor: 'rgba(7, 65, 117,0.5)',
            shadowColor: 'rgba(7, 65, 117,0.8)',
            shadowOffsetY: 15,
            shadowBlur: 8,
            areaColor: '#0A2763',
          },
        },
      },
    ],
    2: {
      map: 'yns',
      zlevel: 10,
      show: true,
      layoutCenter: ['50%', '50%'],
      roam: false,
      layoutSize: '90%',
      zoom: 1,
      label: {
        normal: {
          show: true,
          textStyle: {
            fontSize: 12,
            color: '#43D0D6',
          },
        },
      },
      itemStyle: {
        normal: {
          color: '#062031',
          borderWidth: 1.1,
          borderColor: '#43D0D6',
        },
      },
      emphasis: {
        areaColor: '#FFB800',
        label: {
          show: false,
        },
      },
    },
    3: {
      map: 'yns',
      zoom: 1,
      show: true,
      roam: true,
      label: {
        normal: {
          show: false,
        },
        emphasis: {
          show: false,
        },
      },
      itemStyle: {
        normal: {
          areaColor: '#21729a',
          borderColor: '#68ebf0', //线
          borderWidth: 0,
          borderJoin: 'round',
          shadowColor: 'rgba(18, 216, 250, 1)', //外发光
          shadowOffsetX: -3,
          shadowOffsetY: 5,
          shadowBlur: 2, //图形阴影的模糊大小
        },
        emphasis: {
          areaColor: '#2f9eff', //悬浮区背景
        },
      },
      select: {
        itemStyle: {
          areaColor: '#2f9eff', //悬浮区背景
        },
      },
    },
  };
  const setData = (data, code) => {
    const coord = data.features
      .sort((a, b) => a.id - b.id)
      .map((val) => {
        return code === 'china'
          ? {
              name: val.properties.name,
              value: val.properties.cp,
            }
          : {
              name: val.properties.name,
              value: val.properties.center,
            };
      });
    const lines_coord = [];
    coord.forEach((v, index) => {
      index > 0 &&
        lines_coord.push({
          coords: [v.value, coord[0].value],
        });
    });
    //地市取简称
    data.features.forEach((v) => {
      v.properties.name = v.properties.name.indexOf('版纳') > -1 ? v.properties.name.substr(0, 4) : v.properties.name.substr(0, 2);
    });

    const { styleType } = props.node;

    echarts.registerMap('yns', data);
    myOption = {
      title: {
        // text: props.node.cityName,
      },
      geo: geos[styleType] || geos[styleType],
      series: [
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 15,
          symbolSize: 8,
          rippleEffect: {
            period: 4,
            brushType: 'stroke',
            scale: 4,
          },
          itemStyle: {
            color: '#FFB800',
            opacity: 0.1,
          },
          data: coord.slice(1),
        },
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 15,
          symbolSize: 12,
          rippleEffect: {
            period: 6,
            brushType: 'stroke',
            scale: 8,
          },
          itemStyle: {
            color: '#FF5722',
            opacity: 1,
          },
          data: coord.slice(0, 1),
        },
        {
          type: 'lines',
          coordinateSystem: 'geo',
          zlevel: 15,

          effect: {
            show: true,
            period: 5,
            trailLength: 0,
            symbol: 'arrow',
            color: '#01AAED',
            symbolSize: 8,
          },
          lineStyle: {
            normal: { opacity: 0.6, curveness: 0.2, color: '#FFB800' },
          },
          data: lines_coord,
        },
      ],
    };
    initChart();
  };
  // 初始化echarts
  const initChart = () => {
    if (myChart) myChart.dispose();
    const { theme, renderType } = props.node;
    myChart = echarts.init(dom.value, theme, { renderer: renderType });
    setOption();
    myChart.on('click', function () {
      nodeClick(props.node);
    });
  };
  onMounted(() => {
    getData();
  });
</script>

<style scoped></style>
