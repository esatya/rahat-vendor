import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IoRadioButtonOff } from 'react-icons/io5';
import { BiReset } from 'react-icons/bi';
import Webcam from 'react-webcam';
import Swal from 'sweetalert2';
import Loading from '../global/Loading';
import Wallet from '../../utils/blockchain/wallet';
import { AppContext } from '../../contexts/AppContext';
import DataService from '../../services/db';
import api from '../../constants/api';

export default function Main() {
	const history = useHistory();
	const { setHasWallet, setWallet, setAgency } = useContext(AppContext);
	const [loading, showLoading] = useState(null);
	const [videoConstraints, setVideoConstraints] = useState({
		facingMode: 'environment',
		forceScreenshotSourceSize: true,
		screenshotQuality: 1,
		width: 1280,
		height: 720
	});
	const [previewImage, setPreviewImage] = useState('');
	const [showPageLoader, setShowPageLoader] = useState(true);
	const webcamRef = React.useRef(null);

	const capture = () => {
		const imageSrc = webcamRef.current.getScreenshot();
		setPreviewImage(imageSrc);
	};

	const registerWithAgency = async data => {
		let appData = await fetch(`${api.APP}/settings`).then(r => {
			if (!r.ok) throw Error(r.message);
			return r.json();
		});

		const agencyData = {
			api: process.env.REACT_APP_DEFAULT_AGENCY_API,
			address: appData.agency.contracts.rahat,
			adminAddress: appData.agency.contracts.rahat_admin,
			network: appData.networkUrl,
			tokenAddress: appData.agency.contracts.rahat_erc20,
			nftAddress: appData.agency.contracts.rahat_erc1155,
			name: appData.agency.name,
			email: appData.agency.email,
			isApproved: false
		};
		await DataService.addAgency(agencyData);
		setAgency(agencyData);
		if (!data.email) delete data.email;

		await fetch(`${api.VENDORS}/register`, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then(r => {
			if (!r.ok) throw Error(r.message);
			return r.json();
		});

		return agencyData;
	};

	const save = async event => {
		event.preventDefault();
		try {
			showLoading('Creating new wallet...');
			const wallet = await DataService.getWallet();
			if (wallet) {
				history.push('/');
				return;
			}
			const profile = await DataService.get('profile');
			if (!profile.phone) {
				showLoading(null);
				history.push('/setup/profile');
				return;
			}
			await DataService.saveProfileIdCard(previewImage);
			let profileImage = await DataService.get('profileImage');

			const res = await Wallet.create(profile.phone);
			if (res) {
				const { wallet, encryptedWallet } = res;
				showLoading('Registering with the agency...');
				await registerWithAgency({
					wallet_address: wallet.address,
					name: profile.name,
					phone: profile.phone,
					email: profile.email,
					address: profile.address,
					photo: profileImage,
					govt_id_image: previewImage
				});
				await DataService.saveWallet(encryptedWallet);
				await DataService.saveAddress(wallet.address);
				await DataService.setSynchronized(true);

				setWallet(wallet);
				setHasWallet(true);
				showLoading(null);
				history.push('/wallet/backup');
			}
		} catch (err) {
			console.log(err);
			Swal.fire('ERROR', err.message, 'error');
			showLoading(null);
		}
	};

	useEffect(() => {
		setVideoConstraints({
			facingMode: 'environment',
			forceScreenshotSourceSize: true,
			screenshotQuality: 1,
			width: 1280,
			height: 720
		});
		return function cleanup() {};
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowPageLoader(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			{showPageLoader ? (
				<div id="loader">
					<img src="/assets/img/brand/icon-white-128.png" alt="icon" className="loading-icon" />
				</div>
			) : (
				<>
					<Loading message={loading} showModal={loading !== null} />
					<div className="section">
						<div className="text-center p-2">
							<img src="/assets/img/brand/g20-logo.png" alt="alt" width="130" />
						</div>
						<div className="card1">
							<div className="card-body text-center">
								<h3>
									Take a picture of your ID card
									<small>
										<br />
										Citizenship, Passport, License or National ID
									</small>
								</h3>

								{previewImage ? (
									<img
										alt="preview"
										src={previewImage}
										style={{
											borderRadius: '10px',
											width: '100%',
											height: '300px',
											border: '3px solid #958d9e',
											marginTop: '30px'
										}}
									/>
								) : (
									<div className="idCardWrapper mt-4">
										<Webcam
											audio={false}
											ref={webcamRef}
											height={720}
											width="100%"
											minScreenshotWidth={1024}
											minScreenshotHeight={720}
											screenshotFormat="image/png"
											videoConstraints={videoConstraints}
											className="idCardSnapper"
										/>
									</div>
								)}
							</div>
						</div>
						<div className="pl-3 pr-3">
							{previewImage ? (
								<div>
									<div className="text-center">
										<button
											type="button"
											className="btn btn-lg btn-block btn-outline-primary mt-1"
											onClick={() => setPreviewImage(null)}
										>
											<BiReset className="ion-icon" />
											Retake Picture
										</button>
										<button
											type="button"
											className="btn btn-lg btn-block btn-success mt-3 mb-2"
											onClick={save}
										>
											Complete setup
										</button>
									</div>
									<p className="text-privacy">
										By signing up you acknowledge the{' '}
										<a href="https://docs.rahat.io/privacy-policy" className="privacy-policy">
											Privacy Policy
										</a>{' '}
										.
									</p>
								</div>
							) : (
								<div className="d-flex justify-content-between align-items-center mt-1 mb-3">
									<div style={{ width: '40px', height: '40px' }}></div>
									<div className="btn-shutter" onClick={capture}>
										<IoRadioButtonOff className="btn-shutter-icon" />
									</div>
									<div style={{ width: '40px', height: '40px' }}></div>
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
}
