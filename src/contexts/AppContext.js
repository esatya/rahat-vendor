import React, { createContext, useReducer, useCallback } from 'react';
import appReduce from '../reducers/appReducer';
import APP_ACTIONS from '../actions/appActions';
import Contract from '../utils/blockchain/contract';
import DataService from '../services/db';
import { APP_CONSTANTS, CONTRACT, DEFAULT_TOKEN } from '../constants';

const initialState = {
	sendingTokenName: '',
	address: null,
	network: null,
	wallet: null,
	hasWallet: true,
	scannedEthAddress: '',
	scannedAmount: null,
	balance: 0
};

export const AppContext = createContext(initialState);
export const AppContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(appReduce, initialState);

	const initApp = useCallback(async () => {
		DataService.addDefaultAsset(DEFAULT_TOKEN.SYMBOL, DEFAULT_TOKEN.NAME);
		//TODO: in future check version and add action if the version is different.
		DataService.save('version', APP_CONSTANTS.VERSION);
		let data = await DataService.initAppData();
		data.hasWallet = data.wallet === null ? false : true;
		if (data.hasWallet) data.balance = await getBalance();
		if (!data.hasWallet) localStorage.removeItem('address');
		dispatch({ type: APP_ACTIONS.INIT_APP, data });
	}, [dispatch]);

	async function getBalance() {
		const agency = await DataService.listAgencies();
		const tokenAddress = agency[0].tokenAddress;
		const userAddress = await DataService.getAddress();
		if (!userAddress) return 0;
		const tokenContract = Contract({ address: tokenAddress, type: CONTRACT.TOKEN }).get();
		const remainingBalance = await tokenContract.balanceOf(userAddress);
		const balance = remainingBalance.toNumber();
		dispatch({ type: APP_ACTIONS.SET_ETH_BALANCE, data: balance });
		return balance;
	}

	function setHasWallet(hasWallet) {
		dispatch({ type: APP_ACTIONS.SET_HASWALLET, data: hasWallet });
	}

	function setWallet(wallet) {
		dispatch({ type: APP_ACTIONS.SET_WALLET, data: wallet });
	}

	function setNetwork(network) {
		dispatch({ type: APP_ACTIONS.SET_NETWORK, data: network });
	}

	function saveScannedAddress(data) {
		dispatch({ type: APP_ACTIONS.SET_SCANNED_DATA, data });
	}

	function saveSendingTokenName(symbol) {
		dispatch({ type: APP_ACTIONS.SET_SENDING_TOKEN_NAME, data: symbol });
	}

	return (
		<AppContext.Provider
			value={{
				address: state.address,
				scannedEthAddress: state.scannedEthAddress,
				scannedAmount: state.scannedAmount,
				hasWallet: state.hasWallet,
				network: state.network,
				wallet: state.wallet,
				sendingTokenName: state.sendingTokenName,
				balance: state.balance,
				initApp,
				saveSendingTokenName,
				saveScannedAddress,
				setHasWallet,
				setNetwork,
				getBalance,
				setWallet,
				dispatch
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
