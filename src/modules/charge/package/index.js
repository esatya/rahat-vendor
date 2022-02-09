import React from 'react';
import { ChargeContextProvider } from '../../../contexts/ChargeContext';
import Package from './Package';

function index(props) {
	return (
		<ChargeContextProvider>
			<Package {...props} />
		</ChargeContextProvider>
	);
}

export default index;
