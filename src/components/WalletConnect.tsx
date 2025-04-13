import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { ethers } from "ethers";

const WalletConnect = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState("");
  const [balance, setBalance] = useState("");

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to continue.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const { name } = await provider.getNetwork();
      const balanceInWei = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balanceInWei);

      setAccount(address);
      setNetwork(name);
      setBalance(parseFloat(balanceInEth).toFixed(4));
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setNetwork("");
    setBalance("");
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        disconnectWallet();
      });

      window.ethereum.on("chainChanged", () => {
        disconnectWallet();
      });
    }
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        color: "white",
        cursor: "pointer",
        textDecoration: "none",
        textTransform: "uppercase",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 0, lg: 3 },
        mb: { xs: 3, lg: 0 },
        fontSize: "24px",
        lineHeight: "6px",
        width: "324px", // Ensuring both sections have the same width
        height: "45px",
        borderRadius: "6px",
        backgroundColor: "#00dbe3",
      }}
    >
      {!account ? (
        <Button
          onClick={connectWallet}
          sx={{
            all: "unset",
            textAlign: "center",
            color: "white",
            textTransform: "uppercase",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 0, lg: 3 },
            mb: { xs: 3, lg: 0 },
            fontSize: "24px",
            lineHeight: "6px",
            width: "324px", // Same width as the Box
            height: "45px", // Ensuring button matches Box height
            borderRadius: "6px",
            backgroundColor: "#00dbe3",
          }}
        >
          Connect Wallet
        </Button>
      ) : (
        <Box
          sx={{
            backgroundColor: "#111",
            color: "#fff",
            p: 2,
            borderRadius: "10px",
            mb: 2,
            width: "324px", // Match width of the Box
            height: "auto", // Let content size adjust
          }}
        >
          <Typography>Address: {account.slice(0, 6)}...{account.slice(-4)}</Typography>
          <Typography>Network: {network}</Typography>
          <Typography>Balance: {balance} ETH</Typography>

          <Button
            variant="outlined"
            color="error"
            onClick={disconnectWallet}
            sx={{
              marginTop: "10px",
              fontWeight: "bold",
              textTransform: "uppercase",
              borderRadius: "6px",
              color: "red",
              width: "324px", // Ensure Disconnect button has the same width
            }}
          >
            Disconnect
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default WalletConnect;
