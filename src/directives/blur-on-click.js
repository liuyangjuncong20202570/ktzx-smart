// blur-on-click.js
//创建自定义指令
//首先，你需要定义一个自定义指令，我们可以命名为blur-on-click。这个指令将绑定到按钮的点击事件，并在事件触发时使按钮失去焦点。
export default {
    beforeMount(el, binding, vnode) {
        el.addEventListener('click', () => {
            el.blur();
        });
    }
}
