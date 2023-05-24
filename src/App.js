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
        const pulseChainChainId = "0x171"; // Chain ID: 369

        if (currentChainId !== pulseChainChainId) {
          // Add PulseChain configuration
          const network = {
            chainId: pulseChainChainId,
            chainName: "PulseChain",
            nativeCurrency: {
              name: "PLS",
              symbol: "PLS",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.pulsechain.com"], // RPC URL
            blockExplorerUrls: ["https://scan.pulsechain.com"], // Block Explorer URL
          };

          // Request to add the PulseChain to MetaMask
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
        "https://graph.pulsechain.com/subgraphs/name/pulsechain/pulsex",
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

      // Define a list of blocked addresses.
      const blockedAddresses = [
        "0xfe980d2e7b329a3cbab245579e149eac0f40241c",
        "0x4c1483eb0f821d79c26ea0d43a712c7dd978b71e",
        "0x5076592237349822cd158997c6025d0f845ee4c2",
      ]; // Add more blocked addresses as needed.

      const filteredTokens = data.data.tokens.filter((token) => {
        // Exclude tokens with a longer than 10 char symbol, 20 char name, and blocked addresses.
        return (
          token.symbol.length <= 10 &&
          token.name.length <= 20 &&
          !blockedAddresses.includes(token.id)
        );
      });

      setSearchResults(filteredTokens);
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
      const pulseChainChainId = "0x171"; // Chain ID: 369

      if (currentChainId === pulseChainChainId) {
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
        console.error("Please switch to the PulseChain before adding.");
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
        <h1>PulseChain</h1>
        <div className="button-row">
          <button onClick={connectMetaMask}>Set up PulseChain</button>
          <p style={{ fontSize: "1rem" }}>Latest: Mainnet Live!</p>
          <p
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.2rem",
              fontSize: "0.9rem",
            }}
          >
            {" "}
            If you're on a mobile device, please use the mobile app's browser to
            access this site.
            <br></br>
            Tested working with mobile/browser Metamask, mobile/browser Trust
            wallet and mobile Coinbase Wallet.
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
                window.open("https://app.pulsex.com/swap", "_blank")
              }
            >
              To PulseX
            </button>
            <button
              onClick={() =>
                window.open("https://scan.pulsechain.com/", "_blank")
              }
            >
              To Block Explorer
            </button>
            <button
              onClick={() =>
                window.open("https://beacon.pulsechain.com/", "_blank")
              }
            >
              To Beacon Explorer
            </button>
            <button
              onClick={() =>
                window.open("https://launchpad.pulsechain.com/en/", "_blank")
              }
            >
              To Validator
            </button>
            <button
              onClick={() =>
                window.open("https://bridge.pulsechain.com/", "_blank")
              }
            >
              To Bridge
            </button>
          </div>
        </div>
        <div className="add-token-section">
          <h3 className="add-token-title">Add Tokens</h3>
        </div>
        <p
          style={{
            marginTop: "0.5rem",
            marginBottom: "0.2rem",
            fontSize: "0.9rem",
          }}
        >
          If the buttons doesn't work, check that you are on PulseChain.
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
                "0x95b303987a60c71504d99aa1b13b4da07b0790ab",
                "PLSX",
                18
              )
            }
          >
            Add PLSX{" "}
          </button>
          <button
            onClick={() =>
              addCustom("0x2b591e99afe9f32eaa6214f7b7629768c40eeb39", "HEX", 8)
            }
          >
            Add HEX{" "}
          </button>
          <button
            onClick={() =>
              addCustom("0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d", "INC", 18)
            }
          >
            Add INC{" "}
          </button>
          <button
            onClick={() =>
              addCustom("0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07", "USDC", 6)
            }
          >
            Add USDC Bridged{" "}
          </button> 
          <button
            onClick={() =>
              addCustom(
                "0xefD766cCb38EaF1dfd701853BFCe31359239F305",
                "Dai",
                18
              )
            }
          >
            Add Dai Bridged{" "}
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
                {token.name} ({token.symbol})
              </h4>
              <p className="contract-address">{token.id}</p>
              <button
                onClick={() =>
                  addCustom(token.id, token.symbol, token.decimals)
                }
              >
                Add {token.symbol}
              </button>
            </div>
          ))}
        </div>
        {account ? <p>Connected Account: {account}</p> : <p>Not connected</p>}
      </header>

      <footer className="App-footer">
        <p>Site made by Poseidon</p>
        <a href="https://t.me/Poseidon_PLS" target="_blank" rel="noreferrer">
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
            informational purposes only. Do be careful when adding contract
            addresses as they might be fraudulent. While we strive to keep the
            information up-to-date and correct, we make no representations or
            warranties of any kind, express or implied, about the completeness,
            accuracy, reliability, suitability, or availability with respect to
            the information, products, or services provided. Users are
            encouraged to do their own research and verify the information
            before acting on it. Any reliance you place on such information is
            strictly at your own risks.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
