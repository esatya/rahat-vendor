import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IoCamera } from 'react-icons/io5';
import { BiReset } from 'react-icons/bi';
import Webcam from 'react-webcam';

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
						<h3 className="mb-2">
							Take a selfie
							<small>
								<br />
								Remember to smile :-)
							</small>
						</h3>

						{previewImage ? (
							<img className="video-flipped circleSelfie" alt="preview" src={previewImage} />
						) : (
							<div className="selfieWrapper">
								<Webcam
									audio={false}
									ref={webcamRef}
									className="circleSelfie"
									minScreenshotWidth={1024}
									minScreenshotHeight={720}
									screenshotFormat="image/png"
									videoConstraints={videoConstraints}
								/>
							</div>
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
