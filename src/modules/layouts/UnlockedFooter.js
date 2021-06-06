import React, { useState, useContext } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import QrReader from 'react-qr-reader';
import Swal from 'sweetalert2';
import { GiReceiveMoney } from 'react-icons/gi';
import { GrTransaction } from 'react-icons/gr';
import Loading from '../global/Loading';
import { useIcon } from '../../utils/react-utils';
import ModalWrapper from '../global/ModalWrapper';
import ActionSheet from '../global/ActionSheet';
import { AppContext } from '../../contexts/AppContext';
import { APP_CONSTANTS, CONTRACT } from '../../constants';
import DataService from '../../services/db';
import { RahatService, TokenService } from '../../services/chain';

const { SCAN_DELAY, SCANNER_PREVIEW_STYLE, SCANNER_CAM_STYLE } = APP_CONSTANTS;

export default function UnlockedFooter() {
	let history = useHistory();
	const { saveScannedAddress, wallet, network, setTokenBalance } = useContext(AppContext);
	const [scanModal, setScanModal] = useState(false);
	const [showActionSheet, setShowActionSheet] = useState(null);
	const [loadingModal, setLoadingModal] = useState(false);
	const [chargeData, setChargeData] = useState({ phone: '', amount: '', otp: '' });
	const [otp, setOtp] = useState('');

	const handleScanModalToggle = () => setScanModal(!scanModal);

	//TODO send requestToken transaction
	//TODO claim token on OTP verification

	const chargeCustomer = async () => {
		setLoadingModal(true);
		const agency = await DataService.getDefaultAgency();
		const rahat = RahatService(agency.address, wallet);
		const receipt = await rahat.chargeCustomer(chargeData.phone, chargeData.amount);
		setLoadingModal(false);
		return setShowActionSheet('otp');
	};

	const updateForm = e => {
		let formData = new FormData(e.target.form);
		let data = {};
		formData.forEach((value, key) => (data[key] = value));
		data.phone = data.phone.replace(/[^0-9]/g, '');
		data.amount = data.amount.replace(/[^0-9]/g, '');
		data.otp = data.otp;
		setChargeData(data);
	};

	const updateOtp = e => {
		let formData = new FormData(e.target.form);
		let data = {};
		formData.forEach((value, key) => (data[key] = value));
		setOtp(data.otp);
	};

	const verifyCharge = async () => {
		setLoadingModal(true);
		const agency = await DataService.getDefaultAgency();
		const rahat = RahatService(agency.address, wallet);
		const receipt = await rahat.verifyCharge(chargeData.phone, otp);

		await DataService.addTx({
			hash: receipt.transactionHash,
			type: 'charge',
			timestamp: Date.now(),
			amount: chargeData.amount,
			to: 'xxx',
			from: chargeData.phone,
			status: 'success'
		});
		setLoadingModal(false);
		setShowActionSheet(null);
		Swal.fire('Success', 'Transaction completed.');
		let tokenBalance = await TokenService(agency.address).getBalance();
		setTokenBalance(tokenBalance.toNumber());
	};

	const handleQRLogin = payload => {
		wallet.signMessage(payload.token).then(signedData => {
			const data = { id: payload.id, signature: signedData };
			fetch(`${payload.callbackUrl}`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
				.then(response => {
					handleScanModalToggle();
					Swal.fire('SUCCESS', 'Logged in successfully!', 'success');
				})
				.catch(err => {
					Swal.fire('ERROR', 'Login using wallet failed!', 'error');
				});
		});
	};

	const handleScanError = err => {
		alert('Oops, scanning failed. Please try again');
	};

	const isJsonString = str => {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	};

	const handleScanSuccess = async data => {
		let loginPayload = null;
		if (data) {
			const isJsonStr = isJsonString(data);
			if (isJsonStr === true) {
				loginPayload = JSON.parse(data);
				if (loginPayload && loginPayload.action === 'login') return handleQRLogin(loginPayload);
			} else {
				try {
					const initials = data.substring(0, 2);
					if (initials === '0x') {
						saveScannedAddress({ address: data });
						handleScanModalToggle();
						history.push('/select-token');
						return;
					}
					if (data.indexOf(':') === -1) throw Error('This QR Code is not supported by Rumsan Wallet.');

					let properties = data.split(':');
					let symbol = properties[0] === 'ethereum' ? 'ETH' : properties[0];
					let token = await DataService.getAssetBySymbol(symbol, network.name);
					if (!token)
						throw Error(
							`Token with symbol ${symbol} does not exist in your asset library. Please add asset and try again.`
						);
					handleScanModalToggle();
					history.push(`/transfer/${token.address}/${properties[1]}`);
				} catch (err) {
					console.log('ERR:', err);
					handleScanModalToggle();
					Swal.fire('ERROR', err.message, 'error');
				}
			}
		}
	};

	const sendTransaction = async () => {
		let hash = parseInt(Math.random() * 1000000); //add chain hash here
		//Call blockchain contract here

		await DataService.addTx({
			hash,
			type: 'send',
			timestamp: Date.now(),
			amount: 1000,
			to: 'xxx',
			from: '98767766',
			status: 'success'
		});
	};

	return (
		<>
			<Loading message="Transaction in process. Please wait..." showModal={loadingModal} />
			<ActionSheet
				title="Charge Customer"
				showModal={showActionSheet === 'charge'}
				handleSubmit={chargeCustomer}
				onHide={() => setShowActionSheet(null)}
			>
				<div className="form-group basic">
					<div className="input-wrapper">
						<label className="label">Customer Phone Number</label>
						<Form.Control
							type="number"
							name="phone"
							className="form-control"
							placeholder="Phone Number"
							value={chargeData.phone}
							onChange={updateForm}
							required
						/>
						{/* <input type="number" className="form-control" id="phone" placeholder="Enter number" /> */}
						<i className="clear-input">
							<ion-icon name="close-circle"></ion-icon>
						</i>
					</div>
				</div>

				<div className="form-group basic">
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
							value={chargeData.amount}
							onChange={updateForm}
							required
						/>
						{/* <input type="number" id="amount" className="form-control form-control-lg" placeholder="0" /> */}
					</div>
				</div>
			</ActionSheet>

			<ActionSheet title="Verification OTP" showModal={showActionSheet === 'otp'} handleSubmit={verifyCharge}>
				<div className="form-group basic">
					<div className="input-wrapper">
						<label className="label">OTP from SMS (ask from customer)</label>
						<Form.Control
							type="number"
							name="otp"
							className="form-control"
							placeholder="OTP"
							value={chargeData.otp}
							onChange={updateOtp}
							required
						/>
						{/* <input type="number" className="form-control" id="text11" placeholder="Enter OTP" /> */}
						<i className="clear-input">
							<ion-icon name="close-circle"></ion-icon>
						</i>
					</div>
				</div>
			</ActionSheet>

			<ModalWrapper title="Scan a QR Code" showModal={scanModal} onHide={handleScanModalToggle}>
				<div style={SCANNER_CAM_STYLE}>
					<QrReader
						delay={SCAN_DELAY}
						style={SCANNER_PREVIEW_STYLE}
						onError={handleScanError}
						onScan={handleScanSuccess}
					/>
				</div>
			</ModalWrapper>
			<div className="footer-unlocked">
				<div className="appBottomMenu">
					<Link to="/tx" className="item">
						<div className="col">
							<GrTransaction className="ion-icon" />
							<strong>Transactions</strong>
						</div>
					</Link>
					<a href="#home" className="item" onClick={() => setShowActionSheet('charge')}>
						<div className="col">
							<div className="action-button large">
								<GiReceiveMoney className="ion-icon" />
							</div>
						</div>
					</a>
					<Link to="/settings" className="item">
						<div className="col">
							{useIcon('IoPersonOutline')}
							<strong>Profile</strong>
						</div>
					</Link>
				</div>
			</div>
		</>
	);
}
