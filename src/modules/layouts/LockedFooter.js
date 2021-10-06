import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IoLockClosed } from 'react-icons/io5';

import Loading from '../global/Loading';
import Wallet from '../../utils/blockchain/wallet';
import DataService from '../../services/db';
import { AppContext } from '../../contexts/AppContext';

export default function LockedFooter() {
	let history = useHistory();
	const { setWallet } = useContext(AppContext);
	const [loadingModal, setLoadingModal] = useState(false);

	const handleUnlockClick = async () => {
		setLoadingModal(true);
		let profile = await DataService.get('profile');
		// const wallet = await Wallet.loadFromPrivateKey(
		// 	'0xea9be389aa0c8dd3907fdb1f004ff7dcc18719654077e1f316099c6e588a39aa'
		// );
		let encryptedWallet = await DataService.getWallet();
		const wallet = await Wallet.loadFromJson(profile.phone, encryptedWallet);
		setWallet(wallet);
		history.push('/');
		setLoadingModal(false);
	};

	//setTimeout(handleUnlockClick, 1000);

	return (
		<>
			<Loading message="Unlocking your wallet. Please wait..." showModal={loadingModal} />
			<div className="footer-locked">
				<div className="appBottomMenu">
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
					<a
						title="Tap here to unlock"
						href="#screen"
						className="item"
						id="btnUnlock"
						onClick={handleUnlockClick}
					>
						<div className="col">
							<div className="action-button large">
								<IoLockClosed className="ion-icon" />
							</div>
						</div>
					</a>
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
				</div>
			</div>
		</>
	);
}
