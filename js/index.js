/**
 * Created by lenovo on 16-7-8.
 */
$(document).ready(function(){
    show_shopping_cart_initial();
    binding_goods_list_jump_function();
});
function show_shopping_cart_initial(){
    //if (localStorage.getItem("num") == null) { localStorage.setItem("num", 0);}//判断开始是否有数.
    var number = localStorage.getItem("num")||0;
    $("#shopping_cart_num").text(number);
}

function binding_goods_list_jump_function(){
    add_button_jump_event("lets_label","../html/goods_list.html");
    add_button_jump_event("goods_list","../html/goods_list.html");
    add_button_jump_event("lets_button","../html/goods_list.html");
    add_button_jump_event("shopping","../html/shopping_cart.html");
}

function add_button_jump_event(id_name,file_name) {
    $("button#"+id_name+"").click(function(){
        window.location.href = file_name;
    });
}
