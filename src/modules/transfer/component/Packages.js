import React, { useEffect, useState, useCallback } from 'react';
import DataService from '../../../services/db';

function Packages(props) {
	const { selectedRedeemablePackage, setSelectedRedeemablePackage } = props;
	const [packages, setPackages] = useState(null);

	const onCheckBoxClick = tokenId => {
		const isPresent = isChecked(tokenId);
		if (isPresent) setSelectedRedeemablePackage(prev => prev.filter(elm => elm.tokenId !== tokenId));
		if (!isPresent) {
			const newElm = packages.find(elm => elm.tokenId === tokenId);
			setSelectedRedeemablePackage(prev => [...prev, newElm]);
		}
	};

	const isChecked = tknId => {
		return selectedRedeemablePackage.some(elm => elm.tokenId === tknId);
	};

	const getSavedPackages = useCallback(async () => {
		const list = await DataService.listNft();

		list && list.length && setPackages(list);
	}, []);

	useEffect(() => {
		let isMounted = true;
		if (isMounted) getSavedPackages();

		return () => {
			isMounted = false;
		};
	}, [getSavedPackages]);

	return (
		<div className="wide-block pt-2 pb-2 border-0 ">
			{packages?.length > 0 ? (
				packages.map(p => {
					return (
						<div className=" d-flex flex-row align-items-center justify-content-between mb-1 w-100 ">
							<div>
								<input
									type="checkbox"
									className="mr-2"
									id={`${p.tokenId}`}
									onClick={() => onCheckBoxClick(p.tokenId)}
								/>
								<img
									src={p.imageUri || '/assets/img/brand/icon-72.png'}
									width="50"
									height="50"
									alt="asset"
									className="image"
								/>
								<label className="m-0" for={`${p.tokenId}`}>{`${p.name} (${p.symbol}) `}</label>
							</div>
							<p className="mb-0 ml-3 text-warning font-weight-bold">{p.amount}</p>
						</div>
					);
				})
			) : (
				<p>You don't own any packages.</p>
			)}
		</div>
	);
}

export default Packages;
