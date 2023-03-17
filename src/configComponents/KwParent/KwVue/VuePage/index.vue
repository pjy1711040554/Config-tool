<template>
  <div :style="position" class="Overview">
    <div class="tabs">
      <div v-for="(i, index) in tabs.list" :class="{ active: tabs.index === index }" :key="index" @click="tabsClick(index)">
        {{ i.name }}
      </div>
    </div>
    <div class="table" v-for="(i, index) in tableList" :key="index">
      <table>
        <thead>
          <tr>
            <td :colspan="i.length + 1">{{ i[0].tableName }}</td>
          </tr>
          <tr>
            <td></td>
            <td v-for="(j, indexj) in i" :key="indexj">{{ j.title }}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(col, colIndex) in cols" :key="colIndex">
            <td>{{ col.title }}</td>
            <td style="color: #0b0" v-for="(j, indexj) in i" :key="indexj">{{ j[col.value] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  /**
   *
   * */
  import { onMounted, reactive, ref } from 'vue';
  // 传入定位、元件object
  defineProps({
    position: Object,
    node: Object,
  });

  onMounted(() => {});
  const tabs = reactive({
    list: [{ name: '1F' }, { name: '2F' }, { name: '3F' }, { name: '4F' }, { name: '5F' }],
    index: 0,
  });
  const tabsClick = (index) => {
    tabs.index = index;
    tableList.value = obj[index];
  };
  const getTableList = (num1, num) => {
    return new Array(num).fill(0).map((item, index2) => {
      let num2 = index2 + 1;
      return new Array(Math.floor(Math.random() * (18 - 8 + 1)) + 8).fill(0).map((item2, index3) => {
        let num3 = index3 + 1;
        return {
          title: `${num1}-${num2}-${num3}`,
          zdy: (Math.random() * (600 - 500 + 1) + 500).toFixed(0) + 'V',
          zdl: (Math.random() * (2 - 1 + 1) + 1).toFixed(2) + 'A',
          tableName: `BF${num1}-${num2}`,
        };
      });
    });
  };
  const obj = {
    0: getTableList(1, 8),
    1: getTableList(2, 7),
    2: getTableList(3, 5),
    3: getTableList(4, 6),
    4: getTableList(5, 7),
  };

  const cols = ref([
    { title: '总电压', value: 'zdy' },
    { title: '总电流', value: 'zdl' },
  ]);
  const tableList = ref([]);
  tabsClick(0);
</script>

<style scoped lang="less">
  .Overview {
    background: #000;
    padding: 10px;
  }

  .tabs {
    width: 100%;
    display: flex;
    padding: 10px;
    margin-bottom: 10px;

    > div {
      padding: 0 20px;
      height: 30px;
      text-align: center;
      margin-right: 20px;
      background: #6baccb;
      line-height: 30px;
      cursor: pointer;
      border-radius: 5px;
      color: #fff;
    }

    > .active {
      background: #1890ff;
    }
  }

  .table {
    color: #fff;
    width: 100%;
    text-align: center;
    margin-bottom: 20px;

    table {
      //border: 1px solid #1c7328;
      td {
        width: 100px;
      }
    }

    table tr td {
      border: 1px solid #1c7328;
    }
  }
</style>
