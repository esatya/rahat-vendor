import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { BiReset } from 'react-icons/bi';
import Webcam from 'react-webcam';
import { IoChevronForwardOutline, IoSyncOutline, IoRadioButtonOff } from 'react-icons/io5';

import DataService from '../../services/db';

export default function Main() {
	const history = useHistory();
	const [videoConstraints, setVideoConstraints] = useState({
		facingMode: 'user',
		forceScreenshotSourceSize: true,
		screenshotQuality: 1,
		minScreenshotWidth: 1024
	});
	const [previewImage, setPreviewImage] = useState('');

	const webcamRef = React.useRef(null);
	const camContainerRef = React.useRef();
	//const { width, height } = useResize(camContainerRef);

	const handleFaceChange = () => {
		const { facingMode } = videoConstraints;
		const face = facingMode === 'environment' ? 'user' : 'environment';
		setVideoConstraints({ ...videoConstraints, facingMode: face });
	};

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

	const skip = async event => {
		event.preventDefault();
		history.push('/setup/idcard');
	};

	useEffect(() => {
		setVideoConstraints({
			facingMode: 'user',
			forceScreenshotSourceSize: true,
			screenshotQuality: 1,
			minScreenshotWidth: 1024
		});
		return function cleanup() {};
	}, []);

	return (
		<>
			<div className="section">
				<div className="text-center p-2">
					<img src="/assets/img/brand/logo-512.png" alt="alt" width="130" />
				</div>
				<div className="card1">
					<div className="card-body text-center" ref={camContainerRef}>
						<h2 className="mb-1">
							Take a selfie
							<small>
								<br />
								Remember to smile :-)
							</small>
						</h2>

						{previewImage ? (
							<img className="video-flipped circleSelfie mt-4" alt="preview" src={previewImage} />
						) : (
							<div className="selfieWrapper mt-3">
								<Webcam
									audio={false}
									ref={webcamRef}
									height={720}
									width="100%"
									minScreenshotWidth={1024}
									minScreenshotHeight={720}
									screenshotFormat="image/png"
									videoConstraints={videoConstraints}
									className="circleSelfie"
								/>
							</div>
						)}
					</div>
				</div>
				<div className="pl-4 pr-4">
					{previewImage ? (
						<div className="text-center">
							<button
								type="button"
								className="btn btn-lg btn-block btn-outline-primary mt-1"
								onClick={() => setPreviewImage(null)}
							>
								<BiReset className="ion-icon" />
								Retake Picture
							</button>
							<button type="button" className="btn btn-lg btn-block btn-success mt-3 mb-5" onClick={save}>
								Continue to next step
							</button>
						</div>
					) : (
						<div className="d-flex justify-content-between align-items-center">
							<div className="btn-faceChange" onClick={handleFaceChange}>
								<IoSyncOutline className="btn-flipcamera" />
							</div>
							<div className="btn-shutter" onClick={capture}>
								<IoRadioButtonOff className="btn-shutter-icon" />
							</div>
							<div className="btn-faceChange" onClick={skip}>
								<IoChevronForwardOutline className="btn-skip" />
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
