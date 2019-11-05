class Confirmation {
	constructor(elem, yes) {
		this.elem = $(elem);
		this.yes = yes;

		this.original = this.elem.html();
		this.originalcss = this.elem.css('background');
		this.originalclick = this.elem.attr('onclick');

		this.style = document.createElement('style');
		document.head.appendChild(this.style);

		this.style.sheet.insertRule(
			'.confirmation {' +
				'width: 100%;' +
				'height: 100%;' +
				'display: grid;' +
				'grid-template-columns: 1fr 1fr;' +
				'gap: 5px;' +
			'}'
		);

		
		this.style.sheet.insertRule(
			'.confirmation > .yes {' +
				'background: var(--green);' +
			'}'
		);

		this.style.sheet.insertRule(
			'.confirmation > .yes:hover {' +
				'background: var(--green-dark);' +
			'}'
		);

		this.style.sheet.insertRule(
			'.confirmation > .yes:active {' +
				'background: var(--green-darker);' +
			'}'
		);


		this.style.sheet.insertRule(
			'.confirmation > .no {' +
				'background: var(--red);' +
			'}'
		);

		this.style.sheet.insertRule(
			'.confirmation > .no:hover {' +
				'background: var(--red-dark);' +
			'}'
		);

		this.style.sheet.insertRule(
			'.confirmation > .no:active {' +
				'background: var(--red-darker);' +
			'}'
		);

		



		this.elem.attr('style', 'background: none !important; padding: 0;');
		this.elem.attr('onclick', ' ');
		this.elem.html(
			'<div class="confirmation">' +
				'<div class="yes"></div>' +
				'<div class="no"></div>' +
			'</div>'
		);
		
		$('.confirmation > .yes').on('click', () => {this.yes(); this.cancel()});
		$('.confirmation > .no').on('click', () => setTimeout(() => this.cancel(), 100));

		// this.timeout = setTimeout(() => this.cancel(), 2000);
	}

	cancel() {
		clearTimeout(this.timeout);
		this.elem.css('background', '');
		this.elem.css('padding', '');
		this.elem.attr('onclick', this.originalclick);
		this.elem.html(this.original);
	}
}
