import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ChargeDetails, OTP, QrcodeReader } from './sheets';
import { ActionSheetContext } from '../contexts/ActionSheetContext';

export default function ChargeAction(props) {
	const { initData, showLoading, setData, activeSheet, setActiveSheet } = useContext(ActionSheetContext);

	let init = useCallback(async () => {
		initData({ phone: '', amount: '', otp: '', chargeTxHash: null });
	}, [initData]);

	const onHide = () => {
		setData({ phone: '', amount: '', otp: '', chargeTxHash: null });
		setActiveSheet(null);
		showLoading(null);
	};

	useEffect(init, []);

	return (
		<>
			<QrcodeReader onHide={onHide} showModal={activeSheet === 'qrcode-reader'} />
			<ChargeDetails onHide={onHide} showModal={activeSheet === 'charge-details'} />
			<OTP onHide={onHide} showModal={activeSheet === 'otp'} />
		</>
	);
}
