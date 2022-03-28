import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

// import DataService from '../../services/db';
// import { RahatService } from '../../services/chain';
// import { AppContext } from '../../contexts/AppContext';
import { ActionSheetContext } from '../../contexts/ActionSheetContext';
import ActionSheet from './ActionSheet';
import { checkBeneficiary } from '../../services';

export default function ChargeDetails(props) {
	const history = useHistory();
	const { onHide, showModal } = props;

	const { showLoading, data, setData, setActiveSheet } = useContext(ActionSheetContext);
	// const { wallet } = useContext(AppContext);

	const chargeCustomer = async () => {
		showLoading('Charging customer account...');
		const isBeneficiary = await checkBeneficiary(data.phone);
		if (!isBeneficiary.data) {
			setActiveSheet('null');
			showLoading(null);
			return Swal.fire('Error', `${isBeneficiary.message || 'Invalid Beneficiary'}`, 'error');
		}
		try {
			// const agency = await DataService.getDefaultAgency();
			// const rahat = RahatService(agency.address, wallet);
			// let receipt = await rahat.chargeCustomer(data.phone, data.amount);
			// setData({ chargeTxHash: receipt.transactionHash });
			setActiveSheet('null');
			history.push(`/charge/${data.phone}`);
		} catch (e) {
			// console.log(e);
			Swal.fire('Error', 'Transaction cancelled. Please try again.', 'error');
		} finally {
			showLoading(null);
		}
	};

	return (
		<ActionSheet
			title="Charge Customer"
			buttonName="Charge"
			showModal={showModal}
			handleSubmit={chargeCustomer}
			onHide={onHide}
		>
			<div className="form-group basic">
				<div className="input-wrapper">
					<label className="label">Customer Phone Number</label>
					<Form.Control
						type="number"
						name="phone"
						className="form-control"
						placeholder="Phone Number"
						value={data.phone}
						onChange={e => setData({ phone: e.target.value })}
						required
					/>
					<i className="clear-input">
						<ion-icon name="close-circle"></ion-icon>
					</i>
				</div>
			</div>

			{/* <div className="form-group basic">
				<label className="label">Enter Amount</label>
				<div className="input-group mb-3">
					<div className="input-group-prepend">
						<span className="input-group-text" id="input14">
							Rs.
						</span>
					</div>
					<Form.Control
						type="number"
						name="amount"
						className="form-control"
						placeholder="Charge Amount"
						value={data.amount}
						onChange={e => setData({ amount: e.target.value })}
						required
					/>
				</div>
			</div> */}
		</ActionSheet>
	);
}
