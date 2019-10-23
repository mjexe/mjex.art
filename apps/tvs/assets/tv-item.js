class List {
	constructor(data) {
		this.container = $(data.container);
		this.items = [];
	}

	generatelist(opacity) {
		opacity = typeof opacity == 'undefined' ? 1 : opacity;
		this.container.html('<div class="tv-list"></div>');
		this.list = this.container.find('.tv-list');
		this.items.forEach((e, i) => this.renderitem(e, opacity));
		this.list[0].style.gridTemplateColumns = 'repeat(' + hordiv + ', 200px)';
	}

	generatedetails(id, opacity) {
		opacity = typeof opacity == 'undefined' ? 1 : opacity;
		this.currentid = id;

		let data = this.itemdata(id);
		this.container.html('<div class="detail-view" style="opacity: ' + opacity + '"></div>');
		this.detailview = this.container.find('.detail-view');
		
		this.detailview.append(
			'<div class="view">' +
				'<div class="header">' +
					'<div class="left"></div>' +
					'<div class="title" id="currentid">' + data.id + '</div>' +
					'<div class="spacer"></div>' +
					'<div class="transition"></div>' +
				'</div>' +
	
				'<div class="content">' +
					'<div class="image" style="background: url(\'' + data.images[data.currentimg] + '\')"></div>' +
				'</div>' +
	
				'<div class="footer">' +
					'<div class="left"></div>' +
					'<div class="spacer"></div>' +
					'<div class="title">DETAIL VIEW</div>' +
					'<div class="transition"></div>' +
				'</div>' +
			'</div>' +
	
			'<div class="menu">' +
				'<div class="top"></div>' +
	
				'<ul class="buttons">' +
					'<li id="copyid" data-clipboard-target="#currentid">COPY ID</li>' +
					'<li onclick="javascript:nextimg()">NEXT IMAGE</li>' +
					'<li onclick="javascript:previmg()">PREV IMAGE</li>' +
				'</ul>' +
				
				'<div class="spacer"></div>' +
				'<div class="bottom"></div>' +
			'</div>' +
		'</div>'
		);

		
		let clipboard = new ClipboardJS('#copyid');
		clipboard.on('success', (e) => {
			window.getSelection().empty();
			$('#copyid').text('COPIED');
			$('#copyid').css('background', 'hsl(91, 46%, 58%)');

			setTimeout(() => {
				$('#copyid').text('COPY ID');
				$('#copyid').css('background', '');
			}, 2000);
		});

		clipboard.on('error', (e) => {
			window.getSelection().empty();
			$('#copyid').text('FAILED');
			$('#copyid').css('background', 'hsl(0, 100%, 50%)');

			setTimeout(() => {
				$('#copyid').text('COPY ID');
				$('#copyid').css('background', '');
			}, 2000);
		});

		this.detailview.find('.view')[0].style.width = (itemwidth - 140) + 'px';
	}



	additem(data) {this.items.push(data)}

	additems(array) {
		array.forEach((e) => this.additem(e));
	}

	renderitem(data, opacity) {
		opacity = typeof opacity == 'undefined' ? 1 : opacity;
		this.list.append('<div class="item" id="' + data.id + '" style="opacity: ' + opacity + '"></div>');
		$('#' + data.id).append(
			'<div class="top"></div>',
			'<div class="header">' + data.id + '</div>',
			'<div class="content" style="background: url(\'' + data.thumbnail + '"></div>',
			'<div class="spacer 1"></div>',
			'<div class="spacer 2"></div>',
			'<div class="spacer 3"></div>',
			'<div class="bottom"></div>',
		);

		$('#' + data.id).attr('onclick', 'javascript:detailAnim(\'' + data.id + '\')');
	}

	removeitem(id) {
		this.items.splice(this.getindex(id), 1);
		// $('#' + id).remove();
	}


	getindex(id) {return this.items.findIndex(x => x.id == id)}
	itemdata(id) {return this.items[this.getindex(id)]}
}
