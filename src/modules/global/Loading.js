import React from 'react';
import { Modal } from 'react-bootstrap';

export default function Loading({ showModal, message }) {
	return (
		<>
			<Modal backdrop="static" style={{ marginTop: 100 }} show={showModal || false}>
				<Modal.Body>
					<div className="text-center">
						<div className="spinner-border text-success mt-5 in-progress" role="status"></div>
						<div>{message || 'Please wait...'}</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
