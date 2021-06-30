import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

import { AppContext } from '../../contexts/AppContext';
import { RahatService, TokenService } from '../../services/chain';
import DataService from '../../services/db';
import { ActionSheetContext } from '../../contexts/ActionSheetContext';
import ActionSheet from './ActionSheet';

export default function ChargeDetails(props) {
	const history = useHistory();
	const { onHide, showModal } = props;
	const { wallet, setTokenBalance, addRecentTx } = useContext(AppContext);
	const { showLoading, data, setData, setActiveSheet } = useContext(ActionSheetContext);

	const verifyCharge = async () => {
		showLoading('Verifying OTP');
		const agency = await DataService.getDefaultAgency();
		try {
			const rahat = RahatService(agency.address, wallet);
			const receipt = await rahat.verifyCharge(data.phone, data.otp);
			const tx = {
				hash: receipt.transactionHash,
				type: 'charge',
				timestamp: Date.now(),
				amount: data.amount,
				to: wallet.address,
				from: data.phone,
				status: 'success'
			};

			await DataService.addTx(tx);
			history.push(`/tx/${receipt.transactionHash}`);
		} catch (e) {
			console.log(e);
			const tx = {
				hash: data.chargeTxHash,
				type: 'charge',
				timestamp: Date.now(),
				amount: data.amount,
				to: wallet.address,
				from: data.phone,
				status: 'error'
			};
			addRecentTx(tx);
			await DataService.addTx(tx);
			Swal.fire('Error', 'Transaction cancelled. Please try again.', 'error');
		} finally {
			showLoading(null);
			setActiveSheet(null);
			let tokenBalance = await TokenService(agency.address).getBalance();
			setTokenBalance(tokenBalance.toNumber());
		}
	};

	return (
		<ActionSheet
			title="Verification OTP"
			buttonName="Verify"
			showModal={showModal}
			onHide={onHide}
			handleSubmit={verifyCharge}
		>
			<div className="form-group basic">
				<div className="input-wrapper">
					<label className="label">OTP from SMS (ask from customer)</label>
					<Form.Control
						type="number"
						name="otp"
						className="form-control"
						placeholder="OTP"
						value={data.otp}
						onChange={e => setData({ otp: e.target.value })}
						required
					/>
					<i className="clear-input">
						<ion-icon name="close-circle"></ion-icon>
					</i>
				</div>
			</div>
		</ActionSheet>
	);
}
