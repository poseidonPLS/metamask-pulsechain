import { useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import "./App.css";
import logo from "./logo.png"; // Import PulseChain logo image
import logoPulseX from "./logoPulseX.png"; // Import the PulseX logo image
import logoHEX from "./logoHEX.png"; // Import the HEX logo image

function App() {
  const [account, setAccount] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 

  const connectMetaMask = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      try {
        // Request account access
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        const currentChainId = await provider.request({
          method: "eth_chainId",
        });
        const pulseChainTestnetv4ChainId = "0x3af"; // Chain ID: 943

        if (currentChainId !== pulseChainTestnetv4ChainId) {
          // Add PulseChain Testnet V4 configuration
          const network = {
            chainId: pulseChainTestnetv4ChainId,
            chainName: "PulseChain Testnet V4",
            nativeCurrency: {
              name: "tPLS",
              symbol: "tPLS",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.v4.testnet.pulsechain.com"], // RPC URL
            blockExplorerUrls: ["https://scan.v4.testnet.pulsechain.com"], // Block Explorer URL
          };

          // Request to add the PulseChain Testnet V4 to MetaMask
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [network],
          });
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchTokens(searchInput);
    }
  };

  const searchTokens = async (query) => {
    if (query.trim() === "") {
      setSearchResults([]);
      setErrorMessage("Please enter a symbol to search.");
      return;
    }

    try {
      const response = await fetch(
        "https://graph.v4.testnet.pulsechain.com/subgraphs/name/pulsechain/pulsex",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `{tokens (where: {symbol_contains_nocase: "${query}"}) {id, name, symbol, decimals}}`,
          }),
        }
      );

      const data = await response.json();
      setSearchResults(data.data.tokens);
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setSearchResults([]);
      setErrorMessage("An error occurred while searching for tokens.");
    }
  };

  const addCustom = async (Address, Symbol, Decimals) => {
    const provider = await detectEthereumProvider();

    if (provider) {
      const currentChainId = await provider.request({ method: "eth_chainId" });
      const pulseChainTestnetv4ChainId = "0x3af"; // Chain ID: 943

      if (currentChainId === pulseChainTestnetv4ChainId) {
        try {
          // Request to add the custom to MetaMask
          await provider.request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC20",
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
        console.error(
          "Please switch to the PulseChain Testnet v4 before adding."
        );
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <a href="https://hex.com" target="_blank" rel="noopener noreferrer">
            <img src={logoHEX} alt="HEX Logo" className="logo" />
          </a>
          <a
            href="https://pulsechain.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={logo} alt="PulseChain Logo" className="logo" />
          </a>
          <a
            href="https://pulsex.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={logoPulseX} alt="PulseX Logo" className="logo" />
          </a>
        </div>
        <h1>PulseChain Testnet v4</h1>
        <div className="button-row">
          <button onClick={connectMetaMask}>Set up PulseChain V4</button>
          <p style={{ fontSize: "1rem" }}>
            Latest: V4 bridge is LIVE!
          </p>
          <p style={{ marginTop: "0.5rem", marginBottom: "0.2rem", fontSize: "0.9rem" }}>
            {" "}
            If you're on a mobile device, please use the mobile app's browser to
            access this site.
            <br></br>
             Tested working with mobile/browser Metamask,
            mobile/browser Trust wallet and mobile Coinbase Wallet.
          </p>
          <p style={{ fontSize: "0.8rem" }}>
            * Your mobile app need to support custom RPC. 
          </p>
        </div>
        <div className="navigation-section">
          <h3 className="navigation-heading">Quick Links</h3>
          <div className="navigation-buttons">
            <button
              onClick={() =>
                window.open("https://app.v4.testnet.pulsex.com/swap", "_blank")
              }
            >
              To PulseX
            </button>
            <button
              onClick={() =>
                window.open("https://scan.v4.testnet.pulsechain.com/", "_blank")
              }
            >
              To Block Explorer
            </button>
            <button
              onClick={() =>
                window.open(
                  "https://beacon.v4.testnet.pulsechain.com/",
                  "_blank"
                )
              }
            >
              To Beacon Explorer
            </button>
            <button
              onClick={() =>
                window.open(
                  "https://faucet.v4.testnet.pulsechain.com/",
                  "_blank"
                )
              }
            >
              To Faucet
            </button>
            <button
              onClick={() =>
                window.open(
                  "https://launchpad.v4.testnet.pulsechain.com/en/",
                  "_blank"
                )
              }
            >
              To Validator
            </button>
            <button
              onClick={() => window.open("https://pulseramp.com/#/", "_blank")}
            >
              To Bridge
            </button>
            <button
              onClick={() =>
                window.open(
                  "https://pulsechain-sacrifice-checker.vercel.app/",
                  "_blank"
                )
              }
            >
              To Sacrifice Checker
            </button>
          </div>
        </div>
        <div className="add-token-section">
          <h3 className="add-token-title">Add Tokens</h3>
        </div>
        <p style={{ marginTop: "0.5rem", marginBottom: "0.2rem", fontSize: "0.9rem" }}>
              If the buttons doesn't work, check that you are on PulseChain Testnet.
          </p>
        <div className="grid-container">
          <button
            onClick={() =>
              addCustom("0x2b591e99afe9f32eaa6214f7b7629768c40eeb39", "HEX", 8)
            }
          >
            Add HEX{" "}
          </button>
          <button
            onClick={() =>
              addCustom(
                "0x8a810ea8b121d08342e9e7696f4a9915cbe494b7",
                "PLSX",
                18
              )
            }
          >
            Add PLSX{" "}
          </button>
          <button
            onClick={() =>
              addCustom("0x6efafcb715f385c71d8af763e8478feea6fadf63", "INC", 18)
            }
          >
            Add INC{" "}
          </button>
          <button
            onClick={() =>
              addCustom("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", "USDC", 6)
            }
          >
            Add USDC{" "}
          </button>
          <button
            onClick={() =>
              addCustom("0x6b175474e89094c44da98b954eedeac495271d0f", "DAI", 18)
            }
          >
            Add DAI{" "}
          </button>
          <button
            onClick={() =>
              addCustom(
                "0x826e4e896cc2f5b371cd7bb0bd929db3e3db67c0",
                "tDai",
                18
              )
            }
          >
            Add tDai{" "}
          </button>
        </div>
        <div className="button-row">
          <input
            type="text"
            placeholder="Search for other tokens"
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress} 
            style={{
              fontSize: "1rem",
              padding: "0.5rem",
              width: "60%",
              marginRight: "1rem",
            }}
          />
          <button onClick={() => searchTokens(searchInput)}>Search</button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}{" "}
        {/* Add this line to display the error message */}
        <div className="search-results grid-container">
          {searchResults.map((token) => (
            <div key={token.id} className="token">
              <h4>
                {token.name} ({token.symbol}
                {token.name.includes("from Sepolia") ? "-bridged" : ""}){" "}
                {/* Update this line */}
              </h4>
              <p className="contract-address">{token.id}</p>
              <button
                onClick={() =>
                  addCustom(token.id, token.symbol, token.decimals)
                }
              >
                Add {token.symbol}
                {token.name.includes("from Sepolia")
                  ? "-bridged"
                  : ""} Token {/* Update this line */}
              </button>
            </div>
          ))}
        </div>
        {account ? <p>Connected Account: {account}</p> : <p>Not connected</p>}
      </header>

      <footer className="App-footer">
        <p>Site made by Poseidon</p>
        <a
              href="https://t.me/Poseidon_PLS"
              target="_blank"
              rel="noreferrer"
            >
              Telegram
            </a>
            <br></br>
        <a
          href="https://twitter.com/TheDonSGPulseX"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
        <div className="disclaimer">
          <p>
            Disclaimer: The information provided by this application is for
            informational purposes only. While we strive to keep the information
            up-to-date and correct, we make no representations or warranties of
            any kind, express or implied, about the completeness, accuracy,
            reliability, suitability, or availability with respect to the
            information, products, or services provided. Users are encouraged to
            do their own research and verify the information before acting on
            it. Any reliance you place on such information is strictly at your
            own risk.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
