import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import AppHeader from '../layouts/AppHeader';

export default function Asset() {
	const { hasWallet, wallet, tokenBalance } = useContext(AppContext);

	return (
		<>
			<AppHeader currentMenu="Assets" />
			<div id="appCapsule">
				<div className="section  mt-2">
					<div className="card p-2">
						<span className="title">Balance</span>
						<h1 className="total mb-0">{tokenBalance} </h1>
					</div>
				</div>

				<div className="section mt-2">
					<div className="card">
						<div
							className="section-heading"
							style={{
								marginBottom: '0px'
							}}
						>
							<div
								className="card-header"
								style={{
									borderBottom: '0px'
								}}
							>
								Packages
							</div>
						</div>
						<div
							className="card-body"
							style={{
								paddingTop: '0px'
							}}
						>
							<ul className="listview image-listview">
								<li>
									<Link to={`/assets/123`} className="item">
										<img src="assets/img/brand/icon-72.png" alt="asset" className="image" />
										<div className="in">
											<div>Rice</div>
										</div>
									</Link>
								</li>

								<li>
									<Link to={`/assets/123`} className="item">
										<img src="assets/img/brand/icon-72.png" alt="asset" className="image" />
										<div className="in">
											<div>Soyabean oil</div>
										</div>
									</Link>
								</li>
								<li>
									<Link to={`/assets/123`} className="item">
										<img src="assets/img/brand/icon-72.png" alt="asset" className="image" />
										<div className="in">
											<div>Salt</div>
										</div>
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="text-center mt-4">
					{hasWallet && !wallet && <strong>Tap on lock icon to unlock</strong>}
				</div>
			</div>
		</>
	);
}
