import Swal from 'sweetalert2';

export function isOffline(msg) {
	if (!navigator.onLine) {
		Swal.fire({
			title: 'OFFLINE',
			icon: 'error',
			text:
				msg || 'Cannot perform this action while you are offline. Please connect to the Internet and try again.'
		});
		return true;
	} else return false;
}

export function mergeAndRemoveDuplicate(array1 = [], array2 = [], keyName) {
	const array3 = [...array1, ...array2];
	// Return unique array on the basis of keyName.
	return [...new Map(array3.map(item => [item[`${keyName}`], item])).values()];
}

export function dataURLtoFile(dataurl, filename = 'my_doc') {
	var arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], filename, { type: mime });
}

export function arraysAreEqual(ary1, ary2) {
	return ary1.join('') === ary2.join('');
}

export function base64ToBlob(base64Url) {
	return new Promise((resolve, reject) => {
		fetch(base64Url)
			.then(res => {
				const result = res.blob();
				resolve(result);
			})
			.catch(err => reject(err));
	});
}

export const blobToBase64 = blob => {
	const reader = new FileReader();
	reader.readAsDataURL(blob);
	return new Promise(resolve => {
		reader.onloadend = () => {
			resolve(reader.result);
		};
	});
};
