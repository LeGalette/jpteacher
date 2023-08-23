const { ipcRenderer } = require('electron');
const { SpeechConfig, AudioConfig, SpeechSynthesizer } = require('microsoft-cognitiveservices-speech-sdk');
require('dotenv').config();

const speechSubscriptionKey = process.env.YOUR_SUBSCRIPTION_KEY;
const speechRegion = process.env.YOUR_REGION;

const speechConfig = SpeechConfig.fromSubscription(speechSubscriptionKey, speechRegion);
const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
speechConfig.speechSynthesisVoiceName = 'ja-JP-NanamiNeural';
const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

const sendQuestionBtn = document.getElementById('translate-btn');
const inputText = document.getElementById('input-text');
const loader = document.getElementById('loader');

async function synthesizeSpeech(text) {
  try {
    const result = await synthesizer.speakTextAsync(text);
    if (result) {
      const base64Audio = result.audioData.slice(44).toString('base64');
      playAudio(base64Audio);
      result.close();
    }
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    throw error;
  }
}

function playAudio(base64Audio) {
  const audio = new Audio('data:audio/wav;base64,' + base64Audio);
  audio.play();
}

inputText.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendQuestionBtn.click();
  }
});

sendQuestionBtn.addEventListener('click', () => {
  const text = inputText.value;
  loader.style.display = 'inline-block';
  ipcRenderer.send('translate-text', text);
});


ipcRenderer.on('translation-result', (event, assistantMessageContent) => {
  const outputText = document.getElementById('output-text');

  // Create and append the question
  const questionContainer = document.createElement('div');
  const questionElement = document.createElement('span');
  questionElement.innerHTML = 'Q: ' + inputText.value;
  questionContainer.appendChild(questionElement);
  outputText.appendChild(questionContainer);

  // Create and append the answer
  const answerContainer = document.createElement('div');
  const answerElement = document.createElement('span');
  answerElement.innerHTML = 'A: ' + assistantMessageContent.trim();
  answerContainer.appendChild(answerElement);
  outputText.appendChild(answerContainer);

  loader.style.display = 'none';
});


