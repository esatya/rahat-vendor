import React, { useContext, useState, useEffect } from 'react';
import { IoCloseCircle } from 'react-icons/io5';

import AppHeader from '../layouts/AppHeader';
import { NETWORKS, getNetworkByName } from '../../constants/networks';
import { AppContext } from '../../contexts/AppContext';
import Wallet from '../../utils/blockchain/wallet';
import DataService from '../../services/db';

export default function Network() {
	const { wallet, setWallet, setNetwork, network } = useContext(AppContext);
	const [customNetworkUrl, setCustomNetworkUrl] = useState('');
	const [isCustom, setIsCustom] = useState(false);
	const [currentNetworkName, setCurrentNetworkName] = useState(null);
	const [networkUpdateStatus, setNetworkUpdateStatus] = useState('');

	const changeCurrentNetwork = async (name, url) => {
		let selNetwork = null;
		if (name === 'custom') {
			setIsCustom(true);
			selNetwork = { name: 'custom', url, display: 'Custom Network' };
		} else {
			setIsCustom(false);
			selNetwork = getNetworkByName(name);
		}

		//setCurrentNetworkName(network);
		await DataService.saveNetwork(selNetwork);
		await DataService.updateAsset('default', { balance: 0 });
		setNetwork(selNetwork);
		if (wallet) {
			let newWallet = await Wallet.connectProvider(wallet, selNetwork);
			setWallet(newWallet);
		}
	};

	const handleCustomUrlChange = e => {
		setCustomNetworkUrl(e.target.value);
		changeCurrentNetwork('custom', e.target.value);
		networkUpdateSuccess();
	};

	const networkUpdateSuccess = () => {
		setNetworkUpdateStatus('success');
	};

	const handleNetworkChange = e => {
		const { value } = e.target;
		changeCurrentNetwork(value);
		networkUpdateSuccess();
	};

	useEffect(() => {
		async function currentNetwork() {
			let currentNetwork = network || (await DataService.getNetwork());
			const { name, url } = currentNetwork;
			if (name === 'custom') {
				setCustomNetworkUrl(url);
				setIsCustom(true);
			}
			setCurrentNetworkName(name);
		}
		currentNetwork();
	}, [network]);

	return (
		<>
			<AppHeader currentMenu="Networks" />
			<div id="appCapsule">
				<div id="cmpMain">
					<div className="section full mt-2">
						<div className="section-title">Select an Network:</div>
						<div className="content-header mb-05">
							Please note: changing network will show current balance of only the active network
						</div>
					</div>
					<div className="section full mb-2" id="cmpNetwork">
						<div className="section-title">Available Networks </div>
						<div className="wide-block p-0">
							<form autoComplete="off">
								<div className="input-list">
									{NETWORKS.length &&
										NETWORKS.map(network => {
											return (
												<div key={network.name} className="custom-control custom-radio">
													<input
														checked={
															currentNetworkName && currentNetworkName === network.name
																? true
																: false
														}
														type="radio"
														id={network.name}
														name="selNetwork"
														onChange={handleNetworkChange}
														value={network.name}
														className="custom-control-input active"
													/>
													<label className="custom-control-label" htmlFor={network.name}>
														{network.display}
													</label>
												</div>
											);
										})}
									<div className="custom-control custom-radio">
										<input
											checked={
												currentNetworkName && currentNetworkName === 'custom' ? true : false
											}
											type="radio"
											id="custom"
											name="selNetwork"
											value="custom"
											onChange={handleNetworkChange}
											className="custom-control-input"
										/>
										<label className="custom-control-label" htmlFor="custom">
											Custom Network
										</label>
									</div>
								</div>
								{isCustom && (
									<div className="form-group boxed" id="cmpNetworkUrl" style={{ display: 's' }}>
										<div className="input-wrapper" style={{ margin: '0px 55px' }}>
											<label className="label" htmlFor="customNetworkUrl">
												Enter Network Url
											</label>
											<input
												type="text"
												className="form-control"
												id="customNetworkUrl"
												name="customNetworkUrl"
												value={customNetworkUrl}
												onChange={handleCustomUrlChange}
												placeholder="Ethereum network gateway url"
												autoComplete="off"
											/>
											<i className="clear-input">
												<IoCloseCircle className="ion-icon" />
											</i>
										</div>
									</div>
								)}
								{networkUpdateStatus === 'success' && (
									<div style={{ padding: 20, color: 'green' }}>Network updated successfully.</div>
								)}
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
