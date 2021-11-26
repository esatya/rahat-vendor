import React from 'react';
import { ChargeContextProvider } from '../../../contexts/ChargeContext';
import Token from './Token';

function Index(props) {
	return (
		<ChargeContextProvider>
			<Token {...props} />
		</ChargeContextProvider>
	);
}

export default Index;
