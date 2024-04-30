<template>
  <layout id="main">
    <a-button class="btn" type="primary" @click="add">新建</a-button>
    <a-tabs v-model:activeKey="pageType" animated>
      <a-tab-pane key="fabricjs" tab="fabricjs">
        <div class="project-list">
          <div class="project" v-for="i in getList('fabricjs')" @click="pre(i)">
            <img :class="{empty:!i.thumbnailUrl}"
                 :src="i.thumbnailUrl || 'https://modao.cc/mb-dashboard/images2/product/prototype.svg'"
                 alt="">
            <div :title="i.title">{{ i.title }}</div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="konvajs" tab="konvajs">
        <div class="project-list">
          <div class="project" v-for="i in getList('konvajs')" @click="pre(i)">
            <img :class="{empty:!i.thumbnailUrl}"
                 :src="i.thumbnailUrl || 'https://modao.cc/mb-dashboard/images2/product/prototype.svg'"
                 alt="">
            <div :title="i.title">{{ i.title }}</div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>

  </layout>
</template>

<script setup>
import Layout from "@/components/layout/Index.vue";
import {computed, ref} from "vue";

const pageType = ref('fabricjs')
const list = ref([
  {
    "type":"fabricjs",
    "title": "编辑器",
    "url": "http://test.falsehood.top/fabric.html"
  },
  {
    "type":"fabricjs",
    "title": "元件吸附",
    "url": "http://test.falsehood.top/fabric_guidelines.html"
  },
  {
    "type":"fabricjs",
    "title": "热区",
    "url": "http://test.falsehood.top/fabric3D.html"
  },
  {
    "type":"fabricjs",
    "title": "性能测试",
    "url": "http://test.falsehood.top/fabricPer.html"
  },
  {
    "type":"konvajs",
    "title": "编辑器",
    "url": "http://test.falsehood.top/konva.html"
  },
  {
    "type":"konvajs",
    "title": "元件吸附",
    "url": "http://test.falsehood.top/konva_guidelines.html"
  },
  {
    "type":"konvajs",
    "title": "俯瞰图热区",
    "url": "http://test.falsehood.top/konva3D.html"
  },
  {
    "type":"konvajs",
    "title": "楼层热区",
    "url": "http://test.falsehood.top/konva3D2.html"
  },
  {
    "type":"konvajs",
    "title": "自定义热区",
    "url": "http://test.falsehood.top/konvahot.html"
  },
  {
    "type":"konvajs",
    "title": "性能测试",
    "url": "http://test.falsehood.top/konvaPer.html"
  },
])
const getList = (type) => {
  return list.value.filter(i=>i.type === type)
}

const pre = (item) => {
  window.open(item.url, "_blank")
}
</script>

<style scoped lang="less">
.project-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 192px);
  gap: 14px;
  flex-flow: row wrap;
  align-content: stretch;

  .project {
    width: 192px;
    height: 138px;
    border: 1px solid transparent;
    overflow: hidden;
    transition: all 50ms ease 0s;
    position: relative;
    display: flex;
    flex-direction: column;
    -webkit-box-align: center;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-align: center;

    &:hover {
      background: rgb(242, 242, 242);
      border: 1px solid rgb(229, 229, 229);
      border-radius: 8px;
      .point{
        background: rgb(229, 229, 229);
      }
    }

    img {
      object-fit: cover;
      width: 160px;
      height: 90px;

      &.empty {
        width: 90px;
        height: 90px;
      }
    }

    div {
      margin-top: 10px;
      width: 120px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .point {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 25px;
      height: 25px;
      border-radius: 5px;
      text-align: center;

      &:hover {
        background: rgb(229, 229, 229);
      }
    }
  }
}

.btn {
  position: absolute;
  top: 39px;
  right: 38px;
}
</style>
<style lang="less">

.overlayClassName {
  .ant-popover-inner-content {
    padding: 10px;

    div {
      cursor: pointer;
      margin-bottom: 5px;
    }
  }
}
</style>
