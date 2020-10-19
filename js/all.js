// 改寫自 MDN 範例
// navigator.geolocation.getCurrentPosition(function(position) {
//     console.log(position.coords.latitude, position.coords.longitude);
// });

// const { post } = require("jquery");
let mapinfo = document.querySelector('.map-info');
let latA, lonA, latB = "25.042574", lonB = "121.550855";

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    mapinfo.textContent = "抓取資料失敗，請確認有開啟定位";
  }
}

function showPosition(position) {
  latA = position.coords.latitude;
  lonA = position.coords.longitude;
  mapinfo.textContent = `經緯度：${latA},${lonA}`;
  console.log(distance(latA, lonA, latB, lonB, "K"));
}

// function getDistance(x1, y1, x2, y2){
//   let distance = Math.sqrt(Math.abs(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
//   console.log(distance);
// }

function distance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist;
  }
}
$(document).ready(function () {
  const page = {
    home: 'https://huihongchang.github.io/getmap/',
    index: 'https://huihongchang.github.io/getmap/index.html',
    checkout: 'https://huihongchang.github.io/checkout.html'
  }
  // 判斷如果進到打卡頁面時，是否登入
  (function () {
    let gobalIsLogin = sessionStorage.getItem('isLogin');
    let isOnIndex = location.href === page.checkout;
    if (isOnIndex && !gobalIsLogin) {
      alert('請先登入');
      $(window).attr('location', page.index);
    }
  })();
  
  // Changes XML to JSON
  function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof (obj[nodeName]) == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof (obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  };

  function login() {
    let account = {
      sId: $('#qrCodeAccount').val() || '',
      sPw: $('#qrCodePassword').val() || '',
    }
    let settings = {
      "url": "http://59.124.246.10:9999/Service1.asmx?op=uCheckEmployee",
      "method": "POST",
      "dataType": "xml",
      "timeout": 0,
      "headers": {
        "Content-Type": "text/xml;charset='UTF-8'",
      },
      // "data": `<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n  <soap:Body>\r\n    <uCheckEmployee xmlns=\"http://tempuri.org/\">\r\n      <sId>${account.sId}</sId>\r\n      <sPw>${account.sPw}</sPw>\r\n    </uCheckEmployee>\r\n  </soap:Body>\r\n</soap:Envelope>`,
      "data": `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <uCheckEmployee xmlns="http://tempuri.org/">
            <sId>${account.sId}</sId>
            <sPw>${account.sPw}</sPw>
          </uCheckEmployee>
        </soap:Body>
      </soap:Envelope>
      `,
    };

    $.ajax(settings).done(function (response) {
      let xmlData = xmlToJson(response);
      let isLogin = (xmlData['soap:Envelope']['soap:Body'].uCheckEmployeeResponse.uCheckEmployeeResult['#text'] === 'true');
      if (isLogin) {
        sessionStorage.setItem('isLogin', isLogin);
        alert('登入成功');
        $(window).attr('location', page.index);
      } else {
        sessionStorage.setItem('isLogin', isLogin);
        alert('登入失敗');
      }
    });
  }

  $('#qrLogin').click(login);

});