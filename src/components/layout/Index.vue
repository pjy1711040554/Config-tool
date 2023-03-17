<template>

  <div class="layout">
    <div class="layout-menu">
      <div class="layout-menu-title">可视化工具</div>
      <div v-for="i in menuList" class="layout-menu-item" :class="route.path === i.path ? 'active' : ''"
           @click="menuClick(i.path)">
        <component :is="i.icon"></component>
        <span>{{ i.title }}</span>
      </div>

    </div>
    <div class="layout-content">
      <div class="layout-content-title">{{ pageTitle }}</div>
      <div class="layout-content-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup name="LayoutMenu">
import {DesktopOutlined, RedditOutlined} from '@ant-design/icons-vue';
import {useRoute, useRouter} from "vue-router";
import {computed, ref} from "vue";

const route = useRoute();
const router = useRouter();
const menuList = ref([
  {
    path: '/',
    title: '个人空间',
    icon: RedditOutlined,
  },
  // {
  //   path: '/element',
  //   title: '元件列表',
  //   icon: DesktopOutlined,
  // }
])
const pageTitle = computed(() => {
  let menuItem = menuList.value.find(i => i.path === route.path) || {}
  return menuItem.title
})
const menuClick = (path) => {
  router.push(path)
}
</script>

<style scoped lang="less">

.layout {
  height: 100%;
  display: flex;

  .layout-menu {
    width: 240px;
    height: 100%;
    position: relative;
    background-color: rgb(245, 248, 253);
    transition: width 0.3s ease 0s;
    box-sizing: border-box;
    padding: 20px 15px 0px;
    overflow-y: hidden;

    .layout-menu-title {
      font-size: 20px;
      text-align: center;
      margin-bottom: 20px;
    }

    .layout-menu-item {
      padding: 10px 15px;
      border-radius: 4px;
      position: relative;
      width: auto;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      margin-bottom: 10px;
      transition: .3s;

      span {
        padding-left: 10px;
      }

      &:hover {
        background: rgb(225, 230, 239);
      }

      &.active {
        background: rgb(216, 232, 253);
        color: rgb(22, 132, 252);
      }
    }
  }

  .layout-content {
    flex: 1;
    padding: 36px 36px 0px;

    .layout-content-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 600;
      font-size: 24px;
      line-height: 34px;
      color: #000;
      flex-shrink: 1000;
      height: 50px;
      display: flex;
    }
  }
}
</style>