import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contracts/Condominium.json";

function App() {

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [inputValue, setInputValue] = useState({ condominiumName: "", condominiumDefaultFee: "", payCondominiumFee: "" });
  const [isCondominiumManager, setIsCondominiumManager] = useState(false);
  const [condominiumManagerAddress, setCondominiumManagerAddress] = useState(null);
  const [currentCondominiumBalance, setCurrentCondominiumBalance] = useState(null);
  const [currentCondominiumName, setCurrentCondominiumName] = useState(null);
  const [currentCondominiumDefaultFee, setCurrentCondominiumDefaultFee] = useState(null);
  const [jointOwnerAddress, setJointOwnerAddress] = useState(null); 

  const contractAddress = '0xF0E851F6F0D7EcA23faBaad3105E77Ff14b5Ce2E';
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0];
        setIsWalletConnected(true);
        setJointOwnerAddress(account);
        console.log("Account Connected: ", account);
      } else {
        setError("Please install a MetaMask wallet to use our bank.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }

  const getCondominiumManagerHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);

        let condominiumManager = await bankContract.condominiumManager();
        setCondominiumManagerAddress(condominiumManager);

        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (condominiumManager.toLowerCase() === account.toLowerCase()) {
          setIsCondominiumManager(true);
        }
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getCondominiumBalance = async () => {
    try {
      if (window.ethereum) {

        //read data
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const condominiumContract = new ethers.Contract(contractAddress, contractABI, signer);

        let condominiumBalance = await condominiumContract.getCondominiumBalance();
        setCurrentCondominiumBalance(parseFloat(condominiumBalance).toFixed(4));
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getCondominiumName = async () => {
    try {
      if (window.ethereum) {

        //read data
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const condominiumContract = new ethers.Contract(contractAddress, contractABI, signer);

        let condominiumName = await condominiumContract.condominiumName();
        condominiumName = utils.parseBytes32String(condominiumName);
        setCurrentCondominiumName(condominiumName.toString());
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setCondominiumNameHandler = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const condominiumContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await condominiumContract.setCondominiumName(utils.formatBytes32String(inputValue.condominiumName));
        console.log("Setting Condominium Name...");
        await txn.wait();
        console.log("Condominium Name Changed", txn.hash);
        getCondominiumName();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getCondominiumDefaultFee = async () => {
    try {
      if (window.ethereum) {

        //read data
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const condominiumContract = new ethers.Contract(contractAddress, contractABI, signer);

        let condominiumDefaultFee = await condominiumContract.condominiumDefaultFee();
        condominiumDefaultFee = utils.parseBytes32String(condominiumDefaultFee);
        setCurrentCondominiumDefaultFee(condominiumDefaultFee.toString());
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setCondominiumDefaultFeeHandler = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const condominiumContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await condominiumContract.setCondominiumDefaultFee(utils.formatBytes32String(inputValue.condominiumDefaultFee));
        console.log("Setting Condominium Default Fee...");
        await txn.wait();
        console.log("Condominium Default Fee Changed", txn.hash);
        getCondominiumDefaultFee();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const payCondominiumFeeHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        //write data
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const condominiumContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await condominiumContract.payCondominiumFee({ value: ethers.utils.parseEther(inputValue.payCondominiumFee) });
        console.log("Payment for condominium fee...");
        await txn.wait();
        console.log("Condominium fee paid...", txn.hash);

        getCondominiumBalance();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    checkIfWalletIsConnected();
    getCondominiumName();
    getCondominiumBalance();
    getCondominiumDefaultFee();
    getCondominiumManagerHandler();
  }, [isWalletConnected])

  return (
    <main className="main-container">
      <h2 className="headline"><span className="headline-gradient">Condominium Management</span> 🏢</h2>
      <section className="jointOwner-section px-10 pt-5 pb-10">
        <p className="text-2xl text-red-700"></p>
        <div className="mt-5">
          {currentCondominiumName === "" && isCondominiumManager?
            <p>"Setup the name of your condominium." </p> :
            <p className="text-3xl font-bold">Condominium: {currentCondominiumName}</p>
          }
        </div>
        <div className="mt-5">
          {currentCondominiumDefaultFee === "" ?
            <p>"Setup the default fee of your condominium." </p> :
            <p className="text-3xl font-bold">Default Fee (ETH): {currentCondominiumDefaultFee}</p>
          }
        </div>
        <div className="mt-7 mb-9">
          <form className="form-style">
            <input
              type="text"
              className="input-style"
              onChange={handleInputChange}
              name="payCondominiumFee"
              placeholder="0.0000 ETH"
              value={inputValue.payCondominiumFee}
            />
            <button
              className="btn-green"
              onClick={payCondominiumFeeHandler}>Pay Condominium Fee In ETH</button>
          </form>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">Condominium Manager Address: </span>{condominiumManagerAddress}</p>
        </div>
        <div className="mt-5">
        {isWalletConnected && <p><span className="font-bold">Your Wallet Address: </span>{jointOwnerAddress}</p>}
          <button className="btn-connect" onClick={checkIfWalletIsConnected}>
            {isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
          </button>
        </div>
      </section>
      {
        isCondominiumManager && (
          <section className="condominium-manager-section">
            <h2 className="text-xl border-b-2 border-green-500 px-10 py-4 font-bold">Manager Panel</h2>
            <div className="p-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="condominiumName"
                  placeholder="Enter a name for your condominium"
                  value={inputValue.condominiumName}
                />
                <button
                  className="btn-grey"
                  onClick={setCondominiumNameHandler}>
                  Set Condominium Name
                </button>
              </form>
            </div>
            <div className="p-10">
              <form className="form-style">
              <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="condominiumDefaultFee"
                  placeholder="Enter a default fee for your condominium"
                  value={inputValue.condominiumDefaultFee}
                />
                <button
                  className="btn-grey"
                  onClick={setCondominiumDefaultFeeHandler}>
                  Set Condominium Default Fee
                </button>
              </form>
            </div>
            <div className="p-10">
              <p>Condominium Balance: {currentCondominiumBalance}</p>
            </div>
          </section>
        )
      }
    </main>
  );
}
export default App;