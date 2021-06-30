import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function ModalWrapper(props) {
	const { btnText, handleSubmit, modalSize, showModal, title, onHide, onShow } = props;
	return (
		<>
			<Modal size={modalSize || 'md'} show={showModal || false} onHide={onHide} onShow={onShow}>
				{title && (
					<Modal.Header>
						<Modal.Title style={{ fontSize: 14 }}>{title}</Modal.Title>
					</Modal.Header>
				)}

				<Modal.Body>{props.children}</Modal.Body>
				{props.showFooter && (
					<Modal.Footer>
						<Button variant="primary" onClick={handleSubmit}>
							{btnText || 'Save Changes'}
						</Button>
					</Modal.Footer>
				)}
			</Modal>
		</>
	);
}

ModalWrapper.propTypes = {
	showModal: PropTypes.bool.isRequired
};
