import CHARGE_ACTIONS from '../actions/chargeActions';

const AppReducer = (state, action) => {
	switch (action.type) {
		case CHARGE_ACTIONS.SET_TOKEN_AMOUNT:
			return {
				...state,
				tokenAmount: action.data
			};

		case CHARGE_ACTIONS.SET_NFT_AMOUNT:
			return {
				...state,
				nftAmount: action.data
			};

		default:
			return state;
	}
};

export default AppReducer;
