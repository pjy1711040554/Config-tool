<template>
  <a-upload
    name="file"
    v-model:file-list="fileList"
    class="avatar-uploader"
    :headers="headers"
    :show-upload-list="false"
    action="http://43.143.72.33:3999/api/file/upload"
    :before-upload="beforeAvatarUpload"
    @change="handleChange"
    :accept="accept"
  >
    <slot></slot>
  </a-upload>
</template>

<script setup>
  /**
   * 自定义上传组件
   * */
  import { ref } from 'vue';

  const props = defineProps({
    /**
     * Whether to display text
     */
    accept: { type: String, default: '.jpg,.png,.gif,.svg,.webp' },
  });

  const emits = defineEmits(['success']);
  const fileList = ref([]);
  const headers = {

  };
  const handleChange = (info) => {
    if (info.file.status === 'done') {
      emits('success', info.file.response.data);
    } else if (info.file.status === 'error') {
      alert('上传失败');
    }
  };
  const beforeAvatarUpload = (rawFile) => {
    var suffix = rawFile.name.match(/.[^.]+$/)[0]; //.txt
    if (props.accept.indexOf(suffix) === -1) {
      alert('上传失败,请上传' + props.accept);
      return false;
    }
    return true;
  };
</script>

<style scoped></style>
