<template>
  <a-tree :tree-data="treeData" :load-data="onLoadData" :selectedKeys="selectedKeys" @select="treeSelect" />
</template>

<script name="DeviceStandardTree" setup>
  import { ref, toRaw } from 'vue';
  import { defHttp } from '@/utils/http/axios';

  const emit = defineEmits(['select', 'update:selectedKeys', 'update:selectedRows']);
  defineProps({
    layerTag: {
      type: Number,
      default: 3,
    },
    expandedKeys: Array,
    selectedKeys: Array,
    selectedRows: Array,
    showLine: Boolean,
  });
  const treeData = ref([]);
  const onLoadData = async (treeNode) => {
    if (treeNode.dataRef.children?.length) return;
    let res = await defHttp.get({
      url: '/meta/baseMetadataSystemClassification/tree',
      params: { systemClassificationNo: treeNode.eventKey },
    });
    treeNode.dataRef.children = res.map((i) => {
      return {
        title: i.name,
        key: i.code,
        disabled: true,
        children: i.children.map((i) => ({ title: i.deviceTypeName, key: i.code, isLeaf: true })),
      };
    });
  };
  const getTreeData = async () => {
    let res = await defHttp.get({ url: '/meta/baseMetadataSystemClassification/list', params: {} });
    treeData.value = res.map((i) => ({
      title: i.name,
      key: i.no,
      children: i.children,
      disabled: true,
    }));
  };
  getTreeData();

  const treeSelect = (e, event) => {
    emit('update:selectedKeys', e);
    emit('update:selectedRows', e[0] ? [event.node.dataRef] : []);
    emit('select', e, toRaw(event.node.dataRef), getTreeRoute(toRaw(treeData.value), event.node.dataRef.key));
  };
  function getTreeRoute(tree, key) {
    let path = [];

    function dfs(tree) {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].key === key) {
          path.unshift(tree[i]);
          return true;
        } else if (tree[i].children) {
          if (dfs(tree[i].children)) {
            path.unshift(tree[i]);
            return true;
          }
        }
      }
    }

    dfs(tree);
    return path;
  }
</script>

<style scoped lang="less">
  :deep(li.ant-tree-treenode-disabled > .ant-tree-node-content-wrapper span) {
    color: #00000063;
  }
</style>
