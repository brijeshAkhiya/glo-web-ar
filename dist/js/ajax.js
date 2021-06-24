function checkQrCode() {
  const qrCode = window.location.href.split('/')[4];
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function (event) {
    if (this.status && this.response) {
      if (JSON.parse(this.response).status === 200) {
        window.location.replace(window.location.origin + '/Verified-QR-Code');
        localStorage.setItem('url', JSON.parse(this.response).destination_url);
      } else if (JSON.parse(this.response).status === 403) {
        window.location.replace('https://www.gloextract.com/not-verified');
      } else if (JSON.parse(this.response).status === 404) {
        // window.location.replace(domain + '/invalid-QR-Code');
        window.location.replace('https://www.gloextract.com/not-verified');
      }
    }
  };
  xhttp.open("GET", "https://admglo.gloextract.com/api/v1/qr?qrcode=" + qrCode, true);
  xhttp.send();
}
