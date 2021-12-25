import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import CircularVisualizer from "./CircularVisualizer";
const soundFile = require("./Song1.mp3");

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "CircularVisualizer",
  component: CircularVisualizer,
} as ComponentMeta<typeof CircularVisualizer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CircularVisualizer> = (args) => <CircularVisualizer label={""} audioFile={soundFile} />;

export const HelloWorld = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
HelloWorld.args = {
  label: "Hello world!",
};

export const ClickMe = Template.bind({});
ClickMe.args = {
  label: "Click me!",
};