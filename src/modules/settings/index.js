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
				<div class="section mt-3 text-center">
					<div class="avatar-section">
						<img src={profileImage} alt="avatar" class="imaged w100 rounded" />
					</div>
				</div>

				<div class="listview-title mt-1">Settings</div>
				<ul class="listview image-listview text inset">
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
									<div class="text-muted">
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
