<template>
  <div class="menu" v-show="position.show" id="menuBox">
    <div class="menu-body" :style="{
      top:position.top+'px',
      left:position.left+'px',
    }">
      <ul>
        <li v-for="i in menuList" @click.stop="liClick(i.key,i.disabled)" :class="{
          disable:i.disabled,
          menuDriver:i.type === 'driver',
          li:i.type === 'li'
        }">
          <div>{{ i.label }}</div>
          <span class="shortcut-key">{{ i.shortcutKey }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
/**
 * 鼠标右键菜单
 * */
import { computed, inject, onMounted, ref, unref } from "vue";

const emit = defineEmits(["change"]);
const props = defineProps({
  position: {
    type: Object,
    required: true
  }
});
const selectObject = inject("selectObject");


const menuList = ref([
  {
    type: "li",
    label: "删除",
    key: "del",
    disabled: false,
    shortcutKey: "Delete"
  },
  {
    type: "driver"
  },
  {
    type: "li",
    label: "组合",
    key: "make",
    disabled: computed(() => {
      return (selectObject.activeObject && selectObject.activeObject.type) === "group" || selectObject.objects.length <= 1;
    }),
    shortcutKey: ""
  },
  {
    type: "li",
    label: "拆分",
    key: "split",
    disabled: computed(() => {
      return (selectObject.activeObject && selectObject.activeObject.type) !== "group";
    }),
    shortcutKey: ""
  },
  {
    type: "driver"
  },
  {
    type: "li",
    label: "锁定",
    key: "locking",
    disabled: computed(() => {
      return selectObject.objects.every(item => !item.selectable);
    }),
    shortcutKey: ""
  },
  {
    type: "li",
    label: "解锁",
    key: "Unlock",
    disabled: computed(() => {
      return selectObject.objects.every(item => item.selectable);
    }),
    shortcutKey: ""
  },
  {
    type: "driver"
  },
  {
    type: "li",
    label: "置于顶层",
    key: "bringToFront",
    disabled: false,
    shortcutKey: ""
  },
  {
    type: "li",
    label: "置于底层",
    key: "sendToBack",
    disabled: false,
    shortcutKey: ""
  },
  {
    type: "li",
    label: "上一层级",
    key: "bringForward",
    disabled: false,
    shortcutKey: ""
  },
  {
    type: "li",
    label: "下一层级",
    key: "sendBackwards",
    disabled: false,
    shortcutKey: ""
  },
  // {
  //   type: "driver"
  // },
  // {
  //   type: "li",
  //   label: "另存为",
  //   key: "save",
  //   disabled: computed(() => {
  //     return selectObject.objects.length > 1;
  //   }),
  //   shortcutKey: ""
  // }
]);

const liClick = (type, disable) => {
  if (disable) return;
  emit("change", type);
  props.position.show = false;
};
onMounted(() => {
  if(document.getElementById("menuBox")){
    document.getElementById("menuBox").oncontextmenu = function(e) {
      return false;
    };
    document.getElementById("menuBox").onmousedown = function(e) {
      e.stopPropagation();
    };
  }

});
const splitDisable = computed(() => {
  return (selectObject.activeObject && selectObject.activeObject.type) !== "group";
});
const saveDisable = computed(() => {
  return selectObject.objects.length > 1;
});
const maketDisable = computed(() => {
  return (selectObject.activeObject && selectObject.activeObject.type) === "group" || selectObject.objects.length <= 1;
});
const lockingDisable = computed(() => {
  return selectObject.objects.every(item => !item.selectable);
});
const UnlockDisable = computed(() => {
  return selectObject.objects.every(item => item.selectable);
});
</script>

<style scoped lang="less">
.menu-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 998;
}

.menu-body {
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 4px 0px;
  min-width: 200px;
  background: rgb(51, 51, 51);
  box-shadow: rgb(0 0 0 / 30%) 0px 2px 8px;
  border-radius: 4px;
  color: rgb(242, 244, 245);
  border: 1px solid rgb(69, 70, 71);
  z-index: 999;

  ul {
    margin-bottom: 0;
    list-style: none;

    .li {
      position: relative;
      height: 24px;
      padding-left: 16px;
      padding-right: 14px;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      color: rgb(255, 255, 255);
      cursor: pointer;
      justify-content: space-between;

      .shortcut-key {
        display: inline-block;
        text-align: center;
        min-width: 12px;
        color: rgb(153, 153, 153);
        font-family: Inter;
      }

      &:hover {
        background: rgb(102, 102, 102);
      }

      &.disable {
        opacity: 0.4;
      }

      &.disable:hover {
        background: rgb(51, 51, 51);
      }
    }
  }

  .menuDriver {
    margin: 4px 0px;
    border-top: 1px solid rgb(69, 69, 70);
  }
}
</style>
