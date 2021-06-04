import React from 'react';
import { Modal, Form } from 'react-bootstrap';
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
					<Form>
						<div className="action-sheet-content">
							<form>
								{props.children}
								<div className="form-group basic">
									<button
										type="button"
										onClick={handleSubmit}
										className="btn btn-primary btn-block btn-lg"
									>
										Charge
									</button>
								</div>
							</form>
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
