import React from 'react';
import { Link } from 'react-router-dom';
import * as io5 from 'react-icons/io5';

export default function AppHeader({ currentMenu, actionButton, ionIcon }) {
	const titleIcon = ionIcon
		? React.createElement(io5[ionIcon], { className: 'ion-icon', style: { fontSize: 22 } })
		: '';
	return (
		<div className="appHeader bg-primary text-light">
			<div className="left">
				<Link to="/" className="headerButton goBack">
					<io5.IoChevronBackOutline className="ion-icon" />
				</Link>
			</div>
			{titleIcon}
			<div className="pageTitle">{currentMenu || 'Home'}</div>
			<div className="right">
				{actionButton !== undefined ? (
					<>{actionButton}</>
				) : (
					<Link to="/" className="headerButton">
						<io5.IoHomeOutline className="ion-icon" />
					</Link>
				)}
			</div>
		</div>
	);
}
