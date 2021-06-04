import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowDownOutline, IoArrowForwardOutline, IoSendOutline } from 'react-icons/io5';
import { GiReceiveMoney } from 'react-icons/gi';

import AppHeader from '../layouts/AppHeader';
import { AppContext } from '../../contexts/AppContext';

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
		</>
	);
}
