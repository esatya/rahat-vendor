import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ChargeDetails, OTP, QrcodeReader } from './sheets';
import { ActionSheetContext } from '../contexts/ActionSheetContext';

export default function ChargeAction(props) {
	const { show, hide } = props;
	const { initData, showLoading, setData } = useContext(ActionSheetContext);

	const [activeSheet, setActiveSheet] = useState(null);

	let init = useCallback(async () => {
		initData({ phone: '', amount: '', otp: '', chargeTxHash: null });
	}, [initData]);

	const onHide = () => {
		hide();
		setData({ phone: '', amount: '', otp: '', chargeTxHash: null });
		setActiveSheet(null);
		showLoading(null);
	};

	useEffect(init, []);

	useEffect(() => {
		if (show) {
			setActiveSheet('qrcode-reader');
		}
	}, [show]);

	return (
		<>
			<QrcodeReader setActiveSheet={setActiveSheet} onHide={onHide} showModal={activeSheet === 'qrcode-reader'} />
			<ChargeDetails
				setActiveSheet={setActiveSheet}
				onHide={onHide}
				showModal={activeSheet === 'charge-details'}
			/>
			<OTP setActiveSheet={setActiveSheet} onHide={onHide} showModal={activeSheet === 'otp'} />
		</>
	);
}
