package main

import (

	"bytes"
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct
{}

type Certificate struct
{
	RollNo string `json:"rollno"`
	SubjectCode string `json:"subjectcode"`
	StudentUniqueID string `json:"studentuniqueid"`
	Grade string `json:"grade"`
	Hash string `json:"hash"`
}

func (s *SmartContract) Init(APIStub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIStub shim.ChaincodeStubInterface) sc.Response {
	function, args :=APIStub.GetFunctionAndParameters()
	
	if function == "verify" {
		return s.verify(APIStub,args)
	} else if function == "issue" {
		return s.issue(APIStub,args)
	} else if function == "initLedger" {
		return s.initLedger(APIStub)
	} else {
		return shim.Error("Invalid Smart Contract Function Name")
	}
		
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) issue(APIStub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 5 {
		return shim.Error("Invalid Number of Arguments. Expecting 5");
	}
		
	var certificate= Certificate { RollNo: args[0], SubjectCode: args[1], StudentUniqueID: args[2], Grade: args[3], Hash: args[4]}
	
	certificateAsBytes, _ :=json.Marshal(certificate)
	
	var key = certificate.RollNo
	key+="_"
	key+=certificate.SubjectCode
	key+="_"
	key+=certificate.StudentUniqueID
	
	APIStub.PutState(key,certificateAsBytes)
	
	return shim.Success(nil);
}

func (s *SmartContract) verify(APIStub shim.ChaincodeStubInterface, args []string) sc.Response {
	
	if len(args) != 5 {
		return shim.Error("Invalid Number of Arguments. Expecting 5")
	}
		
	var key=args[0]
	key+="_"
	key+=args[1]
	key+="_"
	key+=args[2]
	
	certificateAsBytes, _ :=APIStub.GetState(key)
	
	certificate:= Certificate{}
	
	json.Unmarshal(certificateAsBytes, &certificate)
	
	var buffer bytes.Buffer
	if certificate.RollNo!=args[0] || certificate.SubjectCode!=args[1] || certificate.StudentUniqueID!=args[2] || certificate.Grade!=args[3] || certificate.Hash!=args[4] {
		buffer.WriteString("0")
		return shim.Success(buffer.Bytes())
	}
	buffer.WriteString("1")
	return shim.Success(buffer.Bytes());
}
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
