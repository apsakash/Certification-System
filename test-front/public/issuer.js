function issue(json, hashedData)
{
                Web3 = require('web3');
				web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
				console.log(web3);
				
				abi = JSON.parse( '[{"constant":false,"inputs":[{"name":"data","type":"bytes32"}],"name":"issueCertificate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');
				IssuingContract = web3.eth.contract(abi);
				// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
				contractInstance = IssuingContract.at('0x7241edf6665bed377e42182ffc3c45fa815f4456');
                console.log(contractInstance);
                contractInstance.issueCertificate(hashedData, {from: web3.eth.accounts[0]}, 
					function(error , hash) {
						console.log("transaction completed , transaction id- " + hash);

						json['transactionId']=hash;						
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
							link.dispatchEvent( event )
						                         });
}
