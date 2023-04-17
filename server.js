const express = require("express"); // npm i express | yarn add express
const cors    = require("cors");    // npm i cors | yarn add cors
const mysql   = require("mysql2");   // npm i mysql | yarn add mysql
const app     = express();
const PORT    = 3001; // 포트번호 설정

// MySQL 연결
const db = mysql.createPool({
  host: "127.0.0.1", // 호스트
  user: "root",      // 데이터베이스 계정
  password: "*****",      // 데이터베이스 비밀번호
  database: "공구_정보",  // 사용할 데이터베이스
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
  const sqlQuery = "SELECT * FROM 서울시_대여_공구_찾기_정보 ORDER BY (`구분자(PK)`)";

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
  
  const sqlQuery = "SELECT * FROM COMPANY;";

  db.query(sqlQuery, (err, result) => {
      res.send(result);
  });
});