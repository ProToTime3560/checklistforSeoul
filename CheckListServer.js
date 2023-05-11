const express = require("express"); // npm i express | yarn add express
const cors    = require("cors");    // npm i cors | yarn add cors
const mysql   = require("mysql2");   // npm i mysql | yarn add mysql
const app     = express();
const PORT    = 3001; // 포트번호 설정
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // JSON 형식의 요청 본문 처리
app.use(bodyParser.urlencoded({ extended: true })); // URL 인코딩된 요청 본문 처리

// MySQL 연결
const db = mysql.createPool({
  host: "toolrentaloffice.coqcexjiecvx.us-east-1.rds.amazonaws.com", // 호스트
  user: "stakeholders",      // 데이터베이스 계정
  password: "stakeholders",      // 데이터베이스 비밀번호 가려놓음
  database: "ToolRentalOffice",  // 사용할 데이터베이스
});

// 서버 연결 시 발생
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

//app.use(express.json());

app.use(cors({
  origin: "*",                // 출처 허용 옵션
  credentials: true,          // 응답 헤더에 Access-Control-Allow-Credentials 추가
  optionsSuccessStatus: 200,  // 응답 상태 200으로 설정
}))

app.get("/pet", (req, res) => {
  res.send("Hello, World!");
});

app.get('/', (request, response) => {  
  response.send('Hello from Express!')
})

// post 요청 시 값을 객체로 바꿔줌
//app.use(express.urlencoded({ extended: true })) 


app.get("/api/getdefaultdata", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*"); /*외부 도메인으로 부터 HTTP 요청 허용*/
  //console.log('디폴트접속성공');
  const sqlQuery = "SELECT * FROM RentalToolList ORDER BY GONGUSEQ";

  db.query(sqlQuery, (err, result) => {
    console.log('접속중');
      res.send(result);
      console.log('접속완료');
      console.log(result);
      console.log(err)
  });
});

app.get("/api/company", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  
  const sqlQuery = "SELECT * FROM RentalToolList;";

  db.query(sqlQuery, (err, result) => {
      res.send(result);
  });
});

app.post("/api/getspecificdata", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  
  let selectRegion = req.body.Region;
  let selectMainCategory = req.body.MainCategory;
  let selectMiddleCategory = req.body.MiddleCategory;
  let queryValues = [selectMainCategory, selectMiddleCategory];
  let searchArray = req.body.searchArray;

  console.log(selectRegion,queryValues, searchArray , "디버그용 확인 출력이라네")//디버그용

  if(searchArray.length == 0) {
    console.log("검색어가 없다네")
    if(selectRegion == "모든지역") { //모든지역 선택
      console.log("region 설정없음")
      if(selectMiddleCategory == '0') {
       
        if(selectMainCategory == 0) {
          let sqlQuery = "SELECT * FROM RentalToolList ORDER BY GONGUSEQ";
  
          console.log("Executing SQL query:", sqlQuery, queryValues);
          db.query(sqlQuery, (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send("Error retrieving specific data");
            } else {
              res.send(result);
            }
          });
        }
        else {
          let sqlQuery = "SELECT * FROM RentalToolList WHERE `MAINGONGUCODE` = ? ORDER BY `GONGUSEQ`";
  
          console.log("Executing SQL query:", sqlQuery, queryValues);
          db.query(sqlQuery, queryValues, (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send("Error retrieving specific data");
            } else {
              res.send(result);
            }
          });
        }
      }
  
      else {
        console.log("중분류코드 적용")
        let sqlQuery = "SELECT * FROM RentalToolList WHERE `MAINGONGUCODE` = ? AND `SUBGONGUCODE` = ? ORDER BY `GONGUSEQ`";
        console.log("Executing SQL query:", sqlQuery, queryValues);
        db.query(sqlQuery, queryValues, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error retrieving specific data");
          } else {
            res.send(result);
          }
        });
      }
    }
    else {
      console.log("region 설정있음", selectRegion)
    if(selectMainCategory == '0') {
      console.log("대분류 선택안함")
      switch(selectRegion) {
        case '강북구':
          sqlQuery = "SELECT * FROM RentalToolList WHERE(DETAILADDR LIKE '%강북구%' OR  (MAPSEQ >= 36 AND MAPSEQ <= 48) OR (MAPSEQ >= 194 AND MAPSEQ <= 202) OR MAPSEQ = 13034 OR (MAPSEQ >= 13215 AND MAPSEQ <= 13216) OR MAPSEQ = 13220 OR MAPSEQ = 13267) ORDER BY `GONGUSEQ`;"
          break;
        case '강서구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%강서구%' OR  (MAPSEQ >= 49 AND MAPSEQ <= 52) OR (MAPSEQ >= 2412 AND MAPSEQ <= 2436) OR MAPSEQ = 13219) ORDER BY `GONGUSEQ`;"
          break;
        case '강동구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%강동구%' OR  ((GONGUSEQ >= 1 AND GONGUSEQ <= 35) OR (GONGUSEQ >= 115 AND GONGUSEQ <= 116) OR (GONGUSEQ >= 143 AND GONGUSEQ <= 144) OR GONGUSEQ = 148 OR GONGUSEQ = 151 OR GONGUSEQ = 153 OR GONGUSEQ = 156)) ORDER BY GONGUSEQ;"
          break;
        case '관악구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%관악구%' OR  (MAPSEQ >= 53 AND MAPSEQ <= 74) OR (MAPSEQ >= 203 AND MAPSEQ <= 223)) ORDER BY `GONGUSEQ`;"
          break;
        case '광진구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%광진구%' OR  (MAPSEQ >= 75 AND MAPSEQ <= 89) OR MAPSEQ = 13175 OR MAPSEQ = 13198) ORDER BY `GONGUSEQ`;"
          break;
        case '구로구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%구로구%' OR  (MAPSEQ >= 90 AND MAPSEQ <= 103) OR (MAPSEQ >= 224 AND MAPSEQ <= 226) OR MAPSEQ = 13035) ORDER BY `GONGUSEQ`;"
          break;
        case '금천구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%금천구%' OR  (MAPSEQ >= 104 AND MAPSEQ <= 114) OR MAPSEQ = 227 OR (MAPSEQ >= 13162 AND MAPSEQ <= 13166) OR (MAPSEQ >= 13213)) ORDER BY `GONGUSEQ`;"
          break;
        case '노원구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%노원구%' OR  (MAPSEQ >= 117 AND MAPSEQ <= 129) OR MAPSEQ = 13169 OR MAPSEQ = 13197 OR MAPSEQ = 13214) ORDER BY `GONGUSEQ`;"
          break;
        case '도봉구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%도봉구%' OR  (MAPSEQ >= 130 AND MAPSEQ <= 142) OR MAPSEQ = 228 OR MAPSEQ = 13222 OR MAPSEQ = 13276) ORDER BY `GONGUSEQ`;"
          break;
        case '동대문구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%동대문구%' OR  (MAPSEQ >= 145 AND MAPSEQ <= 147) OR (MAPSEQ >= 149 AND MAPSEQ <= 150) OR MAPSEQ = 152 OR (MAPSEQ >= 154 AND MAPSEQ <= 155) OR (MAPSEQ >= 157 AND MAPSEQ <= 162) OR (MAPSEQ >= 229 AND MAPSEQ <= 232) OR (MAPSEQ >= 13036 AND MAPSEQ <= 13039)) ORDER BY `GONGUSEQ`;"
          break;
        case '동작구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%동작구%' OR  (MAPSEQ >= 163 AND MAPSEQ <= 174) OR MAPSEQ = 9766 OR (MAPSEQ >= 13066 AND MAPSEQ <= 13068) OR (MAPSEQ >= 13170 AND MAPSEQ <= 13174)) ORDER BY `GONGUSEQ`;"
          break;
        case '마포구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%마포구%' OR  (MAPSEQ >= 175 AND MAPSEQ <= 188) OR (MAPSEQ >= 13053 AND MAPSEQ <= 13054)) ORDER BY `GONGUSEQ`;"
          break;
        case '서대문구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%서대문구%' OR  (MAPSEQ >= 189 AND MAPSEQ <= 193) OR (MAPSEQ >= 233 AND MAPSEQ <= 235) OR (MAPSEQ >= 13055 AND MAPSEQ <=13063) ORDER BY `GONGUSEQ`"
          break;
        case '서초구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%서초구%' OR  (GONGUSEQ BETWEEN 236 AND 243 OR GONGUSEQ BETWEEN 13046 AND 13052 OR GONGUSEQ BETWEEN 13172 AND 13195 OR GONGUSEQ = 13221)) ORDER BY `GONGUSEQ`;"
          break;
        case '성동구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%성동구%' OR  GONGUSEQ BETWEEN 244 AND 25) ORDER BY `GONGUSEQ`"
          break;
        case '성북구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%성북구%' OR  (GONGUSEQ BETWEEN 254 AND 263 OR GONGUSEQ = 13040 OR GONGUSEQ BETWEEN 13167 AND 13168 OR GONGUSEQ BETWEEN 13228 AND 13246 OR GONGUSEQ = 13251)) ORDER BY `GONGUSEQ`;"
          break;
        case '송파구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%송파구%' OR  (GONGUSEQ BETWEEN 264 AND 321 OR GONGUSEQ = 13033 OR GONGUSEQ = 13227)) ORDER BY `GONGUSEQ`;"
          break;
        case '양천구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%양천구%' OR  (GONGUSEQ BETWEEN 322 AND 331 OR GONGUSEQ = 13041 OR GONGUSEQ = 13204)) ORDER BY `GONGUSEQ`;"
          break;
        case '영등포구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%영등포구%' OR  (GONGUSEQ BETWEEN 332 AND 367 OR GONGUSEQ = 13176 OR GONGUSEQ = 13224 OR GONGUSEQ = 13263)) ORDER BY `GONGUSEQ`;"
          break;
        case '용산구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%용산구%' OR  GONGUSEQ BETWEEN 368 AND 452 OR GONGUSEQ = 13250) ORDER BY `GONGUSEQ`;"
          break;
        case '은평구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%은평구%' OR  (GONGUSEQ BETWEEN 453 AND 469 OR GONGUSEQ = 13042 OR GONGUSEQ = 13171 OR GONGUSEQ = 13266)) ORDER BY `GONGUSEQ`;"
          break;
        case '종로구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%종로구%' OR  GONGUSEQ BETWEEN 470 AND 487) ORDER BY `GONGUSEQ`;"
          break;
        case '중구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%중구%' OR  GONGUSEQ BETWEEN 488 AND 507) ORDER BY `GONGUSEQ`;"
          break;
        case '중랑구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (D0ETAILADDR LIKE '%중랑구%' OR  (GONGUSEQ BETWEEN 508 AND 510 OR GONGUSEQ BETWEEN 2437 AND 2438 OR GONGUSEQ BETWEEN 13043 AND 13045 OR GONGUSEQ BETWEEN 13200 AND 13202 OR GONGUSEQ BETWEEN 13205 AND 13029 OR GONGUSEQ = 13223)) ORDER BY `GONGUSEQ`;"
          break;
        case '강남구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%강남구%' OR (GONGUSEQ BETWEEN 13005 AND 13026)) ORDER BY `GONGUSEQ`;"
          break;
        case '인천광역시 강화군' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE (DETAILADDR LIKE '%인천광역시 강화군%' OR GONGUSEQ = 13064) ORDER BY GONGUSEQ;"
          break;
      }
    
      console.log("Executing SQL query:", queryValues, queryValues);
      db.query(sqlQuery, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error retrieving specific data");
        } else {
          res.send(result);
        }
      });
    }
    else{
    console.log("대분류 선택함")
          if(selectMiddleCategory == '0') {
            console.log("중분류코드 적용안함")
            switch(selectRegion) {
              case '강북구':
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%강북구%' OR  (MAPSEQ >= 36 AND MAPSEQ <= 48) OR (MAPSEQ >= 194 AND MAPSEQ <= 202) OR MAPSEQ = 13034 OR (MAPSEQ >= 13215 AND MAPSEQ <= 13216) OR MAPSEQ = 13220 OR MAPSEQ = 13267) ORDER BY `GONGUSEQ`;"
                break;
              case '강서구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%강서구%' OR  (MAPSEQ >= 49 AND MAPSEQ <= 52) OR (MAPSEQ >= 2412 AND MAPSEQ <= 2436) OR MAPSEQ = 13219) ORDER BY `GONGUSEQ`;"
                break;
              case '강동구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%강동구%' OR  ((GONGUSEQ >= 1 AND GONGUSEQ <= 35) OR (GONGUSEQ >= 115 AND GONGUSEQ <= 116) OR (GONGUSEQ >= 143 AND GONGUSEQ <= 144) OR GONGUSEQ = 148 OR GONGUSEQ = 151 OR GONGUSEQ = 153 OR GONGUSEQ = 156)) ORDER BY GONGUSEQ;"
                break;
              case '관악구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%관악구%' OR  (MAPSEQ >= 53 AND MAPSEQ <= 74) OR (MAPSEQ >= 203 AND MAPSEQ <= 223)) ORDER BY `GONGUSEQ`;"
                break;
              case '광진구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%광진구%' OR  (MAPSEQ >= 75 AND MAPSEQ <= 89) OR MAPSEQ = 13175 OR MAPSEQ = 13198) ORDER BY `GONGUSEQ`;"
                break;
              case '구로구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%구로구%' OR  (MAPSEQ >= 90 AND MAPSEQ <= 103) OR (MAPSEQ >= 224 AND MAPSEQ <= 226) OR MAPSEQ = 13035) ORDER BY `GONGUSEQ`;"
                break;
              case '금천구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%금천구%' OR  (MAPSEQ >= 104 AND MAPSEQ <= 114) OR MAPSEQ = 227 OR (MAPSEQ >= 13162 AND MAPSEQ <= 13166) OR (MAPSEQ >= 13213)) ORDER BY `GONGUSEQ`;"
                break;
              case '노원구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%노원구%' OR  (MAPSEQ >= 117 AND MAPSEQ <= 129) OR MAPSEQ = 13169 OR MAPSEQ = 13197 OR MAPSEQ = 13214) ORDER BY `GONGUSEQ`;"
                break;
              case '도봉구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%도봉구%' OR  (MAPSEQ >= 130 AND MAPSEQ <= 142) OR MAPSEQ = 228 OR MAPSEQ = 13222 OR MAPSEQ = 13276) ORDER BY `GONGUSEQ`;"
                break;
              case '동대문구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%동대문구%' OR  (MAPSEQ >= 145 AND MAPSEQ <= 147) OR (MAPSEQ >= 149 AND MAPSEQ <= 150) OR MAPSEQ = 152 OR (MAPSEQ >= 154 AND MAPSEQ <= 155) OR (MAPSEQ >= 157 AND MAPSEQ <= 162) OR (MAPSEQ >= 229 AND MAPSEQ <= 232) OR (MAPSEQ >= 13036 AND MAPSEQ <= 13039)) ORDER BY `GONGUSEQ`;"
                break;
              case '동작구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%동작구%' OR  (MAPSEQ >= 163 AND MAPSEQ <= 174) OR MAPSEQ = 9766 OR (MAPSEQ >= 13066 AND MAPSEQ <= 13068) OR (MAPSEQ >= 13170 AND MAPSEQ <= 13174)) ORDER BY `GONGUSEQ`;"
                break;
              case '마포구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%마포구%' OR  (MAPSEQ >= 175 AND MAPSEQ <= 188) OR (MAPSEQ >= 13053 AND MAPSEQ <= 13054)) ORDER BY `GONGUSEQ`;"
                break;
              case '서대문구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%서대문구%' OR  (MAPSEQ >= 189 AND MAPSEQ <= 193) OR (MAPSEQ >= 233 AND MAPSEQ <= 235) OR (MAPSEQ >= 13055 AND MAPSEQ <=13063) ORDER BY `GONGUSEQ`"
                break;
              case '서초구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%서초구%' OR  (GONGUSEQ BETWEEN 236 AND 243 OR GONGUSEQ BETWEEN 13046 AND 13052 OR GONGUSEQ BETWEEN 13172 AND 13195 OR GONGUSEQ = 13221)) ORDER BY `GONGUSEQ`;"
                break;
              case '성동구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%성동구%' OR  GONGUSEQ BETWEEN 244 AND 25) ORDER BY `GONGUSEQ`"
                break;
              case '성북구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%성북구%' OR  (GONGUSEQ BETWEEN 254 AND 263 OR GONGUSEQ = 13040 OR GONGUSEQ BETWEEN 13167 AND 13168 OR GONGUSEQ BETWEEN 13228 AND 13246 OR GONGUSEQ = 13251)) ORDER BY `GONGUSEQ`;"
                break;
              case '송파구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%송파구%' OR  (GONGUSEQ BETWEEN 264 AND 321 OR GONGUSEQ = 13033 OR GONGUSEQ = 13227)) ORDER BY `GONGUSEQ`;"
                break;
              case '양천구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%양천구%' OR  (GONGUSEQ BETWEEN 322 AND 331 OR GONGUSEQ = 13041 OR GONGUSEQ = 13204)) ORDER BY `GONGUSEQ`;"
                break;
              case '영등포구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%영등포구%' OR  (GONGUSEQ BETWEEN 332 AND 367 OR GONGUSEQ = 13176 OR GONGUSEQ = 13224 OR GONGUSEQ = 13263)) ORDER BY `GONGUSEQ`;"
                break;
              case '용산구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%용산구%' OR  GONGUSEQ BETWEEN 368 AND 452 OR GONGUSEQ = 13250) ORDER BY `GONGUSEQ`;"
                break;
              case '은평구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%은평구%' OR  (GONGUSEQ BETWEEN 453 AND 469 OR GONGUSEQ = 13042 OR GONGUSEQ = 13171 OR GONGUSEQ = 13266)) ORDER BY `GONGUSEQ`;"
                break;
              case '종로구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%종로구%' OR  GONGUSEQ BETWEEN 470 AND 487) ORDER BY `GONGUSEQ`;"
                break;
              case '중구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%중구%' OR  GONGUSEQ BETWEEN 488 AND 507) ORDER BY `GONGUSEQ`;"
                break;
              case '중랑구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (D0ETAILADDR LIKE '%중랑구%' OR  (GONGUSEQ BETWEEN 508 AND 510 OR GONGUSEQ BETWEEN 2437 AND 2438 OR GONGUSEQ BETWEEN 13043 AND 13045 OR GONGUSEQ BETWEEN 13200 AND 13202 OR GONGUSEQ BETWEEN 13205 AND 13029 OR GONGUSEQ = 13223)) ORDER BY `GONGUSEQ`;"
                break;
              case '강남구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%강남구%' OR (GONGUSEQ BETWEEN 13005 AND 13026)) ORDER BY `GONGUSEQ`;"
                break;
              case '인천광역시 강화군' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND (DETAILADDR LIKE '%인천광역시 강화군%' OR GONGUSEQ = 13064) ORDER BY GONGUSEQ;"
                break;
            }
            
          
            console.log("Executing SQL query:", queryValues, queryValues);
            db.query(sqlQuery, [selectMainCategory], (err, result) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error retrieving specific data");
              } else {
                res.send(result);
              }
            });
          }
          else{
            console.log("중분류코드 적용함")
            switch(selectRegion) {
              case '강북구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%강북구%' OR  (MAPSEQ >= 36 AND MAPSEQ <= 48) OR (MAPSEQ >= 194 AND MAPSEQ <= 202) OR MAPSEQ = 13034 OR (MAPSEQ >= 13215 AND MAPSEQ <= 13216) OR MAPSEQ = 13220 OR MAPSEQ = 13267) ORDER BY `GONGUSEQ`;"
                break;
              case '강서구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%강서구%' OR  (MAPSEQ >= 49 AND MAPSEQ <= 52) OR (MAPSEQ >= 2412 AND MAPSEQ <= 2436) OR MAPSEQ = 13219) ORDER BY `GONGUSEQ`;"
                break;
              case '강동구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%강동구%' OR  ((GONGUSEQ >= 1 AND GONGUSEQ <= 35) OR (GONGUSEQ >= 115 AND GONGUSEQ <= 116) OR (GONGUSEQ >= 143 AND GONGUSEQ <= 144) OR GONGUSEQ = 148 OR GONGUSEQ = 151 OR GONGUSEQ = 153 OR GONGUSEQ = 156)) ORDER BY GONGUSEQ;"
                break;
              case '관악구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%관악구%' OR  (MAPSEQ >= 53 AND MAPSEQ <= 74) OR (MAPSEQ >= 203 AND MAPSEQ <= 223)) ORDER BY `GONGUSEQ`;"
                break;
              case '광진구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%광진구%' OR  (MAPSEQ >= 75 AND MAPSEQ <= 89) OR MAPSEQ = 13175 OR MAPSEQ = 13198) ORDER BY `GONGUSEQ`;"
                break;
              case '구로구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%구로구%' OR  (MAPSEQ >= 90 AND MAPSEQ <= 103) OR (MAPSEQ >= 224 AND MAPSEQ <= 226) OR MAPSEQ = 13035) ORDER BY `GONGUSEQ`;"
                break;
              case '금천구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%금천구%' OR  (MAPSEQ >= 104 AND MAPSEQ <= 114) OR MAPSEQ = 227 OR (MAPSEQ >= 13162 AND MAPSEQ <= 13166) OR (MAPSEQ >= 13213)) ORDER BY `GONGUSEQ`;"
                break;
              case '노원구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%노원구%' OR  (MAPSEQ >= 117 AND MAPSEQ <= 129) OR MAPSEQ = 13169 OR MAPSEQ = 13197 OR MAPSEQ = 13214) ORDER BY `GONGUSEQ`;"
                break;
              case '도봉구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%도봉구%' OR  (MAPSEQ >= 130 AND MAPSEQ <= 142) OR MAPSEQ = 228 OR MAPSEQ = 13222 OR MAPSEQ = 13276) ORDER BY `GONGUSEQ`;"
                break;
              case '동대문구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%동대문구%' OR  (MAPSEQ >= 145 AND MAPSEQ <= 147) OR (MAPSEQ >= 149 AND MAPSEQ <= 150) OR MAPSEQ = 152 OR (MAPSEQ >= 154 AND MAPSEQ <= 155) OR (MAPSEQ >= 157 AND MAPSEQ <= 162) OR (MAPSEQ >= 229 AND MAPSEQ <= 232) OR (MAPSEQ >= 13036 AND MAPSEQ <= 13039)) ORDER BY `GONGUSEQ`;"
                break;
              case '동작구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%동작구%' OR  (MAPSEQ >= 163 AND MAPSEQ <= 174) OR MAPSEQ = 9766 OR (MAPSEQ >= 13066 AND MAPSEQ <= 13068) OR (MAPSEQ >= 13170 AND MAPSEQ <= 13174)) ORDER BY `GONGUSEQ`;"
                break;
              case '마포구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%마포구%' OR  (MAPSEQ >= 175 AND MAPSEQ <= 188) OR (MAPSEQ >= 13053 AND MAPSEQ <= 13054)) ORDER BY `GONGUSEQ`;"
                break;
              case '서대문구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%서대문구%' OR  (MAPSEQ >= 189 AND MAPSEQ <= 193) OR (MAPSEQ >= 233 AND MAPSEQ <= 235) OR (MAPSEQ >= 13055 AND MAPSEQ <=13063) ORDER BY `GONGUSEQ`"
                break;
              case '서초구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%서초구%' OR  (GONGUSEQ BETWEEN 236 AND 243 OR GONGUSEQ BETWEEN 13046 AND 13052 OR GONGUSEQ BETWEEN 13172 AND 13195 OR GONGUSEQ = 13221)) ORDER BY `GONGUSEQ`;"
                break;
              case '성동구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%성동구%' OR  GONGUSEQ BETWEEN 244 AND 253) ORDER BY `GONGUSEQ`"
                break;
              case '성북구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%성북구%' OR  (GONGUSEQ BETWEEN 254 AND 263 OR GONGUSEQ = 13040 OR GONGUSEQ BETWEEN 13167 AND 13168 OR GONGUSEQ BETWEEN 13228 AND 13246 OR GONGUSEQ = 13251)) ORDER BY `GONGUSEQ`;"
                break;
              case '송파구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%송파구%' OR  (GONGUSEQ BETWEEN 264 AND 321 OR GONGUSEQ = 13033 OR GONGUSEQ = 13227)) ORDER BY `GONGUSEQ`;"
                break;
              case '양천구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%양천구%' OR  (GONGUSEQ BETWEEN 322 AND 331 OR GONGUSEQ = 13041 OR GONGUSEQ = 13204)) ORDER BY `GONGUSEQ`;"
                break;
              case '영등포구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%영등포구%' OR  (GONGUSEQ BETWEEN 332 AND 367 OR GONGUSEQ = 13176 OR GONGUSEQ = 13224 OR GONGUSEQ = 13263)) ORDER BY `GONGUSEQ`;"
                break;
              case '용산구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%용산구%' OR  GONGUSEQ BETWEEN 368 AND 452 OR GONGUSEQ = 13250) ORDER BY `GONGUSEQ`;"
                break;
              case '은평구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%은평구%' OR  (GONGUSEQ BETWEEN 453 AND 469 OR GONGUSEQ = 13042 OR GONGUSEQ = 13171 OR GONGUSEQ = 13266)) ORDER BY `GONGUSEQ`;"
                break;
              case '종로구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%종로구%' OR  GONGUSEQ BETWEEN 470 AND 487) ORDER BY `GONGUSEQ`;"
                break;
              case '중구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%중구%' OR  GONGUSEQ BETWEEN 488 AND 507) ORDER BY `GONGUSEQ`;"
                break;
              case '중랑구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%중랑구%' OR  (GONGUSEQ BETWEEN 508 AND 510 OR GONGUSEQ BETWEEN 2437 AND 2438 OR GONGUSEQ BETWEEN 13043 AND 13045 OR GONGUSEQ BETWEEN 13200 AND 13202 OR GONGUSEQ BETWEEN 13205 AND 13029 OR GONGUSEQ = 13223)) ORDER BY `GONGUSEQ`;"
                break;
              case '강남구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%강남구%' OR (GONGUSEQ BETWEEN 13005 AND 13026)) ORDER BY `GONGUSEQ`;"
                break;
              case '인천광역시 강화군' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%인천광역시 강화군%' OR GONGUSEQ = 13064) ORDER BY `GONGUSEQ`;"
                break;
            }//체크하라
          
            console.log("Executing SQL query:", queryValues, queryValues);
            db.query(sqlQuery, [selectMainCategory, selectMiddleCategory], (err, result) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error retrieving specific data");
              } else {
                res.send(result);
              }
            });
  
          }
    }
  
    
  
    }
  }
  else{ //검색어가 있을경우------------------------------------------------ AND GONGUNAME LIKE '%${searchArray.join('%')}%' 추가됨
    console.log("검색어가 있다네")
    let makeListForMysql = searchArray.map((value) => `%${value}%`);
    if(selectRegion == "모든지역") { //모든지역 선택
      console.log("region 설정없음")
      if(selectMiddleCategory == '0') {
       
        if(selectMainCategory == 0) {
          let sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' ORDER BY GONGUSEQ";
  
          console.log("Executing SQL query:", sqlQuery, queryValues);
          db.query(sqlQuery, (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send("Error retrieving specific data");
            } else {
              res.send(result);
            }
          });
        }
        else {
          let sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND `MAINGONGUCODE` = ? ORDER BY `GONGUSEQ`";
  
          console.log("Executing SQL query:", sqlQuery, queryValues);
          db.query(sqlQuery, queryValues, (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send("Error retrieving specific data");
            } else {
              res.send(result);
            }
          });
        }
      }
  
      else {
        console.log("중분류코드 적용")
        let sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND `MAINGONGUCODE` = ? AND `SUBGONGUCODE` = ? ORDER BY `GONGUSEQ`";
        console.log("Executing SQL query:", sqlQuery, queryValues);
        db.query(sqlQuery, queryValues, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error retrieving specific data");
          } else {
            res.send(result);
          }
        });
      }
    }
    else {
      console.log("region 설정있음", selectRegion)
    if(selectMainCategory == '0') {
      console.log("대분류 선택안함")
      switch(selectRegion) {
        case '강북구':
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%강북구%' OR  (MAPSEQ >= 36 AND MAPSEQ <= 48) OR (MAPSEQ >= 194 AND MAPSEQ <= 202) OR MAPSEQ = 13034 OR (MAPSEQ >= 13215 AND MAPSEQ <= 13216) OR MAPSEQ = 13220 OR MAPSEQ = 13267) ORDER BY `GONGUSEQ`;"
          break;
        case '강서구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%강서구%' OR  (MAPSEQ >= 49 AND MAPSEQ <= 52) OR (MAPSEQ >= 2412 AND MAPSEQ <= 2436) OR MAPSEQ = 13219) ORDER BY `GONGUSEQ`;"
          break;
        case '강동구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%강동구%' OR  ((GONGUSEQ >= 1 AND GONGUSEQ <= 35) OR (GONGUSEQ >= 115 AND GONGUSEQ <= 116) OR (GONGUSEQ >= 143 AND GONGUSEQ <= 144) OR GONGUSEQ = 148 OR GONGUSEQ = 151 OR GONGUSEQ = 153 OR GONGUSEQ = 156)) ORDER BY GONGUSEQ;"
          break;
        case '관악구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%관악구%' OR  (MAPSEQ >= 53 AND MAPSEQ <= 74) OR (MAPSEQ >= 203 AND MAPSEQ <= 223)) ORDER BY `GONGUSEQ`;"
          break;
        case '광진구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%광진구%' OR  (MAPSEQ >= 75 AND MAPSEQ <= 89) OR MAPSEQ = 13175 OR MAPSEQ = 13198) ORDER BY `GONGUSEQ`;"
          break;
        case '구로구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%구로구%' OR  (MAPSEQ >= 90 AND MAPSEQ <= 103) OR (MAPSEQ >= 224 AND MAPSEQ <= 226) OR MAPSEQ = 13035) ORDER BY `GONGUSEQ`;"
          break;
        case '금천구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%금천구%' OR  (MAPSEQ >= 104 AND MAPSEQ <= 114) OR MAPSEQ = 227 OR (MAPSEQ >= 13162 AND MAPSEQ <= 13166) OR (MAPSEQ >= 13213)) ORDER BY `GONGUSEQ`;"
          break;
        case '노원구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%노원구%' OR  (MAPSEQ >= 117 AND MAPSEQ <= 129) OR MAPSEQ = 13169 OR MAPSEQ = 13197 OR MAPSEQ = 13214) ORDER BY `GONGUSEQ`;"
          break;
        case '도봉구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%도봉구%' OR  (MAPSEQ >= 130 AND MAPSEQ <= 142) OR MAPSEQ = 228 OR MAPSEQ = 13222 OR MAPSEQ = 13276) ORDER BY `GONGUSEQ`;"
          break;
        case '동대문구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%동대문구%' OR  (MAPSEQ >= 145 AND MAPSEQ <= 147) OR (MAPSEQ >= 149 AND MAPSEQ <= 150) OR MAPSEQ = 152 OR (MAPSEQ >= 154 AND MAPSEQ <= 155) OR (MAPSEQ >= 157 AND MAPSEQ <= 162) OR (MAPSEQ >= 229 AND MAPSEQ <= 232) OR (MAPSEQ >= 13036 AND MAPSEQ <= 13039)) ORDER BY `GONGUSEQ`;"
          break;
        case '동작구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%동작구%' OR  (MAPSEQ >= 163 AND MAPSEQ <= 174) OR MAPSEQ = 9766 OR (MAPSEQ >= 13066 AND MAPSEQ <= 13068) OR (MAPSEQ >= 13170 AND MAPSEQ <= 13174)) ORDER BY `GONGUSEQ`;"
          break;
        case '마포구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%마포구%' OR  (MAPSEQ >= 175 AND MAPSEQ <= 188) OR (MAPSEQ >= 13053 AND MAPSEQ <= 13054)) ORDER BY `GONGUSEQ`;"
          break;
        case '서대문구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%서대문구%' OR  (MAPSEQ >= 189 AND MAPSEQ <= 193) OR (MAPSEQ >= 233 AND MAPSEQ <= 235) OR (MAPSEQ >= 13055 AND MAPSEQ <=13063) ORDER BY `GONGUSEQ`"
          break;
        case '서초구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%서초구%' OR  (GONGUSEQ BETWEEN 236 AND 243 OR GONGUSEQ BETWEEN 13046 AND 13052 OR GONGUSEQ BETWEEN 13172 AND 13195 OR GONGUSEQ = 13221)) ORDER BY `GONGUSEQ`;"
          break;
        case '성동구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%성동구%' OR  GONGUSEQ BETWEEN 244 AND 25) ORDER BY `GONGUSEQ`"
          break;
        case '성북구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%성북구%' OR  (GONGUSEQ BETWEEN 254 AND 263 OR GONGUSEQ = 13040 OR GONGUSEQ BETWEEN 13167 AND 13168 OR GONGUSEQ BETWEEN 13228 AND 13246 OR GONGUSEQ = 13251)) ORDER BY `GONGUSEQ`;"
          break;
        case '송파구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%송파구%' OR  (GONGUSEQ BETWEEN 264 AND 321 OR GONGUSEQ = 13033 OR GONGUSEQ = 13227)) ORDER BY `GONGUSEQ`;"
          break;
        case '양천구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%양천구%' OR  (GONGUSEQ BETWEEN 322 AND 331 OR GONGUSEQ = 13041 OR GONGUSEQ = 13204)) ORDER BY `GONGUSEQ`;"
          break;
        case '영등포구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%영등포구%' OR  (GONGUSEQ BETWEEN 332 AND 367 OR GONGUSEQ = 13176 OR GONGUSEQ = 13224 OR GONGUSEQ = 13263)) ORDER BY `GONGUSEQ`;"
          break;
        case '용산구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%용산구%' OR  GONGUSEQ BETWEEN 368 AND 452 OR GONGUSEQ = 13250) ORDER BY `GONGUSEQ`;"
          break;
        case '은평구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%은평구%' OR  (GONGUSEQ BETWEEN 453 AND 469 OR GONGUSEQ = 13042 OR GONGUSEQ = 13171 OR GONGUSEQ = 13266)) ORDER BY `GONGUSEQ`;"
          break;
        case '종로구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%종로구%' OR  GONGUSEQ BETWEEN 470 AND 487) ORDER BY `GONGUSEQ`;"
          break;
        case '중구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%중구%' OR  GONGUSEQ BETWEEN 488 AND 507) ORDER BY `GONGUSEQ`;"
          break;
        case '중랑구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (D0ETAILADDR LIKE '%중랑구%' OR  (GONGUSEQ BETWEEN 508 AND 510 OR GONGUSEQ BETWEEN 2437 AND 2438 OR GONGUSEQ BETWEEN 13043 AND 13045 OR GONGUSEQ BETWEEN 13200 AND 13202 OR GONGUSEQ BETWEEN 13205 AND 13029 OR GONGUSEQ = 13223)) ORDER BY `GONGUSEQ`;"
          break;
        case '강남구' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%강남구%' OR (GONGUSEQ BETWEEN 13005 AND 13026)) ORDER BY `GONGUSEQ`;"
          break;
        case '인천광역시 강화군' :
          sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND (DETAILADDR LIKE '%인천광역시 강화군%' OR GONGUSEQ = 13064) ORDER BY GONGUSEQ;"
          break;
      }
    
      console.log("Executing SQL query:", queryValues, queryValues);
      db.query(sqlQuery, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error retrieving specific data");
        } else {
          res.send(result);
        }
      });
    }
    else{
    console.log("대분류 선택함")
          if(selectMiddleCategory == '0') {
            console.log("중분류코드 적용안함")
            switch(selectRegion) {
              case '강북구':
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%강북구%' OR  (MAPSEQ >= 36 AND MAPSEQ <= 48) OR (MAPSEQ >= 194 AND MAPSEQ <= 202) OR MAPSEQ = 13034 OR (MAPSEQ >= 13215 AND MAPSEQ <= 13216) OR MAPSEQ = 13220 OR MAPSEQ = 13267) ORDER BY `GONGUSEQ`;"
                break;
              case '강서구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%강서구%' OR  (MAPSEQ >= 49 AND MAPSEQ <= 52) OR (MAPSEQ >= 2412 AND MAPSEQ <= 2436) OR MAPSEQ = 13219) ORDER BY `GONGUSEQ`;"
                break;
              case '강동구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%강동구%' OR  ((GONGUSEQ >= 1 AND GONGUSEQ <= 35) OR (GONGUSEQ >= 115 AND GONGUSEQ <= 116) OR (GONGUSEQ >= 143 AND GONGUSEQ <= 144) OR GONGUSEQ = 148 OR GONGUSEQ = 151 OR GONGUSEQ = 153 OR GONGUSEQ = 156)) ORDER BY GONGUSEQ;"
                break;
              case '관악구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%관악구%' OR  (MAPSEQ >= 53 AND MAPSEQ <= 74) OR (MAPSEQ >= 203 AND MAPSEQ <= 223)) ORDER BY `GONGUSEQ`;"
                break;
              case '광진구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%광진구%' OR  (MAPSEQ >= 75 AND MAPSEQ <= 89) OR MAPSEQ = 13175 OR MAPSEQ = 13198) ORDER BY `GONGUSEQ`;"
                break;
              case '구로구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%구로구%' OR  (MAPSEQ >= 90 AND MAPSEQ <= 103) OR (MAPSEQ >= 224 AND MAPSEQ <= 226) OR MAPSEQ = 13035) ORDER BY `GONGUSEQ`;"
                break;
              case '금천구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%금천구%' OR  (MAPSEQ >= 104 AND MAPSEQ <= 114) OR MAPSEQ = 227 OR (MAPSEQ >= 13162 AND MAPSEQ <= 13166) OR (MAPSEQ >= 13213)) ORDER BY `GONGUSEQ`;"
                break;
              case '노원구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%노원구%' OR  (MAPSEQ >= 117 AND MAPSEQ <= 129) OR MAPSEQ = 13169 OR MAPSEQ = 13197 OR MAPSEQ = 13214) ORDER BY `GONGUSEQ`;"
                break;
              case '도봉구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%도봉구%' OR  (MAPSEQ >= 130 AND MAPSEQ <= 142) OR MAPSEQ = 228 OR MAPSEQ = 13222 OR MAPSEQ = 13276) ORDER BY `GONGUSEQ`;"
                break;
              case '동대문구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%동대문구%' OR  (MAPSEQ >= 145 AND MAPSEQ <= 147) OR (MAPSEQ >= 149 AND MAPSEQ <= 150) OR MAPSEQ = 152 OR (MAPSEQ >= 154 AND MAPSEQ <= 155) OR (MAPSEQ >= 157 AND MAPSEQ <= 162) OR (MAPSEQ >= 229 AND MAPSEQ <= 232) OR (MAPSEQ >= 13036 AND MAPSEQ <= 13039)) ORDER BY `GONGUSEQ`;"
                break;
              case '동작구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%동작구%' OR  (MAPSEQ >= 163 AND MAPSEQ <= 174) OR MAPSEQ = 9766 OR (MAPSEQ >= 13066 AND MAPSEQ <= 13068) OR (MAPSEQ >= 13170 AND MAPSEQ <= 13174)) ORDER BY `GONGUSEQ`;"
                break;
              case '마포구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%마포구%' OR  (MAPSEQ >= 175 AND MAPSEQ <= 188) OR (MAPSEQ >= 13053 AND MAPSEQ <= 13054)) ORDER BY `GONGUSEQ`;"
                break;
              case '서대문구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%서대문구%' OR  (MAPSEQ >= 189 AND MAPSEQ <= 193) OR (MAPSEQ >= 233 AND MAPSEQ <= 235) OR (MAPSEQ >= 13055 AND MAPSEQ <=13063) ORDER BY `GONGUSEQ`"
                break;
              case '서초구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%서초구%' OR  (GONGUSEQ BETWEEN 236 AND 243 OR GONGUSEQ BETWEEN 13046 AND 13052 OR GONGUSEQ BETWEEN 13172 AND 13195 OR GONGUSEQ = 13221)) ORDER BY `GONGUSEQ`;"
                break;
              case '성동구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%성동구%' OR  GONGUSEQ BETWEEN 244 AND 25) ORDER BY `GONGUSEQ`"
                break;
              case '성북구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%성북구%' OR  (GONGUSEQ BETWEEN 254 AND 263 OR GONGUSEQ = 13040 OR GONGUSEQ BETWEEN 13167 AND 13168 OR GONGUSEQ BETWEEN 13228 AND 13246 OR GONGUSEQ = 13251)) ORDER BY `GONGUSEQ`;"
                break;
              case '송파구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%송파구%' OR  (GONGUSEQ BETWEEN 264 AND 321 OR GONGUSEQ = 13033 OR GONGUSEQ = 13227)) ORDER BY `GONGUSEQ`;"
                break;
              case '양천구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%양천구%' OR  (GONGUSEQ BETWEEN 322 AND 331 OR GONGUSEQ = 13041 OR GONGUSEQ = 13204)) ORDER BY `GONGUSEQ`;"
                break;
              case '영등포구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%영등포구%' OR  (GONGUSEQ BETWEEN 332 AND 367 OR GONGUSEQ = 13176 OR GONGUSEQ = 13224 OR GONGUSEQ = 13263)) ORDER BY `GONGUSEQ`;"
                break;
              case '용산구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%용산구%' OR  GONGUSEQ BETWEEN 368 AND 452 OR GONGUSEQ = 13250) ORDER BY `GONGUSEQ`;"
                break;
              case '은평구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%은평구%' OR  (GONGUSEQ BETWEEN 453 AND 469 OR GONGUSEQ = 13042 OR GONGUSEQ = 13171 OR GONGUSEQ = 13266)) ORDER BY `GONGUSEQ`;"
                break;
              case '종로구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%종로구%' OR  GONGUSEQ BETWEEN 470 AND 487) ORDER BY `GONGUSEQ`;"
                break;
              case '중구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%중구%' OR  GONGUSEQ BETWEEN 488 AND 507) ORDER BY `GONGUSEQ`;"
                break;
              case '중랑구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (D0ETAILADDR LIKE '%중랑구%' OR  (GONGUSEQ BETWEEN 508 AND 510 OR GONGUSEQ BETWEEN 2437 AND 2438 OR GONGUSEQ BETWEEN 13043 AND 13045 OR GONGUSEQ BETWEEN 13200 AND 13202 OR GONGUSEQ BETWEEN 13205 AND 13029 OR GONGUSEQ = 13223)) ORDER BY `GONGUSEQ`;"
                break;
              case '강남구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%강남구%' OR (GONGUSEQ BETWEEN 13005 AND 13026)) ORDER BY `GONGUSEQ`;"
                break;
              case '인천광역시 강화군' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND (DETAILADDR LIKE '%인천광역시 강화군%' OR GONGUSEQ = 13064) ORDER BY GONGUSEQ;"
                break;
            }
            
          
            console.log("Executing SQL query:", queryValues, queryValues);
            db.query(sqlQuery, [selectMainCategory], (err, result) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error retrieving specific data");
              } else {
                res.send(result);
              }
            });
          }
          else{
            console.log("중분류코드 적용함")
            switch(selectRegion) {
              case '강북구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%강북구%' OR  (MAPSEQ >= 36 AND MAPSEQ <= 48) OR (MAPSEQ >= 194 AND MAPSEQ <= 202) OR MAPSEQ = 13034 OR (MAPSEQ >= 13215 AND MAPSEQ <= 13216) OR MAPSEQ = 13220 OR MAPSEQ = 13267) ORDER BY `GONGUSEQ`;"
                break;
              case '강서구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%강서구%' OR  (MAPSEQ >= 49 AND MAPSEQ <= 52) OR (MAPSEQ >= 2412 AND MAPSEQ <= 2436) OR MAPSEQ = 13219) ORDER BY `GONGUSEQ`;"
                break;
              case '강동구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%강동구%' OR  ((GONGUSEQ >= 1 AND GONGUSEQ <= 35) OR (GONGUSEQ >= 115 AND GONGUSEQ <= 116) OR (GONGUSEQ >= 143 AND GONGUSEQ <= 144) OR GONGUSEQ = 148 OR GONGUSEQ = 151 OR GONGUSEQ = 153 OR GONGUSEQ = 156)) ORDER BY GONGUSEQ;"
                break;
              case '관악구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%관악구%' OR  (MAPSEQ >= 53 AND MAPSEQ <= 74) OR (MAPSEQ >= 203 AND MAPSEQ <= 223)) ORDER BY `GONGUSEQ`;"
                break;
              case '광진구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%광진구%' OR  (MAPSEQ >= 75 AND MAPSEQ <= 89) OR MAPSEQ = 13175 OR MAPSEQ = 13198) ORDER BY `GONGUSEQ`;"
                break;
              case '구로구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%구로구%' OR  (MAPSEQ >= 90 AND MAPSEQ <= 103) OR (MAPSEQ >= 224 AND MAPSEQ <= 226) OR MAPSEQ = 13035) ORDER BY `GONGUSEQ`;"
                break;
              case '금천구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%금천구%' OR  (MAPSEQ >= 104 AND MAPSEQ <= 114) OR MAPSEQ = 227 OR (MAPSEQ >= 13162 AND MAPSEQ <= 13166) OR (MAPSEQ >= 13213)) ORDER BY `GONGUSEQ`;"
                break;
              case '노원구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%노원구%' OR  (MAPSEQ >= 117 AND MAPSEQ <= 129) OR MAPSEQ = 13169 OR MAPSEQ = 13197 OR MAPSEQ = 13214) ORDER BY `GONGUSEQ`;"
                break;
              case '도봉구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%도봉구%' OR  (MAPSEQ >= 130 AND MAPSEQ <= 142) OR MAPSEQ = 228 OR MAPSEQ = 13222 OR MAPSEQ = 13276) ORDER BY `GONGUSEQ`;"
                break;
              case '동대문구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%동대문구%' OR  (MAPSEQ >= 145 AND MAPSEQ <= 147) OR (MAPSEQ >= 149 AND MAPSEQ <= 150) OR MAPSEQ = 152 OR (MAPSEQ >= 154 AND MAPSEQ <= 155) OR (MAPSEQ >= 157 AND MAPSEQ <= 162) OR (MAPSEQ >= 229 AND MAPSEQ <= 232) OR (MAPSEQ >= 13036 AND MAPSEQ <= 13039)) ORDER BY `GONGUSEQ`;"
                break;
              case '동작구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%동작구%' OR  (MAPSEQ >= 163 AND MAPSEQ <= 174) OR MAPSEQ = 9766 OR (MAPSEQ >= 13066 AND MAPSEQ <= 13068) OR (MAPSEQ >= 13170 AND MAPSEQ <= 13174)) ORDER BY `GONGUSEQ`;"
                break;
              case '마포구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%마포구%' OR  (MAPSEQ >= 175 AND MAPSEQ <= 188) OR (MAPSEQ >= 13053 AND MAPSEQ <= 13054)) ORDER BY `GONGUSEQ`;"
                break;
              case '서대문구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%서대문구%' OR  (MAPSEQ >= 189 AND MAPSEQ <= 193) OR (MAPSEQ >= 233 AND MAPSEQ <= 235) OR (MAPSEQ >= 13055 AND MAPSEQ <=13063) ORDER BY `GONGUSEQ`"
                break;
              case '서초구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%서초구%' OR  (GONGUSEQ BETWEEN 236 AND 243 OR GONGUSEQ BETWEEN 13046 AND 13052 OR GONGUSEQ BETWEEN 13172 AND 13195 OR GONGUSEQ = 13221)) ORDER BY `GONGUSEQ`;"
                break;
              case '성동구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%성동구%' OR  GONGUSEQ BETWEEN 244 AND 253) ORDER BY `GONGUSEQ`"
                break;
              case '성북구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%성북구%' OR  (GONGUSEQ BETWEEN 254 AND 263 OR GONGUSEQ = 13040 OR GONGUSEQ BETWEEN 13167 AND 13168 OR GONGUSEQ BETWEEN 13228 AND 13246 OR GONGUSEQ = 13251)) ORDER BY `GONGUSEQ`;"
                break;
              case '송파구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%송파구%' OR  (GONGUSEQ BETWEEN 264 AND 321 OR GONGUSEQ = 13033 OR GONGUSEQ = 13227)) ORDER BY `GONGUSEQ`;"
                break;
              case '양천구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%양천구%' OR  (GONGUSEQ BETWEEN 322 AND 331 OR GONGUSEQ = 13041 OR GONGUSEQ = 13204)) ORDER BY `GONGUSEQ`;"
                break;
              case '영등포구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%영등포구%' OR  (GONGUSEQ BETWEEN 332 AND 367 OR GONGUSEQ = 13176 OR GONGUSEQ = 13224 OR GONGUSEQ = 13263)) ORDER BY `GONGUSEQ`;"
                break;
              case '용산구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%용산구%' OR  GONGUSEQ BETWEEN 368 AND 452 OR GONGUSEQ = 13250) ORDER BY `GONGUSEQ`;"
                break;
              case '은평구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%은평구%' OR  (GONGUSEQ BETWEEN 453 AND 469 OR GONGUSEQ = 13042 OR GONGUSEQ = 13171 OR GONGUSEQ = 13266)) ORDER BY `GONGUSEQ`;"
                break;
              case '종로구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%종로구%' OR  GONGUSEQ BETWEEN 470 AND 487) ORDER BY `GONGUSEQ`;"
                break;
              case '중구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%중구%' OR  GONGUSEQ BETWEEN 488 AND 507) ORDER BY `GONGUSEQ`;"
                break;
              case '중랑구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%중랑구%' OR  (GONGUSEQ BETWEEN 508 AND 510 OR GONGUSEQ BETWEEN 2437 AND 2438 OR GONGUSEQ BETWEEN 13043 AND 13045 OR GONGUSEQ BETWEEN 13200 AND 13202 OR GONGUSEQ BETWEEN 13205 AND 13029 OR GONGUSEQ = 13223)) ORDER BY `GONGUSEQ`;"
                break;
              case '강남구' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%강남구%' OR (GONGUSEQ BETWEEN 13005 AND 13026)) ORDER BY `GONGUSEQ`;"
                break;
              case '인천광역시 강화군' :
                sqlQuery = "SELECT * FROM RentalToolList WHERE GONGUNAME LIKE '" + makeListForMysql.join("' OR GONGUNAME LIKE '") + "' AND MAINGONGUCODE = ? AND SUBGONGUCODE = ? AND (DETAILADDR LIKE '%인천광역시 강화군%' OR GONGUSEQ = 13064) ORDER BY `GONGUSEQ`;"
                break;
            }//체크하라
          
            console.log("Executing SQL query:", queryValues, queryValues);
            db.query(sqlQuery, [selectMainCategory, selectMiddleCategory], (err, result) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error retrieving specific data");
              } else {
                res.send(result);
              }
            });
  
          }
    }
  
    
  
    }
  }
  
});