import React, { useContext } from 'react';
import QrReader from 'react-qr-reader';
import Swal from 'sweetalert2';

import DataService from '../../services/db';
import { RahatService } from '../../services/chain';
import { AppContext } from '../../contexts/AppContext';
import { ActionSheetContext } from '../../contexts/ActionSheetContext';
import ActionSheet from './ActionSheet';
import { APP_CONSTANTS } from '../../constants';
const { SCAN_DELAY, SCANNER_PREVIEW_STYLE } = APP_CONSTANTS;

export default function Camera(props) {
	const { modalSize, onHide, showModal } = props;
	const { wallet } = useContext(AppContext);
	const { showLoading, loading, setData, setActiveSheet } = useContext(ActionSheetContext);

	const handleScanError = err => {
		alert('Oops, scanning failed. Please try again');
	};

	const handleScanSuccess = async data => {
		if (data) {
			showLoading('Processing...');
			try {
				let phone =
					data.indexOf('+977') > -1
						? data.split('+977').pop().split('?')[0]
						: data.split(':').pop().split('?')[0];
				let amount = parseInt(data.split('amount=').pop().split('&')[0], 10);
				if (!amount) {
					setData({ phone, amount: '' });
					return setActiveSheet('charge-details');
				}
				const agency = await DataService.getDefaultAgency();
				const rahat = RahatService(agency.address, wallet);
				let receipt = await rahat.chargeCustomer(phone.toString(), amount);
				setData({ phone, amount, chargeTxHash: receipt.transactionHash });
				setActiveSheet('otp');
			} catch (e) {
				console.log(e);
				setData({ phone: '', amount: '', chargeTxHash: null });
				Swal.fire('Error', 'Please make sure you scanned a valid QR code. Please try again.', 'error');
				showLoading(null);
				setActiveSheet(null);
			} finally {
				showLoading(null);
			}
		}
	};

	return (
		<ActionSheet
			title="Scan QR Code"
			size={modalSize || 'md'}
			showModal={showModal}
			onHide={onHide}
			buttonName="Enter manually"
			handleSubmit={() => setActiveSheet('charge-details')}
		>
			<div className="text-center">
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '-50px',
						padding: '40px',
						minHeight: 200
					}}
				>
					{showModal && loading === null && (
						<QrReader
							delay={SCAN_DELAY}
							style={SCANNER_PREVIEW_STYLE}
							onError={handleScanError}
							onScan={handleScanSuccess}
						/>
					)}
				</div>
			</div>
		</ActionSheet>
	);
}
