import React, { useRef, useEffect } from "react";
import { CircularVisualizerProps } from "./CircularVisualizerTypes";
function VisualDemo(props: any) {
  const amplitudeValues = useRef(null);
  let freqBands = props.frequencyBandArray;

  function normalizeFreqBands(freqBands: any) {
    console.log(freqBands);
    let tempFreqBands = [];
    for (let freq of freqBands) {
      // tempFreqBands.push(freq - (10 / freq) * 100);
      // tempFreqBands.push(freq);
      // tempFreqBands.push(freq + (10 / freq) * 100);
      // tempFreqBands.push(freq-0.5);
      tempFreqBands.push(freq);
      tempFreqBands.push(freq + 0.5);
    }
    console.log(tempFreqBands);
  }
  function adjustFreqBandStyle(newAmplitudeData: null) {
    amplitudeValues.current = newAmplitudeData;
    console.log(amplitudeValues.current);
    let domElements = freqBands.map((num: string) =>
      document.getElementById(num)
    );
    for (let i = 0; i < freqBands.length; i++) {
      let num = freqBands[i];
      domElements[
        num
      ].style.backgroundColor = `rgb(255, 25, ${amplitudeValues.current[num]})`;
      domElements[num].style.height = `${amplitudeValues.current[num] / 2}px`;
    }
  }

  function runSpectrum() {
    props.getFrequencyData(adjustFreqBandStyle);
    requestAnimationFrame(runSpectrum);
  }

  function handleStartBottonClick() {
    props.initializeAudioAnalyser();
    requestAnimationFrame(runSpectrum);
  }

  normalizeFreqBands(freqBands);
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "blue",
          position: "relative",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        {freqBands.map((num: React.Key | null | undefined, ind: number) => {
          let radius = props.radius;
          let theta = (360 / props.numberOfBars) * ind;
          theta = theta * (Math.PI / 180);
          const x = radius * Math.sin(theta);
          const y = radius * Math.cos(theta);
          let radian = Math.atan2(y, x);
          let angle = radian * (180 / Math.PI);
          let rotationAngle = 90 - angle < 0 ? 360 + (90 - angle) : 90 - angle;
          return (
            <div
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                padding: "0.5rem",
                bottom: y,
                left: x,
                margin: "0.5rem",
                position: "absolute",
                backgroundColor: "white",
              }}
              id={`${num}`}
              key={num}
              // children={ind}
            />
          );
        })}
      </div>
      <button onClick={handleStartBottonClick}>Play</button>
    </div>
  );
}

const AudioDataContainer = ({
  audioFile: soundFile,
  radius = 200,
  numberOfBars = 20,
  ...props
}: CircularVisualizerProps) => {
  const [state, setState] = React.useState({
    audioData: {
      frequencyBinCount: 0,
      getByteFrequencyData: (amplitudeArray: Uint8Array) => {},
    },
    audioContext: null,
    source: null,
    audioAnalyser: null,
    audioBuffer: null,
    // audioBufferSourceNode: null,
    // audioBufferSourceNodeStarted: false,
    // audioBufferSourceNodeStartedTime: 0,
    // audioBufferSourceNodeStartedTimeOffset: 0,
    // audioBufferSourceNodeStartedTimeOffsetStart: 0,
    // audioBufferSourceNodeStartedTimeOffsetEnd: 0,
    // audioBufferSourceNodeStartedTimeOffsetStarted: false,
    // audioBufferSourceNodeStartedTimeOffsetEnded: false,

    // audioBufferSourceNodeStartedTimeOffsetStartTime: 0,
    // audioBufferSourceNodeStartedTimeOffsetEndTime: 0,
    // audioBufferSourceNodeStartedTimeOffsetStartedTime: 0,
    // audioBufferSourceNodeStartedTimeOffsetEndedTime: 0,
  });
  const [frequencyBandArray, setFrequencyBandArray] = React.useState([
    // @ts-ignore
    ...Array(20).keys(),
  ]);

  const initializeAudioAnalyser = () => {
    const audioFile = new Audio();
    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audioFile);
    const analyser = audioContext.createAnalyser();
    audioFile.src = soundFile;
    analyser.fftSize = 64;
    source.connect(audioContext.destination);
    source.connect(analyser);
    audioFile.play();
    setState((prevState) => {
      prevState.audioData = analyser;
      return prevState;
    });
  };

  const getFrequencyData = (styleAdjuster: any) => {
    const bufferLength = state.audioData.frequencyBinCount;
    const amplitudeArray = new Uint8Array(bufferLength);
    state.audioData.getByteFrequencyData(amplitudeArray);
    styleAdjuster(amplitudeArray);
  };

  return (
    <VisualDemo
      initializeAudioAnalyser={initializeAudioAnalyser}
      frequencyBandArray={frequencyBandArray}
      getFrequencyData={getFrequencyData}
      audioData={state.audioData}
      radius={radius}
      numberOfBars={numberOfBars}
    />
  );
};

const CircularVisualizer = ({
  audioFile,
  ...props
}: CircularVisualizerProps) => {
  return (
    <div
      style={{
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
      }}
    >
      <AudioDataContainer audioFile={audioFile} />
    </div>
  );
};

export default CircularVisualizer;
