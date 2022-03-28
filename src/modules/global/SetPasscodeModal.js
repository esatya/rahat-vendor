import React, { useEffect, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import DataService from '../../services/db';

import { APP_CONSTANTS } from '../../constants';
const { PASSCODE_LENGTH } = APP_CONSTANTS;

function SetPasscodeModal({ showModal, togglePasscodeModal = () => {}, handlePasscodeSave }) {
	const [passcode, setPasscode] = useState('');
	const [confirmPasscode, setConfirmPasscode] = useState('');
	const [confirmBtn, showConfirmBtn] = useState(false);
	const [passCodeMatch, setPasscodeMatch] = useState(true);

	const resetModal = () => {
		setPasscode('');
		setConfirmPasscode('');
		showConfirmBtn(false);
	};
	const handlePasscodeChange = e => {
		setPasscode(e.target.value);
	};

	const handleConfirmPasscodeChange = async e => {
		const { value } = e.target;
		setConfirmPasscode(value);
		if (value.length === PASSCODE_LENGTH) {
			if (value !== passcode) {
				setPasscodeMatch(false);
				return;
			}
			showConfirmBtn(true);
		}
	};

	const savePasscode = async () => {
		try {
			await DataService.save('temp_passcode', passcode);
			handlePasscodeSave();
		} catch (err) {
			console.log('Error while saving passcode');
		}
	};
	useEffect(() => {
		resetModal();
		return () => resetModal();
	}, []);

	return (
		<ModalWrapper
			title="Enter your registered phone number."
			showModal={showModal}
			handleModal={togglePasscodeModal}
			onHide={() => {
				resetModal();
				togglePasscodeModal();
			}}
			onEnter={() => resetModal()}
		>
			<div className="row mb-5">
				<div className="col">
					<p>Enter your registered phone number.</p>
					{passcode.length < PASSCODE_LENGTH && (
						<input
							onChange={handlePasscodeChange}
							type="text"
							pattern="[0-9]*"
							inputMode="numeric"
							className="form-control  passcode pwd"
							placeholder="----------"
							maxLength={PASSCODE_LENGTH}
							autoComplete="false"
							value={passcode}
						/>
					)}

					{passcode && passcode.length === PASSCODE_LENGTH && (
						<>
							<input
								onChange={handleConfirmPasscodeChange}
								type="password"
								pattern="[0-9]*"
								inputMode="numeric"
								className="form-control passcode pwd"
								placeholder="----------"
								maxLength={PASSCODE_LENGTH}
								autoComplete="false"
								value={confirmPasscode}
							/>
							<div className="text-center">
								{passCodeMatch === true ? (
									<small className="message">Please enter phone number again</small>
								) : (
									<small className="text-danger message">
										Confirm-Phone number didnot match the previous one .
									</small>
								)}
							</div>
						</>
					)}

					{confirmBtn && (
						<div className="text-center">
							<button className="btn btn-block btn-primary" onClick={() => savePasscode()}>
								Confirm Passcode
							</button>
						</div>
					)}
				</div>
			</div>
		</ModalWrapper>
	);
}

export default SetPasscodeModal;
