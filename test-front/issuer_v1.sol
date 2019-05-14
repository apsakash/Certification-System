pragma solidity ^0.4.18;

contract issuer_v1 {

  uint8 stage;

  function issuer_v1() public {
	stage=1;
  }  

 
  function issueCertificate(bytes32 data) public {
       stage+= 1;
  }

}


