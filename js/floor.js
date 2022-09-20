// 1.当我们滚动到 今日推荐 模块，就让电梯导航显示出来
// 2.点击电梯导航页面可以滚动到相应内容区域
// 3.核心算法：因为电梯导航和内容模块是一一对应的
// 4.当我们点击电梯导航某个小模块，就可以拿到当前小模块的索引号
// 5.就可以把animate要移动的距离求出来：当前索引号内容模块它的offset().top
// 6.然后执行动画即可

$(function () {
    // alert(11);
    // 当我们点击了li 此时不需要执行 页面滚动事件里的li 的背景选择 添加 current
    // 节流阀(互斥锁)
    var flag = true;
    var toolTop = $('.recom').offset().top;
    // 为了解决刷新页面后电梯导航消失，将判断封装到一个函数中，在页面滚动前先调用一次
    function toggleTool() {
        if ($(document).scrollTop() >= toolTop) {
            $('.fixedtool').fadeIn();
        } else {
            $('.fixedtool').fadeOut();
        }
    };
    toggleTool();
    // 1.当我们滚动到 今日推荐 模块，就让电梯导航显示出来
    $(window).scroll(function () {
        toggleTool();
        // 3.当我们页面滚动到内容区域某个模块，左侧电梯导航，相对应的li 模块，也会添加current类，其兄弟移除current 类
        // 触发的事件是页面滚动，因此这个功能要写到页面滚动事件里面
        // 需要用到each ，遍历内容区域大模块，each里面能拿到内容区域每一个模块元素和索引号
        // 判断条件：被卷去的头部大于等于内容区域里面每个模块的offset().top
        // 就利用这个索引号找到相应的电梯导航li 添加类

        if (flag) {   // 节流阀
            $('.floor .w').each(function (i, ele) {
                if ($(document).scrollTop() >= $(ele).offset().top) {
                    // console.log(i);
                    $('.fixedtool li').eq(i).addClass('current').siblings('li').removeClass('current');
                }
            })
        }
    })
    // 2.点击电梯导航页面可以滚动到相应内容区域
    $('.fixedtool li').click(function () {
        // console.log($(this).index());
        // console.log($('.jiadian').offset().top);
        // console.log($('.shouji').offset().top);
        // 每个516
        // var index = $(this).index();
        // var offsetTop = $('.jiadian').offset().top;
        // var height = $('.shouji').offset().top - offsetTop;
        // // console.log(height);
        // $('body,html').stop().animate({
        //     scrollTop: offsetTop + height * index
        // });  // 这种方法也可行
        flag = false;   // 节流阀
        var current = $('.floor .w').eq($(this).index()).offset().top;
        // 页面动画滚动效果
        $('body,html').stop().animate({
            scrollTop: current
        }, function () {
            flag = true;   // 利用回调函数在动画执行完再执行的特性,打开节流阀
        })
        // 当我们点击电梯导航某个li 当前li添加current 类，其兄弟移除current 类
        // 注意操作类里面的参数不要加点!
        // 链式编程 让当前li 添加current 类名  其兄弟移除current 类名
        $(this).addClass('current').siblings('li').removeClass('current');
    })
})