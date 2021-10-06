import React from 'react';
import { Link } from 'react-router-dom';
import { IoSendOutline } from 'react-icons/io5';

import AppHeader from '../layouts/AppHeader';
import TransactionList from './list';

export default function Main() {
	return (
		<>
			<AppHeader
				currentMenu="Transactions"
				actionButton={
					<Link to="/transfer" className="headerButton">
						<IoSendOutline className="ion-icon" />
					</Link>
				}
			/>
			<div id="appCapsule">
				<div className="section full">
					<TransactionList />
				</div>
			</div>
		</>
	);
}
