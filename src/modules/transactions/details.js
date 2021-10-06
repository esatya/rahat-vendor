import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { IoArrowDownOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { GiReceiveMoney, GiMoneyStack } from 'react-icons/gi';
import { BiError } from 'react-icons/bi';

import AppHeader from '../layouts/AppHeader';
import DataService from '../../services/db';

export default function Main(props) {
	const hash = props.match.params.hash;

	const [tx, setTx] = useState({});

	useEffect(() => {
		(async () => {
			const t = await DataService.getTx(hash);
			if (t.type === 'charge') {
				t.name = `Charge to ${t.from}`;
				t.icon = (
					<div className="iconbox bg-success">
						<GiReceiveMoney className="ion-icon" />
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
			if (t.type === 'redeem') {
				t.name = 'Redeem Tokens';
				t.icon = (
					<div className="iconbox bg-primary">
						<GiMoneyStack className="ion-icon" />
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
			setTx(t);
		})();
	}, [hash]);

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
					</ul>
				</div>
			</div>
		</>
	);
}
