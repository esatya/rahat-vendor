module.exports = {
	APP_CONSTANTS: {
		VERSION: 1,
		PASSCODE_LENGTH: 6,
		SCAN_DELAY: 600,
		SCANNER_PREVIEW_STYLE: {
			height: 300,
			width: 400,
			display: 'flex',
			justifyContent: 'center'
		}
	},
	BACKUP: {
		PASSPHRASE_RULE: '"^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{12,})"',
		GDRIVE_FOLDERNAME: 'RumsanWalletBackups'
	},
	DB: {
		NAME: 'db_wallet',
		VERSION: 2.1,
		TABLES: {
			DATA: 'tbl_data',
			ASSETS: 'tbl_assets',
			DOCUMENTS: 'tbl_docs'
		}
	},
	DEFAULT_TOKEN: {
		NAME: 'Ether',
		SYMBOL: 'ETH'
	}
};
