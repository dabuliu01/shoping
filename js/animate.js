function animate(obj, target, callback) {
    // console.log(callback); // ƒ () { }   调用的时候 callback()
    clearInterval(obj.timer);
    // obj.timer 将定时器赋值给对象属性
    obj.timer = setInterval(function () {
        // 步长值写到定时器里面 这样就会更新
        // 把我们步长值改为整数 不要出现小数问题,往上取整(防止因为除不尽而导致元素到不了目标位置)
        // var step = Math.ceil((target - obj.offsetLeft) / 10);
        var step = (target - obj.offsetLeft) / 10;
        // 前进步长往大取整 后退(步长为负)步长往小取整
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if (obj.offsetLeft == target) {
            // 停止动画 本质是停止定时器
            clearInterval(obj.timer);
            // 回调函数写到定时器结束里面
            // if (callback) {
            //     // 如果有回调函数,则调用函数
            //     callback();
            // }
            // 逻辑中断,等价于上面代码
            callback && callback();
        }
        // 把每次加1 这个步长值改为一个慢慢变小的值 步长公式:(目标值-现在位置)/10 
        obj.style.left = obj.offsetLeft + step + 'px';
    }, 15)
}