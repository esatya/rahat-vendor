import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { gapi } from 'gapi-script';
import { IoChevronBackOutline, IoHomeOutline } from 'react-icons/io5';
import Wallet from '../../utils/blockchain/wallet';
import UserImg from '../../assets/images/user.svg';
import DataService from '../../services/db';
import { BACKUP } from '../../constants';
import { GFile, GFolder } from '../../utils/google';
import Loading from '../global/Loading';
import Swal from 'sweetalert2';
import SetPasscodeModal from '../global/SetPasscodeModal';
import { AppContext } from '../../contexts/AppContext';
import { getVendorByWallet } from '../../services';

//const { PASSCODE_LENGTH } = APP_CONSTANTS;

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const GOOGLE_REDIRECT_URL = process.env.REACT_APP_GOOGLE_REDIRECT_URL;
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function GoogleRestore() {
	const history = useHistory();
	let currentWallet = null;
	const { setWallet } = useContext(AppContext);
	const Actions = useCallback(
		() => [
			{
				hash: '#choose-account',
				label: 'Please choose Google account. Please click the switch account button to change account.'
			},
			{
				hash: '#choose-wallet',
				label: 'Please select the wallet you wish to restore.'
			},
			{
				hash: '#enter-passphrase',
				label: 'Please enter backup passphrase.'
			}
		],
		[]
	);

	const [passcodeModal, setPasscodeModal] = useState(false);
	const [passcodeIncorrect, setPasscodeInorrect] = useState(false);
	const togglePasscodeModal = () => setPasscodeModal(prev => !prev);

	const [loading, setLoading] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [gUser, setGUser] = useState({
		id: null,
		name: 'Loading Users...',
		email: null,
		image: UserImg
	});
	const [walletList, setWalletList] = useState([]);
	const [selectedWallet, setSelectedWallet] = useState({});

	const [currentAction, setCurrentAction] = useState({});

	const changeAction = useCallback(
		hash => {
			setErrorMsg(null);
			let selectedAction = Actions().find(a => a.hash === hash);
			if (!selectedAction) setCurrentAction(Actions().find(a => a.hash === '#choose-account'));
			else setCurrentAction(selectedAction);
		},
		[Actions]
	);

	const loadGapiClient = () => {
		history.listen(location => {
			changeAction(location.hash);
		});
		changeAction(history.location.hash);
		gapi.load('client:auth2', initClient);
	};

	const updateSigninStatus = useCallback(async isSignedIn => {
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
	}, []);

	const initClient = useCallback(() => {
		gapi.client
			.init({
				clientId: CLIENT_ID,
				discoveryDocs: DISCOVERY_DOCS,
				ux_mode: 'redirect',
				scope: 'profile email https://www.googleapis.com/auth/drive',
				redirect_uri: `${GOOGLE_REDIRECT_URL}/restore`
			})
			.then(function () {
				gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
				updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
			})
			.catch(e => {
				console.log(e);
				Swal.fire(
					'Warning',
					'You have blocked third-party cookies for this site or app. You must allow them for Google login to work.',
					'warning'
				).then(e => {
					history.push('/');
				});
			});
	}, [history, updateSigninStatus]);

	const handleUserSignIn = () => {
		return gapi.auth2.getAuthInstance().signIn();
	};

	const handlePasscodeSave = () => {
		setErrorMsg(null);
		togglePasscodeModal();
		restoreWallet();
	};
	const fetchWalletList = async () => {
		let existingWallet = await DataService.getWallet();
		if (existingWallet) {
			Swal.fire(
				'Warning',
				'You have already setup a wallet. Please backup and remove it before restoring another wallet from Google Drive.',
				'warning'
			).then(d => {
				history.push('/');
			});
			return;
		}
		history.push('#choose-wallet');
		setLoading('Querying Google Drive for wallet backups. Please wait...');
		const gFolder = new GFolder(gapi);
		const gFile = new GFile(gapi);
		const folder = await gFolder.ensureExists(BACKUP.GDRIVE_FOLDERNAME);
		let files = await gFile.listFiles(folder.id);
		setWalletList(files);
		setLoading(null);
	};

	const fetchSelectedWalletData = async () => {
		setErrorMsg(null);
		setLoading('Fetching wallet data. Please wait...');
		try {
			const gFile = new GFile(gapi);
			let walletData = await gFile.downloadFile(selectedWallet.id);
			currentWallet = JSON.parse(walletData);
			if (!currentWallet.name) throw Error('Not a valid wallet. Please select another wallet.');
			setSelectedWallet(Object.assign(selectedWallet, { data: currentWallet }));
			restoreWallet();
		} catch (e) {
			setErrorMsg(
				e.message === 'Not a valid wallet. Please select another wallet.'
					? e.message
					: 'Issue fetching wallet. Are you sure you selected a right wallet? Please check and try again.'
			);
			setSelectedWallet({});
		}
		setLoading(null);
	};

	const unlockWallet = async () => {
		try {
			const passcode = await DataService.get('temp_passcode');
			const wallet = await Wallet.loadFromJson(passcode, selectedWallet?.data?.wallet);
			return wallet;
		} catch (err) {
			setErrorMsg('Backup passphrase is incorrect. Please try again.');
			setPasscodeInorrect(true);
		}
	};

	const checkWalletRegistered = async walletAddress => {
		try {
			setLoading('Checking if wallet is registered');
			const walletReg = await getVendorByWallet(walletAddress);
			return walletReg;
		} catch (err) {
			setErrorMsg('Wallet not registered, Redirecting to home screen.');
			await DataService.clearAll();

			setTimeout(() => {
				history.push('/');
			}, [2500]);
		}
	};

	const restoreWallet = async () => {
		setErrorMsg(null);
		setLoading('Unlocking and restoring wallet.');
		const wallet = await unlockWallet();
		const walletReged = await checkWalletRegistered(wallet?.address);
		if (walletReged) {
			await DataService.saveWallet(selectedWallet?.data?.wallet);
			await DataService.saveHasBackedUp(true);
			await DataService.saveAddress(wallet.address);
			setWallet(wallet);
			history.push('/sync');
		}

		setLoading(null);
	};

	const showInfo = msg => {
		if (loading) return <div className="text-center p3">Loading...</div>;
		return (
			<>
				<div className="text-center p-3">
					{/* {isLoading && (
					<span className="spinner-border spinner-border-sm mr-05" role="status" aria-hidden="true"></span>
				)} */}
					{msg}
				</div>
				<div className="text-center">
					<Link to="/" className="btn btn-primary ml-1 mb-2 ">
						Go Back
					</Link>
				</div>
			</>
		);
	};

	const handleBackButton = e => {
		if (history.action === 'POP') return history.push('/google/restore');
		history.goBack();
	};

	useEffect(loadGapiClient, [changeAction, history, initClient]);

	return (
		<div id="appCapsule">
			<SetPasscodeModal
				showModal={passcodeModal}
				togglePasscodeModal={togglePasscodeModal}
				handlePasscodeSave={handlePasscodeSave}
			/>
			<Loading message={loading} showModal={loading} />
			<div className="appHeader bg-success text-light">
				<div className="left">
					{history.location.hash !== '' && (
						<button href="#" className="headerButton btn" onClick={e => handleBackButton()}>
							<IoChevronBackOutline className="ion-icon" />
						</button>
					)}
				</div>
				<div className="pageTitle">Restore wallet from Google Drive</div>
				<div className="right">
					<Link to="/" className="headerButton">
						<IoHomeOutline className="ion-icon" />
					</Link>
				</div>
			</div>

			<div style={{ marginTop: 80 }}>
				<div className="section">
					<h2>Restore Wallet from Google Drive</h2>
					<h4>{currentAction.label}</h4>
				</div>

				{currentAction.hash === '#choose-account' && (
					<div className="text-center section full mt-2 mb-3">
						<div className="text-center wide-block p-3">
							<div className="avatar">
								<img src={gUser?.image} alt="avatar" className="imaged w64 rounded" />
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
								<button
									className="btn btn-primary"
									id="btnMnemonic"
									onClick={e => fetchWalletList()}
									disabled={loading ? 'true' : ''}
								>
									Continue wallet restore for selected user
								</button>
							</div>
						)}
					</div>
				)}

				{currentAction.hash === '#choose-wallet' && (
					<div className="section full mt-2 mb-3">
						<div className="wide-block p-0">
							<div className="input-list">
								{walletList.length
									? walletList.map(d => {
											return (
												<div key={d.id} className="custom-control custom-radio">
													<input
														type="radio"
														id={d.id}
														name="walletList"
														className="custom-control-input"
														value={d.id}
														checked={selectedWallet.id === d.id}
														onChange={e => {
															setErrorMsg(null);
															setSelectedWallet(d);
														}}
													/>
													<label className="custom-control-label" htmlFor={d.id}>
														{d.name}
													</label>
												</div>
											);
									  })
									: showInfo('There are no wallet backed up in your Google Drive.')}
							</div>
						</div>

						<div className="text-center mt-3">
							{selectedWallet.id && (
								<button
									className="btn btn-primary"
									id="btnMnemonic"
									onClick={e => fetchSelectedWalletData()}
									disabled={loading ? 'true' : ''}
								>
									Continue with selected wallet
								</button>
							)}
						</div>
					</div>
				)}
			</div>

			{errorMsg && (
				<>
					<div className="text-center">
						<span className="text-danger">
							<b>Error</b>: {errorMsg}
						</span>
					</div>
				</>
			)}
			{passcodeIncorrect && (
				<div className="text-center">
					<button onClick={() => togglePasscodeModal()} className="btn btn-danger">
						Set Phone
					</button>
				</div>
			)}
		</div>
	);
}
