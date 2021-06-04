import APP_ACTIONS from '../actions/appActions';

const AppReducer = (state, action) => {
	switch (action.type) {
		case APP_ACTIONS.INIT_APP:
			return {
				...state,
				address: action.data.address,
				network: action.data.network,
				hasWallet: action.data.hasWallet
			};

		case APP_ACTIONS.SET_NETWORK:
			return {
				...state,
				network: action.data
			};

		case APP_ACTIONS.SET_WALLET:
			return {
				...state,
				wallet: action.data
			};

		case APP_ACTIONS.SET_HASWALLET:
			return {
				...state,
				hasWallet: action.data
			};

		case APP_ACTIONS.SET_SCCANNED_DATA:
			return {
				...state,
				scannedEthAddress: action.data.address,
				scannedAmount: action.data.amount ? action.data.amount : null
			};

		case APP_ACTIONS.SET_SENDING_TOKEN_NAME:
			return {
				...state,
				sendingTokenName: action.data
			};

		default:
			return state;
	}
};

export default AppReducer;
