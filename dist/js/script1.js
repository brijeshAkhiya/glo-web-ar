const isAndroid = /android/i.test(navigator.userAgent);
document.getElementById('model-viewer').style.display = "none";
document.getElementById('arButton').style.display = "none";
if (isAndroid) {
	document.getElementById('arButton').style.display = "block";
} else {
	document.getElementById('model-viewer').style.display = "block";
	document.getElementById('ar').style.display = "none";

	document.querySelector("model-viewer").addEventListener('ar-status', (event) => {
		if (event.detail.status === 'failed') {
			alert('failed');
			const error = document.querySelector("#error");
			error.classList.remove('hide');
			error.addEventListener('transitionend', (event) => {
				error.classList.add('hide');
			});
		}
	});
	document.querySelector('model-viewer').addEventListener('load', () => {
		if (document.getElementById('ar')) {
			document.getElementById('ar').click();
		}
	});
}



function activateAr() {
	navigator.xr.requestSession('immersive-ar')
		.then((session) => {
			if (session) {
				document.getElementById('ar').click();
			}
		})
		.catch((err) => {
			alert('AR not supported, please install ARcore services and try again!');
			window.location.replace('https://play.google.com/store/apps/details?id=com.google.ar.core');
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
			}, 2000);
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