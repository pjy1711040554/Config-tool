<template>
  <layout id="main">
    <a-button class="btn" type="primary" @click="add">新建</a-button>
    <a-tabs>
      <a-tab-pane key="1" tab="文件"></a-tab-pane>
      <!--      <a-tab-pane key="2" tab="回收站"></a-tab-pane>-->
    </a-tabs>
    <div class="project-list">
      <div class="project" v-for="i in list" @click="pre(i)">
        <img :class="{empty:!i.thumbnailUrl}"
             :src="i.thumbnailUrl || 'https://modao.cc/mb-dashboard/images2/product/prototype.svg'"
             alt="">
        <div :title="i.title">{{ i.title }}</div>

        <a-popover overlayClassName="overlayClassName" placement="bottom">
          <template #content>
            <div @click="toEdit(i)">配置</div>
            <div @click="edit(i)">编辑</div>
            <div @click="del(i)">删除</div>
          </template>
          <span class="point">
                <ellipsis-outlined/>
          </span>
        </a-popover>
      </div>
    </div>

    <a-modal
        v-model:visible="visible"
        :title=" formState.id ? '修改' : '新增'"
        ok-text="确定"
        cancel-text="取消"
        @ok="onOk"
    >
      <a-form ref="formRef" :model="formState" name="form_in_modal">
        <a-form-item
            style="display: none"
            name="id">
          <a-input v-model:value="formState.id"/>
        </a-form-item>
        <a-form-item
            name="title"
            label="页面名称"
            :rules="[{ required: true, message: '请输入页面名称!' }]"
        >
          <a-input v-model:value="formState.title"/>
        </a-form-item>

        <a-form-item
            name="title"
            label="页面JSON"
        >
          <a-textarea v-model:value="formState.content" style="min-height: 200px"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </layout>
</template>

<script setup>
import {
  EllipsisOutlined
} from '@ant-design/icons-vue';
import Layout from "@/components/layout/Index.vue";
import {reactive, ref, toRaw} from "vue";
import {useRouter} from "vue-router";
import {addPage, deletePage, getPageList, updatePage} from "@/plugins/page";
import {toConfiguration} from "@/configComponents/util";

import {message} from 'ant-design-vue';
const router = useRouter()
const list = ref([])
list.value = getPageList()
const toEdit = (item) => {
  router.push({
    path: '/edit',
    query: {
      id: item.id
    }
  })
}


const formRef = ref();
const visible = ref(false);
const formState = reactive({
  id: '',
  title: '',
  content: '',
  thumbnailUrl: '',
});
const onOk = () => {
  formRef.value.validateFields().then(_ => {
    if (!formState.id) {
      formState.id = new Date().getTime().toString()
      addPage(formState)
      message.success('新增成功')
    } else {
      updatePage(formState)
      message.success('修改成功')
    }
    list.value = getPageList()
    visible.value = false;
    formRef.value.resetFields();
  }).catch(info => {
    console.log('Validate Failed:', info);
  });
};
const add = () => {
  formRef.value && formRef.value.resetFields();
  Object.assign(formState, {
    id: '',
    title: '',
    content: '',
    thumbnailUrl: '',
  })
  visible.value = true
}
const edit = (item) => {
  formRef.value && formRef.value.resetFields();
  Object.assign(formState, item)
  visible.value = true
}
const pre = (item) => {
  toConfiguration(
      {
        id: item.id,
      },
      true
  );
}
const del = (item) => {
  deletePage(item.id)
  list.value = getPageList()
  message.success('删除成功')
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