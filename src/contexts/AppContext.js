import React, { createContext, useState, useReducer, useCallback } from 'react';
import appReduce from '../reducers/appReducer';
import APP_ACTIONS from '../actions/appActions';
import DataService from '../services/db';
import { TokenService } from '../services/chain';
import { APP_CONSTANTS, DEFAULT_TOKEN } from '../constants';

const initialState = {
	address: null,
	agency: null,
	network: null,
	wallet: null,
	profile: null,
	hasWallet: true,
	tokenBalance: 0,
	scannedEthAddress: '',
	scannedAmount: null
};

export const AppContext = createContext(initialState);
export const AppContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(appReduce, initialState);
	const [recentTx, setRecentTx] = useState([]);

	const initApp = useCallback(async () => {
		DataService.addDefaultAsset(DEFAULT_TOKEN.SYMBOL, DEFAULT_TOKEN.NAME);
		//TODO: in future check version and add action if the version is different.
		DataService.save('version', APP_CONSTANTS.VERSION);
		let data = await DataService.initAppData();
		data.profile = await DataService.getProfile();
		data.hasWallet = data.wallet === null ? false : true;
		if (!data.hasWallet) {
			localStorage.removeItem('address');
		} else {
			let agency = await DataService.getDefaultAgency();
			if (!agency) return;
			const balance = await TokenService(agency.address).getBalance();
			data.balance = balance.toNumber();
			data.agency = agency;
		}
		dispatch({ type: APP_ACTIONS.INIT_APP, data });
	}, [dispatch]);

	async function setAgency(agency) {
		if (!agency) agency = await DataService.getDefaultAgency();
		dispatch({ type: APP_ACTIONS.SET_AGENCY, data: agency });
	}

	async function setTokenBalance(tokenBalance) {
		dispatch({ type: APP_ACTIONS.SET_BALANCE, data: tokenBalance });
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

	function addRecentTx(tx) {
		setRecentTx([]);
		if (!Array.isArray(tx)) tx = [tx];
		const arr = [...tx, ...recentTx];
		setRecentTx(arr.slice(0, 3));
	}

	return (
		<AppContext.Provider
			value={{
				agency: state.agency,
				tokenBalance: state.tokenBalance,
				address: state.address,
				scannedEthAddress: state.scannedEthAddress,
				scannedAmount: state.scannedAmount,
				hasWallet: state.hasWallet,
				network: state.network,
				wallet: state.wallet,
				recentTx,
				initApp,
				setAgency,
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
