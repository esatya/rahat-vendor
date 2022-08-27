import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IoCloseCircle, IoSendOutline } from 'react-icons/io5';
import Swal from 'sweetalert2';

import { AppContext } from '../../../contexts/AppContext';
import { ChargeContext } from '../../../contexts/ChargeContext';

import Loading from '../../global/Loading';
import AppHeader from '../../layouts/AppHeader';
import { APP_CONSTANTS } from '../../../constants';

import DataService from '../../../services/db';
import { RahatService } from '../../../services/chain';
import { checkBeneficiary } from '../../../services';

const { CHARGE_TYPES } = APP_CONSTANTS;

export default function Token(props) {
	const { wallet } = useContext(AppContext);

	const { setTokenAmount } = useContext(ChargeContext);
	let history = useHistory();
	let beneficiary = props.match.params.beneficiary;
	const queryParam = useLocation().search;
	const queryAmount = new URLSearchParams(queryParam).get('amount');
	const [beneficiaryPhone, setBeneficiaryPhone] = useState('');
	const [projectId, setProjectId] = useState('');
	const [loading, showLoading] = useState(null);
	const [chargeAmount, setChargeAmount] = useState(null);
	const [packages, setPackages] = useState([]);
	const [beneficiaryTokenBalance, setBeneficiaryTokenBalance] = useState(null);

	const handleChargeClick = async () => {
		try {
			console.log('chargeing');
			showLoading('charging beneficiary...');
			if (chargeAmount > beneficiaryTokenBalance) {
				Swal.fire('Error', 'Charge Amount is greater than Beneficiary balance', 'error');
				showLoading(null);
			}
			const agency = await DataService.getDefaultAgency();
			const rahat = RahatService(agency.address, wallet);
			const tx = await rahat.chargeCustomerForERC20(projectId, beneficiaryPhone, chargeAmount);
			console.log({ tx });
			setTokenAmount(chargeAmount);
			history.push(`/charge/${beneficiaryPhone}/otp/${CHARGE_TYPES.TOKEN}`);
			showLoading(null);
		} catch (e) {
			console.log(e);
			showLoading(null);
		}
	};

	const handleChargeAmtChange = e => {
		setChargeAmount(e.target.value);
	};

	const fetchBeneficiaryTokenBalance = useCallback(async () => {
		console.log('ASD');
		if (!beneficiaryPhone) return;
		const agency = await DataService.getDefaultAgency();
		const { data: benData } = await checkBeneficiary(beneficiary);
		if (!benData?.projects) return;
		setProjectId(benData.projects[0]);
		const rahat = RahatService(agency.address, wallet);
		const tokenBalance = await rahat.getBeneficiaryBalance(benData.projects[0], beneficiaryPhone);
		console.log({ tokenBalance });
		setBeneficiaryTokenBalance(tokenBalance.toNumber());
	}, [beneficiaryPhone, wallet, beneficiary]);

	const setChargeAmountFromQuery = useCallback(() => {
		if (queryAmount) setChargeAmount(queryAmount);
	}, [queryAmount]);

	useEffect(() => {
		(async () => {
			if (beneficiary) setBeneficiaryPhone(beneficiary);
		})();
	}, []);

	useEffect(() => {
		setChargeAmountFromQuery();
	}, [setChargeAmountFromQuery]);

	useEffect(() => {
		fetchBeneficiaryTokenBalance();
	}, [fetchBeneficiaryTokenBalance]);

	return (
		<>
			<Loading showModal={loading !== null} message={loading} />
			<AppHeader currentMenu="Charge" />
			<div id="appCapsule">
				<div id="cmpMain">
					<div className="section mt-2 mb-5">
						<div className="text-center">
							<h2 class="text-primary ">{beneficiaryPhone}</h2>
						</div>

						<div className="card mt-2">
							<div className="card-header">Tokens</div>

							<div className="card-body">
								<form>
									<div className="form-group boxed" style={{ padding: 0 }}>
										<div className="input-wrapper">
											<label className="label" htmlFor="chargeAmount">
												Amount to Charge: ({' '}
												<span className="text-right">
													Chargable Amount: <strong>{beneficiaryTokenBalance || 0}</strong>
												</span>
												)
											</label>
											<input
												onChange={handleChargeAmtChange}
												value={chargeAmount}
												type="number"
												className="form-control"
												id="chargeAmount"
												name="chargeAmount"
												placeholder="Enter amount to charge"
											/>
											<i className="clear-input">
												<IoCloseCircle className="ion-icon" />
											</i>
										</div>
									</div>
									<div className="mt-3">
										<br />
										<small>Important: Please double check the amount before charging</small>
									</div>
								</form>
							</div>
							<div className="card-footer text-right">
								<button
									type="button"
									id="btncharge"
									className="btn btn-success"
									onClick={handleChargeClick}
									disabled={!chargeAmount}
								>
									<IoSendOutline className="ion-icon" /> Charge
								</button>
							</div>
						</div>

						{/* <div className="card mt-3">
							<div className="card-header">Packages</div>

							<div class="card-body">
								<PackageList packages={packages} beneficiary={beneficiaryPhone} />
							</div>
						</div> */}
					</div>
				</div>
			</div>
		</>
	);
}
