import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute({ component: Component, wallet, ...rest }) {
	return (
		<Route
			{...rest}
			render={props => {
				if (wallet != null) {
					return <Component {...props} {...rest} />;
				} else {
					return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
				}
			}}
		/>
	);
}

export default PrivateRoute;
