<template>
  <div :style="position">
    <!--    <video class="video" :src="node.url" :controls="node.controls" :autoplay="node.autoplay" muted></video>-->
    <video ref="videoPlayer" class="video-js vjs-big-play-centered video" style="margin: auto auto"></video>
  </div>
</template>

<script setup>
  /**
   *
   * */
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
  import videojs from 'video.js';
  import 'video.js/dist/video-js.css';
  // 传入定位、元件object
  const props = defineProps({
    position: Object,
    node: Object,
  });
  const modePreview = computed(() => props.node.canvas.mode === 'preview');

  const videoPlayer = ref(null);
  let myPlayer = null;
  watch([() => props.node.url], () => {
    myPlayer.src(props.node.url);
    myPlayer.load();
  });

  onMounted(() => {
    const { url, videoControls, autoplay } = props.node;
    myPlayer = videojs(
      videoPlayer.value,
      {
        autoplay: modePreview.value ? autoplay : false,
        controls: videoControls,
        muted: true,
        notSupportedMessage: '无法播放',
        sources: url,
        controlBar: {
          // 配置控制栏
          timeDivider: false, // 时间分割线
          durationDisplay: false, // 总时间
          progressControl: true, // 进度条
          customControlSpacer: true, // 未知
          fullscreenToggle: true, // 全屏
        },
        playbackRates: [0.5, 1, 1.5, 2],
      },
      () => {}
    );
  });

  onUnmounted(() => {
    myPlayer && myPlayer.dispose();
  });
</script>

<style scoped>
  .video {
    width: 100%;
    height: 100%;
  }
</style>
