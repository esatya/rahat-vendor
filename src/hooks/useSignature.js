import { useState, useEffect, useCallback } from 'react';

function useAuthSignature(wallet) {
	const [sign, setSign] = useState(null);
	const getSign = useCallback(async () => {
		if (!wallet) return;
		const data = Date.now().toString();
		let signature = await wallet.signMessage(data);
		signature = `${data}.${signature}`;
		setSign(signature);
	}, [wallet]);
	useEffect(getSign, [getSign]);

	return sign;
}

export default useAuthSignature;
