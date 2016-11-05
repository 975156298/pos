$(document).ready(function () {
    var goods_info=JSON.parse(localStorage.getItem("goods_info"));
    show_shopping_cart_num();
    show_time();
    add_goods_info_rows(goods_info);
    add_discount_goods__rows(goods_info);
    show_total();
    count_discount_total(goods_info)
    click_confirm_button();
    add_button_jump_function();
});

function show_shopping_cart_num() {
    var number = localStorage.getItem("num");
    set_element_text_by_id("shopping_cart_num", number);
}

function show_time(){
    var currentDate = new Date(),
        year = dateDigitToString(currentDate.getFullYear()),
        month = dateDigitToString(currentDate.getMonth() + 1),
        date = dateDigitToString(currentDate.getDate()),
        hour = dateDigitToString(currentDate.getHours()),
        minute = dateDigitToString(currentDate.getMinutes()),
        second = dateDigitToString(currentDate.getSeconds()),
        formattedDateString = year + '年' + month + '月' + date + '日 ' + hour + ':' + minute + ':' + second;
    set_element_text_by_id('time',formattedDateString);
}

function dateDigitToString (num) {
    return num < 10 ? '0' + num : num;
}

function add_goods_info_rows(goods_info){
    var get_string = $("#td_row_template").text();
    _.map(goods_info,function(value){
        var replace = get_string.replace(/type/,value.type)
            .replace(/name/,value.name)
            .replace(/price/,value.price)
            .replace(/unit/,value.unit)
            .replace(/num/,value.count)
            .replace(/subtotal_id/,value.barcode);
        $("#table_body").append(replace);
        show_subtotal(value.barcode,goods_info);
    });
}

function add_discount_goods__rows(goods_info){
    var promotion_info=get_item_local("promotion_info");
    var get_string = $("#td_discount_info").text();
    _.map(promotion_info,function(value){
        if(value.barcode in goods_info && goods_info[value.barcode].count>=3){
            var replace=get_string.replace(/type/,goods_info[value.barcode].type)
                .replace(/name/,goods_info[value.barcode].name)
                .replace(/number/,Math.floor(goods_info[value.barcode].count/3));
            $("#discount_table").append(replace);
        }
    });
}

function show_subtotal(id,goods_info) {//假设可口可乐,雪碧,方便面参加优惠.
    var promotion_info=get_item_local("promotion_info");
    var bol=false;
    _.map(promotion_info,function(value){
        if(value.barcode==id && goods_info[id].count>=3) bol=true;
    });
    if(bol){
        set_element_text_by_id( id, goods_info[id].subtotal - goods_info[id].discount_subtotal+'元' + '(原价：' + goods_info[id].subtotal + '元)');
    }else{
        set_element_text_by_id(id, goods_info[id].subtotal + "元");
    }
}

function show_total() {
    var total = get_item_local("total")
    set_element_text_by_id("total", total.toFixed(2))
}

function count_discount_total(goods_info){
    var promotion_info=get_item_local("promotion_info");
    var discount_total=0;
    _.map(promotion_info,function(value){
        if(value.barcode in goods_info){
            discount_total+=goods_info[value.barcode].discount_subtotal;
        }
    });
    set_element_text_by_id('discount',discount_total.toFixed(2));
}

function click_confirm_button(){
    $("#confirm").click(function(){
        localStorage.clear();
        window.location.href = "goods_list.html";
    });
}

function add_button_jump_function() {
    bind_button_event("lets_label", "../html/goods_list.html");
    bind_button_event("index", "../html/index.html");
    bind_button_event("goods_list", "../html/goods_list.html");
    bind_button_event("shopping","../html/shopping_cart.html");
}

function bind_button_event(id_name, file_name) {
    $("button#" + id_name).click(function () {
        window.location.href = file_name;
    });
}

function get_item_local(id) {
    return JSON.parse(localStorage.getItem(id));
}

function set_element_text_by_id(id, text) {
    $("#" + id).text(text)
}