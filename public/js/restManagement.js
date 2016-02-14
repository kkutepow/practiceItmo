$(document).ready(function(){
    $(".button-collapse").sideNav();
    $('.modal-trigger').leanModal();
})

var restID;

function changeSelect(restId){
    restID = restId;
    $("#newRestName").val($("#rest"+restID+">td.name").text());
    $("[for='newRestName']").addClass("active");
}

function restaurantUpdate() {
    var restName = $("#newRestName").val();
    if (restName == ""){
        Materialize.toast('Введите новое имя ресторана', 4000);
        return 0;
    }
    $.ajax({
        type: "POST",
        url: '/admin/restaurantUpdate',
        data: 'id='+restID+'&restName='+restName,
        success: function (data) {
            if (!data){ Materialize.toast('Произошла ошибка', 4000);}
            else {
                $("#rest"+restID+">td.name").text(restName);
            }
        }
    });
}

function restaurantAdd(){
    var restName = $("#restName").val();
    if (restName == ""){
        Materialize.toast('Введите имя нового ресторана', 4000);
        return 0;
    }
    $.ajax({
        type: "POST",
        url: '/admin/restaurantAdd/',
        data: 'restName='+restName,
        success: function (data) {
            if (!data){ Materialize.toast('Произошла ошибка', 4000);}
            else { window.location.replace("/admin/restaurants");}
        }
    });
}

function restaurantDelete(){

     $.ajax({
         type:"DELETE",
         url:'/admin/restaurantDelete',
         data: "id="+restID,
        success: function(data){
            if (!data){ Materialize.toast('Невозможно удалить ресторан, в котором числятся работники.', 4000);}
            else {
                $("#rest"+restID).remove();
            }
        }
    });
}