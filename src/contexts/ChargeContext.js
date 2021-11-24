import React, { createContext, useState, useReducer, useCallback } from 'react';
import appReduce from '../reducers/appReducer';
import APP_ACTIONS from '../actions/appActions';
import DataService from '../services/db';
import { TokenService } from '../services/chain';
import { APP_CONSTANTS, DEFAULT_TOKEN } from '../constants';

const initialState = {
	tokenAmount: null,
	nftAmount: null
};

export const AppContext = createContext(initialState);
export const AppContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(appReduce, initialState);

	return (
		<AppContext.Provider
			value={{
				tokenAmount: state.tokenAmount,
				nftAmount: state.nftAmount,
				dispatch
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
