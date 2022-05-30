<template>
  <div v-if="state.status == 0">
    v0.2.1
    <button class="starter" @click="start">START</button>
  </div>
  <div id="container" v-else-if="state.status == 1">
    <div id="header">
      <div id="timer-left">
        <h2>{{ getMinutes() }}:{{ getSeconds() }}</h2>
      </div>
      <div id="score">
        <h2>SCORE: {{ state.score }}</h2>
      </div>
    </div>

    <div id="old">
      <h4 v-html="state.old5"></h4>
      <h4 v-html="state.old4"></h4>
      <h4 v-html="state.old3"></h4>
      <h4 v-html="state.old2"></h4>
      <h4 v-html="state.old1"></h4>
    </div>
    <h1>{{ state.problem }} = ?</h1>
    <input
      id="answer-field"
      type="number"
      pattern="\d*"
      inputmode="numeric"
      v-model="state.answer"
      v-on:keyup.enter="submit()"
    />
    <br />
    <br />
    <br />
    <button id="submit" @click="submit()">SUBMIT</button>
  </div>
  <div id="done" v-else>
    <h1 id="score">
      <h2>SCORE: {{ state.score }}</h2>
    </h1>
    <br />
    <br />
    <br />
    <a href="/" id="start-over-a"
      ><button id="start-over-b">START OVER</button></a
    >
  </div>
</template>

<script setup>
import { reactive } from "vue";
let state = reactive({
  timeLimit: 5,
  timeLeft: 0,
  score: 0,
  max: 20,
  min: 1,
  status: 0,
  problem: "",
  answer: null,
  old5: "",
  old4: "",
  old3: "",
  old2: "",
  old1: "",
  lastAnswer: 0,
});
function start() {
  state.status = 1;

  (function () {
    state.timeLeft = state.timeLimit * 60;
  })();

  const countDownFx = function () {
    if (state.timeLeft > 0) {
      state.timeLeft--;
      state.lastAnswer++;

      console.log(state.timeLeft);
      stresser();
      clearTimeout(countDownId);
      countDownId = setTimeout(countDownFx, 1000);
    } else {
      state.status = 2;
      state.old1 = `${state.problem} = ✔${state.answer}`;
      let audio = new Audio("/audio/tada.mp3");
      audio.play();
    }
  };
  let countDownId = setTimeout(countDownFx, 1000);

  generateQuestion();
}
function maxMin() {
  return Math.floor(Math.random() * (state.max - state.min) + state.min);
}
function generateQuestion() {
  var easyOrHard = Math.random() < 0.01;
  console.log(easyOrHard);
  let firstNum = maxMin();
  let firstRule = Math.random() < 0.5 ? "+" : "-";
  let secondNum = maxMin();
  let secondRule = Math.random() < 0.5 ? "+" : "-";
  let thirdNum = maxMin();
  state.problem = easyOrHard
    ? `${firstNum} ${firstRule} ${secondNum} ${secondRule} ${thirdNum}`
    : `${firstNum} ${firstRule} ${secondNum}`;
  if (eval(state.problem) > 20 || eval(state.problem) < 0) {
    generateQuestion();
  }
  console.log("eval(state.problem)", eval(state.problem));
}
function getMinutes() {
  return Math.floor(state.timeLeft / 60);
}
function getSeconds() {
  let minutesLeft = Math.floor(state.timeLeft / 60);
  let secondsLeft = state.timeLeft - minutesLeft * 60;
  return secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;
}
function submit() {
  state.lastAnswer = 0;
  console.log("submitted");
  if (state.answer == eval(state.problem)) {
    state.score = state.score + 1;
    state.old5 = state.old4;
    state.old4 = state.old3;
    state.old3 = state.old2;
    state.old2 = state.old1;
    state.old1 = `<div style="padding:2px;background-color: rgba(0,255,0,0.2)">${state.problem} = <span style="color:green">✔${state.answer}</span></div>`;
    let audio = new Audio("/audio/bell.mp3");
    audio.play();
  } else if (state.answer == null) {
    state.score = state.score++;
    state.old5 = state.old4;
    state.old4 = state.old3;
    state.old3 = state.old2;
    state.old2 = state.old1;
    state.old1 = `<div style="padding:2px;background-color: rgba(255,255,0,0.2)">${
      state.problem
    } = ❌<span style="color:yellow">Skipped</span> <span style="color:green">✔${eval(
      state.problem
    )}</span></div>`;
    let audio = new Audio("/audio/next.mp3");
    audio.play();
  } else {
    state.score = state.score++;
    state.old5 = state.old4;
    state.old4 = state.old3;
    state.old3 = state.old2;
    state.old2 = state.old1;
    state.old1 = `<div style="padding:2px;background-color: rgba(255,0,0,0.2)">${
      state.problem
    } = <span style="color:red">❌${
      state.answer
    }</span> <span style="color:green">✔${eval(state.problem)}</span></div>`;
    let audio = new Audio("/audio/buzz.mp3");
    audio.play();
  }
  generateQuestion();
  state.answer = null;
  document.getElementById("answer-field").focus();
}
function stresser() {
  console.log("Stress", state.lastAnswer);
  if (state.lastAnswer > 5 && state.lastAnswer <= 10) {
    let audio = new Audio("/audio/beep.mp3");
    audio.play();
  } else if (state.lastAnswer > 10) {
    let audio = new Audio("/audio/beep-beep.mp3");
    audio.play();
  }
}
</script>

<style lang="scss">
html {
  body {
    font-family: Arial, Helvetica, sans-serif;
    height: 100vh;
    width: 100vw;

    background-color: rgb(15, 5, 27);
    color: #fff;
    .starter {
      margin: 100px 15px;
      width: calc(100% - 30px);
      font-size: 32px;
      cursor: pointer;
      background-color: #090;
      color: #fff;
      border-radius: 5px;
    }
    #container {
      #header {
        #timer-left {
          float: left;
        }
        #score {
          float: right;
        }
      }
      #old {
        text-align: left;
        padding: 30px;
        height: 70px;
      }
      h1 {
        font-size: 3.5rem;
        padding-top: 5px;
      }
      h2 {
        font-size: 2rem;
      }
      height: 100vh;
      width: 100vw;
      text-align: center;

      #answer-field {
        font-size: 1.5rem;
        text-align: center;
        width: 100vw;
      }
      #submit {
        width: 100%;
        cursor: pointer;
        padding: 15px 0;
        line-height: 40px;
      }
    }
    #done {
      text-align: center;
      #score {
        font-size: 4rem;
      }
      #start-over-a {
        width: 100%;
        #start-over-b {
          width: 100%;
          padding: 10px;
        }
      }
    }
  }
}
</style>
