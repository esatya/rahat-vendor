import React, { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import { ethers } from 'ethers';
import QrReader from 'react-qr-reader';
import { IoCloseCircle, IoSendOutline, IoQrCodeOutline } from 'react-icons/io5';

import { AppContext } from '../../contexts/AppContext';
import Loading from '../global/Loading';
import AppHeader from '../layouts/AppHeader';
import ModalWrapper from '../global/ModalWrapper';
import { APP_CONSTANTS } from '../../constants';
import { ERC1155_Service, TokenService } from '../../services/chain';
import { isOffline, isValidAddress } from '../../utils';
import DataService from '../../services/db';
import Packages from './component/Packages';
const { SCAN_DELAY, SCANNER_PREVIEW_STYLE, CHARGE_TYPES } = APP_CONSTANTS;
const TAB = {
	TOKEN: 'token',
	PACKAGE: 'packgae'
};
export default function Index(props) {
	const { agency, wallet, setTokenBalance } = useContext(AppContext);
	let history = useHistory();
	let toAddress = props.match.params.address;
	const [sendAmount, setSendAmount] = useState('');
	const [sendToAddress, setSendToAddress] = useState('');
	const [loading, showLoading] = useState(null);
	const [scanModal, setScanModal] = useState(false);
	const [selectedTab, setSelectedTab] = useState(TAB.TOKEN);
	const [selectedRedeemablePackage, setSelectedRedeemablePackage] = useState([]);
	const [isAddressValid, setAddressValid] = useState(true);
	const changeTab = tab => setSelectedTab(tab);

	const handleScanModalToggle = () => setScanModal(!scanModal);

	const handleScanError = err => {
		alert('Oops, scanning failed. Please try again');
	};
	const handlScanSuccess = data => {
		if (data) {
			try {
				const initials = data.substring(0, 2);
				if (initials === '0x') {
					saveScannedAddress({ address: data });
					handleScanModalToggle();
					history.push('/select-token');
					return;
				}
				let properties = data.split(',');
				let obj = {};
				properties.forEach(function (property) {
					let tup = property.split(':');
					obj[tup[0]] = tup[1].trim();
				});
				const tokenName = Object.getOwnPropertyNames(obj)[0];
				obj.address = obj[tokenName];
				saveTokenNameToCtx(tokenName);
				saveScannedAddress(obj);
				handleScanModalToggle();
				history.push('/transfer');
			} catch (err) {
				handleScanModalToggle();
				Swal.fire('ERROR', 'Invalid wallet address!', 'error');
			}
		}
	};

	const handleSendToChange = e => {
		setSendToAddress(e.target.value);
	};

	const handleSendAmtChange = e => {
		setSendAmount(e.target.value);
	};

	const resetFormStates = () => {
		showLoading(null);
		setSendAmount('');
		setSendToAddress('');
	};

	const confirmAndSend = async data => {
		const isConfirm = await Swal.fire({
			title: 'Are you sure?',
			html: `You are sending <b>${data.sendAmount}</b> to <b>${data.sendToAddress}</b>.<br>
				<small>Please double check the address and the amount.</small>`,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes',
			cancelButtonText: 'No'
		});
		if (isConfirm.value) {
			send(data);
		}
	};

	const send = async data => {
		try {
			if (!ethers.utils.isAddress(data.sendToAddress)) throw Error('Destination address is invalid');
			showLoading('Transferring tokens. Please wait...');
			let tknService = TokenService(agency.address, wallet);
			let receipt = await tknService.transfer(data.sendToAddress, data.sendAmount);
			resetFormStates();
			DataService.addTx({
				hash: receipt.transactionHash,
				type: CHARGE_TYPES.TOKEN_TRANSFER,
				timestamp: Date.now(),
				amount: data.sendAmount,
				to: data.sendToAddress,
				from: wallet.address,
				status: 'success'
			});
			history.push(`/tx/${receipt.transactionHash}`);
			let tokenBalance = await TokenService(agency.address).getBalance();
			setTokenBalance(tokenBalance.toNumber());
		} catch (e) {
			Swal.fire('ERROR', e.message, 'error');
		} finally {
			resetFormStates();
		}
	};

	const checkAddress = () => {
		const isValid = isValidAddress(sendToAddress);
		setAddressValid(isValid);
		return isValid;
	};

	const transferPackages = async () => {
		if (!selectedRedeemablePackage?.length) return;
		showLoading('Transferring packages. Please wait...');
		const ids = [];
		const amount = [];
		try {
			selectedRedeemablePackage.forEach(item => {
				ids.push(item.tokenId);
				amount.push(item.amount);
			});

			const trasnaction = await ERC1155_Service(agency?.address, wallet).batchRedeem(
				wallet.address,
				sendToAddress,
				ids,
				amount
			);

			const tx = {
				hash: trasnaction.transactionHash,
				type: CHARGE_TYPES.PAKCAGE_TRANSFER,
				timestamp: Date.now(),
				amount: amount.reduce((prevVal, curVal) => prevVal + curVal, 0),
				to: sendToAddress,
				from: wallet.address,
				status: 'success'
			};
			await DataService.addTx(tx);
			await DataService.batchDecrementNft(ids, amount);
			setSelectedRedeemablePackage([]);
			showLoading(null);
			await Swal.fire({
				icon: 'success',
				title: 'Success',
				text: 'Successfully Redeemed Pacakages'
			});
		} catch (err) {
			console.log({ err });
			showLoading(null);

			Swal.fire({
				title: 'Error',
				text: `Couldnot redeem package`,
				icon: 'error'
			});
		}
	};

	const confirmSendPackage = () => {
		return Swal.fire({
			title: 'Warning',
			icon: 'warning',
			text: 'All amount of selected packages will be transferred.',
			showCancelButton: true
		});
	};

	const handleTokenSendClick = () => {
		const isValid = checkAddress();
		if (!isValid) return;
		if (isOffline('Cannot transfer while you are offline. Please connect to the Internet and try again.')) return;

		if (!sendAmount || !sendToAddress) {
			return Swal.fire({ title: 'ERROR', icon: 'error', text: 'Send amount and receiver address is required' });
		}
		confirmAndSend({ sendAmount, sendToAddress });
	};

	const handlePackageSendClick = async () => {
		const isValid = checkAddress();
		if (!isValid) return;
		if (isOffline('Cannot transfer while you are offline. Please connect to the Internet and try again.')) return;
		const isConfirm = await confirmSendPackage();
		if (isConfirm.value) transferPackages();
	};

	useEffect(() => {
		(async () => {
			if (toAddress) setSendToAddress(toAddress);
		})();
	}, [toAddress]);

	// useEffect(() => {
	// 	const _tokens = [];
	// 	//setTokenAssets(_tokens);
	// 	//sendingTokenName => Scanned token name
	// 	if (true == false && sendingTokenName) {
	// 		const found = _tokens.find(item => item.tokenName === sendingTokenName);
	// 		if (found) {
	// 			setSendingTokenSymbol(found.symbol);
	// 			setCurrentBalance(found.tokenBalance);
	// 		} else {
	// 			if (sendingTokenName === 'ethereum') {
	// 				setSendingTokenSymbol(DEFAULT_TOKEN.SYMBOL);
	// 				setCurrentBalance(ethBalance);
	// 			} else {
	// 				setSendingTokenSymbol('');
	// 				Swal.fire({
	// 					title: 'Asset not available',
	// 					text: `Would you like to add ${sendingTokenName} asset now?`,
	// 					showCancelButton: true,
	// 					confirmButtonColor: '#3085d6',
	// 					cancelButtonColor: '#d33',
	// 					confirmButtonText: 'Yes',
	// 					cancelButtonText: 'No'
	// 				}).then(res => {
	// 					if (res.isConfirmed) history.push('/import-token');
	// 				});
	// 			}
	// 		}
	// 	}

	// 	scannedEthAddress && setSendToAddress(scannedEthAddress);
	// 	scannedAmount && setSendAmount(scannedAmount);
	// }, [ethBalance, history, scannedAmount, scannedEthAddress, sendingTokenName]);

	return (
		<>
			<ModalWrapper title="Scan a QR Code" showModal={scanModal} onHide={handleScanModalToggle}>
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
						<QrReader
							delay={SCAN_DELAY}
							style={SCANNER_PREVIEW_STYLE}
							onError={handleScanError}
							onScan={handlScanSuccess}
						/>
					</div>
				</div>
			</ModalWrapper>
			<Loading showModal={loading !== null} message={loading} />
			<AppHeader currentMenu="Transfer" />
			<div id="appCapsule">
				<div id="cmpMain">
					<div className="section mt-2">
						<div className="form-group boxed">
							<div className="input-wrapper">
								<label className="label" htmlFor="sendToAddr">
									Destination Address:
								</label>
								<div className="input-group mb-0">
									<input
										type="text"
										className="form-control"
										id="sendToAddr"
										name="sendToAddr"
										placeholder="Enter receiver's address"
										onChange={handleSendToChange}
										value={sendToAddress}
									/>
									<i className="clear-input">
										<IoCloseCircle className="ion-icon" />
									</i>
									<div className="ml-1">
										<button
											type="button"
											className="btn btn-icon btn-primary mr-1 mb-1 btn-scan-address"
											onClick={handleScanModalToggle}
										>
											<IoQrCodeOutline className="ion-icon" />
										</button>
									</div>
								</div>
								{!isAddressValid && <p className="text-danger">Invalid Address.</p>}
							</div>
						</div>
					</div>
					<div className="tab-content mt-1">
						<div className="tab-pane fade show active" id="lined" role="tabpanel">
							<div className="section full mt-1">
								<div className="wide-block pb-2">
									<ul className="nav nav-tabs lined" role="tablist">
										<li className="nav-item">
											<a
												className={`nav-link ${selectedTab === TAB.TOKEN && 'active'}`}
												data-toggle="tab"
												href="#token"
												role="tab"
												onClick={() => changeTab(TAB.TOKEN)}
											>
												Token
											</a>
										</li>
										<li className="nav-item">
											<a
												className={`nav-link ${selectedTab === TAB.PACKAGE && 'active'}`}
												data-toggle="tab"
												href="#package"
												role="tab"
												onClick={() => changeTab(TAB.PACKAGE)}
											>
												Package
											</a>
										</li>
									</ul>
									<div className="tab-content mt-2">
										<div
											className={`tab-pane fade ${selectedTab === TAB.TOKEN && 'show active'}`}
											id="home11"
											role="tabpanel"
										>
											<div className="form-group boxed" style={{ padding: 0 }}>
												<div className="input-wrapper">
													<label className="label" htmlFor="sendAmount">
														Amount to Send:
													</label>
													<input
														onChange={handleSendAmtChange}
														value={sendAmount}
														type="number"
														className="form-control"
														id="sendAmount"
														name="sendAmount"
														placeholder="Enter amount to send"
													/>
													<i className="clear-input">
														<IoCloseCircle className="ion-icon" />
													</i>
												</div>
											</div>
											<div className="mt-3">
												<small>
													Important: Please double check the address and amount before
													sending. Transactions cannot be reversed.
												</small>
											</div>
											<div className="mt-3 text-right">
												<button
													type="button"
													id="btnSend"
													className="btn btn-success"
													onClick={handleTokenSendClick}
													disabled={!sendAmount || sendAmount <= 0}
												>
													<IoSendOutline className="ion-icon" /> Send Now
												</button>
											</div>
										</div>
										<div
											className={`tab-pane fade ${selectedTab === TAB.PACKAGE && 'show active'}`}
											id="profile12"
											role="tabpanel"
										>
											<Packages
												selectedRedeemablePackage={selectedRedeemablePackage}
												setSelectedRedeemablePackage={setSelectedRedeemablePackage}
											/>

											<div className="mt-3">
												<small>
													Important: Please double check the address and packages before
													sending. Transactions cannot be reversed.
												</small>
											</div>
											<div className="mt-3 text-right">
												<button
													type="button"
													id="btnSend"
													className="btn btn-success"
													onClick={handlePackageSendClick}
													disabled={!selectedRedeemablePackage?.length}
												>
													<IoSendOutline className="ion-icon" /> Send Now
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
