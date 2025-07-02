import React, { useRef, useState } from 'react';
import "./Recorder.css";

const Recorder = ({ audioCtx, masterGain}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const mediaRecorder = useRef(null);
  const recordedChunks = useRef([]);

  const startRecording = () => {
  const dest = audioCtx.createMediaStreamDestination();

  masterGain.connect(dest);
  masterGain.connect(audioCtx.destination);

  mediaRecorder.current = new MediaRecorder(dest.stream);
  mediaRecorder.current.ondataavailable = (e) => recordedChunks.current.push(e.data);

  mediaRecorder.current.onstop = () => {
    const blob = new Blob(recordedChunks.current, { type: 'audio/webm' });
    setRecordingUrl(URL.createObjectURL(blob));
    recordedChunks.current = [];
  };

  mediaRecorder.current.start();
  setIsRecording(true);
};


  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="recorder">
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {recordingUrl && (
        <>
          <audio controls src={recordingUrl}></audio>
          <a href={recordingUrl} download="recording.webm">Download</a>
        </>
      )}
    </div>
  );
};


export default Recorder;
