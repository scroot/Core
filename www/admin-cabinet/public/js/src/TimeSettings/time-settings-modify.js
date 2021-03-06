/*
 * Copyright (C) MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nikolay Beketov, 12 2019
 *
 */

/* global globalRootUrl, globalTranslate, SemanticLocalization, Form, PbxApi */

const timeSettings = {
	$number: $('#extension'),
	$formObj: $('#time-settings-form'),
	validateRules: {
		CurrentDateTime: {
			depends: 'PBXManualTimeSettings',
			identifier: 'CurrentDateTime',
			rules: [
				{
					type: 'empty',
					prompt: globalTranslate.cq_ValidateNameEmpty,
				},
			],
		},
	},
	initialize() {
		$('#PBXTimezone').dropdown({
			fullTextSearch: true,
		});

		$('#CalendarBlock').calendar({
			firstDayOfWeek: SemanticLocalization.calendarFirstDayOfWeek,
			ampm: false,
			text: SemanticLocalization.calendarText,
		});

		$('.checkbox').checkbox({
			onChange() {
				timeSettings.toggleDisabledFieldClass();
			},
		});
		timeSettings.initializeForm();
		timeSettings.toggleDisabledFieldClass();
	},
	formattedDate() {
		const date = Date.parse(timeSettings.$formObj.form('get value', 'CurrentDateTime'));
		return date / 1000;
	},
	toggleDisabledFieldClass() {
		if (timeSettings.$formObj.form('get value', 'PBXManualTimeSettings') === 'on') {
			$('#SetDateTimeBlock').removeClass('disabled');
			$('#SetNtpServerBlock').addClass('disabled');
		} else {
			$('#SetNtpServerBlock').removeClass('disabled');
			$('#SetDateTimeBlock').addClass('disabled');
		}
	},
	cbBeforeSendForm(settings) {
		const result = settings;
		result.data = timeSettings.$formObj.form('get values');
		return result;
	},
	cbAfterSendForm() {
		PbxApi.UpdateDateTime({date: timeSettings.formattedDate()});
	},
	initializeForm() {
		Form.$formObj = timeSettings.$formObj;
		Form.url = `${globalRootUrl}time-settings/save`;
		Form.validateRules = timeSettings.validateRules;
		Form.cbBeforeSendForm = timeSettings.cbBeforeSendForm;
		Form.cbAfterSendForm = timeSettings.cbAfterSendForm;
		Form.initialize();
	},
};

$(document).ready(() => {
	timeSettings.initialize();
});
