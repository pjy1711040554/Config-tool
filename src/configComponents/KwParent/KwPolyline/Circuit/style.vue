<template>
  <Style></Style>
  <a-divider orientation="left" plain style="margin: 12px 0">电路配置</a-divider>
  <kw-from-item inputType="number" inputAttr="speed" width="100%" label="流速"></kw-from-item>
</template>

<script setup>
import Style from "../style.vue";
import KwFromItem from '@/configComponents/otherComponents/KwFromItem.vue';
import { inject } from "vue";

const selectObject = inject("selectObject");
</script>

<style scoped>

</Style>
