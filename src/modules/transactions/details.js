import React, { useContext } from 'react';
import { IoArrowDownOutline } from 'react-icons/io5';
import { GiReceiveMoney } from 'react-icons/gi';

import AppHeader from '../layouts/AppHeader';
import { AppContext } from '../../contexts/AppContext';

export default function Main() {
	const { hasWallet, wallet } = useContext(AppContext);

	return (
		<>
			<AppHeader currentMenu="Tx Details" />
			<div id="appCapsule" className="full-height">
				<div className="section mt-2 mb-2">
					<div className="listed-detail mt-3">
						<div className="icon-wrapper">
							<div className="iconbox">
								<IoArrowDownOutline className="ion-icon" />
							</div>
						</div>
						<h3 className="text-center mt-2">Token Received</h3>
					</div>

					<ul className="listview flush transparent simple-listview no-space mt-3">
						<li>
							<strong>Status</strong>
							<span className="text-success">Success</span>
						</li>
						<li>
							<strong>To</strong>
							<span>Jordi Santiago</span>
						</li>
						<li>
							<strong>Tx Hash</strong>
							<span>Yes</span>
						</li>
						<li>
							<strong>Date</strong>
							<span>Sep 25, 2020 10:45 AM</span>
						</li>
						<li>
							<strong>Amount</strong>
							<h3 className="m-0">$ 24</h3>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
}
