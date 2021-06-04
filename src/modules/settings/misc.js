import React, { useState, useEffect } from 'react';
import AppHeader from '../layouts/AppHeader';
import DataService from '../../services/db';

export default function ImportToken() {
	const [ipfs, setIpfs] = useState(null);
	const [ipfsDownload, setIpfsDownload] = useState(null);

	const changeIpfs = async e => {
		const { value } = e.target;
		setIpfs(value);
		if (value.length > 5) DataService.saveIpfsUrl(value);
		else DataService.saveIpfsUrl(null);
	};

	const changeIpfsDownload = async e => {
		const { value } = e.target;
		setIpfsDownload(value);
		if (value.length > 5) DataService.saveIpfsDownloadUrl(value);
		else DataService.saveIpfsDownloadUrl(null);
	};

	useEffect(() => {
		(async () => {
			let { ipfsUrl, ipfsDownloadUrl } = await DataService.getIpfs();
			setIpfs(ipfsUrl);
			setIpfsDownload(ipfsDownloadUrl);
		})();
	}, []);

	return (
		<>
			<AppHeader currentMenu="Settings" />
			<div id="appCapsule">
				<div id="cmpMain">
					<div className="section mt-2 mb-5">
						<div className="card mt-5" id="cmpTransfer">
							<div className="card-body">
								<div className="form-group boxed" style={{ padding: 0 }}>
									<div className="input-wrapper">
										<label className="label">IPFS Upload Url:</label>
										<div className="input-group mb-3">
											<input
												type="text"
												className="form-control"
												placeholder="Enter full IPFS url (eg: http://localhost:5001)"
												value={ipfs}
												onChange={changeIpfs}
											/>
										</div>
									</div>
								</div>
								<div className="form-group boxed" style={{ padding: 0 }}>
									<div className="input-wrapper">
										<label className="label">IPFS Download Url:</label>
										<div className="input-group mb-3">
											<input
												type="text"
												className="form-control"
												placeholder="Enter IPFS download url (eg: http://localhost:8080/ipfs)"
												value={ipfsDownload}
												onChange={changeIpfsDownload}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
