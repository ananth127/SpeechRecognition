import React, { useState, useEffect, useRef } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const SpeechToText = () => {
  const [transcript, setTranscript] = useState(''); // Final transcript
  const [interimTranscript, setInterimTranscript] = useState(''); // Live transcript (while speaking)
  const [recognizing, setRecognizing] = useState(false);
  const recognitionRef = useRef(null); // Store recognition instance

  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      // Handle the result event
      recognition.onresult = (event) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += transcriptPart; // Final part of the speech
          } else {
            interimText += transcriptPart; // Interim part (live)
          }
        }
        
        setInterimTranscript(interimText); // Update live transcript
        setTranscript((prev) => prev + finalText); // Append final transcript to the main transcript
      };

      recognition.onend = () => {
        setRecognizing(false);
      };

      recognitionRef.current = recognition; // Store recognition instance in the ref
    } else {
      alert("Your browser doesn't support Speech Recognition.");
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop(); // Ensure cleanup on component unmount
      }
    };
  }, []);

  const startRecognition = () => {
    if (recognitionRef.current && !recognizing) {
      recognitionRef.current.start();
      setRecognizing(true);
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current && recognizing) {
      recognitionRef.current.stop();
      setRecognizing(false);
    }
  };

  return (
    <div>
      <h1>Speech to Text Generator</h1>
      <button onClick={startRecognition} disabled={recognizing}>Start Recording</button>
      <button onClick={stopRecognition} disabled={!recognizing}>Stop Recording</button>

      <h2>Live Transcript (while speaking)</h2>
      <p>{interimTranscript}</p> {/* Display interim (live) transcript */}

      <h2>Final Transcript</h2>
      <p>{transcript}</p> {/* Display final transcript */}
    </div>
  );
};

export default SpeechToText;
