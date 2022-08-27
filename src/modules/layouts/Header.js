import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { IoHomeOutline, IoPersonOutline, IoLockClosedOutline, IoSendOutline } from 'react-icons/io5';
import { Dropdown } from 'react-bootstrap';
import { AppContext } from '../../contexts/AppContext';

import DataService from '../../services/db';

export default function Header() {
	const history = useHistory();
	const [profileImage, setProfileImage] = useState(null);
	const { setWallet } = useContext(AppContext);

	useEffect(() => {
		(async () => {
			let profile = await DataService.getProfile();
			if (profile) setProfileImage(profile.img);
		})();
	});

	return (
		<div>
			<div className="appHeader bg-primary scrolled">
				<div className="left d-none">
					<a href="fake_value" className="headerButton" data-toggle="modal" data-target="#sidebarPanel">
						<IoHomeOutline className="ion-icon" />
					</a>
				</div>
				<div className="pageTitle">
					<img src="assets/img/brand/rumsan-favicon.png" width="22" alt="logo" className="logo" />
					&nbsp; PAMS Vendor
				</div>
				<div className="right">
					<Dropdown drop="down">
						<Dropdown.Toggle variant="link" bsPrefix="p-0">
							<img src={profileImage} alt="profile" className="imaged w32" />
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item onClick={() => history.push('/transfer')}>
								<IoSendOutline className="ion-icon" />
								Transfer
							</Dropdown.Item>
							<Dropdown.Item onClick={() => history.push('/settings')}>
								<IoPersonOutline className="ion-icon" />
								My Profile
							</Dropdown.Item>
							<Dropdown.Item onClick={() => setWallet(null)}>
								<IoLockClosedOutline className="ion-icon" />
								Lock App
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</div>
		</div>
	);
}
