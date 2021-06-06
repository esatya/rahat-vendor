import React, { useEffect, useContext } from 'react';
import { Route, Switch } from 'react-router-dom';

import { AppContext } from '../../contexts/AppContext';
import PrivateRoute from './PrivateRoute';

import BackupWallet from '../wallet/backup/index';
import Footer from '../layouts/Footer';
import Header from '../layouts/Header';
import Main from './main';
import NetworkSettings from '../settings/network';
import Settings from '../settings';
import Profile from '../settings/profile';
import Transfer from '../transfer';
import Transactions from '../transactions';
import TxDetails from '../transactions/details';
import GoogleBackup from '../misc/googleBackup';

function App() {
	const { initApp, wallet } = useContext(AppContext);

	useEffect(() => {
		(async () => {
			initApp();
		})();
	}, [initApp]);

	return (
		<>
			<Header />
			<Switch>
				<Route exact path="/" component={Main} />
				<PrivateRoute exact path="/tx" component={Transactions} wallet={wallet} />
				<PrivateRoute exact path="/tx/:hash" component={TxDetails} wallet={wallet} />
				<PrivateRoute exact path="/backup" component={BackupWallet} wallet={wallet} />
				<PrivateRoute exact path="/networks" component={NetworkSettings} wallet={wallet} />
				<PrivateRoute exact path="/profile" component={Profile} wallet={wallet} />
				<PrivateRoute exact path="/settings" component={Settings} wallet={wallet} />
				<PrivateRoute exact path="/profile" component={Profile} wallet={wallet} />
				<PrivateRoute exact path="/transfer/:contract" component={Transfer} wallet={wallet} />
				<PrivateRoute exact path="/transfer/:contract/:address" component={Transfer} wallet={wallet} />
				<PrivateRoute exact path="/google/backup" component={GoogleBackup} wallet={wallet} />
				<Route path="*" component={Main} />
			</Switch>
			<Footer />
		</>
	);
}

export default App;
