import React from 'react';
import { Modal, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function ActionSheet(props) {
	const { handleSubmit, modalSize, showModal, title, onHide, onShow, buttonName } = props;
	return (
		<>
			<Modal
				className="modal fade action-sheet"
				size={modalSize || 'md'}
				show={showModal || false}
				onHide={onHide}
				onShow={onShow}
				role="dialog"
			>
				{title && (
					<Modal.Header>
						<Modal.Title>{title}</Modal.Title>
					</Modal.Header>
				)}

				<Modal.Body>
					<Form>
						<div className="action-sheet-content">
							{props.children}
							<div className="form-group basic">
								<button
									type="button"
									onClick={handleSubmit}
									className="btn btn-primary btn-block btn-lg"
								>
									{buttonName}
								</button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}

ActionSheet.propTypes = {
	showModal: PropTypes.bool.isRequired
};
