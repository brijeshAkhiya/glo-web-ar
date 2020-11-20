const isAndroid = /android/i.test(navigator.userAgent);
if (isAndroid) {

} else {
	window.location.replace('../ar.html');
}
function start(result) {
	if (result) {
		activateAr();
	} else {
		withoutPermission();
	}
	// `${result}`()
}


function activateAr() {
	navigator.xr.requestSession('immersive-ar')
		.then((session) => {
			if (session) {
				document.getElementById('ar').click();
			}
		})
		.catch((err) => {
			alert('AR not supported');
			window.location.replace('../index.html');
			console.log(err);
		})
}
function withoutPermission() {
	document.querySelector('model-viewer').addEventListener('load', () => {
		if (document.querySelector('button')) {
			setInterval(() => {
				if (!document.querySelector('button').click()) {
					document.querySelector('button').click();
				}
			}, 2000)
		}
	});
}
function arNotSupported() {
	document.querySelector("#model-viewer").addEventListener('ar-status', (event) => {
		if (event.detail.status === 'failed') {
			alert('failed');
			const error = document.querySelector("#error");
			error.classList.remove('hide');
			error.addEventListener('transitionend', (event) => {
				error.classList.add('hide');
			});
		}
	});
}