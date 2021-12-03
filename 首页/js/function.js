
//轮播图function
//把六张图拼成一张长图，这张长图在页面上一段一段的移动，向前向后或者闪现回原位，长图的位置相对于显示框位置，长图左端即左边距对应显示框的左边框，左边距为零
//定义变量名
var autoplay = true;
var autoplay_Delay = 3000; // ms
var autoplayId;
var intervalId;

var slider;//滑槽变量名
var slider_item_container;//滑槽页容器变量名
var slider_items;//滑槽页变量名
var indicator_container;//小圆点

var slider_item_width;//图片页宽度变量名 
var curIndex = 0;//图片位置参数，第一张图参数为0，第二为1...


window.onload=function(){func1(),func2(),func3(),func4()}//同时加载多个js程序


//加载函数
function func1(){
    initElement();//调用获取元素函数
    initEvent();//监听事件函数
    if (autoplay) {
        startAnimation(slider_item_container);//开始函数
    }
}

//获取元素函数
function initElement() {
    slider = document.getElementById("slider");//通过id获取元素
    slider_items = slider.getElementsByTagName("li");
    slider_item_container = slider.getElementsByClassName("slider-item-container")[0];//
    indicator_container = slider.getElementsByClassName("indicator-container")[0];
    
    var firstItem = slider_items[0].cloneNode(true);//复制第一张图
    slider_item_container.appendChild(firstItem);//把复制的第一张图添加到滑槽页容器里
    
    slider_item_width = slider_items[0].offsetWidth;//offsetwidth ：水平方向 width + 左右padding + 左右border-width
}

function initEvent() {
    slider.addEventListener("mouseover", function () {//鼠标移上去时
        clearTimeout(autoplayId);
        autoplay = false;//值为假
    });//添加监听事件，鼠标放上去会触发事件
    slider.addEventListener("mouseout", function () {
        autoplay = true;//值为真
        startAnimation(slider_item_container);//触发开始函数
    });
    
    var indicators = indicator_container.children;//children：返回元素节点，这里含有5个元素，数值为5
    for (var i = 0; i < indicators.length; i++) {//
        indicators[i].setAttribute("index", i);//setattribute设定属性，index索引，i为值，分别给小圆点添加索引
        indicators[i].addEventListener("click", function () {//添加监听事件，click点击事件
            var index = parseInt(this.getAttribute("index"));//parseint把字符串转换为整数
            next(index);//调用next函数，索引值作为实参传入
        });
    }
    
    var left_arrow = slider.getElementsByClassName("left-arrow")[0];//获取元素
    var right_arrow = slider.getElementsByClassName("right-arrow")[0];
    left_arrow.addEventListener("click", function () {//添加点击左键监听事件
        prev();
    });
    right_arrow.addEventListener("click", function () {//
        next();
    });
}

function animate(element, target) {//定义动画函数，element目标元素，target为目标位置（形参）
    var step = 20;//步长
    var time = 10;//时长ms
    var gap = (Math.abs(target - element.offsetLeft) / slider_item_width);//target为目标位置，ele-left为对象元素的左边距，即当前位置
    if (gap > 1) {
        step = step * gap;//根据当前位置与目标位置的距离调整步长和时长
        time = time / gap;
    }
    if (element) {
        step = (element.offsetLeft > target) ? -step : step;//step的正负对应向左还是向右移动
        clearInterval(intervalId);//清除定时器
        setCurrentActiveIndicator(curIndex);//为当前图片对应的小圆点改变类名，配合css作为点亮小圆点的作用
        intervalId = setInterval(function () {//设置定时器，每隔time调用一次函数
            if ((step < 0) && (Math.abs(element.offsetLeft + step) < Math.abs(target))) {//如果步长为负且当前位置与目标位置的距离大于步长  math。abs(x)返回的值x为绝对值
                element.style.left = element.offsetLeft + step + "px";//当前位置向左移动一个步长的距离，element.style.left只能获取到行内样式，不能获取到style里的标签样式
            } else {
                if (Math.abs(target - element.offsetLeft) > Math.abs(step)) {//计算到目标位置所需距离是否大于步长，是就向目标位置移动
                    element.style.left = element.offsetLeft + step + "px";//当前位置向右移动一个步长的距离
                } else {
                    clearInterval(intervalId);//清除定时器intervalid
                    intervalId = -1;
                    element.style.left = target + "px";//跳转到目标位置
                    if (autoplay) {
                        startAnimation(element);
                    }
                }
            }
        }, time);
    }
}

function prev() {
    var element = slider_item_container;
    var li = element.children;
    curIndex = curIndex - 1;//
    if (curIndex < 0) {//当图片位置参数为负值，即当前位置是第一张图，然后闪现为第六张图，再移动到第五张图
        element.style.left = -((li.length-1)*slider_item_width) + "px";
        curIndex = li.length-2;
    }
    animate(element, -(curIndex*slider_item_width));
}

function next(nextIndex) {//当轮播到第六张图片时，执行next函数后先闪现到第一张图再移动到第二张图
    var element = slider_item_container;
    var li = element.children;
    if ((nextIndex != null) && (typeof(nextIndex) != "undefined")) {//如果有实参传入，比如点击小圆点时传入的实参
        curIndex = nextIndex;
    } else {
        curIndex = curIndex + 1;//
        if (curIndex > (li.length-1)) {
            element.style.left = 0 + "px";
            curIndex = 1;
        }
    }
    animate(element, -(curIndex*slider_item_width));
}

function startAnimation(element) {
    if (autoplayId) {//如果已经有了一个定时运行函数在执行，则阻止该函数执行
        clearTimeout(autoplayId);
    }
    autoplayId = setTimeout(function () {//设定定时运行函数
        next();
    }, autoplay_Delay);
}

function setCurrentActiveIndicator(index) {//修改小圆点类名
    var indicators = indicator_container.children;
    if (index == indicators.length) {
        index = 0;
    }
    for (var i = 0; i < indicators.length; i++) {//改变类名，当轮到哪个小圆点时，类名变为indicator_active，使用css样式实现点亮小圆点效果
        if (i == index) {
            indicators[i].className = "indicator active";
        } else {
            indicators[i].className = "indicator";
        }
    }
}



//主体部分栏目右侧tab切换
var listbox;
var title;
var title_content;
var timer;
var timerId;
var tit_curIndex=0;
var listautoplay=true;

function func2() {
    initElement2();
    initEvent2();
    startAnimation2();
}

function initElement2(){
    listbox= document.getElementsByClassName("listbox")[0];
    title=listbox.getElementsByClassName("title")[0];
    title_content=listbox.getElementsByClassName("title-content")[0];
}

function show(nextIndex){ 
    var tit_contents=title_content.children;
    if ((nextIndex != null) && (typeof(nextIndex) != "undefined")) {
        tit_curIndex = nextIndex;
    } 
    else{
        tit_curIndex = tit_curIndex + 1;
        if (tit_curIndex > tit_contents.length-1) {
            tit_curIndex = 0;
        }}
        setCurrentActivelist(tit_curIndex);
}

function initEvent2(){
    var title_s=title.children;
    for(var i=0;i<title_s.length;i++){
        title_s[i].setAttribute("index",i);
        title_s[i].addEventListener("mouseover",function(){
            var tit_index =parseInt(this.getAttribute("index"));
            show(tit_index);
        })
    }
    listbox.addEventListener("mouseover",function(){
        listautoplay=false;
        clearInterval(timerId);
    })
    listbox.addEventListener("mouseout",function(){
        listautoplay=true;
        startAnimation2();
    })
}

function setCurrentActivelist(index) {
    var title_ss = title.children;
    for (var i = 0; i < title_ss.length; i++) {
        if (i == index) {
            title.children[i].className = "active";
            title_content.children[i].className="tit-content";
        } else {
            title.children[i].className = "";
            title_content.children[i].className="tit-content active";
        }
    }
}

function startAnimation2(){
    if(listautoplay){
        timerId = setInterval(show,3000);
    }
}



//主体部分栏目listbox-left tab切换
var listbox_left;
var left_title;
var left_title_content;
var left_tit_curIndex=0;


function func3() {
    initElement3();
    initEvent3();
}

function initElement3(){
    listbox_left= document.getElementsByClassName("listbox-left")[0];
    left_title=listbox_left.getElementsByClassName("left-title")[0];
    left_title_content=listbox_left.getElementsByClassName("left-title-content")[0];
}

function initEvent3(){
    var title_s=left_title.children;
    for(var i=0;i<title_s.length;i++){
        title_s[i].setAttribute("index",i);
        title_s[i].addEventListener("mouseover",function(){
            var tit_index =parseInt(this.getAttribute("index"));
            setCurrentActivelist2(tit_index);
        })
    }
}

function setCurrentActivelist2(index) {
    var title_ss = left_title.children;
    for (var i = 0; i < title_ss.length; i++) {
        if (i == index) {
            left_title.children[i].className = "active";
            left_title_content.children[i].className="left-tit-content";
        } else {
            left_title.children[i].className = "";
            left_title_content.children[i].className="left-tit-content active";
        }
    }
}




//小轮播图js，同上大轮播图思路
var small_autoplay = true;
var small_autoplay_Delay = 2000; // ms
var small_autoplayId;
var small_intervalId;

var small_slider;//滑槽变量名
var small_slider_item_container;//滑槽页容器变量名
var small_slider_items;//滑槽页变量名
var small_indicator_container;//小圆点

var small_slider_item_width;//图片页宽度变量名 
var small_curIndex = 0;//图片位置参数，第一张图参数为0，第二为1...


function func4(){
    initElement4();//调用获取元素函数
    initEvent4();//监听事件函数
    if (small_autoplay) {
        startAnimation4(small_slider_item_container);//开始函数
    }
}

//获取元素函数
function initElement4() {
    small_slider = document.getElementById("small-slider");//通过id获取元素
    small_slider_items = small_slider.getElementsByTagName("li");
    small_slider_item_container = small_slider.getElementsByClassName("small-slider-item-container")[0];//
    small_indicator_container = small_slider.getElementsByClassName("small-indicator-container")[0];
    
    small_slider_item_width = small_slider_items[0].offsetWidth;//offsetwidth ：水平方向 width + 左右padding + 左右border-width
}

function initEvent4() {
    small_slider.addEventListener("mouseover", function () {//鼠标移上去时
        clearTimeout(small_autoplayId);
        small_autoplay = false;//值为假
    });//添加监听事件，鼠标放上去会触发事件
    small_slider.addEventListener("mouseout", function () {
        small_autoplay = true;//值为真
        startAnimation4(small_slider_item_container);//触发开始函数
    });
    
    var indicators = small_indicator_container.children;//children：返回元素节点，这里含有5个元素，数值为5
    for (var i = 0; i < indicators.length; i++) {//
        indicators[i].setAttribute("index", i);//setattribute设定属性，index索引，i为值，分别给小圆点添加索引
        indicators[i].addEventListener("click", function () {//添加监听事件，click点击事件
            var index = parseInt(this.getAttribute("index"));//parseint把字符串转换为整数
            next2(index);//调用next函数，索引值作为实参传入
        });
    }
}

function animate2(element, target) {//定义动画函数，element目标元素，target为目标位置（形参）
    var step = 20;//步长
    var time = 10;//时长ms
    var gap = (Math.abs(target - element.offsetLeft) / small_slider_item_width);//target为目标位置，ele-left为对象元素的左边距，即当前位置
    if (gap > 1) {
        step = step * gap;//根据当前位置与目标位置的距离调整步长和时长
        time = time / gap;
    }
    if (element) {
        step = (element.offsetLeft > target) ? -step : step;//step的正负对应向左还是向右移动
        clearInterval(small_intervalId);//清除定时器
        setCurrentActiveIndicator2(small_curIndex);//为当前图片对应的小圆点改变类名，配合css作为点亮小圆点的作用
        small_intervalId = setInterval(function () {//设置定时器，每隔time调用一次函数
            if ((step < 0) && (Math.abs(element.offsetLeft + step) < Math.abs(target))) {//如果步长为负且当前位置与目标位置的距离大于步长  math。abs(x)返回的值x为绝对值
                element.style.left = element.offsetLeft + step + "px";//当前位置向左移动一个步长的距离，element.style.left只能获取到行内样式，不能获取到style里的标签样式
            } else {
                if (Math.abs(target - element.offsetLeft) > Math.abs(step)) {//计算到目标位置所需距离是否大于步长，是就向目标位置移动
                    element.style.left = element.offsetLeft + step + "px";//当前位置向右移动一个步长的距离
                } else {
                    clearInterval(small_intervalId);//清除定时器intervalid
                    small_intervalId = -1;
                    element.style.left = target + "px";//跳转到目标位置
                    if (small_autoplay) {
                        startAnimation4(element);
                    }
                }
            }
        }, time);
    }
}

function next2(nextIndex) {//当轮播到第六张图片时，执行next函数后先闪现到第一张图再移动到第二张图
    var element = small_slider_item_container;
    var li = element.children;
    if ((nextIndex != null) && (typeof(nextIndex) != "undefined")) {//如果有实参传入，比如点击小圆点时传入的实参
        small_curIndex = nextIndex;
    } else {
        small_curIndex = small_curIndex + 1;//
        if (small_curIndex > (li.length-3)) {
            element.style.left = 0 + "px";
            small_curIndex = 1;
        }
    }
    animate2(element, -(small_curIndex*small_slider_item_width));
}

function startAnimation4(element) {
    if (small_autoplayId) {//如果已经有了一个定时运行函数在执行，则阻止该函数执行
        clearTimeout(small_autoplayId);
    }
    small_autoplayId = setTimeout(function () {//设定定时运行函数
        next2();
    }, small_autoplay_Delay);
}

function setCurrentActiveIndicator2(index) {//修改小圆点类名
    var indicators = small_indicator_container.children;
    if (index == indicators.length) {
        index = 0;
    }
    for (var i = 0; i < indicators.length; i++) {//改变类名，当轮到哪个小圆点时，类名变为indicator_active，使用css样式实现点亮小圆点效果
        if (i == index) {
            indicators[i].className = "small-indicator active";
        } else {
            indicators[i].className = "small-indicator";
        }
    }
}