import React, {useState, useEffect} from 'react';
import { ethers} from "ethers";

function App() {

  const [greet, setGreet] = useState('');
  const [balance, setBalance] = useState();
  const [depositValue, setDepositValue] = useState('');
  const [greetingValue, setGreetingValue] = useState('');

    // A Web3Provider wraps a standard Web3 provider, which is
  // what MetaMask injects as window.ethereum into each page
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contractAddress  = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  

  // The ERC-20 Contract ABI, which is a common contract interface
  // for tokens (this is the Human-Readable ABI format)
  const ABI = [
    
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_greeting",
            "type": "string"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "greet",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_greeting",
            "type": "string"
          }
        ],
        "name": "setGreeting",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    
  ];
  
  // The Contract object
  const contract = new ethers.Contract(contractAddress, ABI, signer);

  // MetaMask requires requesting permission to connect users accounts

  useEffect(() => {
    const connectWallet = async () => {
      await provider.send("eth_requestAccounts", []);

    }

    const getBalance = async () => {
      

      const balance = await provider.getBalance(contractAddress)

      const balanceFormatted = ethers.utils.formatEther(balance)
      setBalance(balanceFormatted);
    }

    const getGreeting = async() => {
      const greeting = await contract.greet();
      setGreet(greeting);
    }

    connectWallet()

      .catch(console.error);

    getBalance()
      .catch(console.error);  

    getGreeting()
      .catch(console.error);
    

  })

  

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  

  const handleDepositChange = (e) => {

      setDepositValue(e.target.value);
  }

  const handleGreetingChange = (e) => {
    setGreetingValue(e.target.value);

  }

  const handleDepositSubmit = async (e) => {

   e.preventDefault();
   console.log(depositValue);
   const ethValue = ethers.utils.parseEther(depositValue)

   const depositEth = await contract.deposit({ value : ethValue })
   await depositEth.wait(); 
   const balance = await provider.getBalance(contractAddress)

   const balanceFormatted = ethers.utils.formatEther(balance)
   setBalance(balanceFormatted);

  }

  const handleGreetingSubmit = async (e) => {

    e.preventDefault();
    //console.log(greetingValue);
    const greetingUpdate =  await contract.setGreeting(greetingValue);
    await greetingUpdate.wait();
    setGreet(greetingValue);
    // setGreetingValue('');

  }




  return (

    

    <div className="container">
      <div className="container">
        <div className="row mt-5">
          <div className="col">
            <h3>{greet}</h3>
            <h4>Contract Balance: {balance} ETH</h4>
          </div>
          <div className="col">
            <form onSubmit={handleDepositSubmit}> 
              <div className="mb-3">
                
                <input type="number" className="form-control" placeholder="0" onChange={handleDepositChange} value={depositValue} />
                  
              </div>
              
              <button type="submit" className="btn btn-success">Deposit</button>
              
            </form>
            <form className = "mt-5" onSubmit = {handleGreetingSubmit} >
              <div className="mb-3">
                
                <input type="text" className="form-control" onChange={handleGreetingChange} value={greetingValue} />
                  
              </div>
              
              <button type="submit" className="btn btn-primary">Change</button>
            </form>
          </div>

        </div>
      </div>


    </div>

  );
}

export default App;
