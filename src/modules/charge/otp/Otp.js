import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import { IoCloseCircle, IoSendOutline } from 'react-icons/io5';

import { AppContext } from '../../../contexts/AppContext';

import Loading from '../../global/Loading';
import AppHeader from '../../layouts/AppHeader';
import { APP_CONSTANTS } from '../../../constants';

import DataService from '../../../services/db';
import { RahatService } from '../../../services/chain';

import { ChargeContext } from '../../../contexts/ChargeContext';

const { CHARGE_TYPES } = APP_CONSTANTS;

export default function Otp(props) {
	const { wallet } = useContext(AppContext);
	const { getTokenAmount, getNFTAmount, getNFTDetails, removeTokenAmount, removeNFTAmount, removeNFTDetails } =
		useContext(ChargeContext);

	let history = useHistory();

	let { beneficiary, chargeType, tokenId } = props.match.params;

	const [loading, showLoading] = useState(null);
	const [otp, setOtp] = useState(null);

	const handleStoreAssets = async () => {
		let nftDetails = getNFTDetails();
		await DataService.addNft(nftDetails);
		removeNFTDetails();
	};

	const handleOTPSubmit = async () => {
		try {
			showLoading('verifying OTP...');
			const agency = await DataService.getDefaultAgency();
			const rahat = RahatService(agency.address, wallet);

			let receipt =
				chargeType === CHARGE_TYPES.TOKEN
					? await rahat.verifyChargeForERC20(Number(beneficiary), otp)
					: await rahat.verifyChargeForERC1155(Number(beneficiary), otp, tokenId);

			let tx = {
				hash: receipt.transactionHash,
				type: chargeType === CHARGE_TYPES.TOKEN ? CHARGE_TYPES.TOKEN_RECIEVED : CHARGE_TYPES.NFT_RECIEVED,
				timestamp: Date.now(),
				amount: chargeType === CHARGE_TYPES.TOKEN ? getTokenAmount() : getNFTAmount(),
				to: beneficiary,
				from: receipt.from,
				status: 'success'
			};
			if (chargeType === CHARGE_TYPES.NFT) tx.tokenId = tokenId;
			await DataService.addTx(tx);
			chargeType === CHARGE_TYPES.NFT && (await handleStoreAssets());
			chargeType === CHARGE_TYPES.TOKEN ? removeTokenAmount() : removeNFTAmount();
			showLoading(null);
			await Swal.fire({
				icon: 'success',
				title: 'Successfully transfered',
				timer: 2000
			});
			history.push(`/tx/${tx.hash}`);
		} catch (e) {
			showLoading(null);

			if (e.error && e.error.transaction) {
				let tx = {
					to: beneficiary,
					from: e.error.transaction.from ? e.error.transaction.from : '',
					status: 'failed',
					hash: chargeType + Date.now(),
					type: chargeType === CHARGE_TYPES.TOKEN ? CHARGE_TYPES.TOKEN_RECIEVED : CHARGE_TYPES.NFT_RECIEVED,
					timestamp: Date.now(),
					amount: chargeType === CHARGE_TYPES.TOKEN ? getTokenAmount() : getNFTAmount()
				};
				if (chargeType === CHARGE_TYPES.NFT) tx.tokenId = [tokenId];

				await DataService.addTx(tx);

				Swal.fire({
					icon: 'error',
					title: 'Operation Failed'
				});
			}
		}
	};

	const handleOtpChange = e => {
		setOtp(e.target.value);
	};

	return (
		<>
			<Loading showModal={loading !== null} message={loading} />
			<AppHeader currentMenu="Charge" />
			<div id="appCapsule">
				<div id="cmpMain">
					<div className="section mt-2 mb-5">
						<div className="text-center">
							<h2 class="text-primary ">{beneficiary}</h2>
						</div>

						<div className="card mt-2">
							<div className="card-header">OTP Verification</div>
							<div className="card-body">
								<form>
									<div className="form-group boxed" style={{ padding: 0 }}>
										<div className="input-wrapper">
											<label className="label" htmlFor="otp">
												OTP:
											</label>
											<input
												onChange={handleOtpChange}
												value={otp ? otp : ''}
												type="number"
												className="form-control"
												id="otp"
												name="otp"
												placeholder="Enter OTP given by Beneficiary"
											/>
											<i className="clear-input">
												<IoCloseCircle className="ion-icon" />
											</i>
										</div>
									</div>
									<div className="mt-3">
										<small>Please request the customer to provide OTP for verification.</small>
									</div>
								</form>
							</div>
							<div className="card-footer text-right">
								<button
									type="button"
									id="btncharge"
									className="btn btn-success"
									onClick={handleOTPSubmit}
									disabled={!otp}
								>
									<IoSendOutline className="ion-icon" /> Continue
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
