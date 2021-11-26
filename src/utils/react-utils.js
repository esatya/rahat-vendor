import React, { useState, useEffect } from 'react';
import * as io5 from 'react-icons/io5';

const useResize = myRef => {
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		if (!myRef || !myRef.current) return;
		const handleResize = () => {
			setWidth(myRef.current.offsetWidth);
			setHeight(myRef.current.offsetHeight);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [myRef]);

	return { width, height };
};

const useIcon = (name, options = {}) => {
	if (!name) return '';
	return React.createElement(io5[name], Object.assign({ className: 'ion-icon' }, options));
};

export { useResize, useIcon };
