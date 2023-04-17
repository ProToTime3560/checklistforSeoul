import React, {useEffect, useRef, useCallback, useState} from 'react'
import Select from 'react-select'
import axios from 'axios';
import '../component/CheckList.css';


//출력할개수  지역      
//선택상자   선택상자


function CheckList() {

    const PAGE_SIZE = 20;

    const [page, setPage] = useState(1); // 현재 페이지
    let [viewData, setViewData] = useState([])

    useEffect(() => {
        axios.get('http://localhost:3001/api/getdefaultdata')
          .then(response => {
            const parsedData = response.data;
            setViewData(parsedData);
            console.log(viewData)
          })
          .catch(error => {
            console.error(error);
          });
      }, []);

     const regionList = [
        { value: '모든지역', label: '모든지역' },
        { value: '강남구', label: '강남구' },
        { value: '강동구', label: '강동구' },
        { value: '강북구', label: '강북구' },
        { value: '강서구', label: '강서구' },
        { value: '관악구', label: '관악구' },
        { value: '광진구', label: '광진구' },
        { value: '구로구', label: '구로구' },
        { value: '금천구', label: '금천구' },
        { value: '노원구', label: '노원구' },
        { value: '도봉구', label: '도봉구' },
        { value: '동대문구', label: '동대문구' },
        { value: '동작구', label: '동작구' },
        { value: '마포구', label: '마포구' },
        { value: '서대문구', label: '서대문구' },
        { value: '서초구', label: '서초구' },
        { value: '성동구', label: '성동구' },
        { value: '성북구', label: '성북구' },
        { value: '송파구', label: '송파구' },
        { value: '양천구', label: '양천구' },
        { value: '영등포구', label: '영등포구' },
        { value: '용산구', label: '용산구' },
        { value: '은평구', label: '은평구' },
        { value: '종로구', label: '종로구' },
        { value: '중구', label: '중구' },
        { value: '중랑구', label: '중랑구' },
        { value: '인천광역시 강화군', label: '인천광역시 강화군' }
      ]
    const mainCategoryList = [
        { value: '0', label: '모든공구(대분류)' },
        { value: '1', label: '일반공구' },
        { value: '2', label: '전동공구' },
        { value: '3', label: '생활용품' },
        { value: '4', label: '기타공구' }
    ]

    const middleCategoryList0 = [
        { value: '0', label: '모든공구(중분류)' }
    ]

    const middleCategoryList1 = [
        { value: '0', label: '모든공구(중분류)' },
        { value: '1', label: '공구세트' },
        { value: '2', label: '몽키/렌치/스패너' },
        { value: '3', label: '니퍼/펜치/플라이어' },
        { value: '4', label: '드라이버' },
        { value: '5', label: '망치/함마/장도리' },
        { value: '6', label: '바이스/클램프' },
        { value: '7', label: '톱/낫/삽/원예공구' },
        { value: '8', label: '자/측정공구' },
        { value: '9', label: '커터/절단공구' },
        { value: '10', label: '타카/접착용품' },
        { value: '11', label: '용접/납공구' },
        { value: '12', label: '목공/미장' },
        { value: '13', label: '도장/페인트' },
        { value: '14', label: '자전거공구' },
        { value: '15', label: '못/나사/철사' },
        { value: '16', label: '사다리' },
        { value: '17', label: '바퀴/핸드카' },
        { value: '18', label: '압축/오일' },
        { value: '19', label: '기타 일반공구' }
    ]

    const middleCategoryList2 = [
        { value: '0', label: '모든공구(중분류)' },
        { value: '20', label: '전동공구세트' },
        { value: '21', label: '전동드릴' },
        { value: '22', label: '해머드릴' },
        { value: '23', label: '그라인더' },
        { value: '24', label: '샌더/대패' },
        { value: '25', label: '전동절단/톱/직소' },
        { value: '26', label: '전동드라이버' },
        { value: '27', label: '전동타카' },
        { value: '28', label: '에어건/콤프레셔' },
        { value: '29', label: '비트' },
        { value: '30', label: '랜턴' },
        { value: '31', label: '전선릴' },
        { value: '32', label: '안전용품' },
        { value: '33', label: '기타 전기제품' },
        { value: '34', label: '기타 전동공구' }
    ]

    const middleCategoryList3 = [
        { value: '0', label: '모든공구(중분류)' },
        { value: '35', label: '사무가전' },
        { value: '36', label: '미용가전' },
        { value: '37', label: '디지털가전' },
        { value: '38', label: '재봉공구' },
        { value: '39', label: '캠핑용품' },
        { value: '40', label: '청소용품' },
        { value: '41', label: '김장용품' },
        { value: '42', label: '행사용품' },
        { value: '43', label: '기타 생활용품' }
    ]

    const middleCategoryList4 = [
        { value: '0', label: '모든공구(중분류)' },
        { value: '44', label: '기타공구' },
    ]

    let [selectRegion, setselectRegion] = useState(regionList[0].value);
    let [selectMainCategory, setselectMainCategory] = useState(mainCategoryList[0].value)
    let [selectMiddleCategory, setselectMiddleCategory] = useState(middleCategoryList0[0].value)
    let [userInput, setUserInput] = useState("")


    return (
        <div className="SelectDiv">
                <Select 
                    className="RegionSelect"
                    options={regionList}  
                    placeholder = "지역선택"
                    onChange={(e) => {
                    if(e) {
                        setselectRegion(e.value)
                    }

                }} />
                <Select 
                    className="MainSelect"
                    options={mainCategoryList} 
                    placeholder = "대분류선택"
                    onChange={(e) => {
                    if(e) {
                        setselectMainCategory(e.value)
                    }
                }} />
        
                {
                selectMainCategory === '0' && <Select
                    className="MiddleSelect"
                    options={middleCategoryList0} 
                    placeholder = "중분류선택"
                    onChange={(e) => {
                    if(e) {
                        setselectMiddleCategory(e.value)
                    }
                }} />
                }
                {
                selectMainCategory === '1' && <Select 
                    className="MiddleSelect"
                    options={middleCategoryList1} 
                    placeholder = "중분류선택"
                    onChange={(e) => {
                    if(e) {
                        setselectMiddleCategory(e.value)
                    }
                }} />
                }
                {
                selectMainCategory === '2' && <Select 
                    className="MiddleSelect"
                    options={middleCategoryList2} 
                    placeholder = "중분류선택"
                    onChange={(e) => {
                    if(e) {
                        setselectMiddleCategory(e.value)
                    }
                }} />
                }
                {
                selectMainCategory === '3' && <Select 
                    className="MiddleSelect"
                    options={middleCategoryList3} 
                    placeholder = "중분류선택"
                    onChange={(e) => {
                    if(e) {
                        setselectMiddleCategory(e.value)
                    }
                }} />
                }
                {
                selectMainCategory === '4' && <Select 
                    className="MiddleSelect"
                    options={middleCategoryList4} 
                    placeholder = "중분류선택"
                    onChange={(e) => {
                    if(e) {
                        setselectMiddleCategory(e.value)
                    }
                }} />
                }
                <input className="UserInput" placeholder="공구명 검색" onChange={ (e) => {
                    setUserInput(e.target.value)
                }}/>
                <button className="SerachButton" onClick={ ()=> {

                }}>검색</button>
               <p>{selectRegion} {selectMainCategory} {selectMiddleCategory}{userInput}</p>

               <div className="container">
                <div className="row">
                  {viewData.map(function (a, i) {
                    if (i < 198) {
                    return <Card key={i} item={viewData[i]} i={i}></Card>;
                    }
                  })}
                </div>
              </div>

        </div>
    )
}

function Card(props) {
    return (
      <div className="product-card"> 
        <li><a href="" className="a">
            <strong className="product-title">공구 이름 : {props.item['공구 이름']}</strong>
              <img src={process.env.PUBLIC_URL} className="item-img"></img>
                 <div className="product-description"><span className="spantitle">카테고리 : {props.item['공구 대분류']} &gt; {props.item['공구 중분류']}</span>
                 
                
        

                                  <span>대여장소 :{props.item['대여장소명']}</span>
                                  &nbsp;&nbsp;&nbsp;&nbsp;
                                  <span>운영시간 :
                                   평일 09시 00분 ~ 18시 00분
                                  </span>

                              <p class="title-sub">
                                  <span>전화번호 : {props.item['전화번호']}</span>
                                  &nbsp;&nbsp;&nbsp;&nbsp;
                                  <span>대여료 : {props.item['요금(과금기준 + 요금)']}
                                          
                                      
                                  </span>
                              </p>
                              </div>
                          </a>
                        
                          <div class="cotg">
                              <div class="cnt">
                                  <span class="ttl">전체수량 : {props.item['수량']}</span>
                                  &nbsp;&nbsp;&nbsp;&nbsp;
                                  <span class="abl" id="abl_14478">예약 가능 수량  0</span>
                              </div>
                              <a href="#ppc1" class="od opp-sw-open" id="14478">예약</a>
                          </div>
                      </li>
      </div>
    )
  }

export default CheckList