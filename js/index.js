// 轮播图也称为焦点图,是网页中较为常见的网页特效
// 功能需求:
// 1.鼠标经过轮播图模块,左右按钮显示,离开隐藏左右按钮
// 2.点击右侧按钮一次,图片往左播放一张,以此类推,左侧按钮同理
// 3.图片播放的同时,下面小圆圈模块跟随一起变化
// 4.点击小圆圈,可以播放相应图片
// 5.鼠标不经过轮播图,轮播图也会自动播放
// 6.鼠标经过轮播图模块,自动播放停止

// 因为js较多,我们单独新建js文件夹,再新建js文件,引入页面中
// 此时需要添加load事件 页面全部加载完成后再执行js

window.addEventListener('load', function () {
    // alert('你好呀');
    // 1.获取元素
    var arrowL = document.querySelector('.arrow-l');
    var arrowR = document.querySelector('.arrow-r');
    var focus = document.querySelector('.focus');
    // 2.鼠标经过focus 就显示隐藏左右按钮
    focus.addEventListener('mouseover', function () {
        arrowL.style.display = 'block';
        arrowR.style.display = 'block';
        // 鼠标经过focus 就停止定时器
        clearInterval(timer);
        timer = null; // 清除定时器变量
    })
    focus.addEventListener('mouseout', function () {
        arrowL.style.display = 'none';
        arrowR.style.display = 'none';
        // 鼠标离开focus 就开启定时器
        timer = setInterval(function () {
            // 手动调用点击事件
            arrowR.click();
        }, 2000);
    })
    // 动态生成小圆圈 (小圆圈的个数要跟图片张数一致)
    // 所以首先会想到ul 里面图片的张数(图片放入li 里,所以就是li的个数)
    // 利用循环动态生成小圆圈(这个小圆圈要放入ol里)
    // 创建节点 createElement('li')
    // 插入节点 ol.appendChild(li)
    // 第一个小圆圈需要添加current类

    // 3.动态生成小圆圈 有几张图片,就生成几个小圆圈
    var ul = focus.querySelector('ul');
    var ol = focus.querySelector('.circle');
    var focusWidth = focus.offsetWidth;
    // console.log(ul.children.length);  // 获得图片数量
    for (var i = 0; i < ul.children.length; i++) {
        // 创建一个li
        var li = document.createElement('li');
        // 记录当前小圆圈的索引号 通过自定义属性来做
        li.setAttribute('index', i);
        // 把li 插入到ol 里
        ol.appendChild(li);
        // 4.小圆圈的排他思想
        // 点击当前小圆圈,就添加current 类
        // 其余小圆圈就移除这个current 类
        // 注意：在生成小圆圈的同时，就可以直接绑定这个事件
        li.addEventListener('click', function () {
            // 干掉所有人 把所有li 都清除current 类名
            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            // 留下我自己 当前的li 设置current 类名
            this.className = 'current';
            // 5.点击小圆圈滚动图片
            // 此时用到animate动画函数，将js文件引入(注意：因为index.js依赖animate.js 所以animate.js要写到index.js上面)
            // 使用动画函数的前提，该元素必须要有定位
            // 注意是ul 移动，而不是li
            // 滚动图片的核心算法：点击某个小圆圈，就让图片滚动 小圆圈的索引号乘以图片的宽度作为ul移动距离
            // 此时需要知道小圆圈的索引号，我们可以在生成小圆圈的时候，给它设置一个自定义属性，点击的时候获取这个自定义属性即可

            // animate(obj,target,callback);
            // ul 的移动距离 是小圆圈的索引号 乘以 图片的宽度，注意是负值
            // 当我们点击了某个li 就拿到当前li 的索引号
            var index = this.getAttribute('index');
            // 当我们点击了某个li 就要把这个li 的索引号给num 让滚动和图片一一对应
            num = index;
            // 当我们点击了某个li 就要把这个li 的索引号给circle 让小圆圈和图片一一对应
            circle = index;
            // var focusWidth = focus.offsetWidth;
            // console.log(focusWidth);
            // console.log(index);
            animate(ul, -index * focusWidth);
        })
    }
    // 把ol 里的第一个li 设置类名为 current
    ol.children[0].className = 'current';
    // 6.克隆第一张图片(li) 放到ul 最后面   (解决小圆圈增加的问题   实现自动化)
    // 克隆ul 第一个li cloneNode() 加true 深克隆 复制里面的子节点    false 浅克隆
    // 添加到ul 最后面 appendChild
    var first = ul.children[0].cloneNode(true);
    ul.appendChild(first);
    // 克隆在生成小圆圈的下面,所以克隆的li 不带小圆圈

    // 7.点击右侧按钮一次，就让图片滚动一张
    // 声明一个变量num 点击一次 自增1 让这个变量乘以图片宽度，就是ul 的滚动距离
    // 图片无缝滚动原理
    // ul第一个li 复制一份，放到ul 的最后面
    // 当图片滚动到克隆的最后一张图片时，让ul 快速地，不做动画地跳到最左侧：left为0
    // 同时num 赋值为0，可以重新开始滚动图片了
    var num = 0;
    // circle 控制小圆圈的播放
    var circle = 0;
    // flag 节流阀
    var flag = true;
    arrowR.addEventListener('click', function () {
        if (flag) {
            flag = false; // 关闭节流阀
            // 如果走到了最后复制的一张图片，此时，我们的ul 要快速复原left 改为0
            if (num == ul.children.length - 1) {
                ul.style.left = 0;
                num = 0;
            }
            num++;
            animate(ul, -num * focusWidth, function () {
                flag = true; // 利用回调函数,动画结束后打开节流阀
            });
            // 8.点击右侧按钮,小圆圈跟随变化
            // 最简单的做法是再声明一个变量circle 每次点击自增1,注意,左侧按钮也需要这个变量,因此要声明全局变量
            // 但是图片有5张,我们小圆圈只有4个,少一个,必须加一个判断条件
            // 如果circle==4 就重新复原为0
            circle++;
            // 如果circle==4 说明走到最后我们克隆的这张图片了，就重新复原为0
            if (circle == ol.children.length) {
                circle = 0;
            }
            // 调用函数
            circleChange();
        }
    });
    // 9.左侧按钮做法
    arrowL.addEventListener('click', function () {
        if (flag) {
            flag = false;
            // 如果走到了第一张图片，又摁下左侧按钮，此时，我们的ul 要快速让right 改为0
            if (num == 0) {
                num = ul.children.length - 1;
                ul.style.left = -num * focusWidth + 'px';
            }
            num--;
            animate(ul, -num * focusWidth, function () {
                flag = true;
            });

            // 8.点击右侧按钮,小圆圈跟随变化
            // 最简单的做法是再声明一个变量circle 每次点击自增1,注意,左侧按钮也需要这个变量,因此要声明全局变量
            // 但是图片有5张,我们小圆圈只有4个,少一个,必须加一个判断条件
            // 如果circle < 0 则小圆圈要改为第4个小圆圈
            circle--;
            // 如果circle < 0 说明是第一张图片了，则小圆圈要改为第4个小圆圈（3）
            // if (circle < 0) {
            //     circle = ol.children.length - 1;
            // }
            circle = circle < 0 ? ol.children.length - 1 : circle;
            // 调用函数
            circleChange();
        }
    });
    // 左侧和右侧按钮相同的代码可以提取出来封装函数
    function circleChange() {
        // 先清除其余小圆圈的current类名
        for (var i = 0; i < ol.children.length; i++) {
            ol.children[i].className = '';
        }
        // 留下当前的小圆圈的current类名
        ol.children[circle].className = 'current';
    }
    // 10.自动播放功能
    // 添加一个定时器
    // 自动播放轮播图,实际就类似于点了右侧按钮
    // 此时我们使用手动调用右侧按钮点击事件 arrowR.click()
    // 鼠标经过focus 就停止定时器
    // 鼠标离开focus 就开启定时器
    var timer = setInterval(function () {
        // 手动调用点击事件
        arrowR.click();
    }, 2000);
})

