import React, { useState, useEffect } from 'react';

import DataService from '../../services/db';
import AppHeader from '../layouts/AppHeader';

export default function PackageDetails(props) {
	const [nftDetails, setNftDetails] = useState(null);

	useEffect(() => {
		async function getDetails() {
			let tokenId = props.match.params.tokenId;
			const details = await DataService.getNft(tokenId);
			setNftDetails(details);
		}
		getDetails();
	}, [props]);
	return (
		<>
			<AppHeader currentMenu="Package Details" />
			<div id="appCapsule" className="full-height">
				<div className="section mt-2 mb-2">
					<div className="listed-detail mt-3">
						<div className="text-center">
							<img
								src={
									nftDetails && nftDetails.imageUri
										? nftDetails.imageUri
										: '/assets/img/brand/icon-72.png'
								}
								width="100"
								height="100"
								alt="asset"
								className="image"
							/>
						</div>

						<h3 className="text-center mt-2">
							{nftDetails && nftDetails.symbol ? nftDetails.symbol : '-'}
						</h3>
					</div>

					<ul className="listview flush transparent simple-listview no-space mt-3">
						<li>
							<strong>Name:</strong>
							<span>{nftDetails && nftDetails.name ? nftDetails.name : '-'}</span>
						</li>
						<li>
							<strong>Symbol:</strong>
							<span>{nftDetails && nftDetails.symbol ? nftDetails.symbol : '-'}</span>
						</li>
						<li>
							<strong>Description</strong>
							<span>{nftDetails && nftDetails.description ? nftDetails.description : '-'}</span>
						</li>
						<li>
							<strong>Value in fiat:</strong>
							<span>
								<span>{nftDetails && nftDetails.value ? nftDetails.value : '-'}</span>
							</span>
						</li>
						<li>
							<strong>Amount:</strong>
							<h3 className="m-0">{nftDetails && nftDetails.amount ? nftDetails.amount : '-'}</h3>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
}
