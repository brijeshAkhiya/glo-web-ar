document.getElementById('model-viewer').style.display = "none";
function checkQrCode() {
  var params = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    params.push(hash[0]);
    params[hash[0]] = hash[1];
  }
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function (event) {
    if (this.status && this.response) {
      if (JSON.parse(this.response).status === 200) {
        window.location.replace('../verifiedWebgl.html');
      } else if (JSON.parse(this.response).status === 403) {
        alert(this.response.message);
      } else if (JSON.parse(this.response).status === 404) {
        window.location.replace('../notVerifiedWebgl.html');
      }
    }
    
  };
  xhttp.open("GET", "http://verify.qrcodesafe.com/api/v1/qr?qrcode=" + hash || 'NmqYvTA7ytTE20FHSUlOOGfpwTdIlD3oj0IuUI0lnr', true);
  xhttp.send();
}