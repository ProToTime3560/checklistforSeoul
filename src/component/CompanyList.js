import React, { useEffect, useRef, useCallback, useState } from "react";
import Select from "react-select";
import axios from "axios";
import styles from "../component/CheckList.module.css"
//출력할개수  지역
//선택상자   선택상자


function CompanyList() {

  let [viewDebug, setviewDebug] = useState(false); //콘솔로그확인on off
  let [viewData, setViewData] = useState([]);

  const [userCartIsLoaded, setuserCartIsLoaded] = useState(false);

  const regionList = [
    { value: "모든지역", label: "모든지역" },
    { value: "강남구", label: "강남구" },
    { value: "강동구", label: "강동구" },
    { value: "강북구", label: "강북구" },
    { value: "강서구", label: "강서구" },
    { value: "관악구", label: "관악구" },
    { value: "광진구", label: "광진구" },
    { value: "구로구", label: "구로구" },
    { value: "금천구", label: "금천구" },
    { value: "노원구", label: "노원구" },
    { value: "도봉구", label: "도봉구" },
    { value: "동대문구", label: "동대문구" },
    { value: "동작구", label: "동작구" },
    { value: "마포구", label: "마포구" },
    { value: "서대문구", label: "서대문구" },
    { value: "서초구", label: "서초구" },
    { value: "성동구", label: "성동구" },
    { value: "성북구", label: "성북구" },
    { value: "송파구", label: "송파구" },
    { value: "양천구", label: "양천구" },
    { value: "영등포구", label: "영등포구" },
    { value: "용산구", label: "용산구" },
    { value: "은평구", label: "은평구" },
    { value: "종로구", label: "종로구" },
    { value: "중구", label: "중구" },
    { value: "중랑구", label: "중랑구" },
    { value: "인천광역시 강화군", label: "인천광역시 강화군" },
  ];

  let [selectRegion, setselectRegion] = useState(regionList[0].value);

  let [IsDataloding, setIsDataloding] = useState(false)
  let [userInput, setuserInput] = useState("");
  let [searchArray, setsearchArray] = useState([]);

  useEffect(() => {
    if(viewDebug == true) {
    console.log("변경발견")
    }
    setIsDataloding(true)
    axios
      .post("http://localhost:3001/api/getdefaultCompanydata", {
        Region: selectRegion,
        searchArray : searchArray
      })
      .then((response) => {
        const parsedData = response.data;
        setViewData(parsedData);
        if(viewDebug) {
        console.log(viewData);
        }
        setIsDataloding(false);
      })
      .catch((error) => {
        console.error(error);
        setIsDataloding(false);
      });

  }, [selectRegion, searchArray]);

  let [currentPage, setCurrentPage] = useState(1);
  let [productsPerPage] = useState(10);

  let [showMinButton, setshowMinButton] = useState(0);
  let [showMaxButton, setshowMaxButton] = useState(10);
  let indexOfLastProduct = currentPage * productsPerPage;
  let indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  let currentProducts = viewData.slice(indexOfFirstProduct, indexOfLastProduct);

  let renderProducts = currentProducts.map(function (product, i) {
    return <Card key={i} item={product} />;
  });

  let pageNumbers = [];
  for (let i = 1; i <= Math.ceil(viewData.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  let renderPageNumbers = pageNumbers.slice(showMinButton, showMaxButton).map((number, index)=> {
    return (
        <button className={styles.pagebutton} key={index} onClick={() => {
          setCurrentPage(number)
        }}>{number}</button>
    );
});

  return (
    <div className={styles.backgroundsetwhitesmoke}>
      
    <div className={styles.CheckListView}>
      <div className={styles.SelectDiv}>
        <Select
          className={styles.RegionSelect}
          options={regionList}
          placeholder="지역선택"
          onChange={(e) => {
            if (e) {
              setselectRegion(e.value);
            }
          }}
        />
        <input
          className={styles.UserInput}
          placeholder="작업을 입력하세요 ex)창호, 단열공사"
          onChange={(e) => {
            setuserInput(e.target.value);
          }}
          onKeyDown={(event)=> {
            if (event.key === "Enter") {
              let filteredInput = userInput.trim().replace(/\s+/g, ' ');
              let tempsearchArray = filteredInput.split(',').map((searchTerm) => searchTerm.trim());
              setsearchArray(tempsearchArray);
              if(viewDebug) {
              console.log(searchArray);
              }
            }
          }}
        />
        <button className={styles.purchase_button} onClick={() => { //인젝션 공격방지 적용
          let filteredInput = userInput.trim().replace(/\s+/g, ' ');
          let tempsearchArray = filteredInput.split(',').map((searchTerm) => searchTerm.trim());
          setsearchArray(tempsearchArray);
          if(viewDebug) {
          console.log(searchArray);
          }
        }}>
          검색
        </button>
        {
          viewDebug == true ? <p> 디버그용 확인창----------
          선택지역 : {selectRegion + " , "} 
          사용자 입력 : {userInput + " , "} 검색에 적용된 배열키 : {searchArray}
        </p> : null
        }
        {
        IsDataloding == true ? <div><img src={process.env.PUBLIC_URL + '/loding-unbackground.gif'} alt="로딩창" /><p>서버로부터 데이터를 로딩중입니다.</p></div> : viewData.length == 0 ? <p>해당하는 항목이 없습니다.</p> :  <p></p>

        }
      {
        IsDataloding == true ? null :
        <div className={styles.backgroundsetwhitesmoke}>
          <div className={styles.CheckListView}>{renderProducts}</div>
          <div>
            {showMinButton > 0 && (
              <button className={styles.pagebutton} onClick={() => {
                setshowMinButton(0);
                setshowMaxButton(10);
              }}>&lt;&lt;</button>
            )}
            {showMinButton > 0 && (
              <button className={styles.pagebutton} onClick={() => {
                setshowMinButton(showMinButton - 10);
                setshowMaxButton(showMaxButton - 10);
              }}>&lt;</button>
            )}
            {renderPageNumbers}
            {showMaxButton < pageNumbers.length && (
              <button className={styles.pagebutton} onClick={() => {
                setshowMinButton(showMinButton + 10);
                setshowMaxButton(showMaxButton + 10);
              }}>&gt;</button>
            )}
             {showMaxButton < pageNumbers.length && (
              <button className={styles.pagebutton} onClick={() => {
                setshowMinButton(pageNumbers.length - 10);
                setshowMaxButton(pageNumbers.length);
              }}>&gt;&gt;</button>
            )}
            &nbsp;&nbsp;총 {pageNumbers.length}페이지
          </div>
        </div>
      }

      </div> 
    </div>
  
  </div>
    
  );
}

function Card(props) {
  return (
    <div className={`${styles.product_card}`}>
      <li>
          <strong className={styles.product_title}>
             집수리 업체이름 : {props.item["ENT_NM"]}
          </strong>
          <img src={process.env.PUBLIC_URL} ></img>
          <div className={styles.product_description}>
            <hr/>
            <span>대여장소 : {props.item["ENT_ADDR"]}</span><br/>
            <span className={styles.spantitle}>
              작업 : {props.item["MAIN_CNSTRCT_FLD_NM"]}
            </span>{" "}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <p>
            
            </p>
            <p >
            {props.item["ENT_TEL_NO"] ? (
           <span>전화번호: {props.item["ENT_TEL_NO"]}</span>) : null}
            </p>
          </div>
        
        <div className={styles.cotg}>
        </div>
      </li>
    </div>
  );
}

export default CompanyList;
