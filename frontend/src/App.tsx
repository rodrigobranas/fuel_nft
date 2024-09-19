import { useEffect, useState } from "react";
import {
  useBalance,
  useConnectUI,
  useIsConnected,
  useWallet,
} from "@fuels/react";
import { NftContract } from "./sway-api";
 
 
// REPLACE WITH YOUR CONTRACT ID
const CONTRACT_ID =
  "0xc347d4b034a46df5c887d8e8a03c4daa6d29cdd55a4490515761a4610dd8675a";
 
export default function App() {
  const [contract, setContract] = useState<NftContract>();
  const [transaction, setTransaction] = useState<String>();
  const { connect, isConnecting } = useConnectUI();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();
  const { balance } = useBalance({
    address: wallet?.address.toAddress(),
    assetId: wallet?.provider.getBaseAssetId(),
  });
 
  useEffect(() => {
    async function init() {
      if (isConnected && wallet) {
        const contract = new NftContract(
          CONTRACT_ID,
          wallet
        );
        setContract(contract);
      }
    }
 
    init();
  }, [isConnected, wallet]);

 
  const mint = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
	if (!wallet) {
		return alert("Wallet not loaded");
	}
	const input = {
		Address: {
			bits: wallet.address.toB256()
		}
	};
	const output = await contract.functions.mint(input, "0x0000000000000000000000000000000000000000000000000000000000000000", 1).call();
	const result = await output.waitForResult();
	setTransaction(result.transactionId);
  };
 
  return (
    <div style={styles.root}>
      <div style={styles.container}>
        {isConnected ? (
          <>
			{ transaction && 
				<div style={styles.center}>
					<h3>Success</h3>
					<div>{ transaction }</div>
					<div><a href={`https://app.fuel.network/tx/${transaction}/simple`} target="_blank">open transaction on explorer</a></div>
				</div>
			}
            {balance && balance.toNumber() === 0 ? (
              <p>
                Get testnet funds from the{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://faucet-testnet.fuel.network/?address=${wallet?.address.toAddress()}`}
                >
                  Fuel Faucet
                </a>{" "}
                to mint.
              </p>
            ) : (
              <button onClick={mint} style={styles.button}>
                Mint
              </button>
            )}
 
            <p>Your Fuel Wallet address is:</p>
            <p>{wallet?.address.toAddress()}</p>
          </>
        ) : (
          <button
            onClick={() => {
              connect();
            }}
            style={styles.button}
          >
            {isConnecting ? "Connecting" : "Connect"}
          </button>
        )}
      </div>
    </div>
  );
}
 
const styles = {
  root: {
    display: "grid",
    placeItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "black",
  } as React.CSSProperties,
  container: {
    color: "#ffffffec",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  } as React.CSSProperties,
  label: {
    fontSize: "28px",
  },
  counter: {
    color: "#a0a0a0",
    fontSize: "48px",
  },
  button: {
    borderRadius: "8px",
    margin: "24px 0px",
    backgroundColor: "#707070",
    fontSize: "16px",
    color: "#ffffffec",
    border: "none",
    outline: "none",
    height: "60px",
    padding: "0 1rem",
    cursor: "pointer",
  },
  center: {
	textAlign: "center"
  } as React.CSSProperties
};