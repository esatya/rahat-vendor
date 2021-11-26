import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import DataService from '../../services/db';
import AppHeader from '../layouts/AppHeader';

export default function Asset() {
	const { hasWallet, wallet, tokenBalance } = useContext(AppContext);
	const [nfts, setNfts] = useState(null);

	useEffect(() => {
		async function listNfts() {
			const nftList = await DataService.listNft();
			setNfts(nftList);
		}

		listNfts();
	}, []);

	return (
		<>
			<AppHeader currentMenu="Assets" />
			<div id="appCapsule">
				<div className="section  mt-2">
					<div className="card">
						<div
							className="card-header"
							style={{
								borderBottom: '0px'
							}}
						>
							Token Balance
						</div>
						<h1 className="total mt-0 mb-1 pl-3">{tokenBalance} </h1>
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
							<ul className="listview image-listview flush">
								{nfts &&
									nfts.length > 0 &&
									nfts.map((nft, index) => (
										<li key={index}>
											<Link to={`/package/${nft.tokenId}`} className="item">
												<img src="assets/img/brand/icon-72.png" alt="asset" className="image" />
												<div className="in">
													<div>{nft.symbol}</div>
													<span className="text-success">{nft.amount}</span>
												</div>
											</Link>
										</li>
									))}
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
