<template>
  <ul class="yuansu-ul">
    <li class="yuansu-li" v-for="(i, index) in treeList" :key="index">
      <div
        class="yuansu-item"
        @click="yuansuClick(i)"
        :class="{ active: activeIds.includes(i.id) }"
        :style="{
          paddingLeft: zIndex * 15 + 'px',
        }"
      >
        <div class="label">
          {{ i.name || i.type }}
          <span v-show="i.type === 'group'" class="group iconfont" :class="i.showGroup ? 'icon-youjiantou' : 'icon-xuanzeqizhankai_o'" @click.stop="i.showGroup = !i.showGroup"></span>
        </div>
        <div class="actions">
          <!--          <span @click.stop="yuansuSuo(i)">-->
          <!--            <i v-show="i.selectable" class="iconfont icon-jiesuo"></i>-->
          <!--            <i v-show="!i.selectable" class="iconfont icon-suoding"></i>-->
          <!--          </span>-->
          <!--          <span @click.stop="yuansuDel(i)"><i class="iconfont icon-shanchu"></i></span>-->
        </div>
      </div>
      <yuansu-tree :treeList="i._objects" :z-index="zIndex + 1" :style="{ height: i.showGroup ? '0px' : 'auto' }" />
    </li>
  </ul>
</template>

<script setup>
  /**
   * 左侧现有元素列表
   * */
  import { computed, inject } from 'vue';
  import { fabric } from 'fabric';
  import { deepLoopObjects } from '@/configComponents';

  // const emits = defineEmits(["saveHistory"]);
  defineProps({
    treeList: {
      type: Array, //类型字符串
      default: () => [], //如果没有传递msg参数,默认值是这个
    },
    zIndex: {
      type: Number,
      default: 1,
    },
  });
  const selectObject = inject('selectObject');
  const activeIds = computed(() => {
    let ids = [];
    deepLoopObjects(selectObject.objects, function (i) {
      ids.push(i.id);
    });
    return ids;
  });
  const yuansuClick = (item) => {
    const canvas = myCanvas;
    const objects = canvas.getObjects().filter((i) => i.id == item.id);
    if (objects.length === 0) return;
    if (item.id === activeIds.value.toString()) {
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      return;
    }
    canvas.discardActiveObject();
    const sel = new fabric.ActiveSelection(objects, {
      canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
  };
  // const yuansuSuo = (item) => {
  // const canvas = myCanvas
  // const object = canvas.getObjects().find(i => i.data.id == item.data.id)
  // object.set({
  //   selectable: !item.selectable,
  //   locking: item.selectable
  // })
  // object.lockScalingX = item.selectable
  // object.lockScalingY = item.selectable
  // object.lockRotation = item.selectable
  // object.lockMovementX = item.selectable
  // object.lockMovementY = item.selectable
  // canvas.requestRenderAll();
  // emits('saveHistory')

  // };
  // const yuansuDel = (item) => {
  // const canvas = myCanvas
  // const object = canvas.getObjects().find(i => i.data.id == item.data.id)
  //
  // canvas.discardActiveObject();
  // canvas.requestRenderAll();
  //
  // canvas.remove(object)
  // canvas.fxRemove(object, {
  //   onChange() {
  //
  //   },
  //   onComplete() {
  //     object.element && object.element.remove()
  //   }
  // })
  // canvas.requestRenderAll();
  // emits('saveHistory')
  // };
</script>

<style scoped lang="less">
  @import '../iconfont.css';

  .yuansu-ul {
    overflow: hidden;

    .yuansu-li {
      .yuansu-item {
        position: relative;
        height: 32px;
        padding-right: 4px;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        border: 1px solid transparent;
        font-size: 12px;
        cursor: pointer;
        color: rgb(51, 51, 51);
        justify-content: space-between;
        white-space: nowrap;

        .label {
          height: 100%;
          line-height: 30px;
          position: relative;

          .iconfont.group {
            position: absolute;
            left: -14px;
            top: 3px;
            font-size: 12px;
          }
        }

        &.active {
          background: rgb(218, 235, 254);
        }

        &.active:hover {
          background: rgb(218, 235, 254);
        }

        .actions {
          height: 100%;
          padding-left: 6px;
          display: none;
          align-items: center;

          > span {
            line-height: 30px;
            margin: 0 3px;
          }
        }

        &:hover {
          background: rgba(112, 110, 110, 0.17);

          .actions {
            display: block;
          }
        }
      }
    }
  }

  [data-theme='dark'] .yuansu-ul .yuansu-li .yuansu-item {
    color: #fff;

    &.active {
      background: rgba(255, 255, 255, 0.2);

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
</style>
