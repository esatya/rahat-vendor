module.exports = {
	APP_CONSTANTS: {
		VERSION: 1,
		PASSCODE_LENGTH: 10,
		SCAN_DELAY: 600,
		CHARGE_TYPES: {
			TOKEN: 'token',
			NFT: 'nft',
			TOKEN_RECIEVED: 'tokenRecieved',
			TOKEN_SENT: 'tokenSent',
			NFT_RECIEVED: 'nftRecieved',
			NFT_SENT: 'nftSent',
			REDEEMED_TOKEN: 'tokenRedeemed',
			REDEEMED_PACKAGE: 'packageRedeemed',
			TOKEN_TRANSFER: 'tokenTransfer',
			PAKCAGE_TRANSFER: 'packageTransfer'
		},
		DEFAULT_NFT_CHARGE: 1,
		SCANNER_PREVIEW_STYLE: {
			height: 300,
			width: 400,
			display: 'flex',
			justifyContent: 'center'
		}
	},
	BACKUP: {
		PASSPHRASE_RULE: '"^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{12,})"',
		GDRIVE_FOLDERNAME: 'VendorBackups'
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
