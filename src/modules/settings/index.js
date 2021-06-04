import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import DataService from '../../services/db';
import AppHeader from '../layouts/AppHeader';

export default function Index() {
	const [profileImage, setProfileImage] = useState(
		'https://secure.gravatar.com/avatar/cdfda85820e903a90a89e02903223376?s=180&d=identicon'
	);

	useEffect(() => {
		(async () => {
			setProfileImage(await DataService.get('profileImage'));
		})();
	}, []);
	return (
		<>
			<AppHeader currentMenu="Profile" />
			<div id="appCapsule">
				<div className="section mt-3 text-center">
					<div className="avatar-section">
						<img src={profileImage} alt="avatar" className="imaged w100 rounded" />
					</div>
				</div>

				<div className="listview-title mt-1">Settings</div>
				<ul className="listview image-listview text inset">
					<li>
						<Link to="/profile" className="item">
							<div className="in">
								<div>Update Profile</div>
							</div>
						</Link>
					</li>
					<li>
						<Link to="/backup" className="item">
							<div className="in">
								<div>
									Backup Wallet
									<div className="text-muted">
										Backup your wallet to Google Drive
										<br /> or get seed phrase.
									</div>
								</div>
							</div>
						</Link>
					</li>
				</ul>
			</div>
		</>
	);
}
