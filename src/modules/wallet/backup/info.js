import React from 'react';
import { Link } from 'react-router-dom';

export default function Info({ togglePasscodeModal }) {
	return (
		<div id="appCapsule">
			<div className="section full mt-2">
				<div className="section-title" style={{ fontSize: 'larger' }}>
					Backup your wallet
				</div>
				<div className="content-header mb-05">
					<b style={{ color: 'red' }}>Important! Read very carefully.</b>
					<br />
					For the privacy and security, this application never sends any of your private key and wallet
					information to our or any of our server. This means that if you lose or reset your device, we won't
					be able to recover your wallet or any fund associated with it. Hence, creating backup of your wallet
					is very important. There are two ways to backup your wallet. You have complete control over your
					backups.
				</div>
				<div className="section-title">Option 1: Write down your 12 secret words (mnemonic).</div>
				<div className="content-header mb-05">
					This is the safest way to backup your wallet. Click the button below to reveal your secret words.
					Check no one is looking your screen. Make sure you write down in a paper (or save in an encrypted
					file) and store safely. NEVER lose it. If you ever need to restore your wallet use these secret
					words. You can even use these secret words to restore wallet in other blockchain based wallet. Be
					careful where you restore your wallet. There a lot of scammers out there.
				</div>
				<div className="text-center mt-3">
					<button className="btn btn-success btn-lg" id="btnMnemonic" onClick={togglePasscodeModal}>
						Backup Secret Words
					</button>
				</div>
				<div className="section-title mt-3">Option 2: Backup to Google Drive.</div>
				<div className="content-header mb-05">
					Another easier way to backup is just storing an encrypted form of your wallet in your Google Drive.
					You still have to remember or write down your 6 digit app passcode, as the app uses this passcode to
					encrypt the wallet before sending to Google Drive, for security. You will need to sign in with
					Google and give access to Drive. The app will create a folder called 'eSatyaWalletBackup'. NEVER
					delete it or any contents within it.
				</div>
				<div className="text-center mt-3">
					<Link to="/google/backup">
						<button className="btn btn-danger btn-lg" id="btnDrive">
							Backup to Google Drive
						</button>
					</Link>
				</div>
			</div>
			<div className="section full mb-2" id="cmpBackup"></div>
		</div>
	);
}
