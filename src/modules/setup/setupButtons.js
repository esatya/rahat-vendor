import React, { useState, useContext, useRef } from 'react';
import Swal from 'sweetalert2';
import { useHistory, Link } from 'react-router-dom';

import ModalWrapper from '../global/ModalWrapper';
import Wallet from '../../utils/blockchain/wallet';
import DataService from '../../services/db';
import Loading from '../global/Loading';
import { AppContext } from '../../contexts/AppContext';
import { APP_CONSTANTS } from '../../constants';
import { IoWalletOutline, IoLogoGoogle } from 'react-icons/io5';

const { PASSCODE_LENGTH } = APP_CONSTANTS;

export default function Setup() {
	const { setWallet } = useContext(AppContext);
	let history = useHistory();

	const [showWalletActions, setShowWalletActions] = useState(false);
	const [passcode, setPasscode] = useState('');
	const [confirmPasscode, setConfirmPasscode] = useState('');
	const [loadingModal, setLoadingModal] = useState(false);
	const [loadingMessage] = useState('Creating your new wallet. Please wait...');
	const [currentAction, setCurrentAction] = useState(null);
	const inputRef = useRef(null);

	const resetPasscodes = () => {
		setPasscode('');
		setConfirmPasscode('');
	};

	const setAction = action => {
		setCurrentAction(action);
	};

	const handlePasscodeChange = e => {
		setPasscode(e.target.value);
	};

	const startOver = () => {
		resetPasscodes();
		setShowWalletActions(false);
		setCurrentAction(null);
	};

	const handleConfirmPasscodeChange = async e => {
		const { value } = e.target;
		setConfirmPasscode(value);
		if (value.length === PASSCODE_LENGTH) {
			if (value !== passcode) {
				resetPasscodes();
				Swal.fire('Error', 'Passcodes do not match. Please try another passcode.', 'error').then(actn => {
					inputRef.current.focus();
				});
				return;
			}
			if (currentAction === 'restore_mnemonic') {
				await DataService.save('temp_passcode', value);
				history.push('/mnemonic/restore');
			}
			if (currentAction === 'restore_gdrive') {
				await DataService.save('temp_passcode', value);
				history.push('/google/restore');
			}
			if (currentAction === 'create_wallet') setShowWalletActions(true);
			return;
		}
	};

	const handleWalletCreate = async () => {
		try {
			setCurrentAction(null);
			setLoadingModal(true);
			const res = await Wallet.create(passcode);
			if (res) {
				const { wallet, encryptedWallet } = res;
				await DataService.save('temp_encryptedWallet', encryptedWallet);
				setWallet(wallet);
				history.push('/create');
			}
		} catch (err) {
			Swal.fire('ERROR', err.message, 'error');
		} finally {
			setLoadingModal(false);
		}
	};

	return (
		<div>
			{/* <div id="loader">
				<img src="assets/img/logo-icon.png" alt="icon" className="loading-icon" />
			</div> */}

			<div className="appHeader bg-primary text-light">
				<div className="left"></div>
				<div className="pageTitle">Rumsan Wallet</div>
			</div>

			<div id="appCapsule">
				<div className="section wallet-card-section pt-1">
					<div className="card" style={{ height: 380, paddingTop: 50, paddingLeft: 5, paddingRight: 5 }}>
						<div className="balance">
							<div className="">
								<div style={{ paddingLeft: 20, paddingRight: 20 }}>
									<h2 className="value">Let's setup your wallet</h2>
									<span className="title">
										{/* Rumsan Wallet is a blockchain based wallet to securely store your KYC documents,
									digital assets and sign smart contracts. You can use this as your digital vault to
									store a copy of your important documents. All the data will securely stored in your
									phone. Data will never your phone withour your consent. You can either create a new
									wallet or restore existing wallet. <br /> */}
										Please choose one of the options to setup your wallet.
									</span>
								</div>
								<div className="card-body">
									<button
										onClick={() => setAction('create_wallet')}
										id="btnSetupWallet"
										type="button"
										className="btn btn-lg btn-block btn-success"
									>
										<IoWalletOutline className="ion-icon" aria-label="Create New Wallet" />
										Create new wallet
									</button>

									<div className="mt-2"></div>

									<button
										onClick={() => setAction('restore_mnemonic')}
										id="btnSetupWallet"
										type="button"
										className="btn btn-lg btn-block"
										style={{ backgroundColor: '#1E74FD', borderColor: '#1E74FD', color: '#ffffff' }}
									>
										<IoWalletOutline className="ion-icon" aria-label="Restore Existing Wallet" />
										Restore from seed phrase (mnemonic)
									</button>

									<div className="mt-2"></div>

									<button
										onClick={() => setAction('restore_gdrive')}
										id="btnSetupWallet"
										type="button"
										className="btn btn-lg btn-block btn-danger mb-2"
									>
										<IoLogoGoogle className="ion-icon" aria-label="Restore Using Google" />
										Restore wallet Google Drive
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Loading message={loadingMessage} showModal={loadingModal} />
			<ModalWrapper
				title="First, let's setup your passcode"
				showModal={currentAction !== null}
				onShow={() => inputRef.current.focus()}
				onHide={() => setShowWalletActions(false)}
			>
				{showWalletActions && currentAction === 'create_wallet' ? (
					<div className="p-2">
						<button
							onClick={handleWalletCreate}
							id="btnNewWallet"
							type="button"
							className="btn btn-lg btn-block btn-primary"
						>
							<IoWalletOutline className="ion-icon" aria-label="Create New Wallet" />
							Create a new Rumsan Wallet
						</button>
					</div>
				) : (
					<div className="row mb-3">
						<div className="col">
							<p>Choose a {PASSCODE_LENGTH}-digit passcode.</p>
							{passcode.length < PASSCODE_LENGTH && (
								<input
									onChange={handlePasscodeChange}
									type="text"
									ref={inputRef}
									pattern="[0-9]*"
									inputMode="numeric"
									className="form-control verify-input passcode pwd"
									placeholder="------"
									maxLength={PASSCODE_LENGTH}
									autoComplete="false"
									value={passcode}
								/>
							)}

							{passcode && passcode.length === PASSCODE_LENGTH && (
								<>
									<input
										autoFocus
										onChange={handleConfirmPasscodeChange}
										type="text"
										pattern="[0-9]*"
										inputMode="numeric"
										className="form-control verify-input passcode pwd"
										placeholder="------"
										maxLength={PASSCODE_LENGTH}
										autoComplete="false"
										value={confirmPasscode}
									/>
									<div className="text-center">
										<small className="message">Please confirm your passcode</small>
									</div>
								</>
							)}
						</div>
					</div>
				)}
				<div className="text-center mt-3">
					<Link to="#" onClick={() => startOver()}>
						<small>Start Over</small>
					</Link>
				</div>
			</ModalWrapper>
		</div>
	);
}
