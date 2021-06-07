import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IoHomeOutline, IoPersonOutline, IoLockClosedOutline, IoSendOutline } from 'react-icons/io5';
import { Dropdown } from 'react-bootstrap';

import DataService from '../../services/db';

export default function Header() {
	const history = useHistory();
	const [profileImage, setProfileImage] = useState(null);

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
					<img src="assets/img/brand/icon-white-128.png" width="22" alt="logo" className="logo" />
					&nbsp; Rahat Vendor
				</div>
				<div class="right">
					<Dropdown drop="down">
						<Dropdown.Toggle variant="link" bsPrefix="p-0">
							<img src={profileImage} alt="profile" class="imaged w32" />
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
							<Dropdown.Item onClick={() => console.log('xxx')}>
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
