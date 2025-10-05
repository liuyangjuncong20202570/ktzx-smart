import { ref } from 'vue';

export const useValueEffect = () => {
  const drawer = ref(false);

  const setDrawer = (value: boolean) => {
    drawer.value = value;
  };

  return {
    drawer,
    setDrawer
  };
};
