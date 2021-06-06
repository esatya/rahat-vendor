import React, { useState } from 'react';
import Swal from 'sweetalert2';

import AppHeader from '../../layouts/AppHeader';
import ModalWrapper from '../../global/ModalWrapper';
import { APP_CONSTANTS } from '../../../constants';
import Wallet from '../../../utils/blockchain/wallet';
import Loading from '../../global/Loading';
import BackupInfo from './info';

const { PASSCODE_LENGTH } = APP_CONSTANTS;

export default function Index() {
	const [passcode, setPasscode] = useState('');
	const [loading, setLoading] = useState(false);
	const [phrases, setPhrases] = useState([]);

	const [passcodeModal, setPasscodeModal] = useState(false);
	const [phraseModal, setPhraseModal] = useState(false);

	const togglePasscodeModal = () => {
		setPasscodeModal(!passcodeModal);
	};

	const togglePhraseModal = () => {
		setPhraseModal(!phraseModal);
	};

	const handlePasscodeChange = e => {
		const { value } = e.target;
		setPasscode(e.target.value);
		if (value.length === PASSCODE_LENGTH) {
			togglePasscodeModal();
			return fetchPhrasesAndLoad(value);
		}
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

	const resetStates = () => {
		setLoading(false);
		setPasscode('');
		togglePhraseModal();
	};

	const handlePhraseSaveClick = () => {
		resetStates();
	};

	return (
		<>
			<Loading showModal={loading} message="Fetching your 12 words secret. It may take few seconds to load..." />
			<ModalWrapper title="Please enter your passcode" showModal={passcodeModal} onHide={togglePasscodeModal}>
				<div className="row mb-5">
					<div className="col">
						<p>Choose a {PASSCODE_LENGTH}-digit passcode.</p>

						<input
							onChange={handlePasscodeChange}
							type="password"
							pattern="[0-9]*"
							inputMode="numeric"
							className="form-control verify-input passcode"
							placeholder="------"
							maxLength={PASSCODE_LENGTH}
							autoComplete="false"
							value={passcode}
						/>
					</div>
				</div>
			</ModalWrapper>

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
									<div key={ind} className="col-3">
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

			<BackupInfo togglePasscodeModal={togglePasscodeModal} />
		</>
	);
}
