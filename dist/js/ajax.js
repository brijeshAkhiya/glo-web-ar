const domain = 'https://verify.gloextract.com'
      function checkQrCode() {
        const qrCode = window.location.href.split('/')[4];
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function (event) {
          if (this.status && this.response) {
            if (JSON.parse(this.response).status === 200) {
              window.location.replace(domain + '/Verified-QR-Code');
              localStorage.setItem('url', JSON.parse(this.response).destination_url);
            } else if (JSON.parse(this.response).status === 403) {
              // window.location.replace(domain + '/Invalid-QR-Code');
              window.open('https://www.gloextract.com/not-verified', '_blank');
            } else if (JSON.parse(this.response).status === 404) {
              // window.location.replace(domain + '/invalid-QR-Code');
              window.open('https://www.gloextract.com/not-verified/', '_blank');
              // window.location.replace('http://localhost:3000/verified-ar');
            }
          }
        };
        xhttp.open("GET", "https://admglo.gloextract.com/api/v1/qr?qrcode=" + qrCode, true);
        xhttp.send();
      }
      