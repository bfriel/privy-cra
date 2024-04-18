import { useState } from "react";
import "./App.css";
import { usePrivy, useWallets } from "@privy-io/react-auth";

function App() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [signature, setSignature] = useState("");

  // Wait until the Privy client is ready before taking any actions
  if (!ready) {
    return null;
  }
  
  async function signMessage() {
    const wallet = wallets[0];
    console.log("wallet: ", wallet);
    
    const provider = await wallet.getEthereumProvider();
    const address = wallet.address;
    const message = 'This is the message I am signing';
    const signature = await provider.request({
      method: 'personal_sign',
      params: [message, address],
    });
    setSignature(signature);
  }
  async function signTransaction() {
    const wallet = wallets[0];
    console.log("wallet: ", wallet);
    
    const provider = await wallet.getEthereumProvider();
    const transactionRequest = {
      to: wallet.address,
      value: 100000,
    };
    const transactionHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [transactionRequest],
    });
    console.log("transactionHash: ", transactionHash);
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* If the user is not authenticated, show a login button */}
        {/* If the user is authenticated, show the user object and a logout button */}
        {ready && authenticated ? (
          <div>
            <textarea
              readOnly
              value={JSON.stringify(user, null, 2)}
              style={{ width: "600px", height: "250px", borderRadius: "6px" }}
            />
            <br />
            <button onClick={signTransaction} style={{ marginTop: "20px", padding: "12px", backgroundColor: "#069478", color: "#FFF", border: "none", borderRadius: "6px" }}>
              Sign Transactino
            </button>
            <button onClick={signMessage} style={{ marginTop: "20px", padding: "12px", backgroundColor: "#069478", color: "#FFF", border: "none", borderRadius: "6px" }}>
              Sign Message
            </button>
            <textarea
              readOnly
              value={signature}
              style={{ width: "600px", height: "250px", borderRadius: "6px" }}
            />
            <br />
            <button onClick={logout} style={{ marginTop: "20px", padding: "12px", backgroundColor: "#069478", color: "#FFF", border: "none", borderRadius: "6px" }}>
              Log Out
            </button>
          </div>
        ) : (
          <button onClick={login} style={{padding: "12px", backgroundColor: "#069478", color: "#FFF", border: "none", borderRadius: "6px" }}>Log In</button>
        )}
      </header>
    </div>
  );
}

export default App;
