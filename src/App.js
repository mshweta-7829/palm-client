import './App.css';
import React, {useState} from 'react';
import { IoCopyOutline } from "react-icons/io5";
import { MdOutlineRefresh } from "react-icons/md";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";


function App() {
  const [prevPrompt, setPrevPrompt] = useState("");
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [copy, setCopy] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    await generateResponse(prompt);
  }

  const copyTextToClipboard = () => {
    if (!navigator.clipboard) {
      return
    }
    setCopy(true);
    navigator.clipboard.writeText(response).catch((err) => {
      setError(`Could not copy text: ${err}`)
    })
  }

  const generateResponse = async(d) => {
    setLoading(true);
    const resp = await fetch("http://localhost:8000/api", {
      method : 'POST',
      headers : {
      Accept : 'application/json',
      'Content-Type' : 'application/json' 
      }, 
      body : JSON.stringify({
        prompt : d
      })
    })

    const res = await resp.json();
    setResponse(res);
    setPrevPrompt(prompt);
    setPrompt("");
    setLoading(false);
  }

  const handleRetry = async() => {
    setPrompt(prevPrompt);
    await generateResponse(prevPrompt);
  }

  const handleLike = () => {
    if(like){
      setLike(false);
    }else{
      if(dislike) setDislike(false);
      setLike(true);
    }
  }

  const handleDislike = () => {
    if(dislike){
      setDislike(false);
    }else{
      if(like) setLike(false);
      setDislike(true);
    }
  }

  return (
    <main className="App">
      <div className='App-header'>
        <h1 >
          ChatBot
        </h1>
      </div>
        <div className="resp-container">
          {error &&  <h2 style={{color:"white"}}>{error}</h2>}
          {loading && <h2 style={{color:"white"}}>Loading!!!</h2>}
          {!loading && response.length > 0 && <div className="response">{response}</div>}
          {!loading && response.length > 0 && <div className='icons'>
          {!copy && <IoCopyOutline onClick={copyTextToClipboard} style={{color:"white"}} className='icon' />}
          {copy && <FaCheck style={{color: "white"}}/>}
          <MdOutlineRefresh onClick={handleRetry} style={{color:"white"}} className='icon'  />
          <AiOutlineLike style={{color: like ? "green" : "white"}} onClick={handleLike} className='icon' />
          <AiOutlineDislike style={{color: dislike ? "red" :"white"}} onClick={handleDislike} className='icon'/>
          </div>}
          
        </div>
        <div className='footer'>
          <textarea className='prompt' placeholder="Ask me anything" value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>
          <button className='btn' onClick={handleSubmit}>Go</button>
        </div>
    </main>
  );
}

export default App;
