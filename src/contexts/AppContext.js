import React, { createContext, useState, useReducer, useCallback } from 'react';
import appReduce from '../reducers/appReducer';
import APP_ACTIONS from '../actions/appActions';
import DataService from '../services/db';
import { TokenService } from '../services/chain';
import { APP_CONSTANTS, DEFAULT_TOKEN } from '../constants';
import { ethers } from 'ethers';

const initialState = {
	contextLoading: true,
	address: null,
	agency: null,
	network: null,
	wallet: null,
	profile: null,
	hasWallet: true,
	hasBackedUp: true,
	tokenBalance: 0,
	scannedEthAddress: '',
	scannedAmount: null,
	isSynchronizing: false
};

export const AppContext = createContext(initialState);
export const AppContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(appReduce, initialState);
	const [recentTx, setRecentTx] = useState([]);
	const toggleLoading = useCallback((loading = false) => {
		dispatch({ type: APP_ACTIONS.SET_LOADING, data: loading });
	}, []);
	const initialize_index_db = useCallback(async () => {
		DataService.dbInstance
			.open()
			.then(async () => {
				console.log('Dexie succesfully opened');
				await DataService.addDefaultAsset(DEFAULT_TOKEN.SYMBOL, DEFAULT_TOKEN.NAME);
				await DataService.save('version', APP_CONSTANTS.VERSION);
			})
			.catch(err => {
				console.log('Cannot open dexie', err);
			});
	}, []);

	const initApp = useCallback(async () => {
		//TODO: in future check version and add action if the version is different.
		await initialize_index_db();
		let data = await DataService.initAppData();
		data.profile = await DataService.getProfile();
		data.hasWallet = data.wallet === null ? false : true;
		if (!data.hasWallet) {
			localStorage.removeItem('address');
		} else {
			let agency = await DataService.getDefaultAgency();
			let balance;
			try {
				if (!agency) throw Error('No agency');
				const blcs = await TokenService(agency.address).getBalance();
				balance = blcs;
			} catch (err) {
				balance = ethers.BigNumber.from(0);
			}
			data.balance = balance.toNumber();
			data.agency = agency;
		}
		dispatch({ type: APP_ACTIONS.INIT_APP, data });
		toggleLoading(false);
	}, [dispatch, toggleLoading, initialize_index_db]);

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
				hasBackedUp: state.hasBackedUp,
				contextLoading: state.contextLoading,
				isSynchronizing: state.isSynchronizing,
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
