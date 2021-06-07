import APP_ACTIONS from '../actions/appActions';

const AppReducer = (state, action) => {
	switch (action.type) {
		case APP_ACTIONS.INIT_APP:
			return {
				...state,
				address: action.data.address,
				network: action.data.network,
				hasWallet: action.data.hasWallet,
				tokenBalance: action.data.balance,
				agency: action.data.agency
			};

		case APP_ACTIONS.SET_AGENCY:
			return {
				...state,
				agency: action.data
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

		case APP_ACTIONS.SET_BALANCE:
			return {
				...state,
				tokenBalance: action.data ? action.data : 0
			};

		case APP_ACTIONS.ADD_RECENT_TX:
			return {
				...state,
				recentTx: action.data ? action.data : []
			};

		case APP_ACTIONS.SET_SCANNED_DATA:
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
