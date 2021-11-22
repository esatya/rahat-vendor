import React, { useState, useEffect } from 'react';


import DataService from '../../services/db';

const PackageList = ({ limit, transactions = [] }) => {
	const [tx, setTx] = useState([]);

	useEffect(() => {
		(async () => {
			let txs = transactions.length ? transactions : await DataService.listTx();
			if (limit) txs = txs.slice(0, limit);
	
			setTx(txs);
		})();
	}, [transactions, limit]);

	return (
		<>

  <ul class="listview flush transparent image-listview">
                    <li>
                        <a href="#" class="item">
                            <div class="icon-box bg-primary">
                                <ion-icon name="card-outline" role="img" class="md hydrated" aria-label="card outline"></ion-icon>
                            </div>
                            <div class="in">
                                Package 1
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="item">
                            <div class="icon-box bg-danger">
                                <ion-icon name="cash-outline" role="img" class="md hydrated" aria-label="cash outline"></ion-icon>
                            </div>
                            <div class="in">
                                <div>Package 2</div>
                                <span class="text-muted">Text</span>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="item">
                            <div class="icon-box bg-success">
                                <ion-icon name="wallet-outline" role="img" class="md hydrated" aria-label="wallet outline"></ion-icon>
                            </div>
                            <div class="in">
                                <div>Package 3</div>
                            </div>
                        </a>
                    </li>
                </ul>





			{/* <ul className="listview image-listview flush">
				{tx.length > 0 &&
					tx.map(tx => {
						return (
							<li key={tx.hash}>
								<Link to={`/tx/${tx.hash}`} className="item">
									<div className="icon-box bg-success">
							<GiReceiveMoney className="ion-icon" />
						</div>
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
			</ul> */}
		</>
	);
};

export default PackageList;
