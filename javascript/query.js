'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const readLine = require('readline-sync');

const ccpPath = path.resolve(__dirname, '..', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main() {
	
	var rollNo=readLine.question("RollNo:");
	var subjectCode=readLine.question("SubjectCode:");
	var studentUniqueID=readLine.question("StudentUniqueID:");
	var grade=readLine.question("Grade:");
	var hash=readLine.question("Hash:");
	verify(rollNo,subjectCode,studentUniqueID, grade, hash);
}


async function verify(rollNo,subjectCode,studentUniqueID, grade, hash)
{

    try {

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

        const network = await gateway.getNetwork('certchannel');

        const contract = network.getContract('cert');

        const result=await contract.submitTransaction('verify', rollNo, subjectCode, studentUniqueID, grade, hash);
        console.log(`Result= ${result}`);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

/*
async function main()
{
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
console.log("Came here");
        // Get the network (channel) our contract is deployed to.
        
        const network = await gateway.getNetwork('certchannel');
		
		
		
        // Get the contract from the network.
        const contract = network.getContract('cert');

		console.log("Came here");
        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('issue', '157205', '101', 'abcd', '10', 'abcdefg');
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}
*/
main();
