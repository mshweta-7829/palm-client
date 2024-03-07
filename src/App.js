import './App.css';
import React, {useState} from 'react';

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async(e) => {
    setLoading(true);
    e.preventDefault();
    const resp = await fetch("http://localhost:8000/api", {
      method : 'POST',
      headers : {
      Accept : 'application/json',
      'Content-Type' : 'application/json' 
      }, 
      body : JSON.stringify({
        prompt 
      })
    })

    const res = await resp.json();
    setResponse(res);
    setPrompt("");
    setLoading(false);
  }

  return (
    <main className="App">
      <h1 className="App-header">
        ChatBot
      </h1>
      <div style={{margin:'0', flexGrow:'1', overflow:'scroll'}}>
        <div style={{width:'100%', height:'100%'}}>
          {loading && <h2>Loading</h2>}
        {!loading && <article style={{color:"white", margin:'0'}}>{response}</article>}
        </div>
      </div>
      <div className='footer'>
        <textarea className='prompt' placeholder="Ask me anything" value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>
        <button className='btn' onClick={handleSubmit}>Go</button>
        </div>
    </main>
  );
}

export default App;
