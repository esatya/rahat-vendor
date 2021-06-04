import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowDownOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { GiReceiveMoney } from 'react-icons/gi';
import Moment from 'react-moment';

import { AppContext } from '../../contexts/AppContext';
import DataService from '../../services/db';

export default function ListTx({ limit }) {
	const { hasWallet, wallet } = useContext(AppContext);

	const [transactions, setTransaction] = useState([]);

	useEffect(() => {
		(async () => {
			let txs = await DataService.listTx();
			if (limit) txs = txs.slice(0, limit);
			for (let tx of txs) {
				if (tx.type === 'charge') {
					tx.name = 'Charge to Customer';
					tx.icon = (
						<div class="icon-box bg-success">
							<GiReceiveMoney className="ion-icon" />
						</div>
					);
				}
				if (tx.type === 'send') {
					tx.name = 'Send Tokens';
					tx.icon = (
						<div class="icon-box bg-danger">
							<IoArrowForwardOutline className="ion-icon" />
						</div>
					);
				}
				if (tx.type === 'receive') {
					tx.name = 'Received Tokens';
					tx.icon = (
						<div class="icon-box bg-primary">
							<IoArrowDownOutline className="ion-icon" />
						</div>
					);
				}
			}
			setTransaction(txs);
		})();
	}, []);

	return (
		<>
			<ul class="listview image-listview flush">
				{transactions.length > 0 &&
					transactions.map(tx => {
						return (
							<li key={tx.hash}>
								<Link to="/tx/details" class="item">
									{tx.icon}
									<div class="in">
										<div>
											<div class="mb-05">
												<strong>{tx.name}</strong>
											</div>
											<div class="text-xsmall">
												<Moment date={tx.timestamp} format="YYYY/MM/DD hh:mm a" />
											</div>
										</div>
										{tx.type === 'send' ? (
											<span class="text-danger">{tx.amount}</span>
										) : (
											<span class="text-success">{tx.amount}</span>
										)}
									</div>
								</Link>
							</li>
						);
					})}
			</ul>
		</>
	);
}
