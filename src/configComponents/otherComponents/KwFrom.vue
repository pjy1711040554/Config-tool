<template>
  <kw-from-item v-for="(i, index) in formList" :key="index" :inputType="i.inputType" :inputAttr="i.inputAttr" :width="i.width" :label="i.label" :selectOption="i.selectOption" @change="i.change" />
</template>

<script setup>
  /**
   * 自定义form组件
   * */
  import KwFromItem from './KwFromItem.vue';

  defineProps({
    formList: {
      type: Array,
      default: () => [],
    },
  });
</script>

<style scoped lang="less"></style>
