// ==UserScript==
// @name         Rolf_Rebuilder
// @version      0.8
// @author       RubyComp
// @match        https://www.rolf.ru/bm_admin/v_blocks/*
// ==/UserScript==

$(document).ready(function() {

	// Fast link to site
	var code = $('input[name="code"]').val();
	var folder_id = $('select[name="folder_id"] > option:selected').attr('value');

	var folder = {
		13: 'service_stock',
		14: 'new_auto',
		59: 'used_auto'
	};

	var to_site_link = `<a href="https://www.rolf.ru/special_offers/`+folder[folder_id]+`/`+code+`.html?__drop_static" target="_blank" class="btn btn-outline">Перейти</a>`;
	$('#folder_form > .pull-right').prepend(to_site_link);

	// ======================================================================
	// Tabulation
	var tab, table;

	$('.nav-tabs').html(null);

	function add_tab(id, name) {
		tab = `<li><a data-toggle="tab" href="#tab-`+id+`">`+name+`</a></li>`;
		table = `<div id="tab-`+id+`" class="tab-pane"><table class="table no-borders" id="`+id+`_table"><tbody><!--`+name+`--></tbody></table></div>`;

		$('.nav-tabs').prepend(tab);
		$('.tab-content').append(table);
	}

	add_tab('stock_auto', 'Сток-Авто');
	add_tab('properties', 'Параметры');
	add_tab('content', 'Контент');

	// ======================================================================

	function hide_tr(list,sellector_1,sellector_2) {
		list.forEach(function(item) {
			$(sellector_1+item+sellector_2).closest('tr').css('display','none');
		});
	}

	var id   = [215,219,221,223,224,226,229,233,234,241,263,264,265,266,539,92];
	var prop = [118,120,154,155,222,226,232,233,247,248,250,263,352,353,52,539,561,60,61,92,215,221,223,241,264,265,266,66,234,229,62,72];
	var name = ['sort','text','file_id','active'];

	hide_tr(id,'#');
	hide_tr(prop,'[name*="PROP[',']"');
	hide_tr(name,'[name="','"');

	// ======================================================================

	var stock_auto_props = [224,231,240,242,243,244,249,253,252,219];

	stock_auto_props.forEach(function(item) {
		$('[name*="PROP['+item+']"').closest('tr').appendTo('#stock_auto_table tbody');
	});

	$('.spec_offers_stock_auto').closest('tr').prependTo('#stock_auto_table tbody');

	// ======================================================================

	var date_section = `<div id="date_section"><a id="date_update_btn" class="btn btn-white">Обновить</a></div>`;
	$('#folder_form').append(date_section);

	var date = [62,72];
	date.forEach(function(item) {
		$('[name*="PROP['+item+']"').appendTo('#date_section');
	});

	var active_checkbox = $('[name="active"]').closest('.icheckbox_square-green');
	active_checkbox.attr('id', 'active_checkbox');
	active_checkbox.prependTo('.col-sm-offset-2.pull-right');

	$("#date_update_btn").click(function() {
			var d = new Date();
			var date = d.toISOString().slice(0,10);
			$('[name*="PROP[62]"]').val(date);
			$(this).remove();
	});

	// ======================================================================

	var main_props = [
		'name="name"',
		'name="description"',
		'name="code"',
		'id="52"',          // название
		'name*="PROP[52]"', // название

		'id="57"',          // текст
		'name*="PROP[57]"', // доп. текст

		'id="211"',          // доп. текст
		'name*="PROP[211]"', // доп. текст

		'name*="PROP[216]"', // заголовок формы

		'id="214"',          // сноски
		'name*="PROP[214]"', // заголовок формы
	];
	main_props.forEach(function(item) {
		$('['+item+']').closest('tr').appendTo('#content_table');
	});

	var properties_props = [
		'name*="PROP[53]"',  // изображение в слайдере
		'name*="PROP[98]"',  // изображение на странице
		'name="folder_id"',
		'name*="PROP[212]"', // тип акции
		'name*="PROP[210]"', // тип заявки
		'name*="PROP[59]"',  // марка
		'name*="PROP[58]"',  // салон
		'name*="PROP[230]"'  // локация
	];
	properties_props.forEach(function(item) {
		$('['+item+']').closest('tr').appendTo('#properties_table');
	});

	// ======================================================================

	$('li.active').removeClass('active');
	$('.tab-pane.active').removeClass('active');

	$('.nav-tabs li').first().addClass('active');
	$('#tab-content').first().addClass('active');

	$('label:contains("Тип акци :")').html('Тип акции:');
	$('label:contains("Тип акци  :")').html('Тип акции:');

	// ======================================================================


	function sort_items(elements,target) {

		var $elements = $(elements);
		var $target = $(target);

		$elements.sort(function (a, b) {
			var an = $(a).text(),
				bn = $(b).text();

			if (an && bn)
				return an.toUpperCase().localeCompare(bn.toUpperCase());
			else
				return 0;
		});
		$elements.detach().appendTo($target);
	}

	// sort_items('[name*="PROP[230]"] option','[name*="PROP[230]"]');
	// sort_items('[name*="PROP[210]"] option','[name*="PROP[210]"]');

	create_new = $('[value="apply"]').length ? 0 : 1;

	if (create_new) {
		//$('[name*="PROP[210]"]').val(50);

		var now = new Date();
		var formated_date = now.format("yyyy-mm-dd");
		$('[name*="PROP[62]"]').attr('value',formated_date);
	}
});