import React from 'react';
import Swal from 'sweetalert2';
import Dixie from 'dexie';
import { IoArchiveOutline, IoTrashOutline } from 'react-icons/io5';

export default function Reset() {
	const resetApp = async () => {
		const { value } = await Swal.fire({
			title: 'Please confirm!!!',
			input: 'text',
			inputLabel: 'This is irreversible. Please type "RUMSAN" without quotes to proceed',
			inputPlaceholder: ''
		});

		if (value === 'RUMSAN') {
			await Dixie.delete('db_wallet');
			window.location.href = '/';
		} else {
			Swal.fire('Wrong confirmation', 'No action was taken');
		}
	};

	return (
		<>
			<div id="appCapsule">
				<div className="text-center section full mt-2 mb-3">
					<h1 className="mt-5">Rumsan Wallet Reset</h1>
					<div>This will delete all your data. Please make sure you have backed up your wallet properly.</div>
					<button
						onClick={() => (window.location.href = '/')}
						type="button"
						className="btn btn-md btn-success mt-5 mr-3"
					>
						<IoArchiveOutline className="ion-icon" />
						Backup Wallet
					</button>
					<button onClick={() => resetApp()} type="button" className="btn btn-md btn-danger mt-5">
						<IoTrashOutline className="ion-icon" />
						Reset Rumsan Wallet
					</button>
				</div>
			</div>
		</>
	);
}
