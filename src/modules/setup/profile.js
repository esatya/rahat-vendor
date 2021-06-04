import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { IoCloseCircle } from 'react-icons/io5';
import { Form, Button } from 'react-bootstrap';

import AppHeader from '../layouts/AppHeader';
import { AppContext } from '../../contexts/AppContext';
import DataService from '../../services/db';

export default function Main() {
	const history = useHistory();
	const { hasWallet, wallet } = useContext(AppContext);
	const [profile, setProfile] = useState({ fullName: '', phone: '', address: '', email: '' });

	const save = async event => {
		event.preventDefault();
		await DataService.addAgency({
			address: '0x8a76Af78E800a38ca05E2A4490FE5247cBffe248',
			tokenAddress: '0xc367a378CE8358885CA6ea23c6311366F5707176',
			name: 'Rumsan Group',
			isRegistered: false
		});
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
			<div class="section mt-2">
				<div className="text-center p-5 mb-3">
					<img src="/assets/img/brand/logo-512.png" alt="alt" width="200" />
				</div>
				<Form onSubmit={save}>
					<div class="card">
						<div class="card-body">
							<div class="form-group basic">
								<div class="input-wrapper">
									<label class="label" for="userid1">
										Full Name
									</label>
									<Form.Control
										type="text"
										name="fullName"
										class="form-control"
										placeholder="Enter your full name"
										value={profile.fullName}
										onChange={updateProfile}
										required
									/>
									<i class="clear-input">
										<IoCloseCircle className="ion-icon" />
									</i>
								</div>
							</div>

							<div class="form-group basic">
								<div class="input-wrapper">
									<label class="label" for="userid1">
										Phone #
									</label>
									<Form.Control
										type="number"
										class="form-control"
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
									<i class="clear-input">
										<IoCloseCircle className="ion-icon" />
									</i>
								</div>
							</div>
							<div class="form-group basic">
								<div class="input-wrapper">
									<label class="label" for="userid1">
										Address
									</label>
									<Form.Control
										type="text"
										class="form-control"
										name="address"
										placeholder="Enter your address"
										value={profile.address}
										onChange={updateProfile}
										required
									/>
									<i class="clear-input">
										<IoCloseCircle className="ion-icon" />
									</i>
								</div>
							</div>
							<div class="form-group basic">
								<div class="input-wrapper">
									<label class="label" for="userid1">
										Email Address (optional)
									</label>
									<Form.Control
										type="email"
										class="form-control"
										name="email"
										placeholder="Enter email"
										value={profile.email}
										onChange={updateProfile}
									/>
									<i class="clear-input">
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
