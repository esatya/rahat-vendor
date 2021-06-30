import React, { useContext } from 'react';
//import idleJs from 'idle-js';

import { AppContext } from '../../contexts/AppContext';
import LockedFooter from './LockedFooter';
import UnlockedFooter from './UnlockedFooter';

export default function Footer() {
	const { hasWallet, wallet } = useContext(AppContext);

	// useEffect(() => {
	// 	var idle = new idleJs({
	// 		idle: 30000, // idle time in ms
	// 		events: ['mousemove', 'keydown', 'mousedown', 'touchstart'], // events that will trigger the idle resetter
	// 		onIdle: function () {
	// 			setWallet(null);
	// 		},
	// 		onHide: function () {
	// 			setWallet(null);
	// 		},
	// 		keepTracking: true, // set it to false if you want to be notified only on the first idleness change
	// 		startAtIdle: false // set it to true if you want to start in the idle state
	// 	});
	// 	idle.start();
	// }, [setWallet]);

	return (
		<>
			{hasWallet ? (
				<>
					{wallet === null && <LockedFooter />}
					{wallet !== null && <UnlockedFooter />}
				</>
			) : (
				''
			)}
		</>
	);
}
