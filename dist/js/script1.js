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
			document.getElementById('ar').innerHTML = "AR not supported";
			document.getElementById('ar').disabled = true;
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