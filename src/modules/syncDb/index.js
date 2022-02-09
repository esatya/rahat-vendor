import React, { useContext, useEffect, useCallback, useState } from 'react';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useHistory, Link } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import DataService from '../../services/db';
import Wallet from '../../utils/blockchain/wallet';
import { getDefautAgency, getVendorByWallet } from '../../services';

function SyncDb() {
	const { wallet, setWallet } = useContext(AppContext);
	const [loadingMsg, setLoadingMsg] = useState({ message: 'Processing...', percent: 0 });
	const [errorMsg, setErrorMsg] = useState(null);
	const history = useHistory();

	const showError = msg => {
		setLoadingMsg(null);
		setErrorMsg(msg);
	};

	const setSynchronizing = useCallback(async val => DataService.setSynchronizing(val), []);

	const syncAgency = useCallback(async () => {
		try {
			setLoadingMsg({ percent: 40, message: 'Syncing Agency details...' });
			const agncy = await DataService.getDefaultAgency();
			if (!agncy) {
				const defaultAgency = await getDefautAgency();
				await DataService.addAgency(defaultAgency);
			}
		} catch (err) {
			console.log('Unable to add agency', err);
			showError('Unable to sync agency properly');
		}
	}, []);

	const syncProfile = useCallback(async () => {
		try {
			setLoadingMsg({ percent: 80, message: 'Syncing Profile details...' });
			if (!wallet) return;
			const vendorProfile = await getVendorByWallet(wallet?.address);
			const { name, phone, organization, address, email, photo, govt_id_image } = vendorProfile;
			await DataService.saveProfile({ name, phone, organization, address, email });
			photo && photo.length && (await DataService.saveProfileImage(photo[0]));
			govt_id_image && (await DataService.saveProfileIdCard(govt_id_image));
			setLoadingMsg({ percent: 100, message: 'Succesfully synced...', showHome: true });
			await setSynchronizing(false);
		} catch (err) {
			console.log('Could not sync profile', err);
			showError('Unable to sync profile properly');
		}
	}, [wallet, setSynchronizing]);

	const unlockWallet = useCallback(async () => {
		try {
			setLoadingMsg({ percent: 5, message: 'Unlocking Wallet...' });
			if (wallet) return;
			const passcode = await DataService.get('temp_passcode');
			const encWallet = await DataService.getWallet();
			const wlt = await Wallet.loadFromJson(passcode, encWallet);
			setWallet(wlt);
		} catch (err) {
			console.log('error at walllet', err);
			setErrorMsg('Couldnot validate wallet properly.');
		}
	}, [wallet, setWallet]);

	const handleBackButton = e => {
		history.goBack();
	};

	const initializeSync = useCallback(async () => {
		await setSynchronizing(true);
		await unlockWallet();
		await syncAgency();
		await syncProfile();
	}, [unlockWallet, syncAgency, syncProfile, setSynchronizing]);

	useEffect(() => {
		initializeSync();
	}, [initializeSync]);

	return (
		<div id="appCapsule">
			<div className="appHeader bg-success text-light">
				<div className="left">
					<button href="#" className="headerButton btn" onClick={e => handleBackButton()}>
						<IoChevronBackOutline className="ion-icon" />
					</button>
				</div>
				<div className="pageTitle">Sync Your Data</div>
			</div>
			<div className="section full mt-2">
				<div className="text-center" style={{ marginTop: 100 }}>
					<h4 className="subtitle">{loadingMsg?.message}</h4>
				</div>
				<div>
					<div className="progress" style={{ margin: '50px 80px 3px' }}>
						<div
							className="progress-bar"
							style={{ width: `${loadingMsg?.percent}%` }}
							role="progressbar"
							aria-valuenow={25}
							aria-valuemin={0}
							aria-valuemax={100}
						/>
					</div>
					<div className="text-center">
						<small className="text-success message" />
					</div>
					<div className="text-center">
						{loadingMsg?.showHome && (
							<Link to="/" className="btn btn-primary btn-home mt-3">
								Go to Home
							</Link>
						)}
						{/* <div className="spinner-border text-success mt-5 in-progress" role="status" /> */}
					</div>

					{errorMsg && (
						<div className="text-center">
							<span className="text-danger">
								<b>Error</b>: {errorMsg}
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default SyncDb;
