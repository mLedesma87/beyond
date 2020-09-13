import React, { createContext, useReducer, Dispatch, useEffect } from "react";
import { Plugins } from '@capacitor/core';

interface IState {
  favourites: Array<object>;
}

interface Actions {
  type: string;
  value: any;
}

interface IContextProps {
  state: any;
  dispatch: Dispatch<Actions>;
}

let AppContext = createContext({} as IContextProps);

const initialState = {
    favourites: [],
}

let reducer = (state:IState, action:any) => {
  switch(action.type) {
    case "addFavourite": {
      return { ...state, favourites: [...state.favourites, action.value] }
    }
    case "setFavourites": {
      return {...state, favourites: action.value}
    }
    case "deleteFav": {
      return { ...state, favourites: state.favourites.filter((fav, index) => index !== action.value) }
    }
    default:
      return state
  }
};

function AppContextProvider(props:any) {

  const { Storage } = Plugins;

  const fullInitialState = {
    ...initialState,
  }
  
  let [state, dispatch] = useReducer(reducer, fullInitialState);
  let value = { state, dispatch };

  useEffect(()=>{
    async function getPersistedState() {
      const result = await Storage.get({key:'app'});
      let persistedState = result.value || null;
      if (persistedState !== null) {
        if (dispatch) dispatch({type:'setFavourites', value: JSON.parse(persistedState).favourites})
      }
    }
    getPersistedState();
  },[dispatch]);

  useEffect(()=>{
    if (state && state.favourites) Storage.set({key:'app', value: JSON.stringify(state)})
  },[state])

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}


let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };