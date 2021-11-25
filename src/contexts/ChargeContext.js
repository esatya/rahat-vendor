import React, { createContext } from 'react';
// import chargeReducer from '../reducers/chargeReducer';
// import CHARGE_ACTIONS from '../actions/chargeActions';

const CHARGE_CONSTANTS = {
	TOKEN_AMOUNT: 'tokenAmount',
	NFT_AMOUNT: 'nftAmount',
	NFT_DETAIL: 'nftDetails'
};
const initialState = {
	tokenAmount: null,
	nftAmount: null
};

export const ChargeContext = createContext(initialState);
export const ChargeContextProvider = ({ children }) => {
	// const [state, dispatch] = useReducer(chargeReducer, initialState);

	const getTokenAmount = () => localStorage.getItem(CHARGE_CONSTANTS.TOKEN_AMOUNT);

	const getNFTAmount = () => localStorage.getItem(CHARGE_CONSTANTS.NFT_AMOUNT);

	const getNFTDetails = () => JSON.parse(localStorage.getItem(CHARGE_CONSTANTS.NFT_DETAIL));

	const setTokenAmount = amount => {
		localStorage.setItem(CHARGE_CONSTANTS.TOKEN_AMOUNT, amount);
		// dispatch({ type: CHARGE_ACTIONS.SET_TOKEN_AMOUNT, data: amount });
	};
	const setNFTAmount = amount => {
		localStorage.setItem(CHARGE_CONSTANTS.NFT_AMOUNT, amount);
		// dispatch({ type: CHARGE_ACTIONS.SET_NFT_AMOUNT, data: amount });
	};

	const setNFTDetails = details => {
		localStorage.setItem(CHARGE_CONSTANTS.NFT_DETAIL, JSON.stringify(details));
	};

	const removeTokenAmount = () => {
		localStorage.removeItem(CHARGE_CONSTANTS.TOKEN_AMOUNT);
		// dispatch({ type: CHARGE_ACTIONS.SET_TOKEN_AMOUNT, data: null });
	};

	const removeNFTAmount = () => {
		localStorage.removeItem(CHARGE_CONSTANTS.NFT_AMOUNT);
		// dispatch({ type: CHARGE_ACTIONS.SET_NFT_AMOUNT, data: null });
	};
	const removeNFTDetails = () => {
		localStorage.removeItem(CHARGE_CONSTANTS.NFT_DETAIL);
		// dispatch({ type: CHARGE_ACTIONS.SET_NFT_AMOUNT, data: null });
	};
	return (
		<ChargeContext.Provider
			value={{
				// tokenAmount: state.tokenAmount,
				// nftAmount: state.nftAmount,
				getTokenAmount,
				getNFTAmount,
				getNFTDetails,

				setTokenAmount,
				setNFTAmount,
				setNFTDetails,

				removeTokenAmount,
				removeNFTAmount,
				removeNFTDetails
			}}
		>
			{children}
		</ChargeContext.Provider>
	);
};
