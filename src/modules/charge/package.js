import React, { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import { IoCloseCircle, IoSendOutline, IoQrCodeOutline } from 'react-icons/io5';

import { AppContext } from '../../contexts/AppContext';
import Loading from '../global/Loading';
import AppHeader from '../layouts/AppHeader';
import DataService from '../../services/db';
import { RahatService } from '../../services/chain';
import {getPackageDetails} from '../../services'
import {IPFSLIST} from '../../constants/ipfs'


export default function ChargePackage(props) {
	const { wallet } = useContext(AppContext);
	let history = useHistory();
	let beneficiary= props.match.params.beneficiary;
  let tokenId = props.match.params.tokenId;
	const rumsanIpfs = IPFSLIST.find(el => el.name = 'rumsan')
	const [beneficiaryPhone, setBeneficiaryPhone] = useState('');
	const [loading, showLoading] = useState(null);
	const [pkg,setPkg] = useState({});


const handlePackageCharge = () => {
  console.log("charasdasdge")
}


useEffect(() => {
  (async () => {

    const agency = await DataService.getDefaultAgency();
    const rahat = RahatService(agency.address, wallet);
    
      const data = await getPackageDetails(tokenId);
      console.log(data);
			setPkg({tokenId:data.tokenId,
				name:data.name,
				symbol:data.symbol,
				description:data.metadata.description,
				value:data.metadata.fiatValue,
				imageUri:`${rumsanIpfs.view}/ipfs/${data.metadata.packageImgURI}`})   
  })();
}, []);

	return (
		<>
		
			<Loading showModal={loading !== null} message={loading} />
			<AppHeader currentMenu="Charge Package" />

      <div id="appCapsule" className="full-height">
				<div className="section mt-2 mb-2">
					<div className="listed-detail mt-3">
						<div className="text-center">
							<img src={pkg.imageUri} width='100' height='100' alt="asset" className="image" />
						</div>

						<h3 className="text-center mt-2">wwww</h3>
					</div>

					<ul className="listview flush transparent simple-listview no-space mt-3">
						<li>
							<strong>Name:</strong>
							<span>{pkg.name}</span>
						</li>
						<li>
							<strong>Symbol:</strong>
							<span>{pkg.symbol}</span>
						</li>
						<li>
							<strong>Description</strong>
							<span>{pkg.description}</span>
						</li>
						<li>
							<strong>Value in fiat:</strong>
							<span>
								<span>{pkg.value}</span>
							</span>
						</li>
					
					</ul>

<div className='text-right mt-3'>
<button
									type="button"
									id="btncharge"
									className="btn btn-success"
									onClick={handlePackageCharge}
								>
									<IoSendOutline className="ion-icon" /> charge
								</button>
</div>
				
				</div>
				
			</div>
		
		</>  );
    }
