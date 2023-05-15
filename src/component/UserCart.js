import { firestoreDB, collection, addDoc, getDocs, doc, deleteDoc} from '../firebaseConfig';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector} from "react-redux"
import { SET_userCart, ADD_userCart, DELETE_userCart, DELETETUPLE_userCart } from "../component/reduxStoreForViewData.js"
import styles from "../component/CheckList.module.css"

function UserCart() {
    // ...
    let [viewDebug, setviewDebug] = useState(true); //콘솔로그확인on off

    const userCart = useSelector((state) => state.userCartStore.userCart);
    let dispatch = useDispatch()
    let cartData = userCart;
    console.log("이곳은 userCart속이다.",cartData)

    let [user_nameInput, setuser_nameInput] =useState();
    let [user_callInput, setuser_callInput] =useState();
    let [user_numInput, setuser_numInput] =useState();
    let [user_nameInputError, setuser_nameInputError] = useState(false);
    let [user_callInputError, setuser_callInputError] = useState(false);
    let [user_numInputError, setuser_numInputError] = useState(false);

    const nameRegex = /^[가-힣]{2,6}$/; //한국은 성제외 5글자까지 출생신고허용
    const phoneRegex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
    const numRegex = /^\d{6}-\d{7}$/;
    
    const addData = async () => {
      try {
        const now = new Date();
        const hour = now.getHours();
        const ampm = hour < 12 ? '오전' : '오후';
        const displayHour = hour % 12 || 12;
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
    
        const data = {
          request_time: `${year}년 ${month}월 ${day}일 ${ampm} ${displayHour}시 UTC+9`,
          //tool_name: ['도구1', '도구2', '도구3', '도구4'],
          cartData: cartData,
          tool_num: 4,
          user_call: user_callInput,
          user_name: user_nameInput,
          user_num: user_numInput
        };
    
        const docRef = await addDoc(collection(firestoreDB, 'User_Reserve'), data);
        console.log('Document written with ID: ', docRef.id);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    }

    const viewData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestoreDB, 'User_Reserve'));
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        });
      } catch (e) {
        console.error('Error getting reserve data: ', e);
      }
    }

    const DeleteData = async () => {
      try {
        const docRef = doc(firestoreDB, 'User_Reserve', 'd2DZchSuyKKdZaanEG9W');
        await deleteDoc(docRef);
        console.log("Document successfully deleted!");
      } catch (e) {
        console.error("Error removing document: ", e);
      }
    }
  
    // ...
  
    return (
      // ...\
      <div className={styles.CheckListView}>
        <div className={styles.tableContainer}>
          <table className={styles.userCarttable}>
            <thead>
              <tr>
                <th className={styles.userCarttableth}>#</th>
                <th className={styles.userCarttableth}>상품명</th>
                <th className={styles.userCarttableth}>수량</th>
                <th className={styles.userCarttableth}>수량변경</th>
                <th className={styles.userCarttableth}>삭제</th>
              </tr>
            </thead>
            <tbody>
            {
              cartData.map((i)=> {
                return (
                  <React.Fragment key={i.GONGUSEQ}>
                    <tr>
                      <td>1</td>
                      <td>{i.GONGUNAME}</td>
                      <td>{i.cartcount}</td>
                      <td>
                        <button className={styles.purchase_button} onClick={()=> {
                          dispatch(ADD_userCart(i))
                        }}>+</button>
                        <button className={styles.purchase_button} onClick={()=> {
                          dispatch(DELETE_userCart(i))
                        }}>-</button>
                      </td>
                      <td><button className={styles.purchase_button} onClick={()=> {
                          dispatch(DELETETUPLE_userCart(i))
                        }}>삭제하기</button></td>
                    </tr>
                    <tr>
                      <td colSpan="4">
                        <hr className={styles.userCarttablehr_line}/>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })
            }
            </tbody>
          </table>
          </div>
          <p>이름:
          <input
          className={styles.UserInput}
          placeholder="홍길동"
          onChange={(e) => {
            setuser_nameInput(e.target.value);
          }}/>
          전화번호:
          <input
          className={styles.UserInput}
          placeholder="010-1234-5678"
          onChange={(e) => {
            setuser_callInput(e.target.value);
          }}/>
          주민등록번호:
          <input
          className={styles.UserInput}
          placeholder="980713-1234567"
          onChange={(e) => {
            setuser_numInput(e.target.value);
          }}/>
          </p> 
          <button className={styles.purchase_button} onClick={()=> {
             const isNameError = !nameRegex.test(user_nameInput);
             const isCallError = !phoneRegex.test(user_callInput);
             const isNumError = !numRegex.test(user_numInput);
           
             setuser_nameInputError(isNameError);
             setuser_callInputError(isCallError);
             setuser_numInputError(isNumError);

            if (user_nameInputError) {
              console.log(user_nameInput);
              alert("이름 입력이 잘못되었습니다.");
            }
            if (user_callInputError) {
              console.log(user_callInput);
              alert("전화번호 입력이 잘못되었습니다.");
            }
            if (user_numInputError) {
              console.log(user_numInput);
              alert("주민등록번호 입력이 잘못되었습니다.");
            }
             
            if (!user_nameInputError && !user_callInputError && !user_numInputError) {
              addData();
            }
          }}>예약하기</button>
      {
      viewDebug == true ? 
      <div>
        <p>디버그 입력확인 : {user_nameInput}, {user_callInput}, {user_numInput}</p>
      <button className={styles.purchase_button} onClick={addData}>데이터 추가</button>
      <button className={styles.purchase_button} onClick={viewData}>데이터조회</button>
      <button className={styles.purchase_button} onClick={DeleteData}>데이터삭제</button>
      </div> : null
      }
      </div>
      // ...
    );
  }

  export {UserCart};