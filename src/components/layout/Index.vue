<template>

  <div class="layout">
    <div class="layout-menu">
      <div class="layout-menu-title">
        可视化工具
        <a href="https://github.com/pjy1711040554/Config-tool" target="_blank" style="display: inline-block;width: 20px;vertical-align: middle" title="github">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 24 24" class="vt-social-link-icon"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
        </a>
      </div>
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
  {
    path: '/demo',
    title: '工具demo',
    icon: DesktopOutlined,
  }
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
