import './App.css';
import ResponsiveAppBar from './component/ResponsiveAppBar';
import { useCallback, useEffect, useState } from 'react';
import { createweb3Modal } from './Web3Modal/createWeb3Modal';
import { useConnectWallet, useDisconnectWallet } from './Web3Modal/WalletSlice';

function App() {
  const {
    connectWallet,
    web3,
    address,
    networkId,
    connected
  } = useConnectWallet();
  const { disconnectWallet } = useDisconnectWallet();
  const [web3Modal, setModal] = useState(null);

  useEffect(() => {
    setModal(createweb3Modal);
  }, [setModal]);

  useEffect(() => {
    // if (web3Modal && (web3Modal.cachedProvider || window.ethereum)) {
    //   connectWallet(web3Modal);
    // }
  }, [web3Modal, connectWallet]);

  const connectWalletCallback = useCallback(() => {
    connectWallet(web3Modal);
  }, [web3Modal, connectWallet]);

  const disconnectWalletCallback = useCallback(() => {
    disconnectWallet(web3, web3Modal);
  }, [web3, web3Modal, disconnectWallet]);
  
  return (
    <ResponsiveAppBar
      address={address}
      connected={connected}
      connectWallet={connectWalletCallback}
      disconnectWallet={disconnectWalletCallback} />
  );
}

export default App;
