import { firestoreDB, collection, addDoc } from '..firebaseConfig';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector} from "react-redux"
import { UPDATE_VIEWDATA, ADD_userCart, DELETE_userCart, GET_userCart } from "../component/reduxStoreForViewData.js"

function UserCart() {
    // ...
    const userCart = useSelector((state) => state.userCartStore.userCart);
    let dispatch = useDispatch()
    console.log(Store)

    const addData = async () => {
      try {
        const docRef = await addDoc(collection(firestoreDB, 'User_Reserve'), {
          // 추가할 데이터 객체
          name: 'John Doe',
          age: 30,
        });
        console.log('Document written with ID: ', docRef.id);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    }
  
    // ...
  
    return (
      // ...
      <button onClick={addData}>데이터 추가</button>
      // ...
    );
  }