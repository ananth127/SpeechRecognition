import React, { useState, useEffect, useRef } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const SpeechToText = () => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recognizing, setRecognizing] = useState(false);
  const recognitionRef = useRef(null);

  // Utility function to detect mobile devices
  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += transcriptPart;
          } else {
            interimText += transcriptPart;
          }
        }

        setInterimTranscript(interimText);
        setTranscript((prev) => prev + finalText);
      };

      recognition.onend = () => {
        setRecognizing(false);

        // On mobile, restart recognition automatically after a stop
        if (isMobileDevice()) {
          setTimeout(() => {
            recognition.start();
            setRecognizing(true);
          }, 500);  // Restart after a 500ms delay to avoid rapid stop/start issues
        }
      };

      recognitionRef.current = recognition;
    } else {
      alert("Your browser doesn't support Speech Recognition.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
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
      <p>{interimTranscript}</p>

      <h2>Final Transcript</h2>
      <p>{transcript}</p>
    </div>
  );
};

export default SpeechToText;
