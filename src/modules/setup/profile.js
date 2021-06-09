import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IoCloseCircle } from 'react-icons/io5';
import { Form, Button } from 'react-bootstrap';

import DataService from '../../services/db';

export default function Main() {
	const history = useHistory();
	const [profile, setProfile] = useState({ name: '', phone: '', address: '', email: '' });

	const save = async event => {
		event.preventDefault();
		await DataService.saveProfile(profile);
		history.push('/setup/selfie');
	};

	const updateProfile = e => {
		let formData = new FormData(e.target.form);
		let data = {};
		formData.forEach((value, key) => (data[key] = value));
		data.phone = data.phone.replace(/[^0-9]/g, '');
		setProfile(data);
	};

	useEffect(() => {
		(async () => {
			let profile = await DataService.get('profile');
			if (profile) setProfile(profile);
		})();
	}, []);

	return (
		<>
			<div className="section mt-2">
				<div className="text-center p-5 mb-3">
					<img src="/assets/img/brand/logo-512.png" alt="alt" width="200" />
				</div>
				<Form onSubmit={save}>
					<div className="card">
						<div className="card-body">
							<div className="form-group basic">
								<div className="input-wrapper">
									<label className="label">Full Name</label>
									<Form.Control
										type="text"
										name="name"
										className="form-control"
										placeholder="Enter your full name"
										value={profile.name}
										onChange={updateProfile}
										required
									/>
									<i className="clear-input">
										<IoCloseCircle className="ion-icon" />
									</i>
								</div>
							</div>

							<div className="form-group basic">
								<div className="input-wrapper">
									<label className="label">Phone #</label>
									<Form.Control
										type="number"
										className="form-control"
										name="phone"
										placeholder="Enter mobile number"
										value={profile.phone}
										onChange={updateProfile}
										onKeyDown={e => {
											if (['-', '+', 'e'].includes(e.key)) {
												e.preventDefault();
											}
										}}
										required
									/>
									<i className="clear-input">
										<IoCloseCircle className="ion-icon" />
									</i>
								</div>
							</div>
							<div className="form-group basic">
								<div className="input-wrapper">
									<label className="label">Address</label>
									<Form.Control
										type="text"
										className="form-control"
										name="address"
										placeholder="Enter your address"
										value={profile.address}
										onChange={updateProfile}
										required
									/>
									<i className="clear-input">
										<IoCloseCircle className="ion-icon" />
									</i>
								</div>
							</div>
							<div className="form-group basic">
								<div className="input-wrapper">
									<label className="label">Email Address</label>
									<Form.Control
										type="email"
										className="form-control"
										name="email"
										placeholder="Enter email"
										value={profile.email}
										onChange={updateProfile}
									/>
									<i className="clear-input">
										<IoCloseCircle className="ion-icon" />
									</i>
								</div>
							</div>
						</div>
					</div>
					<div className="p-2">
						<Button type="submit" className="btn btn-lg btn-block btn-success mt-3">
							Continue
						</Button>
					</div>
				</Form>
			</div>
		</>
	);
}
