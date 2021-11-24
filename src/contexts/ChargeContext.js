import React, { createContext } from 'react';
// import chargeReducer from '../reducers/chargeReducer';
// import CHARGE_ACTIONS from '../actions/chargeActions';

const initialState = {
	tokenAmount: null,
	nftAmount: null
};

export const ChargeContext = createContext(initialState);
export const ChargeContextProvider = ({ children }) => {
	// const [state, dispatch] = useReducer(chargeReducer, initialState);

	const getTokenAmount = () => localStorage.getItem('tokenAmount');

	const getNFTAmount = () => localStorage.getItem('nftAmount');

	const setTokenAmount = amount => {
		localStorage.setItem('tokenAmount', amount);
		// dispatch({ type: CHARGE_ACTIONS.SET_TOKEN_AMOUNT, data: amount });
	};
	const removeTokenAmount = () => {
		localStorage.removeItem('tokenAmount');
		// dispatch({ type: CHARGE_ACTIONS.SET_TOKEN_AMOUNT, data: null });
	};
	const setNFTAmount = amount => {
		localStorage.setItem('nftAmount', amount);
		// dispatch({ type: CHARGE_ACTIONS.SET_NFT_AMOUNT, data: amount });
	};
	const removeNFTAmount = () => {
		localStorage.removeItem('nftAmount');
		// dispatch({ type: CHARGE_ACTIONS.SET_NFT_AMOUNT, data: null });
	};
	return (
		<ChargeContext.Provider
			value={{
				// tokenAmount: state.tokenAmount,
				// nftAmount: state.nftAmount,
				getTokenAmount,
				getNFTAmount,
				setTokenAmount,
				setNFTAmount,
				removeTokenAmount,
				removeNFTAmount
			}}
		>
			{children}
		</ChargeContext.Provider>
	);
};
