import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IoCloseCircle, IoSendOutline, IoQrCodeOutline } from 'react-icons/io5';

import { AppContext } from '../../contexts/AppContext';
import Loading from '../global/Loading';
import AppHeader from '../layouts/AppHeader';
import { APP_CONSTANTS } from '../../constants';

import DataService from '../../services/db';
import PackageList from '../package/packageList';
import { RahatService } from '../../services/chain';

const { SCAN_DELAY, SCANNER_PREVIEW_STYLE, SCANNER_CAM_STYLE } = APP_CONSTANTS;

export default function Index(props) {
	const { agency, wallet, setTokenBalance } = useContext(AppContext);
	let history = useHistory();
	let beneficiary= props.match.params.beneficiary;
	const [beneficiaryPhone, setBeneficiaryPhone] = useState('');
	const [loading, showLoading] = useState(null);
  const [chargeAmount,setChargeAmount] = useState(null);
  //const [tokenChargeData,setTokenChargeData] = useState()


  const handleChargeClick = async () => {
    try{
      showLoading("charging beneficiary...")
    	const agency = await DataService.getDefaultAgency();
			const rahat = RahatService(agency.address, wallet);
			let receipt = await rahat.chargeCustomerForERC20(beneficiaryPhone, chargeAmount);
			//setData({ chargeTxHash: receipt.transactionHash });
      console.log(receipt)
      history.push(`/charge/${beneficiaryPhone}/otp`)
      showLoading(null)
    console.log('charging')
    }
    catch(e){
      showLoading(null)
      console.log(e);
    }
  }

  const handleChargeAmtChange = e => {
		setChargeAmount(e.target.value);
	};

	useEffect(() => {
		(async () => {
			if (beneficiary) setBeneficiaryPhone(beneficiary);
		})();
	}, [beneficiary]);


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
              <div className='card-header'>
                Tokens

              </div>
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
										<small>
											Important: Please double check the amount before charging
										</small>
									</div>
								</form>
							</div>
							<div className="card-footer text-right">
								<button
									type="button"
									id="btncharge"
									className="btn btn-success"
									onClick={handleChargeClick}
								>
									<IoSendOutline className="ion-icon" /> Charge
								</button>
							</div>
						</div>


            <div className="card mt-3">
            <div className='card-header'>
                Packages

              </div>

              <div class="card-body">

                <PackageList/>
                {/* <ul class="listview flush transparent image-listview">
                    <li>
                        <a href="#" class="item">
                            <div class="icon-box bg-primary">
                                <ion-icon name="card-outline" role="img" class="md hydrated" aria-label="card outline"></ion-icon>
                            </div>
                            <div class="in">
                                Package 1
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="item">
                            <div class="icon-box bg-danger">
                                <ion-icon name="cash-outline" role="img" class="md hydrated" aria-label="cash outline"></ion-icon>
                            </div>
                            <div class="in">
                                <div>Package 2</div>
                                <span class="text-muted">Text</span>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="item">
                            <div class="icon-box bg-success">
                                <ion-icon name="wallet-outline" role="img" class="md hydrated" aria-label="wallet outline"></ion-icon>
                            </div>
                            <div class="in">
                                <div>Package 3</div>
                            </div>
                        </a>
                    </li>
                </ul> */}
            </div>



</div>

					</div>
				</div>
			</div>
		</>
	);
}
