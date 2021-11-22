import React from 'react';
import AppHeader from '../layouts/AppHeader';

export default function PackageDetail(props) {
	return (
		<>
			<AppHeader currentMenu="Package Details" />
			<div id="appCapsule" className="full-height">
				<div className="section mt-2 mb-2">
					<div className="listed-detail mt-3">
						<div className="text-center">
							<img src="/assets/img/brand/icon-72.png" alt="asset" className="image" />
						</div>

						<h3 className="text-center mt-2">ajksdflkj</h3>
					</div>

					<ul className="listview flush transparent simple-listview no-space mt-3">
						<li>
							<strong>Name:</strong>
							<span>Rice</span>
						</li>
						<li>
							<strong>Symbol:</strong>
							<span>BTC</span>
						</li>
						<li>
							<strong>Description</strong>
							<span>Contains lots of items</span>
						</li>
						<li>
							<strong>Value in fiat:</strong>
							<span>
								<span>NRS 100</span>
							</span>
						</li>
						<li>
							<strong>Amount:</strong>
							<h3 className="m-0">1000</h3>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
}
