
var schedule = []; // расписание
var actualChefs = [];
var actualOffsets = [];

$(document).ready(function(){
    $(".button-collapse").sideNav();
    $('.modal-trigger').leanModal();
    $('select').material_select();
    $("#preloader").css("display", "none");
});

function scheduleGenerate(chefs, fromLastResults){
    if (!fromLastResults){
        var target = 0;
        var point = 0;
        var limit = 150000;
        var maxpoint = 0;
        var chain = [];
        var tempschedule = [];
        for (var d = 1; d <= 7; d++) {
            tempschedule[d] = [];
            for (var h = 10; h < 24; h++) {
                tempschedule[d][h] = {
                    j: 0, 
                    i: 0, 
                    r: 0
                };
                target+=3;
            }
        }
        function getOffsets(chefIndex){
            if (chefIndex < chefs.length) {
                var workdays = chefs[chefIndex].workdays;
                var cycle = workdays + chefs[chefIndex].daysoff;
                var begin = chefs[chefIndex].daysBeginTime.slice(0, 2);
                var end = chefs[chefIndex].daysEndTime.slice(0, 2);
                for (var offset = 0; offset <= chefs[chefIndex].daysoff; offset++){
                    for (var d = 1; d <= 7; d++) { 
                        if ((cycle + d - 1 - offset) % cycle < workdays) {
                            for (var h = begin; h < end; h++) {
                                if (+chefs[chefIndex].hasJapSkills){
                                    point += (!tempschedule[d][h].j ? 1 : 0);
                                    tempschedule[d][h].j++;
                                }
                                if (+chefs[chefIndex].hasItaSkills){
                                    point += (!tempschedule[d][h].i ? 1 : 0);
                                    tempschedule[d][h].i++;
                                }
                                if (+chefs[chefIndex].hasRusSkills){
                                    point += (!tempschedule[d][h].r ? 1 : 0);
                                    tempschedule[d][h].r++;
                                }
                            }   
                        }
                    }
                    chain[chefIndex] = offset;
                    getOffsets(chefIndex+1);
                    if (point > maxpoint) {
                        maxpoint = point;
                        actualOffsets = chain.slice();
                        schedule = tempschedule.slice();
                    }
                    if (point >= target || !(limit--)) {
                        return;
                    }
                    for (var d = 1; d <= 7; d++) {
                        if ((cycle + d - 1 - offset) % cycle < workdays) {
                            for (var h = begin; h < end; h++) {
                                if (+chefs[chefIndex].hasJapSkills){
                                    tempschedule[d][h].j--;
                                    point -= (!tempschedule[d][h].j ? 1 : 0);
                                }
                                if (+chefs[chefIndex].hasItaSkills){
                                    tempschedule[d][h].i--;
                                    point -= (!tempschedule[d][h].i ? 1 : 0);
                                }
                                if (+chefs[chefIndex].hasRusSkills){
                                    tempschedule[d][h].r--;
                                    point -= (!tempschedule[d][h].r ? 1 : 0);
                                }
                            }   
                        }
                    }
                }
            }
        };
        getOffsets(0);
    }
    // schedule clear
    for (var d = 1; d <= 31; d++) {
        schedule[d] = [];
        for (var h = 10; h < 24; h++) {
            schedule[d][h] = {
                j: 0, 
                i: 0, 
                r: 0
            };
        }
    }
    // brush
    chefs.forEach(function(chef, index){
        if (fromLastResults) actualOffsets[index] = chef.offsetSchedule;
        $.ajax({
            type: "POST",
            url: '/admin/setSchedule',
            data: 'chefId='+chef.chefId+'&restId='+chef.restaurants_id+'&offset='+actualOffsets[index],
            success: function (chefs) {
                if (!chefs){ Materialize.toast('Произошла ошибка', 2000);}
                else {
                    scheduleBrushOrErase(chef, actualOffsets[index], true); 
                    scheduleShow();
                }
            }
        }); 
    });
    scheduleShow();
}

function scheduleBrushOrErase(chef, offset, brush){
    var workdays = chef.workdays;
    var cycle = workdays + chef.daysoff;
    var begin = chef.daysBeginTime.slice(0, 2);
    var end = chef.daysEndTime.slice(0, 2);
    brush = brush ? 1 : -1;
    for (var d = 1; d <= 31; d++) { 
        if ((cycle + d - 1 - offset) % cycle < workdays) {
            for (var h = begin; h < end; h++) {
                schedule[d][h].j += brush * chef.hasJapSkills;
                schedule[d][h].r += brush * chef.hasRusSkills;
                schedule[d][h].i += brush * chef.hasItaSkills;
            }   
        }
    }
}

function getRestaurantStaff(){
    var restId = $("#rest").val();
    if (!restId){
        Materialize.toast('Выберите ресторан', 2000);
    } else {
        $("#staff").empty();
        $("#preloader").css("display", "block");
        $("table.schedule").css("display", "none");
        $.ajax({
            type: "POST",
            url: '/admin/getStaff',
            data: 'id='+restId,
            success: function (data) {
                if (!data){ Materialize.toast('Произошла ошибка', 2000);}
                else {
                    actualChefs = data.chefs;
                    data.chefs.forEach(function(chef, index){
                        var inputfield = $("<div class='input-field col s4'></div>");
                        inputfield
                            .append($("<input type='checkbox' checked onclick='scheduleFilter("+index+", this.checked);'></input>")
                            .attr("id", chef.chefId));
                        inputfield
                            .append($("<label></label>")
                            .attr("for", chef.chefId)
                            .text(chef.surname + " " + chef.workdays + "/" + chef.daysoff 
                                    + " (" + chef.daysBeginTime.slice(0, 2) + "-" + chef.daysEndTime.slice(0, 2) + ")"));
                        $("#staff")
                            .append(inputfield);
                    });

                    $("#preloader").css("display", "none");
                    $("table.schedule").css("display", "table");
                    scheduleGenerate(data.chefs, data.scheduleIsReady);
                }
            }
        });
    }
}

function scheduleFilter(chefIndex, show){
    scheduleBrushOrErase(actualChefs[chefIndex], actualOffsets[chefIndex], show);
    scheduleShow();
}

function scheduleShow(){
    for (var d = 1; d <= 31; d++) {
        for (var h = 10; h < 24; h++) {
            document.getElementById("j"+d+":"+h).className = schedule[d][h].j > 0 ? (d%2 ? "red darken-1" : "blue darken-1") : "grey lighten-4";
            document.getElementById("r"+d+":"+h).className = schedule[d][h].r > 0 ? (d%2 ? "red darken-2" : "blue darken-2") : "grey lighten-3";
            document.getElementById("i"+d+":"+h).className = schedule[d][h].i > 0 ? (d%2 ? "red darken-3" : "blue darken-3") : "grey lighten-2";
        }   
    }
}
