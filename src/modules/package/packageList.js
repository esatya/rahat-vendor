import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import DataService from '../../services/db';

const PackageList = ({ limit, packages = [],beneficiary }) => {
	const [pkg, setPkg] = useState([]);

	useEffect(() => {
		(async () => {
			let pkgs = packages
		//	let pkgs = packages.length ? packages : await DataService.listNft();
			if (limit) pkgs = pkgs.slice(0, limit);
	
			setPkg(pkgs);
		})();
	}, [packages, limit]);

	return (
		<>

  <ul class="listview flush transparent image-listview">

			{
				pkg.length > 0 && 
				pkg.map((p) => {

					return(
						<li>
						<Link to={beneficiary? `/charge/${beneficiary}/package/${p.tokenId}`:`/package/${p.tokenId}`} className="item">
								<div class="icon-box bg-primary">
										<ion-icon name="card-outline" role="img" class="md hydrated" aria-label="card outline"></ion-icon>
								</div>
								<div class="in">
										{p.name}
								</div>
								</Link>
				</li>
					)

				})
			}
                   
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
