// setInterval(() => {
	$.ajax({
		type: 'POST',
		
		url: '',
		
		data: JSON.stringify({
			content: '<@186848963373170688>'
		}),
	
		success: (data) => {console.log('fuckin worked man')},
	
		contentType: 'application/json',
	});
// }, 5000);
