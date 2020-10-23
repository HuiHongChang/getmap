
  // testlink：http://127.0.0.1:5500/?id=hqJ/x4xjzfLyWueY5ZS/Xn1UokoHLJc69o4Qny9Umac=&store=A02L&memberid=140026&address=247新北市蘆洲區長榮路3號
  // githublink：https://huihongchang.github.io/getmap/?id=hqJ/x4xjzfLyWueY5ZS/Xn1UokoHLJc69o4Qny9Umac=&store=A02L&memberid=140026&address=247新北市蘆洲區長榮路3號

  const storeData = [
    {
      id:"A02L",
      location: {lat : "25.042574", lon: "121.550855"}
    },
    {
      id:"A03B",
      location: {lat : "23.042574", lon: "123.550855"}
    },
    {
      id:"A03K",
      location: {lat : "24.042574", lon: "122.550855"}
    }
  ];

  let linkData = {

    latA: "",
    lonA: "",
    latB: "",
    lonB: "",
    distance: "",
    id: "",
    memberid: "",
    store: "",
    address: ""
  };

  // test address
  // let storeAddress = "247新北市蘆洲區長榮路3號";
  let mapAPIKey = "AIzaSyDoNDfv-qB-_Cy2EYcTEoGgkoCBpHZD0X8";
  const mapinfo = document.querySelector('.map-info');
  
  // 正式 url
  let page = {
    link: 'http://59.124.246.9:7777/index.html',
  };

  let pageurl = new URL(location.href);
  let params = pageurl.searchParams;
  for (let pair of params.entries()) {
    linkData[pair[0]] = pair[1];
  }

  GetStorePos();   
 
  //取的店座標
  function GetStorePos(){
    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = false;
    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        if(this.status === 200){
          let mapData = JSON.parse(this.responseText);
          console.log(mapData);
          console.log(mapData["results"][0].geometry.location.lat);
          linkData.latB = mapData["results"][0].geometry.location.lat;
          linkData.lonB = mapData["results"][0].geometry.location.lng;
          getLocation();
        }
        else{
          mapinfo.textContent = "請求失敗，請重新使用QRCODE進入!!!";
          MixPageLink();
        }
      }   
      
    });
    
    xhr.open("GET", `https://maps.googleapis.com/maps/api/geocode/json?address=${linkData.address}&key=${mapAPIKey}`);
    
    xhr.send();
  }  

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(GetPosition);
    } else {
      mapinfo.textContent = "抓取資料失敗，請確認有開啟定位";
    }
  }

  // 取得當前裝置座標
  function GetPosition(position) {
    linkData.latA = position.coords.latitude;
    linkData.lonA = position.coords.longitude;
    mapinfo.textContent = `資訊取得成功`;
    distance(linkData.latA, linkData.lonA, linkData.latB, linkData.lonB, "K");
    console.log(linkData);
  }

  /*計算兩個座標的距離*/
  function distance(lat1, lon1, lat2, lon2, unit) {
    let dist
    if ((lat1 == lat2) && (lon1 == lon2)) {
      dist = 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }           
    }
    linkData.distance = dist;
    MixPageLink();
  }
  
  function MixPageLink(){
    console.log(linkData);
    page.link = `${page.link}?sId=${linkData.memberid}&sCheckInLongitude=${linkData.lonA}&sCheckInLatitude=${linkData.latA}&sDistance=${linkData.distance}&sEncryptString=${linkData.id}`;
    console.log(page.link);  
    window.location.assign(page.link);
  }

