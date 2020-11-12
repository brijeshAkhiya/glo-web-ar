function checkQrCode() {
        var params = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            params.push(hash[0]);
            params[hash[0]] = hash[1];
        }
        console.log('hash', hashes);
        console.log('params', params);
        $.get('http://54.177.108.151/api/v1/qr', {qrcode: hash || 'NmqYvTA7ytTE20FHSUlOOGfpwTdIlD3oj0IuUI0lnr'}, (data, status) => {
          if (data.status === 200) {
            alert("Successfully run!!");
          } else if (data.status === 403) {
            window.location.replace('./verified.html')
          } else if (data.status === 404) {
            window.location.replace('./Not_Verified.html')
          }
        });
      }