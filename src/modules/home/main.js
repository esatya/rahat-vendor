import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useResize } from '../../utils/react-utils';
import { isOffline } from '../../utils';
import { AppContext } from '../../contexts/AppContext';
import TransactionList from '../transactions/list';
import DataService from '../../services/db';
import ActionSheet from '../../actionsheets/sheets/ActionSheet';
import { ERC1155_Service, TokenService } from '../../services/chain';
import Loading from '../global/Loading';
import { IoArrowDownCircleOutline } from 'react-icons/io5';
import { calculateTotalPackageBalance } from '../../services';
import useAuthSignature from '../../hooks/useSignature';
import { GiToken } from 'react-icons/gi';
import { FiPackage } from 'react-icons/fi';
import { APP_CONSTANTS } from '../../constants';

var QRCode = require('qrcode.react');
const { CHARGE_TYPES } = APP_CONSTANTS;

export default function Main() {
	const history = useHistory();
	const { hasWallet, wallet, tokenBalance, setTokenBalance, agency, hasBackedUp, contextLoading, hasSynchronized } =
		useContext(AppContext);

	const authSign = useAuthSignature(wallet);
	const [redeemModal, setRedeemModal] = useState(false);
	const [redeemTokenModal, setRedeemTokenModal] = useState(false);
	const [redeemPackageModal, setRedeemPackageModal] = useState(false);

	const [redeemAmount, setRedeemAmount] = useState('');
	const [loading, showLoading] = useState(null);

	const [selectedRedeemablePackage, setSelectedRedeemablePackage] = useState([]);
	const [packageBalanceLoading, setPackageBalanceLoading] = useState(true);
	const [packageBalance, setPackageBalance] = useState(null);
	const [packages, setPackages] = useState(null);
	const [recentTx, setRecentTx] = useState(null);

	const cardBody = useRef();
	const { width } = useResize(cardBody);

	const calcQRWidth = () => {
		if (width < 200) return 200;
		else return 280;
	};

	const checkRecentTnx = useCallback(async () => {
		let txs = await DataService.listTx();
		if (txs && Array.isArray(txs)) {
			const arr = txs.slice(0, 3);
			setRecentTx(arr);
		}
	}, []);

	const getTokenBalance = useCallback(async () => {
		if (!agency) return;
		try {
			const balance = await TokenService(agency.address).getBalance();
			setTokenBalance(balance.toNumber());
		} catch (err) {
			console.log('Unable to get token Balance');
			console.log(err);
		}
	}, [agency, setTokenBalance]);

	const getPackageBalance = useCallback(async () => {
		if (!agency) return;
		if (!authSign) return;
		try {
			const nfts = await DataService.listNft();
			const walletAddress = await DataService.getAddress();
			// Get Token Ids from index db
			const tokenIds = nfts.map(item => item?.tokenId);
			if (!tokenIds?.length) {
				setPackageBalanceLoading(false);
				return;
			}

			const tokenQtys = [];

			// get token balances from contract
			const address = tokenIds.map(() => walletAddress);
			const blnc = await ERC1155_Service(agency?.address).getBatchBalance(address, tokenIds);

			if (!blnc) return;
			if (blnc?.length) {
				blnc.forEach((item, index) => {
					tokenQtys.push(item.toNumber());
					nfts[index].amount = item.toNumber();
				});
			}

			setPackages(nfts);
			// get total-package-balance from Backend server
			const totalNftBalance = await calculateTotalPackageBalance({ tokenIds, tokenQtys }, authSign);

			setPackageBalance(totalNftBalance);
			setPackageBalanceLoading(false);
			// let tokens
		} catch (err) {
			setPackageBalanceLoading(false);
			console.log('Unable to get package balance', err);
		}
	}, [agency, authSign]);

	const confirmAndRedeemToken = async data => {
		setRedeemModal(false);
		const isConfirm = await Swal.fire({
			title: 'Are you sure?',
			html: `You are sending <b>${redeemAmount}</b> token to redeem it for cash`,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes',
			cancelButtonText: 'No'
		});
		if (isConfirm.value) {
			redeemToken();
		} else {
			resetFormStates();
		}
	};

	const redeemToken = async () => {
		//TODO choose a financial institute to redeem token

		setRedeemTokenModal(false);
		let tknService = TokenService(agency.address, wallet);
		showLoading('Transferring tokens to redeem. Please wait...');
		let receipt = await tknService.transfer(agency.adminAddress, Number(redeemAmount));
		resetFormStates();
		const tx = {
			hash: receipt.transactionHash,
			type: CHARGE_TYPES.REDEEMED_TOKEN,
			timestamp: Date.now(),
			amount: redeemAmount,
			to: 'agency',
			from: wallet.address,
			status: 'success'
		};
		await DataService.addTx(tx);
		await getTokenBalance();
		history.push(`/tx/${receipt.transactionHash}`);
	};

	const redeemPackages = async () => {
		if (!selectedRedeemablePackage?.length) return;
		showLoading('Transferring packages to redeem. Please wait...');
		const ids = [];
		const amount = [];
		try {
			selectedRedeemablePackage.forEach(item => {
				ids.push(item.tokenId);
				amount.push(item.amount);
			});

			const trasnaction = await ERC1155_Service(agency?.address, wallet).batchRedeem(
				wallet.address,
				agency?.adminAddress,
				ids,
				amount
			);

			const tx = {
				hash: trasnaction.transactionHash,
				type: CHARGE_TYPES.REDEEMED_PACKAGE,
				timestamp: Date.now(),
				amount: amount.reduce((prevVal, curVal) => prevVal + curVal, 0),
				to: 'agency',
				from: wallet.address,
				status: 'success',
				tokenId: ids
			};

			await DataService.addTx(tx);
			await DataService.batchDecrementNft(ids, amount);
			setSelectedRedeemablePackage([]);
			setRedeemPackageModal(false);
			await getPackageBalance();

			resetFormStates();
			await Swal.fire({
				icon: 'success',
				title: 'Success',
				text: 'Successfully Redeemed Pacakages'
			});
		} catch (err) {
			resetFormStates();

			Swal.fire({
				title: 'Error',
				text: `Couldnot redeem package`,
				icon: 'error'
			});
		}
	};

	const updateRedeemAmount = e => {
		let formData = new FormData(e.target.form);
		let data = {};
		formData.forEach((value, key) => (data[key] = value));
		setRedeemAmount(data.redeemAmount);
	};

	const resetFormStates = () => {
		showLoading(null);
		setRedeemAmount('');
		setRedeemModal(false);
	};

	const getInfoState = useCallback(async () => {
		if (contextLoading) return;
		if (!hasWallet) return history.push('/setup');
		if (!hasBackedUp) return history.push('/wallet/backup');
		if (!hasSynchronized) return history.push('/sync');
		if (agency && !agency.isApproved) return history.push('/setup/pending');
		await checkRecentTnx();
		await getTokenBalance();
	}, [contextLoading, agency, hasSynchronized, hasWallet, hasBackedUp, history, getTokenBalance, checkRecentTnx]);

	// Action Sheet togglers
	const toggleRedeemModal = () => setRedeemModal(prev => !prev);

	const toggleTokenModal = e => {
		e?.preventDefault();
		toggleRedeemModal();
		setRedeemTokenModal(prev => !prev);
	};

	const togglePackageModal = e => {
		e?.preventDefault();
		setSelectedRedeemablePackage([]);
		toggleRedeemModal();
		setRedeemPackageModal(prev => !prev);
	};

	// Checkbox click handler

	const onCheckBoxClick = tokenId => {
		const isPresent = isChecked(tokenId);
		if (isPresent) setSelectedRedeemablePackage(prev => prev.filter(elm => elm.tokenId !== tokenId));
		if (!isPresent) {
			const newElm = packages.find(elm => elm.tokenId === tokenId);
			setSelectedRedeemablePackage(prev => [...prev, newElm]);
		}
	};

	const isChecked = tknId => {
		return selectedRedeemablePackage.some(elm => elm.tokenId === tknId);
	};

	// UseEffects
	useEffect(() => {
		let isMounted = true;
		if (isMounted) getInfoState();
		return () => {
			isMounted = false;
		};
	}, [getInfoState]);

	return (
		<>
			{contextLoading && (
				<div id="loader">
					<img src="/assets/img/brand/icon-white-128.png" alt="icon" className="loading-icon" />
				</div>
			)}
			<Loading showModal={loading !== null} message={loading} />
			{/* Redeem Token Modal Starts */}

			<ActionSheet
				title="Redeem Token"
				buttonName="Redeem"
				showModal={redeemTokenModal}
				onHide={e => toggleTokenModal(e)}
				handleSubmit={confirmAndRedeemToken}
			>
				<div className="form-group basic">
					<div className="input-wrapper">
						<label className="label">Enter Amount</label>
						<div className="input-group mb-3">
							<div className="input-group-prepend">
								<span className="input-group-text" id="input14">
									Rs.
								</span>
							</div>
							<Form.Control
								type="number"
								name="redeemAmount"
								className="form-control"
								placeholder="Redeem"
								value={redeemAmount}
								onChange={updateRedeemAmount}
								required
							/>
							<i className="clear-input">
								<ion-icon name="close-circle"></ion-icon>
							</i>
						</div>
					</div>
				</div>
			</ActionSheet>

			{/* Redeem Token Modal Ends */}

			{/* Redeem Package Modal Starts */}
			<ActionSheet
				title="Redeem Package"
				buttonName="Redeem"
				showModal={redeemPackageModal}
				onHide={e => togglePackageModal(e)}
				handleSubmit={redeemPackages}
			>
				<div className="wide-block pt-2 pb-2 border-0">
					{packages?.length > 0 ? (
						packages.map(p => {
							return (
								<div className=" d-flex flex-row align-items-center justify-content-between mb-1 w-100 ">
									<div>
										<input
											type="checkbox"
											className="mr-2"
											id={`${p.tokenId}`}
											onClick={() => onCheckBoxClick(p.tokenId)}
										/>
										<img
											src={p.imageUri || '/assets/img/brand/icon-72.png'}
											width="50"
											height="50"
											alt="asset"
											className="image"
										/>
										<label className="m-0" for={`${p.tokenId}`}>{`${p.name} (${p.symbol}) `}</label>
									</div>
									<p className="mb-0 ml-3 text-warning font-weight-bold">{p.amount}</p>
								</div>
							);
						})
					) : (
						<p>You don't own any packages.</p>
					)}
				</div>
			</ActionSheet>
			{/* Redeem Package Modal Ends */}

			{/* Redeem Modal Start */}
			<ActionSheet
				title="Redeem"
				buttonName="Close"
				showModal={redeemModal}
				onHide={() => setRedeemModal(false)}
				handleSubmit={toggleRedeemModal}
			>
				<div class="modal-body">
					<ul className="listview image-listview flush">
						<li>
							<button onClick={e => toggleTokenModal(e)} className="item border-0 bg-transparent ">
								<div className="icon-box bg-primary">
									<GiToken className="ion-icon" />
								</div>
								<div className="in">
									<div>
										<div className="mb-05">
											<strong>Token</strong>
										</div>
									</div>
								</div>
							</button>
						</li>
						<li>
							<button onClick={e => togglePackageModal(e)} className="item border-0 bg-transparent ">
								<div className="icon-box bg-primary">
									<FiPackage className="ion-icon" />
								</div>
								<div className="in">
									<div>
										<div className="mb-05">
											<strong>Package</strong>
										</div>
									</div>
								</div>
							</button>
						</li>
					</ul>
				</div>
			</ActionSheet>
			{/* Redeem Modal Ends */}

			<div id="appCapsule">
				<div className="section wallet-card-section pt-1">
					<div className="wallet-card">
						<div className="balance">
							<div className="left">
								<span className="title">Token Balance</span>
								<h1 className={`total `}>{tokenBalance || 0}</h1>
							</div>
							<div className="right">
								{wallet && (
									<button
										className="item button-link"
										onClick={() => {
											if (isOffline()) return;
											setRedeemModal(true);
										}}
									>
										<div className="col">
											<div className="action-button">
												<IoArrowDownCircleOutline
													className="ion-icon"
													style={{ fontSize: '40px' }}
												/>
											</div>
										</div>
										<strong>Redeem</strong>
									</button>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="section mt-2">
					<div className="card">
						<div
							className="section-heading"
							style={{
								marginBottom: '0px'
							}}
						>
							<div
								className="card-header"
								style={{
									borderBottom: '0px'
								}}
							>
								Recent Transactions
							</div>

							<Link to="/transaction" className="link" style={{ marginRight: '16px' }}>
								View All
							</Link>
						</div>
						<div
							className="card-body"
							style={{
								paddingTop: '0px'
							}}
						>
							<TransactionList limit="3" transactions={recentTx || []} />
						</div>
					</div>
				</div>

				{wallet && (
					<div className="section mt-2 mb-4">
						<div className="card text-center">
							<div className="card-header">Your Address</div>
							<div className="card-body">
								<div className="card-text" ref={cardBody}>
									<QRCode value={wallet.address} size={calcQRWidth()} />
									<div className="mt-1" style={{ fontSize: 13 }}>
										{wallet.address}
									</div>
									<div className="mt-2" style={{ fontSize: 9, lineHeight: 1.5 }}>
										This QR Code (address) is your unique identity. Use this to receive digital
										documents, assets or verify your identity.
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="text-center mt-4">
					{hasWallet && !wallet && <strong>Tap on lock icon to unlock</strong>}
				</div>
			</div>
		</>
	);
}
