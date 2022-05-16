import { connectWalletBegin, disconnectWalletBegin, disconnectWalletFailed, walletDisconnected } from "./WalletSlice";

export function disconnectWallet(web3, web3Modal) {
    return (dispatch) => {
        dispatch(disconnectWalletBegin());
        dispatch(connectWalletBegin());
        const promise = new Promise(async (resolve, reject) => {
            try {
                if (web3 && web3.currentProvider && web3.currentProvider.close) {
                    await web3.currentProvider.close();
                }
                await web3Modal.clearCachedProvider();
                dispatch(walletDisconnected());
                resolve();
            } catch (error) {
                dispatch(disconnectWalletFailed());
                reject(error);
            }
        });
        return promise;
    };
}