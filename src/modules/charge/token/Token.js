import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IoCloseCircle, IoSendOutline, IoQrCodeOutline } from 'react-icons/io5';

import { AppContext } from '../../../contexts/AppContext';
import { ChargeContext } from '../../../contexts/ChargeContext';

import Loading from '../../global/Loading';
import AppHeader from '../../layouts/AppHeader';
import { APP_CONSTANTS } from '../../../constants';

import DataService from '../../../services/db';
import PackageList from '../../package/packageList';
import { RahatService } from '../../../services/chain';
import { getPackageDetails } from '../../../services';

const { SCAN_DELAY, SCANNER_PREVIEW_STYLE, SCANNER_CAM_STYLE, CHARGE_TYPES } = APP_CONSTANTS;

export default function Token(props) {
	const { wallet, setTokenBalance } = useContext(AppContext);
	const { setTokenAmount } = useContext(ChargeContext);
	let history = useHistory();
	let beneficiary = props.match.params.beneficiary;
	const [beneficiaryPhone, setBeneficiaryPhone] = useState('');
	const [loading, showLoading] = useState(null);
	const [chargeAmount, setChargeAmount] = useState(null);
	const [tokenIds, setTokenIds] = useState([]);
	const [packages, setPackages] = useState([]);
	//const [tokenChargeData,setTokenChargeData] = useState()

	const handleChargeClick = async () => {
		try {
			showLoading('charging beneficiary...');
			const agency = await DataService.getDefaultAgency();
			const rahat = RahatService(agency.address, wallet);
			await rahat.chargeCustomerForERC20(beneficiaryPhone, chargeAmount);
			//setData({ chargeTxHash: receipt.transactionHash });
			// console.log(receipt);
			setTokenAmount(chargeAmount);
			history.push(`/charge/${beneficiaryPhone}/otp/${CHARGE_TYPES.TOKEN}`);
			showLoading(null);
		} catch (e) {
			showLoading(null);
			// console.log(e);
		}
	};

	const handleChargeAmtChange = e => {
		setChargeAmount(e.target.value);
	};

	useEffect(() => {
		(async () => {
			if (beneficiary) setBeneficiaryPhone(beneficiary);
			const agency = await DataService.getDefaultAgency();
			const rahat = RahatService(agency.address, wallet);
			let tokenIds = await rahat.getBeneficiaryTokenIds(Number(beneficiary));
			tokenIds = tokenIds.map(t => t.toNumber());

			tokenIds.forEach(async el => {
				const data = await getPackageDetails(el);
				//tokenId,name,symbol,description,value,amount
				const pkg = {
					tokenId: data.tokenId,
					name: data.name,
					symbol: data.symbol,
					description: data.metadata && data.metadata.description ? data.metadata.description : '',
					value: data.metadata && data.metadata.fiatValue ? data.metadata.fiatValue : '',
					imageUri: data.metadata && data.metadata.packageImgURI ? data.metadata.packageImgURI : ''
				};
				setPackages(packages => [...packages, pkg]);
			});
		})();
	}, []);

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
												Amount to Charge:
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

						<div className="card mt-3">
							<div className="card-header">Packages</div>

							<div class="card-body">
								<PackageList packages={packages} beneficiary={beneficiaryPhone} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
