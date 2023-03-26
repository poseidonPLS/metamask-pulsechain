import { useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';
import logo from './logo.png'; // Import the logo image

function App() {
  const [account, setAccount] = useState('');

  const connectMetaMask = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      try {
        // Request account access
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const currentChainId = await provider.request({ method: 'eth_chainId' });
        const pulseChainTestnetV3ChainId = '0x3ae'; // Chain ID: 942

        if (currentChainId !== pulseChainTestnetV3ChainId) {
          // Add PulseChain Testnet V3 configuration
          const network = {
            chainId: pulseChainTestnetV3ChainId,
            chainName: 'PulseChain Testnet V3',
            nativeCurrency: {
              name: 'tPLS',
              symbol: 'tPLS',
              decimals: 18,
            },
            rpcUrls: ['https://rpc.v3.testnet.pulsechain.com'], // New RPC URL
            blockExplorerUrls: ['https://scan.v3.testnet.pulsechain.com'], // Block Explorer URL
          };

          // Request to add the PulseChain Testnet V3 to MetaMask
          await provider.request({ method: 'wallet_addEthereumChain', params: [network] });
        }

      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const addCustomToken = async (tokenAddress, tokenSymbol, tokenDecimals) => {
    const provider = await detectEthereumProvider();

    if (provider) {
      const currentChainId = await provider.request({ method: 'eth_chainId' });
      const pulseChainTestnetV3ChainId = '0x3ae'; // Chain ID: 942

      if (currentChainId === pulseChainTestnetV3ChainId) {
        try {
          // Request to add the custom token to MetaMask
          await provider.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20',
              options: {
                address: tokenAddress,
                symbol: tokenSymbol,
                decimals: tokenDecimals,
              },
            },
          });
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error('Please switch to the PulseChain Testnet V3 before adding tokens.');
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Logo" className="logo" /> {/* Add the logo */}
        <h1>MetaMask - PulseChain Testnet V3</h1>
        <div className="button-row">
          <button onClick={connectMetaMask}>Set up PulseChain in MetaMask</button>
        </div>
        <div className="button-row">
          <button onClick={() => addCustomToken('0x3b34fff74497ca21771ce9a0c11cb07490686a58', 'PLSX', 18)}>Add PulseX Token</button>
        </div>
        <div className="button-row">
          <button onClick={() => addCustomToken('0x2b591e99afe9f32eaa6214f7b7629768c40eeb39', 'HEX', 8)}>Add HEX Token</button>
        </div>
        {account ? <p>Connected Account: {account}</p> : <p>Not connected</p>}
      </header>
      <footer className="App-footer">
        <p>Site made by Poseidon</p>
        <a href="https://twitter.com/TheDonSGPulseX" target="_blank" rel="noopener noreferrer">@TheDonSGPulseX</a>
      </footer>
    </div>
  );
}

export default App;