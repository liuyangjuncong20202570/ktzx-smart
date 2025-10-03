export const clickOutside = {
    mounted(el, binding) {
        el.clickOutsideEvent = function(event) {
            // 检查点击事件是否在 el 外面发生，且不是 el 的子节点
            if (!(el === event.target || el.contains(event.target))) {
                // 调用绑定的值作为函数
                binding.value(event);
            }
        };
        document.addEventListener('click', el.clickOutsideEvent);
    },
    beforeUnmount(el) {
        // 清理
        document.removeEventListener('click', el.clickOutsideEvent);
    },
};
