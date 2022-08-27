import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { IoWalletOutline } from 'react-icons/io5';
import { FaGoogleDrive, FaKey } from 'react-icons/fa';
import PackageJson from '../../../package.json';
import PasscodeModal from '../global/SetPasscodeModal';
import DataService from '../../services/db';

const RESTORE_METHOD = {
	GOOGLE: 'google',
	MNEMOMICS: 'mnemonics'
};

const RESTORE_LINK = {
	[RESTORE_METHOD.GOOGLE]: '/google/restore',
	[RESTORE_METHOD.MNEMOMICS]: '/mnemonic/restore'
};

export default function Main() {
	const history = useHistory();
	const [restorePage, setRestorePage] = useState(false);
	const [showModal, setModal] = useState(false);
	const [restoreMethod, setRestoreMethod] = useState(null);
	const togglePasscodeModal = () => setModal(prev => !prev);

	const toggleRestore = () => setRestorePage(prev => !prev);
	const setRestoreMthd = mthd => setRestoreMethod(mthd);
	const handlePasscodeSave = () => {
		togglePasscodeModal();
		restoreMethod && history.push(RESTORE_LINK[restoreMethod]);
	};

	const hasWallet = useCallback(async () => {
		const wallet = await DataService.getWallet();
		if (wallet != null) {
			history.push('/');
		}
	}, [history]);

	useEffect(hasWallet, [hasWallet]);

	return (
		<>
			<div className="item p-2">
				<div className="text-center p-3 mb-3">
					<img src="/assets/img/brand/g20-logo.png" alt="alt" width="200" />
				</div>
				<h2>राहत अधिकृत पसल</h2>
				<p>
					राहत कार्यक्रममा भाग लिनु भएकोमा धन्यवाद। कोरोना भाइरसको निषेधाज्ञाबाट पिडितहरुलाई राहतको धेरै खाँचो
					छ। देश विदेशका दाताबाट राहत बाडिएको छ। उहाँहरुको सहयोग खेरा नजान यो सिस्टम बनाइएको हो। यो आधुनिक
					सिस्टमबाट राहत बाड्न सहज र पारदर्सी हुन्छ। हजुर बिक्रेताको लागि भनेर यो छुटै App बनाइएको हो। यो App
					को माध्यमबाट तपाइले राहत लिनेसंग पैसा लिन सक्नुहुने छ।
				</p>
				<p>आउनुहोस तपाईंलाई Register गरौ। तपाईंको Google Login गर्नुहोस। </p>

				<PasscodeModal
					showModal={showModal}
					togglePasscodeModal={togglePasscodeModal}
					handlePasscodeSave={handlePasscodeSave}
				/>
				{/* <div className="p-2">
					<Link
						to="/setup/profile"
						id="btnSetupWallet"
						type="button"
						className="btn btn-lg btn-block btn-primary mt-3"
					>
						<IoWalletOutline className="ion-icon" aria-label="Restore Using Google" />
						Register as Vendor
					</Link>
				</div> */}
				{!restorePage && (
					<div className="p-2">
						<Link
							to="/setup/profile"
							id="btnSetupWallet"
							type="button"
							className="btn btn-lg btn-block btn-primary mt-3"
						>
							<IoWalletOutline className="ion-icon" aria-label="Restore Using Google" />
							Register as Vendor
						</Link>
						<div className="form-links mt-2">
							<div className="text-center">
								<strong>Already registered? </strong>
								<button className="btn btn-text p-0 ml-2" onClick={toggleRestore}>
									Restore
								</button>
							</div>
						</div>
					</div>
				)}

				{restorePage && (
					<div className="p-2">
						<button
							onClick={() => {
								setRestoreMthd(RESTORE_METHOD.GOOGLE);
								togglePasscodeModal();
							}}
							className="btn btn-lg w-100 btn-warning mb-2"
						>
							<FaGoogleDrive className="mr-2" size={'1.3em'} />
							Restore from Google Drive
						</button>

						<button
							onClick={() => {
								setRestoreMthd(RESTORE_METHOD.MNEMOMICS);
								togglePasscodeModal();
							}}
							className="btn btn-lg w-100  btn-primary "
						>
							<FaKey className="mr-2" size={'1.3em'} />
							Restore from Mnemonics
						</button>
						<div className="form-links mt-2">
							<div className="text-center w-100">
								<button className="btn btn-text" onClick={toggleRestore}>
									Back
								</button>
							</div>
						</div>
					</div>
				)}

				<div className="text-center mt-4">
					<small>Version: {PackageJson.version}</small>
				</div>
			</div>
		</>
	);
}
