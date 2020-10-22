
  // testlink：http://127.0.0.1:5500/?id=Ut7RX43mWEvKqsshW6ctYCbZieDwxAj1n4VL+lNkniY=&store=A02L

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
    store: ""
  };

  let localUrlData = {
    id: "",
    store: "",
    memberid: ""
  };

  var formdata = new FormData();

var requestOptions = {
  method: 'GET',
  body: formdata,
  redirect: 'follow'
};

fetch("https://maps.googleapis.com/maps/api/geocode/json?address=247新北市蘆洲區長榮路3號&key=AIzaSyDoNDfv-qB-_Cy2EYcTEoGgkoCBpHZD0X8&callback=initMap", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

  
  // 正式 url
  let page = {
    link: 'http://59.124.246.9:7777/index.html',
  };

  let pageurl = new URL(location.href);
  let params = pageurl.searchParams;
  for (let pair of params.entries()) {
    linkData[pair[0]] = pair[1];
  }

  
  getLocation();
  // GetStoreLocation(GetStoreId(GetPageLink()));
  // GetMemberId(GetPageLink());

  GetStorePos(linkData.store);
 
  //取的店座標
  function GetStorePos(storeId){
    for(let i = 0; i < storeData.length; i++){
      if(storeData[i]["id"] === storeId){
        linkData.latB = storeData[i]["location"].lat;
        linkData.lonB = storeData[i]["location"].lon;        
      }       
    }  
  }
  
  const mapinfo = document.querySelector('.map-info');

  // $('#btn-getlocation').click(getLocation);  

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
    mapinfo.textContent = `經緯度：${linkData.latA},${linkData.lonA}`;
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
    // window.location.assign(page.link);
  }

