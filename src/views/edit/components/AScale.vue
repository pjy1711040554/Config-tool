<template>
  <canvas ref="widthways" :style="getRuleStyle" style="flex: none;pointer-events: none"></canvas>
</template>

<script lang="ts" setup>
/**
 * 刻度尺
 * */
import {onMounted, ref, computed, watch} from 'vue'
import type {CSSProperties} from 'vue'

const widthways = ref<HTMLCanvasElement>()
const props = defineProps<{
  options: {
    offsetX: number
    offsetY: number
    scale: number
  }
  mode: 'horizontal' | 'vertical'
}>()
const getRuleStyle = computed<CSSProperties>(() => {
  return {
    width: props.mode === 'horizontal' ? '100%' : '20px',
    height: props.mode === 'horizontal' ? '20px' : '100%',
    position: 'absolute',
    zIndex: 2,
    top: '0',
    left: '0',
    display: 'block',
    cursor: props.mode === 'horizontal' ? 'row-resize' : 'col-resize'
  }
})

function getFixed(sparsity: number) {
  const pointIdx = String(sparsity).indexOf('.')
  const len = String(sparsity).length
  return pointIdx < 0 ? 0 : len - pointIdx - 1
}

function isCloseToInteger(num: number) {
  return Math.abs(num - Math.round(num)) < 0.0000001
}

// 获取间隔
function getSparsity(scale: number) {
  if (scale <= 0.3) {
    return 300
  } else if (scale <= 0.5) {
    return 200
  } else if (scale <= 1) {
    return 100
  } else if (scale <= 3) {
    return 50
  } else if (scale <= 4) {
    return 20
  } else if (scale <= 5) {
    return 10
  }
  return 5
}

watch(() => props.options, renderWidthWays, {deep: true})

function renderWidthWays() {
  const canvas = widthways.value
  if (!canvas) {
    return
  }
  const {width, height} = canvas.getBoundingClientRect()
  const dpi = 2
  canvas.width = width * dpi
  canvas.height = height * dpi
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  let {width: w, height: h} = canvas
  w /= dpi
  h /= dpi
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpi, dpi)
  ctx.clearRect(0, 0, w, h)
  ctx.save()
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(73,73,73,0.51)'
  ctx.fillStyle = '#9A9A9A'
  ctx.font = '12px serif'
  ctx.beginPath()
  const {offsetX, offsetY, scale} = props.options
  const offset = props.mode === 'horizontal' ? offsetX : offsetY
  // 间隔
  const sparsity = getSparsity(scale)
  // 间隔内有多少条线
  const part = 10
  const pixelPerUnit = scale * sparsity
  const gap = pixelPerUnit / part
  const fixed = getFixed(sparsity)
  let index = offset % gap > 0 ? gap - (offset % gap) : -offset % gap
  if (props.mode === 'horizontal') {
    ctx.translate(0, 0)
    do {
      const num = ((offset + index) / pixelPerUnit) * sparsity
      if (isCloseToInteger(num / sparsity)) {
        ctx.moveTo(index, 0)
        ctx.lineTo(index, 8)
        const text = num.toFixed(fixed)
        const textWidth = ctx.measureText(text).width
        ctx.fillText(text, index + 3, 15)
      } else {
        ctx.moveTo(index, 0)
        ctx.lineTo(index, 3)
      }
      index += gap
    } while (index < w)
  } else {
    ctx.translate(0, -0.5)
    do {
      const num = ((offset + index) / pixelPerUnit) * sparsity
      if (isCloseToInteger(num / sparsity)) {
        ctx.moveTo(0, index)
        ctx.lineTo(8, index)
        const text = num.toFixed(fixed)
        ctx.save()
        ctx.rotate((-90 * Math.PI) / 180)
        const textWidth = ctx.measureText(text).width
        ctx.fillText(text, -(index - 3), 12)
        ctx.rotate((0 * Math.PI) / 180)
        ctx.restore()
      } else {
        ctx.moveTo(0, index)
        ctx.lineTo(3, index)
      }
      index += gap
    } while (index < h)
  }
  ctx.closePath()
  ctx.stroke()
  ctx.restore()
}

onMounted(renderWidthWays)
</script>
