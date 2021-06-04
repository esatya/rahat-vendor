import React, { useState, useContext, useRef, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { useResize } from '../../utils/react-utils';
import { AppContext } from '../../contexts/AppContext';
import TransactionList from '../transactions/list';
import DataService from '../../services/db';
import Contract from '../../utils/blockchain/contract';
import { APP_CONSTANTS, CONTRACT } from '../../constants';
import { ethers } from 'ethers';
import { get } from 'store';

var QRCode = require('qrcode.react');

export default function Main() {
	const { hasWallet, wallet } = useContext(AppContext);
	const [balance, setBalance] = useState(0);
	const [showPageLoader, setShowPageLoader] = useState(true);

	const cardBody = useRef();
	const { width } = useResize(cardBody);

	const calcQRWidth = () => {
		if (width < 200) return 200;
		else return 280;
	};

	const getBalance = async () => {
		const agency = await DataService.listAgencies();
		const tokenAddress = agency[0].tokenAddress;
		const userAddress = await DataService.getAddress();
		if (!userAddress) return 0;

		const tokenContract = Contract({ address: tokenAddress, type: CONTRACT.TOKEN }).get();

		let remainingBalance = await tokenContract.balanceOf(userAddress);

		return remainingBalance.toNumber();
	};

	setTimeout(async () => {
		setShowPageLoader(false);
	}, 500);

	useEffect(() => {
		(async () => {
			const balance = await getBalance();
			setBalance(balance);
		})();
	}, []);

	if (!hasWallet) {
		return <Redirect to="/setup" />;
	}

	return (
		<>
			{showPageLoader && (
				<div id="loader">
					<img src="/assets/img/brand/icon-white-128.png" alt="icon" className="loading-icon" />
				</div>
			)}

			<div id="appCapsule">
				<div class="section wallet-card-section pt-1">
					<div class="wallet-card">
						<div class="balance">
							<div class="left">
								<span class="title">Your Token Balance</span>
								<h1 class="total">{balance}</h1>
							</div>
							<div className="right"></div>
						</div>
					</div>
				</div>

				<div className="section mt-2">
					<div className="card">
						<div className="card-header">Recent Transactions</div>
						<div className="card-body">
							<TransactionList limit="3" />
						</div>
					</div>
				</div>

				{wallet && (
					<div className="section mt-2 mb-4">
						<div className="card text-center">
							<div className="card-header">Your Address</div>
							<div className="card-body">
								<div className="card-text" ref={cardBody}>
									<QRCode value={wallet.address} size={calcQRWidth()} />
									<div className="mt-1" style={{ fontSize: 13 }}>
										{wallet.address}
									</div>
									<div className="mt-2" style={{ fontSize: 9, lineHeight: 1.5 }}>
										This QR Code (address) is your unique identity. Use this to receive digital
										documents, assets or verify your identity.
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="text-center mt-4">
					{hasWallet && !wallet && <strong>Tap on lock icon to unlock</strong>}
				</div>
			</div>
		</>
	);
}
