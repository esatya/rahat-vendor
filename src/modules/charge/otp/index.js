import React from 'react';
import { ChargeContextProvider } from '../../../contexts/ChargeContext';
import Otp from './Otp';
function Index(props) {
	return (
		<ChargeContextProvider>
			<Otp {...props} />
		</ChargeContextProvider>
	);
}

export default Index;
