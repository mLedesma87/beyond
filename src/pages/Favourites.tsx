import React, { useContext, useState } from 'react';
import { IonContent, IonPage, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle,IonActionSheet } from '@ionic/react';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { AppContext } from '../components/State';
import moment from 'moment';
import './Favourites.css';

const Favourites: React.FC = () => {
  
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

  const [showActionSheet, setShowActionSheet] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const { state, dispatch } = useContext(AppContext);

  const getVideoIdFromUrl = (url:string) => {
    if (url) {
      var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      return (match&&match[1].length===11) ? match[1] : ' ';
    }
  }

  const handleCardClick = (index:number) => {
    setShowActionSheet(true)
    setSelectedIndex(index)
  }

  return (
    <IonPage className="favourites-page">
      <IonContent fullscreen>
        {state.favourites && state.favourites.length > 0 ?
          state.favourites.map((apod:APODdata, index:number) => (
            <IonCard key={`fav_${apod.date}`}>
              <IonCardHeader onClick={()=> handleCardClick(index)}>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                  <div>
                    <div style={{ color:'#e4e4e4', fontSize:'0.9em', height:'20px'}}>{moment(apod.date).format('LL')}</div>
                    <IonCardSubtitle>{apod.copyright}</IonCardSubtitle>
                    <IonCardTitle>{apod.title}</IonCardTitle>
                  </div> 
                  <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></div>
                </div>
              </IonCardHeader>
              <img alt={apod.explanation} onClick={()=> PhotoViewer.show(apod.url)} src={apod.media_type === 'image' ? apod.url : `https://img.youtube.com/vi/${getVideoIdFromUrl(apod.url)}/hqdefault.jpg`} />
            </IonCard>
          ))
        : <div className="search-bg"></div>}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          cssClass='action-menu'
          header='Options'
          buttons={[{
            text: 'Remove from list',
            role: 'destructive',
            handler: () => {
              dispatch({type:"deleteFav", value: selectedIndex})
            }
          },{
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              setShowActionSheet(false)
            }
          }]}
        >
        </IonActionSheet>
      </IonContent>
    </IonPage>
  );
};

export default Favourites;
