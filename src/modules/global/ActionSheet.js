import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function ActionSheet(props) {
	const { handleSubmit, modalSize, showModal, title, onHide, onShow } = props;
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
							<div className="form-group basic">
								<button
									type="button"
									className="btn btn-primary btn-block btn-lg"
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
