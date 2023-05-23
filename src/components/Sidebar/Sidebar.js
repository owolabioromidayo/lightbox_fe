import React, { useEffect, useState } from 'react';
import "../../styles/Sidebar.css";

import axios from 'axios'

import ImageGrid from './ImageGrid';
import Base64ImageInput from './Base64ImageInput';
import SliderToggleButton from '../SliderToggleButton';
import ImageMaskInput from './ImageMaskInput';

import {ReactComponent as OpenArrow}  from "../../assets/open-arrow.svg";

function Sidebar({setResponseImageUrls, responseImageUrls, selectedImageUrl, 
  canvas, setCanvas, selectedImageDetails}) {

  const [workerInfo, setWorkerInfo] = useState([])
  const [serverURL, setServerURL] = useState("http://localhost:3003")
  const [apiToken, setApiToken ] = useState("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2ODM5NTk2ODIsImlhdCI6MTY4MzA5NTY4MiwiaWQiOjJ9.yMYxHrcju90GTt3UzBRp1jRutFYbnhF2XYbQKudc7nE")
  const [secondaryWorkerURL, setSecondaryWorkerURL] = useState("")
  // const [secondaryWorkerURL, setSecondaryWorkerURL] = useState("http://localhost:3009")
  // const [workerAddress, setWorkerAddress] = useState("")

  const [isFederatedMode, setIsFederatedMode] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);

  const [workerOptions, setWorkerOptions] = useState([])
  const [jobOptions, setJobOptions] = useState([])

  const [jobSelect, setJobSelect] = useState(null)
  const [jobInfo, setJobInfo] = useState({})
  const [workerSelect, setWorkerSelect] = useState(null)

  const [finalImageUrl, setFinalImageUrl] = useState(selectedImageUrl);

  const [loading, setLoading] = useState(false);

  const [mask, setMask] = useState(null);

  const [resposneInfo, setResponseInfo] = useState({'message': null, 'error': null})

  const refreshInfo = () => {
      console.log("refreshing data...")
      const extractJobInfo = (data) => {
              let fWorker = "" 
              let fJob = ""
              try{
                fWorker= Object.keys(data)[0]
                fJob = Object.keys(data[Object.keys(data)[0]].models)[0]
                setJobInfo(data[fWorker].models[fJob])

              } catch {
                setJobInfo({})
                setJobOptions([])
              }

              setWorkerOptions(Object.keys(data))        
              setWorkerInfo(data)
              setWorkerSelect(fWorker)
              setJobSelect(fJob)

      }

      let url = isFederatedMode ? secondaryWorkerURL : serverURL 

      if (url && apiToken){
          axios({
              method: 'get',
              url: `${url}/workers`, 
            })
            .then(function (res) {
                extractJobInfo(res.data)
            });
      }

    }

    
  

  useEffect(() => {
       refreshInfo()
  }, [serverURL, apiToken])

  useEffect(() => {

    const delayDebounceFn = setTimeout(() => {
        refreshInfo()
    }, 1000);

  return () => clearTimeout(delayDebounceFn);
  }, [secondaryWorkerURL])




  useEffect(() => {
    if (workerInfo && workerSelect){
      try{
        setJobOptions(Object.keys(workerInfo[workerSelect].models))
      } catch {
        setJobOptions([])
      }
    }
  }, [workerSelect])


  useEffect(() => {
    if (jobSelect){
      try{
        setJobOptions(Object.keys(workerInfo[workerSelect].models))
        //jobInfo update
        setJobInfo(workerInfo[workerSelect].models[jobSelect])
      } catch{
        setJobInfo({})
      }
    }
  }, [jobSelect])

  const handleFormSubmit = (e) => {
    e.preventDefault();
   
    if (!loading && jobSelect && workerSelect){
        setLoading(true)
        let formData = new FormData(e.target);
        // console.log(formData);

        let object = {};
        formData.forEach(function(value, key){
          if (key == "image_encoded" || key=="image_mask_encoded"){
            value = value.split(",")[1] //remove data descriptor
            object[key] = value;
          } else{
            object[key] = value;
          }
        });
        console.log(object)

        if(!isFederatedMode){
        console.log("Submitting conventional....");

          axios({
            method: 'post',
            url: `${serverURL.trim()}/execute_task/${workerSelect.trim()}`, // this should be set from the form
            data: {
              token : apiToken,
              model: jobSelect,
              ...object
            }
          })
            .then(function (res) {
              console.log(res)
              // console.log(res.data)
              setResponseImageUrls(res.data.data)
              setResponseInfo({'message': '', 'error': false})
            })
              .catch((err) => {
                setResponseInfo({'message': err.message, 'error': true })
              })

        } else{
          console.log("Submitting federated....");
            axios({
              method: 'post',
              url: `${serverURL.trim()}/make_federated_request/${workerSelect.trim()}`, // this should be set from the form
              data: {
                token : apiToken,
                model: jobSelect,
                url: secondaryWorkerURL.trim(),
                ...object
              }
            })
              .then(function (res) {
                console.log(res)
                // console.log(res.data)
                setResponseImageUrls(res.data.data)
                setResponseInfo({'message': '', 'error': false})
              })
              .catch((err) => {
                setResponseInfo({'message': err.message, 'error': true })
              })
        }
      
        
        setLoading(false)
      }

  }


  const handleSecondaryURLChange = (value) => {
    setSecondaryWorkerURL(value);
  }

  return (
    <div className={showSidebar ? 'sidebar sidebar-full': 'sidebar sidebar-closed'}>
    {showSidebar ? 
      <div>
      <div className="sidebar-close-arrow-container"
        onClick={() => setShowSidebar(false)} 
      >
      <OpenArrow
          className="sidebar_close_arrow"
       /> 
      </div>
      <div className="input-fields">
        <label>URL:</label>
        <input type="text" placeholder="Enter URL" onChange={(e) => setServerURL(e.target.value)} value={serverURL} />

        <label>Token:</label>
        <input type="text" placeholder="Enter token" onChange={(e) => setApiToken(e.target.value)} value={apiToken} />

        {/* <label>Specific Worker Address:</label>
        <input type="text" placeholder="Enter worker address " onChange={(e) => setWorkerAddress(e.target.value)} value={workerAddress} /> */}

        <label>Secondary URL:</label>
        <input type="text" placeholder="Enter secondary URL" onChange={e => handleSecondaryURLChange(e.target.value)} value={secondaryWorkerURL}/>

        <div id="refresh-container"> 
          Federated Mode: &nbsp; &nbsp; <SliderToggleButton isOn={isFederatedMode} setIsOn={setIsFederatedMode} />
          <button id='sidebar-refresh-btn' onClick={refreshInfo}>♻</button>
        </div>
      </div>


      <div className="dropdown">
        <p> Worker Choices from connected server</p>
        <select value={workerSelect} onChange={(e) => setWorkerSelect(e.target.value)}>
          {workerOptions.map((i) => {
            return <option value={i}>{i}</option>
          })}
        </select>

      </div>

      <div className="worker_info">
        {/* Specific worker information 
          1. Dropdown for different tasks, default 1
          2. Information about that specific task
          3. Input Required for that specific task
          4. Button to execute that task 
          5. Waiting for task execution feedback
        
          */}
          <div className="dropdown">
            <p> Executable tasks from specific workers</p>
            <select value={jobSelect} onChange={(e) => setJobSelect(e.target.value)}>
              {jobOptions.map((i) => {
                return <option value={i}>{i}</option>
              })}
            </select>
          </div>

          {jobInfo && 
          <>
          <div className="job__desc">
            <p style={{width:"300px"}}>{jobInfo.desc}</p>
          </div>

          <div>
            {/* {jobInfo.input && console.log(Object.keys(jobInfo.input))} */}
            {/* {console.log(jobInfo.input)} */}
            <form onSubmit={handleFormSubmit}>
            {jobInfo.input && Object.keys(jobInfo.input).map((i) => {
              switch(jobInfo.input[i]){
                case "<lstr>":
                  return <div>
                      <label>{i}</label>
                      <textarea placeholder="Enter text" name={i} />
                       </div> 

                case "<int>":
                  return <div class='slider_range_container'>
                      <label>{i} &nbsp; </label>
                      <input type="range" min="0" max="20" name={i} id={i} class='slider_range_input'
                      onChange={ () => {document.getElementById(`show_${i}`).innerText = document.getElementById(i).value}} />
                      <span class="slider_range_text"><span id={`show_${i}`}>20</span> / 20 </span>
                      
                      </div> 
                

                case "<bool>":
                  return <div>
                      <label>{i}</label>
                      <input type='hidden' value='false' name={i} />
                      <input type="checkbox" name={i} value="true"/> 
                      </div> 

                case "<b64>":
                  return <div>
                    <label>{i}</label>
                    <Base64ImageInput selectedImageUrl={selectedImageUrl}
                    finalImageUrl={finalImageUrl} setFinalImageUrl={setFinalImageUrl} />
                    <input type='hidden' value={finalImageUrl} name={i} />
                  </div>

                case "mask<b64>":
                  return <div>
                    <label>{i}</label>
                  <ImageMaskInput mask={mask} setMask={setMask}  />
                  <input type='hidden' value={mask} name={i} />
                  </div>
                
                // more types and more type support
              }
            })}
            <div className='generate-container'>

              <button id="generate-button" type='submit' >Generate</button>
              {loading && <p className="loading"></p>}
              <p className={`response-message${resposneInfo.error && '-error'}`}>
                {resposneInfo.message}
              </p>
            </div>
            </form>
          </div>
          </>
          }


    </div>
          <ImageGrid imageUrls={responseImageUrls} 
          canvas={canvas} setCanvas={setCanvas}  selectedImageDetails={selectedImageDetails}/>
    </div>
  : 
  <div onClick={() => setShowSidebar(true)} className="sidebar-hidden-toggle">
    <OpenArrow
        className="sidebar_open_arrow"/>
  </div>}
  
  </div>
  )} 
      


export default Sidebar;