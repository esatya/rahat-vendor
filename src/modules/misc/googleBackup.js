import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { gapi } from 'gapi-script';
import { IoChevronBackOutline, IoHomeOutline, IoCloseCircle } from 'react-icons/io5';
import EthCrypto from 'eth-crypto';

import { BACKUP } from '../../constants';
import { AppContext } from '../../contexts/AppContext';
import DataService from '../../services/db';
import UserImg from '../../assets/images/user.svg';

import { GFile, GFolder } from '../../utils/google';
import Swal from 'sweetalert2';

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const GOOGLE_REDIRECT_URL = process.env.REACT_APP_GOOGLE_REDIRECT_URL;
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function GoogleBackup() {
	const history = useHistory();

	const Actions = [
		{
			hash: '#choose-account',
			label: 'Please choose Google account. Please click the switch account button to change account.'
		},
		{
			hash: '#process',
			label: 'Your is being backed up in Google Drive.'
		},
		{
			hash: '#enter-passphrase',
			label: 'Please enter backup passphrase. It must be at least 10 characters long with one number and alphabet. Button will appear after you type 12 characters. <br />PLEASE NOTE: THIS IS DIFFERENT THAN YOUR 6-DIGIT PASSCODE.'
		}
	];

	const { wallet } = useContext(AppContext);
	const passphraseRef = useRef(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [gUser, setGUser] = useState({
		id: null,
		name: 'Loading User...',
		email: null,
		image: UserImg
	});
	const [passphrase, setPassphrase] = useState('');
	const [passphraseStrength, setPassphraseStrength] = useState('None');
	const [progress, setProgress] = useState({ message: 'Processing...', percent: 0, showHome: false });

	const [currentAction, setCurrentAction] = useState({});

	const changeAction = hash => {
		setErrorMsg(null);
		let selectedAction = Actions.find(a => a.hash === hash);
		if (!selectedAction) setCurrentAction(Actions.find(a => a.hash === '#choose-account'));
		else setCurrentAction(selectedAction);
	};

	const loadGapiClient = () => {
		history.listen(location => {
			changeAction(location.hash);
		});
		changeAction(history.location.hash);
		gapi.load('client:auth2', initClient);
	};

	const initClient = () => {
		gapi.client
			.init({
				clientId: CLIENT_ID,
				discoveryDocs: DISCOVERY_DOCS,
				ux_mode: 'redirect',
				scope: 'profile email https://www.googleapis.com/auth/drive',
				redirect_uri: `${GOOGLE_REDIRECT_URL}/backup`
			})
			.then(function () {
				gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
				updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
			});
	};

	const updateSigninStatus = isSignedIn => {
		let user = null;
		if (isSignedIn) {
			user = gapi.auth2.getAuthInstance().currentUser.get();
			const profile = user.getBasicProfile();
			setGUser({
				id: profile.getId(),
				name: profile.getName(),
				email: profile.getEmail(),
				image: profile.getImageUrl()
			});
		} else user = handleUserSignIn();
	};

	const handleUserSignIn = () => {
		return gapi.auth2.getAuthInstance().signIn();
	};

	const checkAndSetPassphrase = value => {
		setErrorMsg(null);
		var strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})');
		var mediumRegex = new RegExp(
			'^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
		);

		if (strongRegex.test(value)) {
			setPassphraseStrength('Strong');
		} else if (mediumRegex.test(value)) {
			setPassphraseStrength('Medium');
		} else {
			setPassphraseStrength('Weak');
		}
		setPassphrase(value);
	};

	const prepareBackupData = async password => {
		let backupData = { name: 'rumsan-wallet', type: 'ethersjs' };
		let data = await DataService.list();
		data.forEach(d => {
			backupData[d.name] = d.data;
		});
		backupData.wallet = await wallet.encrypt(password.toString());
		delete backupData.backup_googleFile;
		delete backupData.backup_wallet;
		backupData.documents = await DataService.listDocuments();
		backupData.documents.forEach(d => {
			delete d.file;
			delete d.encryptedFile;
		});
		backupData.assets = await DataService.listAssets();
		return backupData;
	};

	const backupWallet = async () => {
		setErrorMsg(null);
		try {
			history.push('#process');

			const gFolder = new GFolder(gapi);
			const gFile = new GFile(gapi);

			setProgress({ ...progress, percent: 5, message: 'Preparing data to backup...' });
			let backupData = await prepareBackupData(passphrase);
			//encrypt and store backup passphrase
			const encrypted = await EthCrypto.encryptWithPublicKey(
				EthCrypto.publicKeyByPrivateKey(wallet.privateKey),
				passphrase
			);
			const encryptedPassphrase = EthCrypto.cipher.stringify(encrypted);
			await DataService.save('backup_passphrase', encryptedPassphrase);

			setProgress({ ...progress, percent: 30, message: 'Checking if previous backup exists...' });
			const folder = await gFolder.ensureExists(BACKUP.GDRIVE_FOLDERNAME);
			setProgress({ ...progress, percent: 50, message: 'Backing up encrypted wallet to Google Drive...' });
			const file = await gFile.getByName(wallet.address, folder.id);
			setProgress({ ...progress, percent: 70, message: 'Creating the encrypted backup file...' });
			let newFile = await gFile.createFile({
				name: wallet.address,
				data: JSON.stringify(backupData),
				parentId: folder.id
			});
			await DataService.save('backup_googleFile', newFile.id);
			await DataService.save('backup_wallet', backupData.wallet);
			setProgress({ ...progress, percent: 80, message: 'Cleaning up and finalizing...' });
			if (file.exists) await gFile.deleteFile(file.firstFile.id);
			setProgress({
				...progress,
				percent: 100,
				showHome: true,
				message: 'Wallet backed up successfully. Backup file named ' + wallet.address + ' has been created.'
			});
		} catch (e) {
			console.log(e.message);
			setPassphrase('');
			passphraseRef.current.focus();
			setErrorMsg('Backup passphrase is incorrect. Please try again.');
		}
	};

	const confirmBackup = async () => {
		var passPhraseRegex = new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{10,})');
		if (!passPhraseRegex.test(passphrase)) {
			Swal.fire(
				'Passphrase incorrect',
				'Passphrase must be 10 characters and have at least one number.',
				'error'
			);
			return;
		}

		const isConfirm = await Swal.fire({
			title: 'Important',
			icon: 'warning',
			html: `You MUST write this passphrase and store it safely. It is used to encrypt your wallet. If you forget it there is no way to retrieve your wallet. It will be gone forever. <br /> Your passphrase is: ${passphrase}`,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, I have written it down',
			cancelButtonText: 'No, I want choose another'
		});
		if (isConfirm.value) {
			backupWallet();
		}
	};

	const handleBackButton = e => {
		if (history.action === 'POP') return history.push('/google/backup');
		history.goBack();
	};

	useEffect(loadGapiClient, []);

	return (
		<div id="appCapsule">
			<div className="appHeader bg-success text-light">
				<div className="left">
					{history.location.hash !== '' && (
						<button href="#" className="headerButton btn" onClick={e => handleBackButton()}>
							<IoChevronBackOutline className="ion-icon" />
						</button>
					)}
				</div>
				<div className="pageTitle">Backup to Google Drive</div>
				<div className="right">
					<Link to="/" className="headerButton">
						<IoHomeOutline className="ion-icon" />
					</Link>
				</div>
			</div>

			<div style={{ marginTop: 80 }}>
				<div className="section">
					<h2>Backup Wallet to your Google Drive</h2>
					<h4 dangerouslySetInnerHTML={{ __html: currentAction.label }}></h4>
				</div>

				{currentAction.hash === '#choose-account' && (
					<div className="text-center section full mt-2 mb-3">
						<div className="text-center wide-block p-3">
							<div className="avatar">
								<img src={gUser.image} alt="avatar" className="imaged w64 rounded" />
							</div>
							<div className="in mt-1">
								<h3 className="name">{gUser.name}</h3>
								<h5 className="subtext" style={{ margin: -3 }}>
									{gUser.email}
								</h5>
							</div>
							{gUser.id && (
								<button
									className="btn btn-sm btn-outline-secondary mt-2"
									id="btnMnemonic"
									onClick={e => handleUserSignIn()}
								>
									Switch account
								</button>
							)}
						</div>
						{gUser.id && (
							<div className="text-center mt-3">
								<button className="btn btn-primary" onClick={e => history.push('#enter-passphrase')}>
									Continue with this Google account
								</button>
							</div>
						)}
					</div>
				)}

				{currentAction.hash === '#enter-passphrase' && (
					<div className="section full mt-2 mb-3">
						{/* {!selectedWallet.id && <Redirect to="/google/restore#choose-account" />} */}
						<div className="wide-block p-2">
							<div className="section full">
								<div className="form-group boxed">
									<div className="input-wrapper">
										<input
											type="text"
											value={passphrase}
											onChange={e => checkAndSetPassphrase(e.target.value)}
											className="form-control"
											placeholder="Backup Passpharse"
											ref={passphraseRef}
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
									<div className="mt-1">
										<small>
											Passphrase length: <b>{passphrase.length}</b>. Strength:{' '}
											<b>{passphraseStrength}</b>
											<br />A strong passphrase should be at least 10-charater long and contain at
											least one lowercase alphabet, one uppercase alphabet, one number and a
											special character
										</small>
									</div>
								</div>
							</div>
						</div>

						<div className="text-center mt-3">
							{passphrase.length > 9 && (
								<button className="btn btn-primary" onClick={e => confirmBackup()}>
									Continue to backup your wallet
								</button>
							)}
						</div>
					</div>
				)}

				{currentAction.hash === '#process' && (
					<div className="section full mt-2">
						<div className="text-center" style={{ marginTop: 100 }}>
							<h4 className="subtitle">{progress.message}</h4>
						</div>
						<div>
							<div className="progress" style={{ margin: '50px 80px 3px' }}>
								<div
									className="progress-bar"
									style={{ width: `${progress.percent}%` }}
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
								{progress.showHome && (
									<Link to="/" className="btn btn-primary btn-home mt-3">
										Go to Home
									</Link>
								)}
								{/* <div className="spinner-border text-success mt-5 in-progress" role="status" /> */}
							</div>
						</div>
					</div>
				)}
			</div>

			{errorMsg && (
				<div className="text-center">
					<span className="text-danger">
						<b>Error</b>: {errorMsg}
					</span>
				</div>
			)}
		</div>
	);
}
