import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from '../modules/home';
import Setup from '../modules/setup';
import SetupProfile from '../modules/setup/profile';
import SetupSelfie from '../modules/setup/selfie';
import SetupIdCard from '../modules/setup/idCard';
import SetupPending from '../modules/setup/pendingApproval';
import UnlockWallet from '../modules/wallet/unlock';
import GoogleRestore from '../modules/misc/googleRestore';
import CreateWallet from '../modules/wallet/create';
import ResetWallet from '../modules/misc/reset';
import RestoreFromMnemonic from '../modules/wallet/restoreMnemonic';

import { AppContextProvider } from '../contexts/AppContext';
import { ActionSheetContextProvider } from '../contexts/ActionSheetContext';

function App() {
	return (
		<>
			<AppContextProvider>
				<ActionSheetContextProvider>
					<BrowserRouter>
						<Switch>
							<Route exact path="/setup" component={Setup} />
							<Route exact path="/setup/profile" component={SetupProfile} />
							<Route exact path="/setup/selfie" component={SetupSelfie} />
							<Route exact path="/setup/idcard" component={SetupIdCard} />
							<Route exact path="/setup/pending" component={SetupPending} />
							<Route exact path="/create" component={CreateWallet} />
							<Route exact path="/unlock" component={UnlockWallet} />
							<Route exact path="/google/restore" component={GoogleRestore} />
							<Route exact path="/mnemonic/restore" component={RestoreFromMnemonic} />
							<Route exact path="/reset" component={ResetWallet} />
							<Route path="/" component={Home} />
							<Route path="*" component={Home} />
						</Switch>
					</BrowserRouter>
				</ActionSheetContextProvider>
			</AppContextProvider>
		</>
	);
}

export default App;
