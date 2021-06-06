import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function ImageViewer(props) {
	const { showModal, handleDownloadClick, handleRemoveDocClick, children, onHide, documentName } = props;
	return (
		<>
			<Modal
				className="modal fade stories"
				id="StoryDefault"
				tabIndex={-1}
				role="dialog"
				show={showModal}
				onHide={onHide}
				size="lg"
			>
				<Modal.Body style={{ padding: 0 }}>{children}</Modal.Body>
				<Modal.Footer style={{ padding: 0, justifyContent: 'space-between' }}>
					<div style={{ float: 'left' }}>{documentName}</div>
					<div>
						<Button onClick={handleRemoveDocClick} className="btn-sm" variant="danger">
							Remove
						</Button>
						&nbsp;
						<Button
							className="btn-sm"
							type="button"
							onClick={e => handleDownloadClick(e)}
							variant="primary"
						>
							Download
						</Button>
					</div>
				</Modal.Footer>
			</Modal>
		</>
	);
}

ImageViewer.propTypes = {
	onHide: PropTypes.func.isRequired,
	showModal: PropTypes.bool.isRequired
};
