import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowDownOutline, IoArrowForwardOutline, IoSendOutline } from 'react-icons/io5';
import { GiReceiveMoney } from 'react-icons/gi';

import AppHeader from '../layouts/AppHeader';
import { AppContext } from '../../contexts/AppContext';
import TransactionList from './list';

export default function Main() {
	const { hasWallet, wallet } = useContext(AppContext);

	return (
		<>
			<AppHeader
				currentMenu="Transactions"
				actionButton={
					<Link to="/transfer/ethereum" className="headerButton">
						<IoSendOutline className="ion-icon" />
					</Link>
				}
			/>
			<div id="appCapsule">
				<div class="section full">
					<TransactionList />
				</div>
			</div>
		</>
	);
}
