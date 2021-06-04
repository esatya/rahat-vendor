import React, { useState, useContext, useRef } from 'react';
import { Redirect, useHistory, Link } from 'react-router-dom';
import { IoArrowDownOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { GiReceiveMoney } from 'react-icons/gi';

import { useResize } from '../../utils/react-utils';
import { AppContext } from '../../contexts/AppContext';
var QRCode = require('qrcode.react');

export default function Main() {
	const history = useHistory();
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
					<img src="/assets/img/brand/icon-white-128.png" alt="icon" class="loading-icon" />
				</div>
			)}

			<div id="appCapsule">
				<div class="section wallet-card-section pt-1">
					<div class="wallet-card">
						<div class="balance">
							<div class="left">
								<span class="title">Your Token Balance</span>
								<h1 class="total">$ 2,562.50</h1>
							</div>
							<div class="right"></div>
						</div>
					</div>
				</div>

				<div class="section mt-2">
					<div class="card">
						<div class="card-header">Recent Transactions</div>
						<div class="card-body">
							<ul class="listview image-listview flush">
								<li>
									<Link to="/tx/details" class="item">
										<div class="icon-box bg-primary">
											<IoArrowDownOutline class="ion-icon" />
										</div>
										<div class="in">
											<div>
												<div class="mb-05">
													<strong>Token received</strong>
												</div>
												<div class="text-xsmall">5/3/2020 10:30 AM</div>
											</div>
											<span class="text-success">200</span>
										</div>
									</Link>
								</li>
								<li>
									<Link to="/tx/details" class="item">
										<div class="icon-box bg-success">
											<GiReceiveMoney class="ion-icon" />
										</div>
										<div class="in">
											<div>
												<div class="mb-05">
													<strong>Charge to customer</strong>
												</div>
												<div class="text-xsmall">5/3/2020 10:30 AM</div>
											</div>
											<span class="text-success">1500</span>
										</div>
									</Link>
								</li>
								<li>
									<Link to="/tx/details" class="item">
										<div class="icon-box bg-danger">
											<IoArrowForwardOutline class="ion-icon" />
										</div>
										<div class="in">
											<div>
												<div class="mb-05">
													<strong>Token sent</strong>
												</div>
												<div class="text-xsmall">5/3/2020 10:30 AM</div>
											</div>
											<span class="text-danger">200</span>
										</div>
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{wallet && (
					<div class="section mt-2 mb-4">
						<div class="card text-center">
							<div class="card-header">Your Address</div>
							<div class="card-body">
								<p class="card-text" ref={cardBody}>
									<QRCode value={wallet.address} size={calcQRWidth()} />
									<div className="mt-1" style={{ fontSize: 13 }}>
										{wallet.address}
									</div>
									<div className="mt-2" style={{ fontSize: 9, lineHeight: 1.5 }}>
										This QR Code (address) is your unique identity. Use this to receive digital
										documents, assets or verify your identity.
									</div>
								</p>
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
