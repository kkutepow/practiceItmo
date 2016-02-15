$(document).ready(function(){
    $(".button-collapse").sideNav();
    $(".modal-trigger").leanModal();
    $('select').material_select();
})

var chefID;

function changeSelect(chefId){
    chefID = chefId;
    $.ajax({
        type: "POST",
        url: '/admin/getChefInfo',
        data: 'id='+chefID,
        success: function (chef) {
            if (!chef){ Materialize.toast('Произошла ошибка', 2000);}
            else {
                $("#nameUpdated").val(chef.name);
                $("[for='nameUpdated']").addClass("active");
                $("#surnameUpdated").val(chef.surname);
                $("[for='surnameUpdated']").addClass("active");
                $("#patronymicUpdated").val(chef.patronymic);
                $("[for='patronymicUpdated']").addClass("active");
                $("#japUpdated")[0].checked = !!+chef.hasJapSkills;
                $("#itaUpdated")[0].checked = !!+chef.hasItaSkills;
                $("#rusUpdated")[0].checked = !!+chef.hasRusSkills;
                $("#cycleUpdated").val(chef.jobCycle_id);
                $("#beginUpdated").val(chef.daysBeginTime.slice(0,-3));
                $("#endUpdated").val(chef.daysEndTime.slice(0,-3));
                $("#restUpdated").val(chef.restaurants_id);
                $("select").material_select();
            }
        }
    });
}

function getChefInformation(fromReplaceModal){
    var info = {};
    info.name = $("#name"+(fromReplaceModal?"Updated":"")).val();
    info.surname = $("#surname"+(fromReplaceModal?"Updated":"")).val();
    info.patronymic = $("#patronymic"+(fromReplaceModal?"Updated":"")).val();
    info.japskill = $("#jap"+(fromReplaceModal?"Updated":""))[0].checked;
    info.itaskill = $("#ita"+(fromReplaceModal?"Updated":""))[0].checked;
    info.russkill = $("#rus"+(fromReplaceModal?"Updated":""))[0].checked;
    info.cycle = $("#cycle"+(fromReplaceModal?"Updated":"")).val();
    info.begin = $("#begin"+(fromReplaceModal?"Updated":"")).val();
    info.end = $("#end"+(fromReplaceModal?"Updated":"")).val();
    info.restaurant = $("#rest"+(fromReplaceModal?"Updated":"")).val();
    info.errors = [];
    if (info.name == ""){ info.errors.push('Введите имя работника'); }
    if (info.surname == ""){ info.errors.push('Введите фамилию работника'); }
    if (!(info.itaskill || info.russkill || info.japskill)){
        info.errors.push('Повар без навыков кухни не может быть допущен к работе');
    }
    var worktime = (+info.end.slice(0,-3))-(+info.begin.slice(0,-3));
    if (worktime < 4 || worktime > 10) {
        info.errors.push('Рабочий день должен быть в пределах от 4 до 10 часов');
    }
    return info;
}

function chefUpdate() {
    var info = getChefInformation(true);
    if (info.errors.length > 0) {
        info.errors.forEach(function(err){
            Materialize.toast(err, 2000);
        });
    } else {
        $.ajax({
            type: "POST",
            url: '/admin/chefUpdate',
            data: 'id='+chefID+'&name='+info.name+"&surname="+info.surname+"&patronymic="+info.patronymic
                    +"&jap="+(+info.japskill)+"&rus="+(+info.russkill)+"&ita="+(+info.itaskill)
                    +"&cycle_id="+info.cycle+"&begintime="+info.begin+"&endtime="+info.end+"&rest_id="+info.restaurant,
            success: function (data) {
                if (!data){ Materialize.toast('Произошла ошибка', 2000);}
                else { window.location.replace("/admin/chefs");}
            }
        });
    }
}

function chefAdd(){
    var info = getChefInformation(false);
    if (info.errors.length > 0) {
        info.errors.forEach(function(err){
            Materialize.toast(err, 2000);
        });
    } else {
        $.ajax({
            type: "POST",
            url: '/admin/chefAdd/',
            data: 'name='+info.name+"&surname="+info.surname+"&patronymic="+info.patronymic
                    +"&jap="+(+info.japskill)+"&rus="+(+info.russkill)+"&ita="+(+info.itaskill)
                    +"&cycle_id="+info.cycle+"&begintime="+info.begin+"&endtime="+info.end+"&rest_id="+info.restaurant,
            success: function (data) {
                if (!data){ Materialize.toast('Произошла ошибка', 2000);}
                else { window.location.replace("/admin/chefs");}
            }
        });
    }
}

function chefDelete(){
     $.ajax({
         type:"DELETE",
         url:'/admin/chefDelete',
         data: "id="+chefID,
        success: function(data){
            if (!data){ Materialize.toast('Произошла ошибка', 2000);}
            else {
                $("#chef"+chefID).remove();
            }
        }
    });
}