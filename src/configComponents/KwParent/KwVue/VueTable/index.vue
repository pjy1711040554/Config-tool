<template>
  <div :style="position">
    <div class="fabric_table">
      <div class="thead">
        <div
          class="tr"
          :style="{
            marginTop: node.vertSpacing + 'px',
            marginBottom: node.vertSpacing + 'px',
          }"
        >
          <div
            class="td"
            v-for="(i, index) in columns"
            :key="index"
            :style="{
              flexBasis: i.width,
              height: node.TheadTdHeight + 'px',
              fontSize: node.TheadTdFontSize + 'px',
              color: node.TheadTdColor,
              fontFamily: node.TheadTdFontFamily,
              backgroundColor: node.TheadTdBgColor,
              justifyContent: node.TheadTdBgAlign,
              border: '1px solid ' + node.TableBorder,

              marginLeft: node.tranSpacing + 'px',
              marginRight: node.tranSpacing + 'px',
            }"
            >{{ i.title }}
          </div>
        </div>
      </div>
      <div class="tbody" :style="{ height: node.height - node.TheadTdHeight + 'px' }">
        <vue3-seamless-scroll v-model="scroll" :key="'id'" hover-stop="true" :list="tableList" :hover="true" :step="0.3">
          <div class="tbody-cont">
            <div
              v-for="(tr, in1) in tableList"
              class="tr"
              :style="{
                marginTop: node.vertSpacing + 'px',
                marginBottom: node.vertSpacing + 'px',
              }"
            >
              <div
                v-for="(td, in2) in columns"
                :key="in1 + in2"
                class="td"
                :style="{
                  flexBasis: td.width,
                  height: node.TbodyTdHeight + 'px',
                  fontSize: node.TbodyTdFontSize + 'px',
                  color: node.TbodyTdColor,
                  fontFamily: node.TbodyTdFontFamily,
                  backgroundColor: node.TbodyTdBgColor,
                  justifyContent: node.TbodyTdBgAlign,
                  border: '1px solid ' + node.TableBorder,

                  marginLeft: node.tranSpacing + 'px',
                  marginRight: node.tranSpacing + 'px',
                }"
              >
                {{ tr[td.dataIndex] || '' }}
              </div>
            </div>
          </div>
        </vue3-seamless-scroll>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
/**
 *
 * */
import { watch, onMounted, ref } from "vue";
import { funEvalOption } from "@/configComponents/util";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import { funEvalTableData } from "../../../util";
// 传入定位、元件object
const props = defineProps({
  position: Object,
  node: Object
});
const columns = ref([]);
const tableList = ref([]);
const scroll = ref(!!(props.node.autoScroll && props.node.canvas.mode === "preview"));
// 监听api返回的数据
watch(
  () => props.node.resultData,
  (result) => {
    tableList.value = funEvalTableData(props.node.dataHandle, result);
  }
);
watch([
  () => props.node.columnsStr
], () => {
  updateThead();
});
watch([
  () => props.node.staticDataStr,
  () => props.node.dataType
], () => {
  updateTbody();
});
const updateThead = () => {
  columns.value = funEvalOption(`function getData() {\n option =` + props.node.columnsStr + `  \nreturn option\n}\n` + "return getData();");
};
const updateTbody = () => {
  if (props.node.dataType === 1) {
    tableList.value = funEvalOption(`function getData() {\n option =` + props.node.staticDataStr + `  \nreturn option\n}\n` + "return getData();");
  } else {
    tableList.value = [];
  }
};


const emit = defineEmits(["onloaded"]);
onMounted(() => {
  emit("onloaded");
  updateThead();
  updateTbody();
});
</script>

<style scoped lang="less">
.fabric_table {
  width: 100%;
  height: 100%;

  .tbody {
    overflow: auto;
  }

  .tbody::-webkit-scrollbar {
    width: 0;
  }

  .tr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;

    .td {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

</style>
