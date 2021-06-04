import React, { useContext, useState, createRef } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

import { AppContext } from '../../contexts/AppContext';
import DataService from '../../services/db';
import Wallet from '../../utils/blockchain/wallet';
import Loading from '../global/Loading';

export default function RestoreMnemonic() {
	const wordCount = 12;
	let history = useHistory();
	const { setWallet } = useContext(AppContext);
	const [loading, setLoading] = useState(false);

	const wordRefs = React.useRef([]);
	if (wordRefs.current.length !== wordCount) {
		wordRefs.current = Array(wordCount)
			.fill()
			.map((_, i) => wordRefs.current[i] || createRef());
	}

	const handleCancelClick = e => {
		e.preventDefault();
		window.location.replace('/');
	};

	const confirmBackup = async () => {
		const isConfirm = await Swal.fire({
			title: 'Success',
			icon: 'success',
			html: `Would you like to backup your wallet in Google Drive`,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, Backup',
			cancelButtonText: 'No, Take to homepage'
		});
		if (isConfirm.value) {
			history.push('/google/backup');
		} else {
			history.push('/');
		}
	};

	const handlePaste = e => {
		e.preventDefault();
		const clip = e.clipboardData.getData('text').trim();
		let words = clip.split(' ');
		words.map((word, i) => {
			if (wordRefs.current[i]) wordRefs.current[i].current.value = word;
			return null;
		});
	};

	let rows = [];
	for (let i = 0; i < wordCount; i++) {
		let column = (
			<div key={i + 1} className="col-sm-3">
				<div className="form-group boxed">
					<div className="input-wrapper">
						<label className="label">Word: {i + 1}</label>
						<input
							type="text"
							ref={wordRefs.current[i]}
							//value={wordRefs.current[i].current ? wordRefs.current[i].current.value : ''}
							onChange={e => {}}
							className="form-control"
							onPaste={handlePaste}
							name={`word${i + 1}`}
							required
						/>
					</div>
				</div>
			</div>
		);
		rows.push(column);
	}

	const restoreWallet = async mnemonic => {
		try {
			setLoading(true);
			let passcode = await DataService.get('temp_passcode');
			const res = await Wallet.create(passcode, mnemonic);
			const { wallet, encryptedWallet } = res;
			setWallet(wallet);
			DataService.saveAddress(wallet.address);
			await DataService.saveWallet(encryptedWallet);
			DataService.remove('temp_passcode');
			setLoading(false);
			return confirmBackup();
		} catch (err) {
			Swal.fire('ERROR', err.message, 'error');
			setLoading(false);
		}
	};

	const handleFormSubmit = e => {
		e.preventDefault();
		let words = [];
		const formData = new FormData(e.target);
		for (let i = 1; i < 13; i++) {
			let word = formData.get(`word${i}`);
			words.push(word);
		}
		const mnemonic = words.join(' ');
		if (!Wallet.isValidMnemonic(mnemonic)) {
			Swal.fire('ERROR', 'Invalid mnemonic. Please check and try again.', 'error');
			return;
		}
		return restoreWallet(mnemonic);
	};

	return (
		<>
			<Loading message="Restoring your wallet. Please wait..." showModal={loading} />
			<div id="appCapsule">
				<div className="section full mt-2">
					<div className="section-title" style={{ fontSize: 'larger' }}>
						Please enter 12 word mnemonics
					</div>
					<form onSubmit={handleFormSubmit}>
						<div className="content-header mb-05">
							<p>One word in each box</p>
							<div className="row">
								{rows &&
									rows.map(col => {
										return col;
									})}
							</div>
						</div>

						<div className="text-center mt-3">
							<button
								type="submit"
								style={{ margin: 5 }}
								className="btn btn-success btn-md"
								id="btnMnemonic"
							>
								Submit
							</button>
							<button onClick={handleCancelClick} className="btn btn-danger btn-md" id="btnCancel">
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
