import { useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';
import logo from './logo.png'; // Import the logo image

function App() {
  const [account, setAccount] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState('');


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

  const searchTokens = async (symbol) => {
    const query = `
      {
        tokens (where: {symbol_contains_nocase: "${symbol}"}) {
          id,
          symbol,
          decimals
        }
      }
    `;
  
    try {
      const response = await fetch('https://graph.v3.testnet.pulsechain.com/subgraphs/name/pulsechain/pulsex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
  
      const data = await response.json();
      setSearchResults(data.data.tokens);
    } catch (error) {
      console.error('Error fetching token data:', error);
    }
  };

  const addCustom = async (Address, Symbol, Decimals) => {
    const provider = await detectEthereumProvider();

    if (provider) {
      const currentChainId = await provider.request({ method: 'eth_chainId' });
      const pulseChainTestnetV3ChainId = '0x3ae'; // Chain ID: 942

      if (currentChainId === pulseChainTestnetV3ChainId) {
        try {
          // Request to add the custom  to MetaMask
          await provider.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20',
              options: {
                address: Address,
                symbol: Symbol,
                decimals: Decimals,
              },
            },
          });
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error('Please switch to the PulseChain Testnet V3 before adding s.');
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
        <div className="grid-container">
      <button onClick={() => addCustom('0x3b34fff74497ca21771ce9a0c11cb07490686a58', 'PLSX', 18)}>Add PLSX </button>
      <button onClick={() => addCustom('0x2b591e99afe9f32eaa6214f7b7629768c40eeb39', 'HEX', 8)}>Add HEX </button>
      <button onClick={() => addCustom('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 'USDC', 6)}>Add USDC </button>
      <button onClick={() => addCustom('0x6b175474e89094c44da98b954eedeac495271d0f', 'DAI', 18)}>Add DAI </button>
      <button onClick={() => addCustom('0xdac17f958d2ee523a2206206994597c13d831ec7', 'USDT', 6)}>Add USDT </button>
    </div>
    <div className="button-row">
    <input
  type="text"
  placeholder="Search for other tokens"
  onChange={(e) => setSearchInput(e.target.value)}
  style={{ fontSize: '1rem', padding: '0.5rem', width: '60%', marginRight: '1rem' }}
/>
      <button onClick={() => searchTokens(searchInput)}>Search</button>
    </div>
    <div className="search-results grid-container">
  {searchResults.map((token) => (
    <div key={token.id} className="token">
      <h4>{token.symbol}</h4>
      <p className="contract-address">{token.id}</p>
      <button onClick={() => addCustom(token.id, token.symbol, token.decimals)}>
        Add {token.symbol} Token
      </button>
    </div>
  ))}
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