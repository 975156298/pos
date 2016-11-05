/**
 * Created by lenovo on 16-7-11.
 */
$(document).ready(function () {
    var promotion_info=[{barcode:'000',name:'可口可乐'},{barcode:'001',name:'雪碧'},{barcode:'005',name:'方便面'}];
    save_localstoage("promotion_info",promotion_info);
    var goods_info = get_item_local("goods_info");
    add_goods_info_rows( goods_info);
    count_shopping_cart_num();
    show_shopping_cart_num();
    bind_goods_button_function(goods_info);
    count_total();
    show_total();
    add_button_jump_function();
})

function add_goods_info_rows( goods_info) {
    var get_string = get_element_text_by_id("td_row_template");
    _.map(goods_info,function(value){
        var replace = get_string.replace(/type/,value.type)
            .replace(/name/,value.name)
            .replace(/price/,value.price)
            .replace(/unit/,value.unit)
            .replace(/_id/g, value.barcode)
            .replace(/number/,value.count);
        $("#table_body").append(replace);
        show_subtotal(value.barcode,goods_info);
    });
}

function show_shopping_cart_num() {
    var number = localStorage.getItem("num") || 0;
    set_element_text_by_id("shopping_cart_num", number);
}

function add_button_jump_function() {
    bind_button_event("lets_label", "../html/goods_list.html");
    bind_button_event("index", "../html/index.html");
    bind_button_event("goods_list", "../html/goods_list.html");
    bind_button_event("pay", "../html/pay_info_confirm.html");
}

function bind_button_event(id_name, file_name) {
    $("button#" + id_name).click(function () {
        window.location.href = file_name;
    });
}

function bind_goods_button_function( goods_info) {
    _.map(goods_info,function(value){
        bind_add_and_dec_button_function(value.barcode);
    });
}

function bind_add_and_dec_button_function(id) {
    $("#add_goods_num"+id).click(function(){
        modify_page_info(id,1);
    });
    $("#dec_goods_num"+id).click(function(){
        modify_page_info(id,-1);
    });
}

function modify_page_info(id, num) {
    count_page_info(id,num);
    var goods_info=get_item_local("goods_info");
    show_page_info(id,goods_info);
    if(goods_info[id].count==0) del_goods_info_row(id,goods_info);
}

function count_page_info(id,num){
    count_goods_info(id, num);
    count_shopping_cart_num();
    count_total();
}

function show_page_info(id,goods_info){
    set_element_text_by_id("goods_num"+id,goods_info[id].count);
    show_subtotal(id,goods_info);
    show_total();
    show_shopping_cart_num();
}

function count_goods_info(id, num){
    var goods_info=get_item_local("goods_info");
    goods_info[id].count += num;
    goods_info[id].subtotal = goods_info[id].price *goods_info[id].count;
    goods_info[id].discount_subtotal = Math.floor(goods_info[id].count / 3)*goods_info[id].price;
    save_localstoage("goods_info",goods_info);
}

function count_shopping_cart_num(){
    var goods_info=get_item_local("goods_info");
    var shopping_cart_num=0;
    _.map(goods_info,function(value){
        shopping_cart_num+=value.count;
    });
    localStorage.setItem("num",shopping_cart_num);
}

function del_goods_info_row(id,goods_info) {
    delete goods_info[id];//goods_info[id]=undefined;
    $("#tr" + id).remove();
    save_localstoage("goods_info",goods_info);
    if (_.isEmpty(goods_info)) window.location.href = "goods_list.html";
}

function show_subtotal(id,goods_info) {//假设可口可乐,雪碧,方便面参加优惠.
    var promotion_info=get_item_local("promotion_info");
    var bool=true;
    _.map(promotion_info,function(value){
        if(value.barcode==id && goods_info[id].count>=3) bool=false;
    });
    if(bool){
        set_element_text_by_id('subtotal' + id, goods_info[id].subtotal + "元");
    }else{
        set_element_text_by_id('subtotal' + id, goods_info[id].subtotal - goods_info[id].discount_subtotal+'元' + '(原价：' + goods_info[id].subtotal + '元)');
    }
}

function count_total() {
    var total=0;
    var goods_info=get_item_local("goods_info");
    _.map(goods_info,function(value){
        total+=value.subtotal;
    })
    save_localstoage("total", total);
}

function show_total() {
    var total = get_item_local("total")
    set_element_text_by_id("total", total.toFixed(2))
}

function get_element_text_by_id(id) {
    return $("#" + id).text()
}

function set_element_text_by_id(id, text) {
    $("#" + id).text(text)
}

function get_item_local(id) {
    return JSON.parse(localStorage.getItem(id));
}

function save_localstoage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}