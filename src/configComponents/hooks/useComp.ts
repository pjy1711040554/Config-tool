import { ref } from 'vue';
import { initFabric } from '@/configComponents';

type comp = {
  id: string;
  node: any;
  position: object;
  comp: any;
};

export function useComp() {
  const componentArr = ref<comp[]>([]);
  const pushComponentArr = (item) => {
    componentArr.value.push({
      id: item.id,
      node: item,
      position: item.getPosition(),
      comp: initFabric.comp[item.type],
    });
  };
  const updateComponentArr = () => {
    componentArr.value.forEach((item) => (item.position = { ...item.node.getPosition() }));
  };
  const clearComponentArr = () => {
    componentArr.value = [];
  };
  return {
    componentArr,
    pushComponentArr,
    updateComponentArr,
    clearComponentArr,
  };
}
