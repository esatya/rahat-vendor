import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import AppHeader from '../../layouts/AppHeader';
import ModalWrapper from '../../global/ModalWrapper';
import Wallet from '../../../utils/blockchain/wallet';
import Loading from '../../global/Loading';
import BackupInfo from './info';
import DataService from '../../../services/db';

export default function Index() {
	const [passcode, setPasscode] = useState('');
	const [loading, setLoading] = useState(false);
	const [phrases, setPhrases] = useState([]);
	const [isQueryingDb, setQuerying] = useState(true);
	const [phraseModal, setPhraseModal] = useState(false);

	const togglePasscodeModal = () => {
		fetchPhrasesAndLoad(passcode);
	};

	const togglePhraseModal = () => {
		setPhraseModal(!phraseModal);
	};

	const fetchPhrasesAndLoad = async passcode => {
		try {
			setLoading(true);
			const w = await Wallet.loadWallet(passcode);
			const words = w.mnemonic.phrase.split(' ');
			setPhrases(words);
			setLoading(false);
			togglePhraseModal();
		} catch (e) {
			setLoading(false);
			setPasscode('');
			Swal.fire('ERROR', e.message, 'error');
		}
	};

	const resetStates = async () => {
		setLoading(false);

		const { isConfirmed, isDismissed, isDenied } = await Swal.fire({
			title: 'Warning!',
			text: 'Have you really backed up your passphrase ?',
			icon: 'warning',
			showDenyButton: true,
			confirmButtonText: 'Yes',
			denyButtonText: 'Cancel'
		});

		try {
			if (isConfirmed) {
				togglePhraseModal();
				await DataService.saveHasBackedUp(true);
				window.location.replace('/');
			}
			if (isDenied || isDismissed) {
				togglePhraseModal();
				throw Error('You should backup this passphrase');
			}
		} catch (err) {
			await DataService.saveHasBackedUp(false);
			Swal.fire({
				title: 'Warning!',
				text: err?.message,
				icon: 'warning',
				confirmButtonText: 'Ok'
			});
		}
	};

	const handlePhraseSaveClick = () => {
		resetStates();
	};

	const getPhone = useCallback(async () => {
		try {
			const { phone } = await DataService.getProfile();
			if (!phone) throw Error('Unable to get passcode');
			setPasscode(phone);
		} catch (err) {
			console.log({ err });
			throw err;
		}
	}, []);

	useEffect(() => {
		getPhone()
			.then(() => setQuerying(false))
			.catch(() => {
				setQuerying(true);
				Swal.fire('ERROR', 'Couldnot get necessary data', 'error').then(() => window.location.replace('/'));
			});
		return () => setQuerying(true);
	}, [getPhone]);

	return (
		<>
			<Loading showModal={loading} message="Fetching your 12 words secret. It may take few seconds to load..." />

			{/* 12 words phrase modal */}
			<ModalWrapper
				title="Here is your 12 words secret. Please write down these words in sequence (using the word number) and store safely"
				showModal={phraseModal}
				onHide={togglePhraseModal}
				modalSize="lg"
				showFooter="true"
				handleSubmit={handlePhraseSaveClick}
				btnText="I have written down the secret words"
			>
				<div className="row">
					{phrases.length > 0
						? phrases.map((word, ind) => {
								return (
									<div key={ind} className="col-lg-3 col-md-6 col-sm-12">
										<div className="form-group boxed">
											<div className="input-wrapper">
												<label className="label">&nbsp;word: {ind + 1}</label>
												<input
													type="text"
													className="form-control"
													name={`${word}${ind + 1}`}
													defaultValue={word}
													readOnly
												/>
											</div>
										</div>
									</div>
								);
						  })
						: ''}
				</div>
			</ModalWrapper>
			<AppHeader currentMenu="Backup" />

			<BackupInfo togglePasscodeModal={togglePasscodeModal} disabled={isQueryingDb} />
		</>
	);
}
