import React, {useState, useEffect, useRef, useContext} from 'react';
import { IonContent, IonPage, IonItem, IonLabel, IonDatetime,IonModal,IonButton } from '@ionic/react';
import { AppContext } from '../components/State';
import ApodImage from '../components/ApodImage';
import './Search.css';
import moment from 'moment'

const Search: React.FC = () => {
  
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
  const [selectedDate, setSelectedDate] = useState<string>();
  const [apodInfo, setApodInfo] = useState<APODdata>();
  const [showInfo, setShowInfo] = useState(false);
  const [explanationSelected, setExplanationSelected] = useState<string>();
  const [showFavIcon, setShowFavIcon] = useState(false);
  let pickerRef = useRef<HTMLIonDatetimeElement>(null);
  const {dispatch} = useContext(AppContext);

  const handleChangeDate = ($event:CustomEvent) => {
    setSelectedDate(moment($event.detail.value).format('YYYY-MM-DD'))
  }
  
    useEffect(()=> {
      if(selectedDate)
       fetch(`${urlService}&date=${selectedDate}`)
        .then(resp => resp.json())
        .then(result => setApodInfo(result))
    },[selectedDate])
  
  const handleShowModal = (explanation:string) => {
    setShowInfo(true)
    setExplanationSelected(explanation)
  } 

  const handleCloseModal = () => 
    setShowInfo(false)

  const handleDoubleClick = () => {
    dispatch({type:"addFavourite", value:apodInfo})
    setShowFavIcon(true)
    setTimeout(() => setShowFavIcon(false), 400)
  }

    return (
    <IonPage>
      <IonContent fullscreen>
          <div style={{height:'calc(100vh - 112px)', maxHeight:'calc(100vh - 112px)'}} onDoubleClick={handleDoubleClick}>
          {apodInfo ? 
            <ApodImage apod={apodInfo} handleShowModal={handleShowModal} fullScreen={false} index={'0'} />
            :
            <div className="search-bg">
            </div>
          }
          </div>
        <div style={{display:'flex', alignItems:'center'}}><IonButton onClick={ () => pickerRef.current?.open() } style={{width:'60vw'}}>Pick a date</IonButton><span style={{textAlign:'right', flexGrow:0.6}}>{selectedDate ? selectedDate : null}</span></div>
        <div style={{visibility:'hidden'}}>
        <IonItem>
          <IonLabel>{selectedDate ? 'Selected date' : 'Select date'}</IonLabel>
            <IonDatetime ref={pickerRef} max={moment().format('YYYY-MM-DD')} min={"1995-06-20"} value={selectedDate ? selectedDate : ''} onIonChange={handleChangeDate}/>
          </IonItem>
        </div>
        <IonModal isOpen={showInfo} swipeToClose={true} cssClass='modal-info'
            onDidDismiss={handleCloseModal}>
            <div style={{display:'flex', flexDirection:'column'}}>
              <div style={{overflowY:'scroll', maxHeight:'80vh'}}>{explanationSelected}</div>
              <div onClick={handleCloseModal} style={{position:'absolute', bottom:'2vh', left:'2vw'}}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div>
            </div>
        </IonModal>
        <div className={showFavIcon ? 'animatedShow' : ''} style={{position:'absolute', left:'calc(50vw - 32px)', top:'calc(50vh - 32px)', opacity:'0'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="#e4e4e4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Search;
