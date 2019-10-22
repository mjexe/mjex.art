class List {
	constructor(data) {
		this.container = $(data.container);
		this.items = [];
	}

	generatelist() {
		this.container.html('<div class="tv-list"></div>');
		this.list = this.container.find('.tv-list');
		this.items.forEach((e, i) => this.renderitem(e));
		this.list[0].style.gridTemplateColumns = 'repeat(' + hordiv + ', 200px)';
	}

	generatedetails(id) {
		let data = this.itemdata(id);
		this.container.html('<div class="detail-view"></div>');
		this.detailview = this.container.find('.detail-view');
		
		this.detailview.append(
			'<div class="view">' +
				'<div class="header">' +
					'<div class="left"></div>' +
					'<div class="title">' + data.id + '</div>' +
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
					'<li>COPY ID</li>' +
					'<li>NEXT IMAGE</li>' +
					'<li>PREV IMAGE</li>' +
				'</ul>' +
				
				'<div class="spacer"></div>' +
				'<div class="bottom"></div>' +
			'</div>' +
		'</div>'
		);

		this.detailview.find('.view')[0].style.width = (itemwidth - 140) + 'px';
	}

	additem(data) {this.items.push(data)}

	additems(array) {
		array.forEach((e) => this.additem(e));
	}

	renderitem(data) {
		this.list.append('<div class="item" id="' + data.id + '"></div>');
		$('#' + data.id).append(
			'<div class="top"></div>',
			'<div class="header">' + data.id + '</div>',
			'<div class="content" style="background: url(\'' + data.thumbnail + '"></div>',
			'<div class=""></div>',
			'<div class="spacer 1"></div>',
			'<div class="spacer 2"></div>',
			'<div class="spacer 3"></div>',
			'<div class="bottom"></div>',
		);
	}

	removeitem(id) {
		this.items.splice(this.getindex(id), 1);
		// $('#' + id).remove();
	}


	getindex(id) {return this.items.findIndex(x => x.id == id)}
	itemdata(id) {return this.items[this.getindex(id)]}
}
