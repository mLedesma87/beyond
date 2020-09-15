import React,{ useEffect, useState,useContext } from 'react';
import { IonContent, IonPage, IonSlides, IonSlide, IonModal } from '@ionic/react';
import moment from 'moment';
import ApodImage from '../components/ApodImage';
import { AppContext } from '../components/State';
import { Plugins } from '@capacitor/core';
import './Home.css';

const Home: React.FC = () => {
  
  interface APODdata {
    url:string,
    copyright: string,
    date: string,
    explanation: string,
    hdurl: string,
    media_type: string,
    service_version: string,
    title: string,
    code:number,
    msg:string
  }

  const urlService = `https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_API_KEY}`;
  const [arrDates, setArrDates] = useState<string[]>([]);
  const [data, setData] = useState<APODdata[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [explanationSelected, setExplanationSelected] = useState<string>();
  const [currentDate, setCurrentDate] = useState<string>();
  const [doSearch, setDoSearch] = useState(false);
  const [showFavIcon, setShowFavIcon] = useState(false);
  const {dispatch} = useContext(AppContext);
  const {SplashScreen} = Plugins;

  useEffect(()=> {
    setCurrentDate(moment().format('YYYY-MM-DD'))
    setDoSearch(true)
  }, [])
  
  useEffect(() => {
    if (currentDate && doSearch) {
      setArrDates([
        moment(currentDate).format('YYYY-MM-DD'),
        moment(currentDate).subtract('1','days').format('YYYY-MM-DD'),
        moment(currentDate).subtract('2','days').format('YYYY-MM-DD'),
        moment(currentDate).subtract('3','days').format('YYYY-MM-DD'),
        moment(currentDate).subtract('4','days').format('YYYY-MM-DD'),
      ])
      setCurrentDate(moment(currentDate).subtract('5','days').format('YYYY-MM-DD'))
      setDoSearch(false)
    }
  },[currentDate, doSearch])
  
  useEffect(()=>{
    if (arrDates.length > 1) {
      const getApiData = async () => {
        Promise.all(arrDates.map(date =>
          fetch(`${urlService}&date=${date}`).then(resp => resp.json())
        )).then((res:any) => {
          //filter array to remove errorResponses
          setData([...data, ...res.filter((resObj:APODdata) => !resObj.code)])
          SplashScreen.hide();
        }).catch(err => console.log(err))
      }
      getApiData();
    }
  },[arrDates])

  const handleDoubleClick = ($event:CustomEvent) => {
    dispatch({type:"addFavourite", value:data[$event.detail.target.id]})
    setShowFavIcon(true)
    setTimeout(() => setShowFavIcon(false), 400)
  }

  const handleShowModal = (explanation:string) => {
    setShowInfo(true)
    setExplanationSelected(explanation)
  } 

  const handleCloseModal = () => 
    setShowInfo(false)

  const handleEndReached = () => 
    data.length > 0 ? setDoSearch(true) : null

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonSlides options={{speed:400, direction:'vertical'}} onIonSlideReachEnd={handleEndReached} onIonSlideDoubleTap={handleDoubleClick}>
          {data.map((apod,index) =>(
            <IonSlide key={`${apod.title}_${index}`} id={index.toString()}>
              <ApodImage apod={apod} handleShowModal={handleShowModal} fullScreen={true} index={index.toString()}/>
            </IonSlide>
          ))}
        </IonSlides>
        <IonModal isOpen={showInfo} swipeToClose={true} cssClass='modal-info'
            onDidDismiss={handleCloseModal}>
            <div style={{display:'flex', flexDirection:'column'}}>
              <div style={{overflowY:'scroll', maxHeight:'80vh'}}>{explanationSelected}</div>
              <div onClick={handleCloseModal} style={{position:'absolute', bottom:'2vh', left:'2vw'}}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div>
            </div>
        </IonModal>
        <div className={showFavIcon ? 'animatedShow' : ''} style={{position:'absolute', left:'calc(50vw - 32px)', top:'calc(50vh - 32px)', opacity:'0',pointerEvents:'none'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="#e4e4e4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
