import { configureStore, createSlice} from '@reduxjs/toolkit'

const userCartFromLocalStorage = localStorage.getItem('userCart');
//console.log(userCartFromLocalStorage)
let initialState;
if (userCartFromLocalStorage && userCartFromLocalStorage !== "undefined") {
  initialState = [];initialState = JSON.parse(userCartFromLocalStorage);
} else {
  initialState = [];
}

let viewDataStore = createSlice({
    name : 'viewData',
    initialState : initialState,
    reducers : {
        UPDATE_VIEWDATA(state, action) {
            return action.payload
        },
        GET_VIEWDATA(state) {
            return state
        }
    }
})

export let { UPDATE_VIEWDATA, GET_VIEWDATA} = viewDataStore.actions

let userCart = createSlice({
    name : 'userCart',
    initialState: userCartFromLocalStorage || [],
    reducers : {
        SET_userCart(state, action) {
          return {
            ...state,
            userCart: action.payload
          };
        },
        ADD_userCart(state, action) {
            const itemToAdd = action.payload;
          
            if (!state.userCart || state.userCart.length === 0) { // 빈 배열인 경우
              return {
                cartallcount: 1,
                userCart: [{ GONGUSEQ: itemToAdd.GONGUSEQ, GONGUNAME: itemToAdd.GONGUNAME, GONGUCOUNT: itemToAdd.GONGUCOUNT, cartcount: 1 }]
              };
            }
          
            const itemIndex = state.userCart.findIndex(item => item.GONGUSEQ === itemToAdd.GONGUSEQ);
          
            if (itemIndex === -1) { // 새로운 상품인 경우
              return {
                ...state,
                cartallcount: state.cartallcount + 1,
                userCart: [
                  ...state.userCart,
                  { GONGUSEQ: itemToAdd.GONGUSEQ, GONGUNAME: itemToAdd.GONGUNAME, GONGUCOUNT: itemToAdd.GONGUCOUNT, cartcount: 1 }
                ]
              };
            } else { // 이미 있는 상품인 경우
              const cartItem = state.userCart[itemIndex];
              if (cartItem.cartcount >= cartItem.GONGUCOUNT) {
                alert("해당 항목은 이미 예약할 수 있는 최대 수량입니다!");
                return state;
              }
              
              const updatedCart = state.userCart.map((item, index) => {
                if (index === itemIndex) {
                  return { ...item, cartcount: item.cartcount + 1 };
                }
                return item;
              });
          
              return {
                ...state,
                cartallcount: state.cartallcount + 1,
                userCart: updatedCart
              };
            }
          },
          DELETE_userCart(state, action) { //최소한개까지 삭제
            const itemToRemove = action.payload;
            let itemIndex = -1;
            if(state.userCart && state.userCart.length > 0) {
            itemIndex = state.userCart.findIndex(item => item.GONGUSEQ === itemToRemove.GONGUSEQ);
            }

            if (itemIndex === -1) { // 장바구니에 없는 상품인 경우
              return state;
            } else if (state.userCart[itemIndex].cartcount > 1) { // 해당 상품이 1개 이상인 경우
              const updatedCart = state.userCart.map((item, index) => {
                if (index === itemIndex) {
                  return { ...item, cartcount: item.cartcount - 1 };
                }
                return item;
              });
          
              return {
                ...state,
                cartallcount: state.cartallcount - 1,
                userCart: updatedCart
              };
            } else { // 해당 상품이 1개인 경우
              alert("최소 수량은 하나입니다!");
          
              return {
                ...state
              };
            }
          },
          DELETETUPLE_userCart(state, action) { //그냥 삭제
            const itemToRemove = action.payload;
            let itemIndex = -1;
            if(state.userCart && state.userCart.length > 0) {
            itemIndex = state.userCart.findIndex(item => item.GONGUSEQ === itemToRemove.GONGUSEQ);
            }
              const updatedCart = state.userCart.filter((item, index) => index !== itemIndex);
          
              return {
                ...state,
                cartallcount: state.cartallcount - 1,
                userCart: updatedCart
              };
            
          }
    }
})

export let { SET_userCart, ADD_userCart, DELETE_userCart, DELETETUPLE_userCart } = userCart.actions

export default configureStore({
    reducer: { 
        viewDataStore : viewDataStore.reducer,
        userCartStore : userCart.reducer
    }
})