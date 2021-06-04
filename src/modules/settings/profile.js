import React from 'react';

// import DataService from '../../services/db';
import AppHeader from '../layouts/AppHeader';

export default function Index() {
	return (
		<>
			<AppHeader currentMenu="Profile" />
			<div id="appCapsule">
				<div className="section mt-3 text-center">
					<h2>
						Please contact administrator to change your profile. <br />
						<br />
						team@rumsan.com
					</h2>
				</div>
			</div>
		</>
	);
}
