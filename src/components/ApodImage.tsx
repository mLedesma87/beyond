import React from 'react';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import moment from 'moment';
import { Plugins } from '@capacitor/core';

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

interface IProps {
    apod: APODdata,
    handleShowModal: any,
    fullScreen:boolean,
    index:string
}

const ApodImage:React.FC<IProps> = ({apod, handleShowModal, fullScreen, index}:IProps) => {

    const { Share, Browser } = Plugins;

    const getVideoIdFromUrl = (url:string) => {
      var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      return (match&&match[1].length===11) ? match[1] : ' ';
    }

    async function launchYoutube(videoUrl:string){
        Browser.open({url: videoUrl})
      }
    
    return(
        <div id={index} className="apod-image" style={{ backgroundImage: apod.media_type === 'image' ? `url(${apod.url})` : `url(https://img.youtube.com/vi/${getVideoIdFromUrl(apod.url)}/hqdefault.jpg)`, height: fullScreen ? '100vh' : '100%'}}>
            <div style={{position:'absolute', right:'4vw', bottom:'15vh', height:'20vh', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                <div onClick={()=> Share.share({
                    title: `${apod.title}${apod.copyright ? `- ${apod.copyright}` : ''}`,
                    text: 'Look at the Astronomy Picture of the Day. Found it on Beyond App',
                    url: `https://apod.nasa.gov/apod/ap${moment(apod.date).format('YYMMDD')}.html`,
                    dialogTitle: 'Share this image'
                    })}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#e4e4e4" stroke="#e4e4e4" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></div>
                <div  onClick={() => PhotoViewer.show(apod.url)}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e4e4e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-maximize"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg></div>
                <div onClick={()=> handleShowModal(apod.explanation)}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e4e4e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>
            </div>
            <div style={{position:'absolute', bottom:'10vh',left:'2vw',width:'70vw', display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
            <div style={{ color:'#e4e4e4', fontSize:'0.7em', height:'25px'}}>{moment(apod.date).format('LL')}</div>
                <div style={{ color:'#e4e4e4', fontSize:'0.9em', textTransform:'uppercase', height:'20px'}}>{apod.copyright}</div>
                <div style={{color:'#efefef', fontSize:'1.5em', textAlign:'left'}}>{apod.title}</div>
            </div>
            {apod.media_type === 'video' ? <div onClick={()=> launchYoutube(`${apod.url.indexOf('vimeo') ? apod.url : `https://www.youtube.com/watch?v=${getVideoIdFromUrl(apod.url)}`}`)} style={{position:'absolute', borderRadius:'120px', backgroundColor:'rgb(250, 250, 250,.2)', padding:'35px', display:'flex', left:'calc(50vw - 60px)', top:'calc(50vh - 60px)'}}><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgb(146, 73, 132)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>: null}
        </div>
    )
}

export default ApodImage;