class List {
	constructor(data) {
		this.container = $(data.container);
		this.container.append('<div class="tv-list"></div>');
		this.list = this.container.find('.tv-list');
	}

	additem(data) {
		this.list.append('<div class="item" id="' + data.id + '"></div>');

		$('#' + data.id).append(
			'<div class="top"></div>',
			'<div class="header">' + data.id + '</div>',
			'<div class="content"><img src="' + data.img + '"></div>',
			'<div class="spacer 1"></div>',
			'<div class="spacer 2"></div>',
			'<div class="spacer 3"></div>',
			'<div class="bottom"></div>',
		)

		// let item = $('#' + data.id);

		// let contents = [
		// 	{fn: () => item.append('<div class="top"></div>'),                                 timeout: 0},
		// 	{fn: () => item.append('<div class="header">' + data.id + '</div>'),               timeout: 200},
		// 	{fn: () => item.append('<div class="content"><img src="' + data.img + '"></div>'), timeout: 400},
		// 	{fn: () => item.append('<div class="spacer 1"></div>'),                            timeout: 450},
		// 	{fn: () => item.append('<div class="spacer 2"></div>'),                            timeout: 500},
		// 	{fn: () => item.append('<div class="spacer 3"></div>'),                            timeout: 550},
		// 	{fn: () => item.append('<div class="bottom"></div>'),                              timeout: 600},
		// ]

		// for(let i = 0; i < contents.length; i++) setTimeout(() => contents[i].fn(), contents[i].timeout);
	}

	removeitem(data) {
		$('#' + data.id).remove();
	}
}
