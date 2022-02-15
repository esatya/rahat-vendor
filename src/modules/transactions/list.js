import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowDownOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { GiTwoCoins } from 'react-icons/gi';
import { AiOutlineSend } from 'react-icons/ai';
import { BiError } from 'react-icons/bi';
import Moment from 'react-moment';

import DataService from '../../services/db';
import { APP_CONSTANTS } from '../../constants';
const { CHARGE_TYPES } = APP_CONSTANTS;

const TxList = ({ limit, transactions = [] }) => {
	const [tx, setTx] = useState([]);

	useEffect(() => {
		(async () => {
			let txs = transactions.length ? transactions : await DataService.listTx();
			if (limit) txs = txs.slice(0, limit);
			for (let t of txs) {
				if (t.type === 'issued') {
					t.name = `Token sent to:`;
					t.phone = `${t.to}`;
					t.icon = (
						<div className="icon-box bg-success">
							<GiTwoCoins className="ion-icon" />
						</div>
					);
				}
				// if (t.type === 'charge') {
				// 	t.name = `Charge to ${t.from}`;
				// 	t.icon = (
				// 		<div className="icon-box bg-success">
				// 			<GiReceiveMoney className="ion-icon" />
				// 		</div>
				// 	);
				// }
				if (t.type === 'send') {
					t.name = 'Send Tokens';
					t.icon = (
						<div className="icon-box bg-warning">
							<IoArrowForwardOutline className="ion-icon" />
						</div>
					);
				}
				if (t.type === 'receive') {
					t.name = 'Received Tokens';
					t.icon = (
						<div className="icon-box bg-primary">
							<IoArrowDownOutline className="ion-icon" />
						</div>
					);
				}
				if (t.type === CHARGE_TYPES.TOKEN_RECIEVED) {
					t.name = 'Token Recieved';
					t.icon = (
						<div className="icon-box bg-primary">
							<IoArrowDownOutline className="ion-icon" />
						</div>
					);
				}
				if (t.type === CHARGE_TYPES.TOKEN_TRANSFER) {
					t.name = 'Token Transferred';
					t.icon = (
						<div className="icon-box bg-primary">
							<AiOutlineSend className="ion-icon" />
						</div>
					);
				}
				if (t.type === CHARGE_TYPES.PAKCAGE_TRANSFER) {
					t.name = 'Package Transferred';
					t.icon = (
						<div className="icon-box bg-primary">
							<AiOutlineSend className="ion-icon" />
						</div>
					);
				}
				if (t.type === CHARGE_TYPES.TOKEN_SENT) {
					t.name = 'Token Sent';
					t.icon = (
						<div className="icon-box bg-primary">
							<IoArrowForwardOutline className="ion-icon" />
						</div>
					);
				}
				if (t.type === CHARGE_TYPES.NFT_RECIEVED) {
					t.name = 'NFT Recieved';
					t.icon = (
						<div className="icon-box bg-primary">
							<IoArrowDownOutline className="ion-icon" />
						</div>
					);
				}
				if (t.type === CHARGE_TYPES.REDEEMED_PACKAGE) {
					t.name = 'NFT Redeemed';
					t.icon = (
						<div className="icon-box bg-primary">
							<IoArrowDownOutline className="ion-icon" />
						</div>
					);
				}
				if (t.type === CHARGE_TYPES.REDEEMED_TOKEN) {
					t.name = 'Token Redeemed';
					t.icon = (
						<div className="icon-box bg-primary">
							<IoArrowDownOutline className="ion-icon" />
						</div>
					);
				}
				if (t.type === CHARGE_TYPES.NFT_SENT) {
					t.name = 'NFT Sent';
					t.icon = (
						<div className="icon-box bg-primary">
							<IoArrowForwardOutline className="ion-icon" />
						</div>
					);
				}
				// if (t.type === 'redeem') {
				// 	t.name = 'Redeem Tokens';
				// 	t.icon = (
				// 		<div className="icon-box bg-primary">
				// 			<GiMoneyStack className="ion-icon" />
				// 		</div>
				// 	);
				// }
				if (t.status === 'error' || t.status === 'fail') {
					t.icon = (
						<div className="icon-box bg-danger">
							<BiError className="ion-icon" />
						</div>
					);
				}
			}
			setTx(txs);
		})();
	}, [transactions, limit]);

	return (
		<>
			<ul className="listview image-listview flush">
				{tx.length > 0 &&
					tx.map(tx => {
						return (
							<li key={tx.hash}>
								<Link to={`/tx/${tx.hash}`} className="item">
									{tx.icon}
									<div className="in">
										<div>
											<div className="mb-05">
												<strong>{tx.name}</strong>
											</div>
											<div className="text-xsmall">
												<Moment date={tx.timestamp} format="YYYY/MM/DD hh:mm a" />
											</div>
										</div>
										{tx.type === 'send' ? (
											<span className="text-danger">{tx.amount}</span>
										) : (
											<span className="text-success">{tx.amount}</span>
										)}
									</div>
								</Link>
							</li>
						);
					})}
			</ul>
		</>
	);
};

export default TxList;
