import { inject } from 'vue';
export const OPTIONS_KEY = Symbol();
export const useOptions = () => {
    return inject(OPTIONS_KEY);
};
