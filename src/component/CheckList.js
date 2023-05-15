import React, { useEffect, useRef, useCallback, useState } from "react";
import Select from "react-select";
import axios from "axios";
import styles from "../component/CheckList.module.css"
import { useDispatch, useSelector} from "react-redux"
import { UPDATE_VIEWDATA, SET_userCart, ADD_userCart, DELETE_userCart, DELETETUPLE_userCart } from "../component/reduxStoreForViewData.js"
import {UserCart} from '../component/UserCart';
//출력할개수  지역
//선택상자   선택상자


function CheckList() {

  let [viewDebug, setviewDebug] = useState(false); //콘솔로그확인on off
  let [viewData, setViewData] = useState([]);

  const userCart = useSelector((state) => state.userCartStore.userCart);
  let dispatch = useDispatch()
  const [userCartIsLoaded, setuserCartIsLoaded] = useState(false);

  let [seeuserCart, setseeuserCart] = useState(false);

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
  const mainCategoryList = [
    { value: "0", label: "모든공구(대분류)" },
    { value: "1", label: "일반공구" },
    { value: "2", label: "전동공구" },
    { value: "3", label: "생활용품" },
    { value: "4", label: "기타공구" },
  ];

  const middleCategoryList0 = [{ value: "0", label: "모든공구(중분류)" }];

  const middleCategoryList1 = [
    { value: "0", label: "모든공구(중분류)" },
    { value: "1", label: "공구세트" },
    { value: "2", label: "몽키/렌치/스패너" },
    { value: "3", label: "니퍼/펜치/플라이어" },
    { value: "4", label: "드라이버" },
    { value: "5", label: "망치/함마/장도리" },
    { value: "6", label: "바이스/클램프" },
    { value: "7", label: "톱/낫/삽/원예공구" },
    { value: "8", label: "자/측정공구" },
    { value: "9", label: "커터/절단공구" },
    { value: "10", label: "타카/접착용품" },
    { value: "11", label: "용접/납공구" },
    { value: "12", label: "목공/미장" },
    { value: "13", label: "도장/페인트" },
    { value: "14", label: "자전거공구" },
    { value: "15", label: "못/나사/철사" },
    { value: "16", label: "사다리" },
    { value: "17", label: "바퀴/핸드카" },
    { value: "18", label: "압축/오일" },
    { value: "19", label: "기타 일반공구" },
  ];

  const middleCategoryList2 = [
    { value: "0", label: "모든공구(중분류)" },
    { value: "20", label: "전동공구세트" },
    { value: "21", label: "전동드릴" },
    { value: "22", label: "해머드릴" },
    { value: "23", label: "그라인더" },
    { value: "24", label: "샌더/대패" },
    { value: "25", label: "전동절단/톱/직소" },
    { value: "26", label: "전동드라이버" },
    { value: "27", label: "전동타카" },
    { value: "28", label: "에어건/콤프레셔" },
    { value: "29", label: "비트" },
    { value: "30", label: "랜턴" },
    { value: "31", label: "전선릴" },
    { value: "32", label: "안전용품" },
    { value: "33", label: "기타 전기제품" },
    { value: "34", label: "기타 전동공구" },
  ];

  const middleCategoryList3 = [
    { value: "0", label: "모든공구(중분류)" },
    { value: "35", label: "사무가전" },
    { value: "36", label: "미용가전" },
    { value: "37", label: "디지털가전" },
    { value: "38", label: "재봉공구" },
    { value: "39", label: "캠핑용품" },
    { value: "40", label: "청소용품" },
    { value: "41", label: "김장용품" },
    { value: "42", label: "행사용품" },
    { value: "43", label: "기타 생활용품" },
  ];

  const middleCategoryList4 = [
    { value: "0", label: "모든공구(중분류)" },
    { value: "44", label: "기타공구" },
  ];

  let [selectRegion, setselectRegion] = useState(regionList[0].value);
  let [selectMainCategory, setselectMainCategory] = useState(
    mainCategoryList[0].value
  );
  let [selectMiddleCategory, setselectMiddleCategory] = useState(
    middleCategoryList0[0].value
  );
  let [IsDataloding, setIsDataloding] = useState(false)
  let [userInput, setuserInput] = useState("");
  let [searchArray, setsearchArray] = useState([]);

  useEffect(() => {
    if(viewDebug == true) {
    console.log("변경발견")
    }
    setIsDataloding(true)
    axios
      .post("http://localhost:3001/api/getspecificdata", {
            Region: selectRegion,
            MainCategory: selectMainCategory,
            MiddleCategory: selectMiddleCategory,
            searchArray : searchArray
      })
      .then((response) => {
        const parsedData = response.data;
        setViewData(parsedData);
        dispatch(UPDATE_VIEWDATA(parsedData))
        if(viewDebug) {
        console.log(viewData);
        }
        setIsDataloding(false);
      })
      .catch((error) => {
        console.error(error);
        setIsDataloding(false);
      });

  }, [selectRegion,selectMainCategory, selectMiddleCategory, searchArray]);

  useEffect(() => {
    const userCartFromLocalStorage = localStorage.getItem('userCart');
    let storedUserCart;
  
    if (userCartFromLocalStorage && userCartFromLocalStorage !== "undefined") {
      storedUserCart = JSON.parse(userCartFromLocalStorage);
    } else {
      storedUserCart = [];
    }
  
    dispatch(SET_userCart(storedUserCart));
    setuserCartIsLoaded(true);
  }, [dispatch]);


  useEffect(() => {
    if (userCartIsLoaded) {
      localStorage.setItem('userCart', JSON.stringify(userCart));
    }
  }, [userCart, userCartIsLoaded]);

  let [currentPage, setCurrentPage] = useState(1);
  let [productsPerPage] = useState(20);

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
        <button key={index} onClick={() => {
          setCurrentPage(number)
        }}>{number}</button>
    );
});

  return (
    seeuserCart == true ? 
    <div>
      <button className={styles.purchase_button} onClick={() => {
      setseeuserCart(false)
    }}>공구목록이동</button>
      <UserCart/>
    </div>:
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
        <Select
          className={styles.MainSelect}
          options={mainCategoryList}
          placeholder="대분류선택"
          onChange={(e) => {
            if (e) {
              setselectMainCategory(e.value);
              setselectMiddleCategory(0)
            }
          }}
        />
      {selectMainCategory === "0" && (
          <Select
            className={styles.MiddleSelect}
            options={middleCategoryList0}
            placeholder="중분류선택"
            onChange={(e) => {
              if (e) {
                setselectMiddleCategory(e.value);
              }
            }}
          />
        )}
        {selectMainCategory === "1" && (
          <Select
            className={styles.MiddleSelect}
            options={middleCategoryList1}
            placeholder="중분류선택"
            onChange={(e) => {
              if (e) {
                setselectMiddleCategory(e.value);
              }
            }}
          />
        )}
        {selectMainCategory === "2" && (
          <Select
            className={styles.MiddleSelect}
            options={middleCategoryList2}
            placeholder="중분류선택"
            onChange={(e) => {
              if (e) {
                setselectMiddleCategory(e.value);
              }
            }}
          />
        )}
        {selectMainCategory === "3" && (
          <Select
            className={styles.MiddleSelect}
            options={middleCategoryList3}
            placeholder="중분류선택"
            onChange={(e) => {
              if (e) {
                setselectMiddleCategory(e.value);
              }
            }}
          />
        )}
        {selectMainCategory === "4" && (
          <Select
            className={styles.MiddleSelect}
            options={middleCategoryList4}
            placeholder="중분류선택"
            onChange={(e) => {
              if (e) {
                setselectMiddleCategory(e.value);
              }
            }}
          />
        )}
        <input
          className={styles.UserInput}
          placeholder="공구명 검색 (,를 이용해 다중검색가능)"
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
          선택지역 : {selectRegion + " , "} 대분류 코드 : {selectMainCategory + " , "} 중분류 코드: {selectMiddleCategory + " , "}
          사용자 입력 : {userInput + " , "} 검색에 적용된 배열키 : {searchArray}
        </p> : null
        }
        {
        IsDataloding == true ? <div><img src={process.env.PUBLIC_URL + '/loding-unbackground.gif'} alt="로딩창" /><p>서버로부터 데이터를 로딩중입니다.</p></div> : viewData.length == 0 ? <p>해당하는 항목이 없습니다.</p> :  <p></p>

        }
      {
        IsDataloding == true ? null : seeuserCart == true ? 
          null :
        <div className={styles.container}>
          <button className={styles.purchase_button} onClick={() => {
          setseeuserCart(true)
        }}>장바구니이동</button>
          <div className={styles.row}>{renderProducts}</div>
          <div>
            {showMinButton > 0 && (
              <button onClick={() => {
                setshowMinButton(0);
                setshowMaxButton(10);
              }}>&lt;&lt;</button>
            )}
            {showMinButton > 0 && (
              <button onClick={() => {
                setshowMinButton(showMinButton - 10);
                setshowMaxButton(showMaxButton - 10);
              }}>&lt;</button>
            )}
            {renderPageNumbers}
            {showMaxButton < pageNumbers.length && (
              <button onClick={() => {
                setshowMinButton(showMinButton + 10);
                setshowMaxButton(showMaxButton + 10);
              }}>&gt;</button>
            )}
             {showMaxButton < pageNumbers.length && (
              <button onClick={() => {
                setshowMinButton(pageNumbers.length - 10);
                setshowMaxButton(pageNumbers.length);
              }}>&gt;&gt;</button>
            )}
            &nbsp;&nbsp;총 {pageNumbers.length}페이지
          </div>
        </div>
      }

      </div> 
    </div>//ListView
  );
}

function Card(props) {
  const 평일오픈시간 = props.item["OPENWEEKHOUR"];
  let 오픈시 = 0;
  let 오픈분 = 0;
  let dispatch = useDispatch()
  if (props.item["OPENWEEKHOUR"]) {
    const 평일오픈시간 = props.item["OPENWEEKHOUR"];
    오픈시 = String(Math.floor(평일오픈시간 / 100)).padStart(2, "0");
    오픈분 = String(평일오픈시간 % 100).padStart(2, "0");
  }
  const 평일클로즈시간 = props.item["CLOSEWEEKHOUR"];
  let 클로즈시 = 0;
  let 클로즈분 = 0;
  if (props.item["CLOSEWEEKHOUR"]) {
    const 평일클로즈시간 = props.item["CLOSEWEEKHOUR"];
    클로즈시 = String(Math.floor(평일클로즈시간 / 100)).padStart(2, "0");
    클로즈분 = String(평일클로즈시간 % 100).padStart(2, "0");
  }
  return (
    <div className={styles.product_card}>
      <li>
          <strong className={styles.product_title}>
            공구 이름 : {props.item["GONGUNAME"]}
          </strong>
          <img src={process.env.PUBLIC_URL} ></img>
          <div className={styles.product_description}>
            <span className={styles.spantitle}>
              카테고리 : {props.item["MAINGONGUNAME"]} &gt;{" "}
              {props.item["SUBGONGUNAME"]}
            </span>{" "}
            <span>대여장소 : {props.item["PLACENAME"]}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <p>
              운영시간 :{" "}
              {props.item["OPENWEEKHOUR"]
                ? `평일 ${오픈시}시 ${오픈분}분 ~`
                : "평일 영업시간이 없습니다"}
              {props.item["CLOSEWEEKHOUR"]
                ? ` ${클로즈시}시 ${클로즈분}분`
                : " "}
            </p>
            <p className={styles.title_sub}>
              <span>전화번호 : {props.item["TELEPHONE"]}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span>대여료 : {props.item["COST"]}</span>
            </p>
          </div>

        <div className={styles.cotg}>
          <div className={styles.cnt}>
            <span className={styles.ttl}>전체수량 : {props.item["GONGUCOUNT"]}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className={styles.abl} id="abl_14478">
              예약 가능 수량 : {props.item["GONGUCOUNT"]}
            </span>
          </div>
          <button className={styles.purchase_button} onClick={()=> {
            dispatch(ADD_userCart(props.item))

          }}>
            장바구니추가
          </button>
          <button className={styles.purchase_button} onClick={()=> {
            dispatch(DELETETUPLE_userCart(props.item))
          }}>
            장바구니삭제
          </button>
        </div>
      </li>
    </div>
  );
}

export default CheckList;
