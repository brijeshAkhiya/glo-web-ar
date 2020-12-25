const domain = 'http://localhost:3000'
      function checkQrCode() {
        const qrCode = window.location.href.split('/')[4];
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function (event) {
          console.log(this.response, qrCode);
          if (this.status && this.response) {
            if (JSON.parse(this.response).status === 200) {
              window.location.replace(domain + '/verified?url=' + JSON.parse(this.response).destination_url);
            } else if (JSON.parse(this.response).status === 403) {
              alert(JSON.parse(this.response).message);
            } else if (JSON.parse(this.response).status === 404) {
              window.location.replace(domain + '/notverified');
            }
          }
        };
        xhttp.open("GET", "http://54.177.108.151/api/v1/qr?qrcode=" + qrCode, true);
        xhttp.send();
      }