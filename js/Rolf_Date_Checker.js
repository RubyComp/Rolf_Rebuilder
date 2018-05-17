// ==UserScript==
// @name         Rolf_Date_Checker
// @version      0.6
// @author       RubyComp
// @match        https://www.rolf.ru/bm_admin/v_blocks/structure/edit_item/*
// ==/UserScript==

$(document).ready(function() {

	var list_area = '<div id="list_area"></div>';
	$('body').append(list_area);

	// ======================================================================

	var search_text;
	var reg_result, common_result = [];
	var items_list = ['[name="name"]','[name="description"]','#57 .note-editable','#211 .note-editable','#214 .note-editable'];
	var regs_list  = [/(^| )(\d{2} *(\.|\\|\/) *\d{2})( *(\.|\\|\/) *\d{1,4})/g,
	                  /(^| +)(\d{1,2}.{0,4}|.{0,10} +|)(январ|феврал|март|апрел|ма(й|я|е)|июн|июл|август|сентябр|октябр|ноябр|декабр)(.{0,4})( |$)/g];

	items_list.forEach(function(id) {

		search_text = $(id).val() ? $(id).val() : $(id).text();


		function push_string(string, count) {
			numb = count ? '<b>('+(count+1)+')</b>' : '';
			common_result += string +' '+ numb + '<br>';
		}

		regs_list.forEach(function(reg) {
			reg_result = search_text.match(reg);

			if (reg_result) {
				reg_result.sort();
				var sting_count = 0;

				for (var i = 0; i < reg_result.length; i++) {

					if (reg_result[i] == reg_result[i+1]) {
						sting_count++;
					} else {
						push_string(reg_result[i],sting_count);
						sting_count = 0;
					}
				}
				common_result +='<hr>';
			}

		});

	});
	$('#list_area').html(common_result);

	// ======================================================================

	var errors = [];

	function new_error(arr, message, heft) {
		error = [message, heft];
		arr.push(error);
	}

	function to_unix(date) {
		return new Date(date).getTime();
	}

	var start_date   = $('[name*="PROP[62]"]').val();
	var end_date     = $('[name*="PROP[72]').val();
	var current_date = Date.now();

	start_date = to_unix(start_date);
	end_date   = to_unix(end_date);
	end_date  += 86400000;


	var active = $('[name="active"]').closest('.icheckbox_square-green').hasClass('checked');

	if (!active)
		new_error(errors, 'Акция отключена', 0);

	if (start_date > end_date)
		new_error(errors, 'Дата начала позже окончания', 0);

	if (!start_date & !end_date)
		new_error(errors, 'Даты не указаны', 0);

	else if (!start_date)
		new_error(errors, 'Дата начала не указана', 0);

	else if (!end_date)
		new_error(errors, 'Дата окончания не указана', 0);

	if (current_date < start_date)
		new_error(errors, 'Акция ещё не началась', 1);

	else if (current_date > end_date)
		new_error(errors, 'Акция уже закончилась', 1);

	else if (current_date + 172800000 > end_date)
		new_error(errors, 'Акция скоро закончится', 2);

	// ======================================================================

	errors.forEach(function(message) {
		if (message[1] < 2)
			alert(message[0]);
			console.log(message[0]);
	});

});