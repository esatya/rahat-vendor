import React, { createContext, useState, useReducer, useCallback } from 'react';
import appReduce from '../reducers/appReducer';
import APP_ACTIONS from '../actions/appActions';
import DataService from '../services/db';
import { TokenService } from '../services/chain';
import { APP_CONSTANTS, DEFAULT_TOKEN } from '../constants';

const initialState = {
	tokenBalance: 0,
	address: null,
	network: null,
	wallet: null,
	hasWallet: true,
	scannedEthAddress: '',
	scannedAmount: null
};

export const AppContext = createContext(initialState);
export const AppContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(appReduce, initialState);
	const [recentTx, setRecentTx] = useState([]);

	async function setTokenBalance(tokenBalance) {
		dispatch({ type: APP_ACTIONS.SET_BALANCE, data: tokenBalance });
	}

	const initApp = useCallback(async () => {
		DataService.addDefaultAsset(DEFAULT_TOKEN.SYMBOL, DEFAULT_TOKEN.NAME);
		//TODO: in future check version and add action if the version is different.
		DataService.save('version', APP_CONSTANTS.VERSION);
		let data = await DataService.initAppData();
		data.hasWallet = data.wallet === null ? false : true;
		if (!data.hasWallet) {
			localStorage.removeItem('address');
		} else {
			let agency = await DataService.getDefaultAgency();
			if (!agency) return;
			const balance = await TokenService(agency.address).getBalance();
			setTokenBalance(balance.toNumber());
		}
		dispatch({ type: APP_ACTIONS.INIT_APP, data });
	}, [dispatch]);

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

	function addRecentTx(tx) {
		if (!Array.isArray(tx)) tx = [tx];
		const arr = [...tx, ...recentTx];
		setRecentTx(arr.slice(0, 3));
	}

	return (
		<AppContext.Provider
			value={{
				tokenBalance: state.tokenBalance,
				address: state.address,
				scannedEthAddress: state.scannedEthAddress,
				scannedAmount: state.scannedAmount,
				hasWallet: state.hasWallet,
				network: state.network,
				wallet: state.wallet,
				recentTx,
				initApp,
				setTokenBalance,
				saveScannedAddress,
				setHasWallet,
				setNetwork,
				setWallet,
				dispatch,
				addRecentTx
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
