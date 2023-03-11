import React, { useEffect, useState } from 'react';
import "../../styles/Sidebar.css";

import axios from 'axios'

import ImageGrid from './ImageGrid';
import Base64ImageInput from './Base64ImageInput';

function Sidebar({setResponseImageUrls, responseImageUrls, selectedImageUrl, 
  canvas, setCanvas, selectedImageDetails}) {

  const [workerInfo, setWorkerInfo] = useState([])
  const [serverURL, setServerURL] = useState("http://localhost:3003")
  const [apiToken, setApiToken ] = useState("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2Nzg0NDIyODUsImlhdCI6MTY3NzU3ODI4NSwiaWQiOjN9.CCRs6Esb86x7cB7EMAB9IpidjaXBYruGASYcZtWUhIc")
  const [workerAddress, setWorkerAddress] = useState("")

  const [workerOptions, setWorkerOptions] = useState([])
  const [jobOptions, setJobOptions] = useState([])

  const [jobSelect, setJobSelect] = useState(null)
  const [jobInfo, setJobInfo] = useState({})
  const [workerSelect, setWorkerSelect] = useState(null)

  const [finalImageUrl, setFinalImageUrl] = useState(selectedImageUrl);

  useEffect(() => {


    //make a request to localhost 3000 to get worker information
    if (serverURL && apiToken)
    {
      axios({
        method: 'get',
        url: `${serverURL}/workers`, // this should be set from the form
        data: {
          token : apiToken
        }
      })
        .then(function (res) {
          console.log(res.data)
          let fWorker = Object.keys(res.data)[0]
          let fJob  = Object.keys(res.data[Object.keys(res.data)[0]].models)[0]

          setWorkerOptions(Object.keys(res.data))        
          setWorkerInfo(res.data)
          setWorkerSelect(fWorker)
          setJobSelect(fJob)

          setJobInfo(res.data[fWorker].models[fJob])
          //set dropdown to first element, create the dropdown and map it to another set
          // of jobs and generated fields
        });
    }
  }, [serverURL, apiToken])


  useEffect(() => {
    if (workerInfo && workerSelect){
      setJobOptions(Object.keys(workerInfo[workerSelect].models))
    }
  }, [workerSelect])


  useEffect(() => {
    if (jobSelect){
      setJobOptions(Object.keys(workerInfo[workerSelect].models))

      //jobInfo update
      setJobInfo(workerInfo[workerSelect].models[jobSelect])
    }
  }, [jobSelect])

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    let formData = new FormData(e.target);
    // console.log(formData);
    console.log("Submitting....");

    let object = {};
    formData.forEach(function(value, key){
      if (key == "image_encoded"){
        value = value.split(",")[1] //remove data descriptor
        object[key] = value;
      } else{
        object[key] = value;
      }
      // console.log(key, value)
    });

    axios({
      method: 'post',
      url: `${serverURL}/execute_task/${workerSelect}`, // this should be set from the form
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
      });

  }

  return (
    <div className="sidebar">
      <div className="input-fields">
        <label>URL:</label>
        <input type="text" placeholder="Enter URL" onChange={(e) => setServerURL(e.target.value)} value={serverURL} />

        <label>Token:</label>
        <input type="text" placeholder="Enter token" onChange={(e) => setApiToken(e.target.value)} value={apiToken} />

        <label>Specific Worker Address:</label>
        <input type="text" placeholder="Enter worker address " onChange={(e) => setWorkerAddress(e.target.value)} />

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
                  return <div>
                      <label>{i}</label>
                      <input type="range" min="0" max="20" name={i} /> 
                      {/* need better range control */}
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

                // more types and more type support
              }
            })}
            <button id="generate-button" type='submit'>Generate</button>
            </form>
          </div>
          </>
          }


    </div>
          <ImageGrid imageUrls={responseImageUrls} 
          canvas={canvas} setCanvas={setCanvas}  selectedImageDetails={selectedImageDetails}/>
    </div>
  )} 
      


export default Sidebar;