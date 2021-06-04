import React from 'react';
import { IoHomeOutline } from 'react-icons/io5';

export default function Header() {
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
				<div className="right"></div>
			</div>
		</div>
	);
}
