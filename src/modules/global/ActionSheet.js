import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function ActionSheet(props) {
	const { btnText, handleSubmit, modalSize, showModal, title, onHide, onShow } = props;
	return (
		<>
			<Modal
				className="modal fade action-sheet"
				size={modalSize || 'md'}
				show={showModal || false}
				onHide={onHide}
				onShow={onShow}
			>
				{title && (
					<Modal.Header>
						<Modal.Title>{title}</Modal.Title>
					</Modal.Header>
				)}

				<Modal.Body>
					<div className="action-sheet-content">
						<form>
							{props.children}
							<div class="form-group basic">
								<button
									type="button"
									class="btn btn-primary btn-block btn-lg"
									data-dismiss="modal"
									onClick={handleSubmit}
								>
									Charge
								</button>
							</div>
						</form>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}

ActionSheet.propTypes = {
	showModal: PropTypes.bool.isRequired
};
