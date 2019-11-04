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
					'<div class="spacer" style="margin-left: 5px"></div>' +
					'<div class="transition"></div>' +
				'</div>' +
	
				'<div class="content">' +
					'<div class="image" style="background: url(\'' + data.images[data.currentimg] + '\')"></div>' +
					'<div class="info">' +
						'<div class="title">SPECIFICATIONS</div>' +
						'<div class="detail"><input placeholder="DIMENSIONS"></input></div>' +
						'<div class="detail"><input placeholder="COLOR"></input></div>' +
						'<div class="detail"><input placeholder="STYLE"></input></div>' +
						'<textarea class="description" placeholder="DESCRIPTION"></textarea>' +
						'<div class="stock" style="color: var(--' + (data.stock ? 'stock-available' : 'stock-none') + ')">' + (data.stock ? 'AVAILABLE' : 'TAKEN') + '</div>' +
					'</div>' +
				'</div>' +
	
				'<div class="footer">' +
					'<div class="left"></div>' +
						'<input class="img-url" placeholder="IMAGE URL"></input>' +

						'<div class="img-controls">' +
							'<div class="button green"></div>' +
							'<div class="button blue"></div>' +
							'<div class="button red"></div>' +
						'</div>' +

						'<div class="spacer"></div>' +
						'<div class="transition"></div>' +
					'</div>' +
				'</div>' +
		
				'<div class="menu">' +
					'<div class="top"></div>' +
		
					'<ul class="buttons">' +
						'<li class="blue" onclick="javascript:nextimg()">NEXT IMAGE</li>' +
						'<li class="blue" onclick="javascript:previmg()">PREV IMAGE</li>' +
						'<li class="red">DELETE</li>' +
						'<li class="green" onclick="javascript:saveItems()">SAVE ITEM</li>' +
					'</ul>' +
					
					'<div class="spacer"></div>' +
					'<div class="bottom"></div>' +
				'</div>' +
			'</div>'
		);

		$('.detail-view input[placeholder="DIMENSIONS"')[0].value     = data.dimensions;
		$('.detail-view input[placeholder="COLOR"')[0].value          = data.color;
		$('.detail-view input[placeholder="STYLE"')[0].value          = data.style;
		$('.detail-view textarea[placeholder="DESCRIPTION"')[0].value = data.description;
		$('.detail-view .img-url')[0].value                           = data.images[data.currentimg];

		$('.detail-view .stock').on('click', (e) => {
			e = e.target;
			if(e.textContent == 'AVAILABLE') e.textContent = 'TAKEN';
			else e.textContent = 'AVAILABLE';
			e.style.color = 'var(--' + (e.textContent == 'AVAILABLE' ? 'stock-available' : 'stock-none') + ')';
		})
		// this.detailview.find('.view')[0].style.width = (itemwidth - 140) + 'px';
	}



	additem(data) {this.items.push(data)}

	additems(array) {array.forEach((e) => this.additem(e))}

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
