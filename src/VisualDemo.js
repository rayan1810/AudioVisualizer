import React, { useRef } from "react";
import { Tooltip, AddIcon, IconButton, Box } from "native-base";
// import "../stylesheets/App.scss

export default function VisualDemo(props) {
  const amplitudeValues = useRef(null);
  let freqBands = props.frequencyBandArray;

  function normalizeFreqBands(freqBands) {
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
  function adjustFreqBandStyle(newAmplitudeData) {
    amplitudeValues.current = newAmplitudeData;
    console.log(amplitudeValues.current);
    let domElements = freqBands.map((num) => document.getElementById(num));
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
    <div>
      <Box position="absolute" top="5" left="5">
        <Tooltip label="Start">
          <IconButton
            icon={<AddIcon size="sm" />}
            id="startButton"
            onPress={() => handleStartBottonClick()}
            disabled={!!props.audioData ? true : false}
          />
        </Tooltip>
      </Box>

      <Box position="relative" alignItems="flex-start" flexDir="row">
        {freqBands.map((num, ind) => {
          let radius = 200;
          let theta = (360 / 20) * ind;
          theta = theta * (Math.PI / 180);
          const x = radius * Math.sin(theta);
          const y = radius * Math.cos(theta);
          let radian = Math.atan2(y, x);
          let angle = radian * (180 / Math.PI);
          let rotationAngle = 90 - angle < 0 ? 360 + (90 - angle) : 90 - angle;
          return (
            <Box
              style={{ transform: [{ rotate: rotationAngle + "deg" }] }}
              p={1}
              bottom={y} //y
              left={x} //x
              m="1"
              position="absolute"
              bg="white"
              shadow={4}
              nativeID={num}
              key={num}
              // children={ind}
            />
          );
        })}
      </Box>
    </div>
  );
}
