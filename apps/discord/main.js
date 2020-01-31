$.ajax({
	type: 'post',
	
	url: 'https://discordapp.com/api/webhooks/672653997672235008/79xRQ508sTP0Lttr6kxiMX6y2wVWGlnhd9PSitTI56ngLJICuWQ9bwdHqH3h5vi0ghIg',
	
	data: 'my balls hurt',

	success: (data) => {console.log(data)},

	dataType: 'json',
})