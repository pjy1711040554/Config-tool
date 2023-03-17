<template>
  <a-tree
    :replace-fields="replaceFields"
    :load-data="onLoadData"
    :tree-data="treeData"
    :show-line="showLine"
    :expandedKeys="expandedKeys"
    :selectedKeys="selectedKeys"
    @select="treeSelect"
    @expand="treeExpand"
  />
</template>

<script setup>
  import { ref, toRaw } from 'vue';
  import { getActionBoot } from '@/configComponents/util';

  const emit = defineEmits(['select', 'update:selectedKeys', 'update:expandedKeys', 'update:selectedRows']);
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
  const replaceFields = {
    children: 'children',
    title: 'name',
    key: 'id',
  };
  const treeData = ref([]);
  // const expandedKeys = computed({
  //   get: () => props.expandedKeys,
  //   set: () => {
  //     emit("update:expandedKeys", e);
  //   }
  // });
  const getData = async (params) => {
    const { result = {} } = await getActionBoot('/base/collect/space/monitor/tree', params);
    return result;
  };

  const getTreeData = async () => {
    treeData.value = await getData();
  };
  const onLoadData = async (treeNode) => {
    treeNode.dataRef.children = await getData({
      parentId: treeNode.eventKey,
      nodeType: treeNode?.dataRef?.nodeType,
      treeType: treeNode?.dataRef?.treeType,
    });
  };
  const treeSelect = (e, event) => {
    emit('update:selectedKeys', e);
    emit('update:selectedRows', e[0] ? [event.node.dataRef] : []);
    emit('select', e, toRaw(event.node.dataRef), getTreeRoute(toRaw(treeData.value), event.node.dataRef.key));
  };
  const treeExpand = (e) => {
    emit('update:expandedKeys', e);
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

  getTreeData();
</script>

<style scoped></style>
