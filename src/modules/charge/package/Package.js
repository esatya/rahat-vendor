import React, { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import { IoSendOutline } from 'react-icons/io5';

import { AppContext } from '../../../contexts/AppContext';
import { ChargeContext } from '../../../contexts/ChargeContext';

import Loading from '../../global/Loading';
import AppHeader from '../../layouts/AppHeader';
import DataService from '../../../services/db';
import { RahatService } from '../../../services/chain';
import { getPackageDetails } from '../../../services';
import { IPFSLIST } from '../../../constants/ipfs';
import { APP_CONSTANTS } from '../../../constants';

export default function ChargePackage(props) {
	const { wallet } = useContext(AppContext);
	const { setNFTAmount, setNFTDetails } = useContext(ChargeContext);

	let history = useHistory();
	let beneficiary = props.match.params.beneficiary;
	let tokenId = props.match.params.tokenId;
	const rumsanIpfs = IPFSLIST.find(el => (el.name = 'rumsan'));

	const [loading, showLoading] = useState(null);
	const [pkg, setPkg] = useState({});

	const handleChargeClick = async () => {
		try {
			showLoading('charging beneficiary...');
			const agency = await DataService.getDefaultAgency();
			const rahat = RahatService(agency.address, wallet);
			await rahat.chargeCustomerForERC1155(beneficiary, APP_CONSTANTS.DEFAULT_NFT_CHARGE.toString(), tokenId);
			setNFTAmount(APP_CONSTANTS.DEFAULT_NFT_CHARGE.toString());
			setNFTDetails(pkg);
			history.push(`/charge/${beneficiary}/otp/${APP_CONSTANTS.CHARGE_TYPES.NFT}/${tokenId}`);
			showLoading(null);
		} catch (e) {
			showLoading(null);
			// console.log(e);
			Swal.fire({
				icon: 'error',
				title: 'Operation Failed'
			});
		}
	};

	useEffect(() => {
		(async () => {
			// const agency = await DataService.getDefaultAgency();
			// const rahat = RahatService(agency.address, wallet);
			const data = await getPackageDetails(tokenId);

			setPkg({
				tokenId: data.tokenId,
				name: data.name,
				symbol: data.symbol,
				description: data.metadata.description,
				value: data.metadata.fiatValue,
				imageUri: `${rumsanIpfs.view}/ipfs/${data.metadata.packageImgURI}`
			});
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
							<img src={pkg.imageUri} width="100" height="100" alt="asset" className="image" />
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

					<div className="text-right mt-3">
						<button type="button" id="btncharge" className="btn btn-success" onClick={handleChargeClick}>
							<IoSendOutline className="ion-icon" /> charge
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
