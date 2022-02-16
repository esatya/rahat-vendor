import React, { useCallback, useEffect, useState } from 'react';
import Moment from 'react-moment';
import { IoArrowDownOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { GiTwoCoins } from 'react-icons/gi';
import { BiError } from 'react-icons/bi';

import AppHeader from '../layouts/AppHeader';
import DataService from '../../services/db';
import { APP_CONSTANTS } from '../../constants';

const { CHARGE_TYPES } = APP_CONSTANTS;

export default function Main(props) {
	const hash = props.match.params.hash;
	const [tx, setTx] = useState({});
	const [tokenDetails, setTokenDetails] = useState(null);

	const reorganizeTxn = useCallback(txn => {
		if (!txn) return txn;
		let t = txn;
		if (t.type === 'issued') {
			t.name = `Token sent to:`;
			t.phone = `${t.to}`;
			t.icon = (
				<div className="iconbox bg-success">
					<GiTwoCoins className="ion-icon" />
				</div>
			);
		}

		if (t.type === 'send') {
			t.name = 'Send Tokens';
			t.icon = (
				<div className="iconbox bg-warning">
					<IoArrowForwardOutline className="ion-icon" />
				</div>
			);
		}
		if (t.type === 'receive') {
			t.name = 'Received Tokens';
			t.icon = (
				<div className="iconbox bg-primary">
					<IoArrowDownOutline className="ion-icon" />
				</div>
			);
		}
		if (t.type === CHARGE_TYPES.REDEEMED_PACKAGE) {
			t.name = 'NFT Redeemed';
			t.icon = (
				<div className="iconbox bg-primary">
					<IoArrowDownOutline className="ion-icon" />
				</div>
			);
		}
		if (t.type === CHARGE_TYPES.REDEEMED_TOKEN) {
			t.name = 'Token Redeemed';
			t.icon = (
				<div className="iconbox bg-primary">
					<IoArrowDownOutline className="ion-icon" />
				</div>
			);
		}
		if (t.type === CHARGE_TYPES.TOKEN_RECIEVED) {
			t.name = 'Token Recieved';
			t.icon = (
				<div className="iconbox bg-primary">
					<IoArrowDownOutline className="ion-icon" />
				</div>
			);
		}
		if (t.type === CHARGE_TYPES.TOKEN_SENT) {
			t.name = 'Token Sent';
			t.icon = (
				<div className="iconbox bg-primary">
					<IoArrowForwardOutline className="ion-icon" />
				</div>
			);
		}
		if (t.type === CHARGE_TYPES.NFT_RECIEVED) {
			t.name = 'NFT Recieved';
			t.icon = (
				<div className="iconbox bg-primary">
					<IoArrowDownOutline className="ion-icon" />
				</div>
			);
		}
		if (t.type === CHARGE_TYPES.NFT_SENT) {
			t.name = 'NFT Sent';
			t.icon = (
				<div className="iconbox bg-primary">
					<IoArrowForwardOutline className="ion-icon" />
				</div>
			);
		}

		if (t.status === 'error' || t.status === 'fail') {
			t.icon = (
				<div className="iconbox bg-danger">
					<BiError className="ion-icon" />
				</div>
			);
		}

		t.hash = `${t.hash.slice(0, 10)}....`;
		t.to = `${t.to.slice(0, 10)}....`;
		return t;
	}, []);

	const getTokenDetails = useCallback(async tokenId => {
		if (!tokenId) return;
		const details = await DataService.getNft(tokenId);
		if (!details) return;
		setTokenDetails(details);
	}, []);

	const getTxnDetails = useCallback(async () => {
		if (!hash) return;

		let tnx = await DataService.getTx(hash);
		if (!tnx) return;

		tnx = reorganizeTxn(tnx);

		await getTokenDetails(tnx?.tokenId);

		setTx(tnx);
	}, [hash, reorganizeTxn, getTokenDetails]);

	useEffect(() => {
		let isMounted = true;
		if (isMounted) getTxnDetails();

		return () => {
			isMounted = false;
			setTx({});
		};
	}, [getTxnDetails]);

	return (
		<>
			<AppHeader currentMenu="Tx Details" />
			<div id="appCapsule" className="full-height">
				<div className="section mt-2 mb-2">
					<div className="listed-detail mt-3">
						<div className="icon-wrapper">{tx.icon}</div>
						<h3 className="text-center mt-2">{tx.name}</h3>
					</div>

					<ul className="listview flush transparent simple-listview no-space mt-3">
						<li>
							<strong>Status</strong>
							<span
								className={tx.status === 'success' ? 'text-success' : 'text-danger'}
								style={{ textTransform: 'capitalize' }}
							>
								{tx.status}
							</span>
						</li>
						<li>
							<strong>To</strong>
							<span>{tx.to}</span>
						</li>
						<li>
							<strong>Tx Hash</strong>
							<span style={{ overflow: 'hidden' }}>{tx.hash}</span>
						</li>
						<li>
							<strong>Date</strong>
							<span>
								<Moment date={tx.timestamp} format="YYYY/MM/DD hh:mm a" />
							</span>
						</li>
						<li>
							<strong>Amount</strong>
							<h3 className="m-0">{tx.amount}</h3>
						</li>
						{tokenDetails && (
							<>
								<li>
									<strong>Token Name</strong>
									<h3 className="m-0">{tokenDetails?.name}</h3>
								</li>
								<li>
									<strong>Token Description</strong>
									<h3 className="m-0">{tokenDetails?.description}</h3>
								</li>
								<li>
									<strong>Token Image</strong>
									<img
										src={tokenDetails?.imageUri || '/assets/img/brand/icon-72.png'}
										width="75"
										height="75"
										alt="asset"
										className="image"
									/>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</>
	);
}
