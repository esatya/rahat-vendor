import React, { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import { IoCloseCircle, IoSendOutline, IoQrCodeOutline } from 'react-icons/io5';

import { AppContext } from '../../contexts/AppContext';
import Loading from '../global/Loading';
import AppHeader from '../layouts/AppHeader';
import { APP_CONSTANTS } from '../../constants';
import { TokenService } from '../../services/chain';
import { isOffline } from '../../utils';
import DataService from '../../services/db';
import { RahatService } from '../../services/chain';

const { SCAN_DELAY, SCANNER_PREVIEW_STYLE, SCANNER_CAM_STYLE } = APP_CONSTANTS;

export default function Otp(props) {
	const { agency, wallet, setTokenBalance } = useContext(AppContext);
	let history = useHistory();
	let beneficiary= props.match.params.beneficiary;
	const [beneficiaryPhone, setBeneficiaryPhone] = useState('');
	const [loading, showLoading] = useState(null);
  const [otp,setOtp] = useState(null);
  //const [tokenChargeData,setTokenChargeData] = useState()


  const handleOTPSubmit = async () => {
    try{
      showLoading("verifying OTP...")
      const agency = await DataService.getDefaultAgency();
			const rahat = RahatService(agency.address, wallet);
	
			let receipt = await rahat.verifyChargeForERC20(Number(beneficiaryPhone), otp);
			//setData({ chargeTxHash: receipt.transactionHash });
      console.log(receipt)
     // history.push(`/charge/${beneficiaryPhone}/otp`)

      showLoading(null)
    }
    catch(e){
      showLoading(null)
      console.log(e);
    }
  }

  const handleOtpChange = e => {
		setOtp(e.target.value);
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
                OTP Verification

              </div>
							<div className="card-body">
								<form>
				
									<div className="form-group boxed" style={{ padding: 0 }}>
										<div className="input-wrapper">
											<label className="label" htmlFor="otp">
												OTP:
											</label>
											<input
												onChange={handleOtpChange}
												value={otp}
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
										<small>
											Please request the customer to provide OTP for verification.
										</small>
									</div>
								</form>
							</div>
							<div className="card-footer text-right">
								<button
									type="button"
									id="btncharge"
									className="btn btn-success"
									onClick={handleOTPSubmit}
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
