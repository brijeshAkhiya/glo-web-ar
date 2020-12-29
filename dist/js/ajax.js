const domain = 'https://glo-ar-web.herokuapp.com'
      function checkQrCode() {
        const qrCode = window.location.href.split('/')[4];
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function (event) {
          if (this.status && this.response) {
            if (JSON.parse(this.response).status === 200) {
              window.location.replace(domain + '/verified?url=' + JSON.parse(this.response).destination_url);
            } else if (JSON.parse(this.response).status === 403) {
              window.location.replace(domain + '/notverified');
            } else if (JSON.parse(this.response).status === 404) {
              window.location.replace(domain + '/notverified');
            }
          }
        };
        xhttp.open("GET", "https://verify.qrcodesafe.com/api/v1/qr?qrcode=" + qrCode, true);
        xhttp.send();
      }

      