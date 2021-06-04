import React, { useState, useContext, useRef } from 'react';
import { Redirect } from 'react-router-dom';

import { useResize } from '../../utils/react-utils';
import { AppContext } from '../../contexts/AppContext';
import TransactionList from '../transactions/list';
var QRCode = require('qrcode.react');

export default function Main() {
	const { hasWallet, wallet } = useContext(AppContext);
	const [showPageLoader, setShowPageLoader] = useState(true);

	const cardBody = useRef();
	const { width } = useResize(cardBody);

	const calcQRWidth = () => {
		if (width < 200) return 200;
		else return 280;
	};

	setTimeout(() => {
		setShowPageLoader(false);
	}, 500);

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
				<div className="section wallet-card-section pt-1">
					<div className="wallet-card">
						<div className="balance">
							<div className="left">
								<span className="title">Your Token Balance</span>
								<h1 className="total">$ 2,562.50</h1>
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
