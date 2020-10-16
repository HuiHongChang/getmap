// 改寫自 MDN 範例
// navigator.geolocation.getCurrentPosition(function(position) {
//     console.log(position.coords.latitude, position.coords.longitude);
// });

// const { post } = require("jquery");

$(document).ready(function () {
  
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
      for(var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(obj[nodeName]) == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) == "undefined") {
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
      if (isLogin){
        alert('登入成功');
        $(window).attr('location','//127.0.0.1:5500/index.html');
      } else {
        alert('登入失敗');
      }
    });

  }
  
  $('#qrLogin').click(login);
  

});