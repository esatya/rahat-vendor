import React, { useContext } from 'react';
import { Modal, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { ActionSheetContext } from '../../contexts/ActionSheetContext';

export default function ActionSheet(props) {
	const { handleSubmit, modalSize, showModal, title, onHide, onShow, buttonName } = props;
	const { loading } = useContext(ActionSheetContext);
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
					{loading !== null && (
						<div
							style={{
								position: 'absolute',
								color: '#ffffff',
								fontSize: 16,
								backgroundColor: '#000',
								opacity: 0.7,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								zIndex: 1000,
								left: 0,
								top: 0,
								right: 0,
								bottom: 0
							}}
						>
							<div className="text-center">
								<img
									src="/assets/img/brand/icon-white-128.png"
									alt="icon"
									className="loading-icon"
									style={{ width: 30 }}
								/>
								<br />
								<div className="mt-1">{loading}</div>
							</div>
						</div>
					)}
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
