import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import QrReader from 'react-qr-reader';
import Swal from 'sweetalert2';
import { GiReceiveMoney } from 'react-icons/gi';
import { GrTransaction } from 'react-icons/gr';

import { useIcon } from '../../utils/react-utils';
import ModalWrapper from '../global/ModalWrapper';
import ActionSheet from '../global/ActionSheet';
import { AppContext } from '../../contexts/AppContext';
import { APP_CONSTANTS } from '../../constants';
import DataService from '../../services/db';

const { SCAN_DELAY, SCANNER_PREVIEW_STYLE, SCANNER_CAM_STYLE } = APP_CONSTANTS;

export default function UnlockedFooter() {
	let history = useHistory();
	const { saveScannedAddress, wallet, network } = useContext(AppContext);
	const [scanModal, setScanModal] = useState(false);
	const [showActionSheet, setShowActionSheet] = useState(null);

	const handleScanModalToggle = () => setScanModal(!scanModal);

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

	return (
		<>
			<ActionSheet
				title="Charge Customer"
				showModal={showActionSheet === 'charge'}
				handleSubmit={() => setShowActionSheet('otp')}
			>
				<div class="form-group basic">
					<div class="input-wrapper">
						<label class="label" for="text11">
							Customer Phone Number
						</label>
						<input type="number" class="form-control" id="text11" placeholder="Enter number" />
						<i class="clear-input">
							<ion-icon name="close-circle"></ion-icon>
						</i>
					</div>
				</div>

				<div class="form-group basic">
					<label class="label">Enter Amount</label>
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text" id="input14">
								Rs.
							</span>
						</div>
						<input type="number" class="form-control form-control-lg" placeholder="0" />
					</div>
				</div>
			</ActionSheet>

			<ActionSheet
				title="Verification OTP"
				showModal={showActionSheet === 'otp'}
				handleSubmit={() => {
					setShowActionSheet(null);
					Swal.fire('To Do', 'Execute Tx here');
				}}
			>
				<div class="form-group basic">
					<div class="input-wrapper">
						<label class="label" for="text11">
							OTP from SMS (ask from customer)
						</label>
						<input type="number" class="form-control" id="text11" placeholder="Enter OTP" />
						<i class="clear-input">
							<ion-icon name="close-circle"></ion-icon>
						</i>
					</div>
				</div>
			</ActionSheet>

			<ModalWrapper title="Scan a QR Code" showModal={scanModal} ohHide={handleScanModalToggle}>
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
							<GrTransaction class="ion-icon" />
							<strong>Transactions</strong>
						</div>
					</Link>
					<a href="#home" className="item" onClick={() => setShowActionSheet('charge')}>
						<div className="col">
							<div className="action-button large">
								<GiReceiveMoney class="ion-icon" />
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
