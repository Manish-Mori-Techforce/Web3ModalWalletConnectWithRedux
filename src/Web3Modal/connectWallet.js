import Web3 from "web3";
import { accountChanged, connectWalletBegin, connectWalletFailed, networkChanged, walletConnected, walletDisconnected } from "./WalletSlice";

export function connectWallet(web3Modal) {
    return async (dispatch) => {
      dispatch(connectWalletBegin());
      try {
        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);
        web3.eth.extend({
          methods: [
            {
              name: "chainId",
              call: "eth_chainId",
              outputFormatter: web3.utils.hexToNumber
            }
          ]
        });
        const subscribeProvider = (provider) => {
          if (!provider.on) {
            return;
          }
          provider.on("disconnect", async () => {
            dispatch(walletDisconnected(web3, web3Modal));
          });
          provider.on("accountsChanged", async (accounts) => {
            const account = accounts[0];
            if (account) {
              dispatch(accountChanged({address: account}));
            } else {
              dispatch(walletDisconnected(web3, web3Modal));
            }
          });
          provider.on("chainChanged", async (chainId) => {
            const networkId = web3.utils.isHex(chainId)
              ? web3.utils.hexToNumber(chainId)
              : chainId;
            dispatch(networkChanged({networkId: networkId}));
          });
        };
        subscribeProvider(provider);
  
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        let networkId = await web3.eth.getChainId();
        if (networkId === 86) {
          // Trust provider returns an incorrect chainId for BSC.
          networkId = 56;
        }
        dispatch(walletConnected({web3, address, networkId}));
      } catch (error) {
        dispatch(connectWalletFailed());
      }
    };
  }