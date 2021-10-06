import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowDownOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { GiTwoCoins } from 'react-icons/gi';
import { BiError } from 'react-icons/bi';
import Moment from 'react-moment';
import { AppContext } from '../../contexts/AppContext';
import * as io5 from 'react-icons/io5';
import DataService from '../../services/db';

export default function AllTransactions() {
	const { recentTx } = useContext(AppContext);
	const [tx, setTx] = useState([]);

	useEffect(() => {
		(async () => {
			setTx([]);
			let txs = recentTx.length ? recentTx : await DataService.listTx();
			// if (limit) txs = txs.slice(0, limit);
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
	}, [recentTx]);

	return (
		<>
			<div id="appCapsule">
				<div className="section full">
					<div className="appHeader" style={{ backgroundColor: '#2b7ec1' }}>
						<div className="left">
							<button className=" btn btn-text headerButton ">
								<Link to="/" className="headerButton goBack">
									<io5.IoChevronBackOutline className="ion-icon" style={{ color: 'white' }} />
								</Link>
							</button>
						</div>
						<div className="pageTitle" style={{ color: 'white' }}>
							Transactions
						</div>
						<div className="right">
							<Link to="/" className="headerButton">
								<io5.IoHomeOutline className="ion-icon" style={{ color: 'white' }} />
							</Link>
						</div>
					</div>

					<div className="section pt-2">
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
															<br />
															<strong>{tx.phone}</strong>
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
					</div>
				</div>
			</div>
		</>
	);
}
