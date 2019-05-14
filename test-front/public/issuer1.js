function issue(json, hashedData)
{
	json['transactionId']=hashedData;						
	jsonString=JSON.stringify(json);

	var blob = new Blob( [ jsonString ], {
		type: 'text/plain'
		});
		name='certificate.json';
		
		url = URL.createObjectURL( blob );
		var link = document.createElement( 'a' );
		link.setAttribute( 'href', url );
		link.setAttribute( 'download', name );
		var event = document.createEvent( 'MouseEvents' );
		event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		link.dispatchEvent( event );
}
