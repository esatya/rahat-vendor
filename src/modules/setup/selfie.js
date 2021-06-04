import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { IoCloseCircle, IoCamera } from 'react-icons/io5';
import { BiReset } from 'react-icons/bi';
import Webcam from 'react-webcam';

import AppHeader from '../layouts/AppHeader';
import { AppContext } from '../../contexts/AppContext';
import { useResize } from '../../utils/react-utils';
import DataService from '../../services/db';

export default function Main() {
	const history = useHistory();
	const { hasWallet, wallet } = useContext(AppContext);
	const [videoConstraints, setVideoConstraints] = useState({
		width: 350,
		height: 350,
		facingMode: 'user'
	});
	const [previewImage, setPreviewImage] = useState('');

	const webcamRef = React.useRef(null);
	const camContainerRef = React.useRef();
	//const { width, height } = useResize(camContainerRef);

	const capture = () => {
		const imageSrc = webcamRef.current.getScreenshot();
		// fetch(imageSrc)
		// 	.then(res => {
		// 		const result = res.blob();
		// 		resolve(result);
		// 	})
		// 	.catch(err => reject(err));
		setPreviewImage(imageSrc);
	};

	const save = async event => {
		event.preventDefault();
		await DataService.saveProfileImage(previewImage);
		history.push('/setup/idcard');
	};

	useEffect(() => {
		setVideoConstraints({
			width: camContainerRef.current.offsetWidth * 0.84,
			height: camContainerRef.current.offsetWidth * 0.84,
			facingMode: 'user'
		});
	}, []);

	return (
		<>
			<div class="section">
				<div className="text-center p-2">
					<img src="/assets/img/brand/logo-512.png" alt="alt" width="130" />
				</div>
				<div class="card1">
					<div class="card-body text-center" ref={camContainerRef}>
						<h3 class="mb-2">
							Take a selfie
							<small>
								<br />
								Remember to smile :-)
							</small>
						</h3>

						{previewImage ? (
							<img
								className="video-flipped"
								alt="preview"
								src={previewImage}
								style={{ borderRadius: '100%', width: '100%', border: '3px solid #958d9e' }}
							/>
						) : (
							<Webcam
								className="video-flipped"
								audio={false}
								ref={webcamRef}
								screenshotFormat="image/jpeg"
								videoConstraints={videoConstraints}
								style={{ borderRadius: '100%', border: '5px solid #958d9e' }}
							/>
						)}
					</div>
				</div>
				<div className="pl-5 pr-5">
					{previewImage ? (
						<div className="text-center">
							<button type="button" className="btn btn-lg btn-block btn-success mt-1" onClick={save}>
								Continue to next step
							</button>
							<button
								type="button"
								className="btn btn btn-block btn-outline-secondary mt-5"
								style={{ width: 200 }}
								onClick={() => setPreviewImage(null)}
							>
								<BiReset className="ion-icon" />
								Retake Picture
							</button>
						</div>
					) : (
						<button type="button" className="btn btn-lg btn-block btn-dark mt-1" onClick={capture}>
							<IoCamera className="ion-icon" />
							Take Picture
						</button>
					)}
				</div>
			</div>
		</>
	);
}
