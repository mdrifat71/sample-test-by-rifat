const Questions = [
  {
    title: "Which is a noun?",
    options: ["govern", "government"],
    correct: 1,
  },
  {
    title: "In which sentence does a noun follow a determiner?",
    options: ["The food's delicious.", "It's delicious food."],
    correct: 0,
  },
  {
    title: " In which sentence does a noun follow an adjective?",
    options: ["Their team played well.", " It's a strong team."],
    correct: 1,
  },
  {
    title: '  "She plays guitar." The noun "guitar" is the',
    options: ["subject of the verb", " object of the verb"],
    correct: 1,
  },
  {
    title: " In which sentence is the subject a pronoun??",
    options: ["England is cold now.", " You'll need warm clothes"],
    correct: 1,
  },
];
let time = 300; // exam time in second

//===========================================================================//
const ms = 1000;

let userAnswer = [];
let correctCount = 0;
const correctCountElem = document.querySelector(".correct-count");
const incorrectCountElem = document.querySelector(".incorrect-count");
const result_wraper = document.querySelector(".result-wraper");
//onCheck
const optionCheckHandler = (e) => {
  let option = e.target;
  let qid = option.getAttribute("qid");
  let value = option.getAttribute("value");
  userAnswer[qid] = value;
};

//fixed elements
const problemSet = document.getElementById("problem-set");
const submit = document.getElementById("submit");

// changeable elements
let card = document.createElement("div");
card.setAttribute("class", "card");
let question = document.createElement("h2");
question.setAttribute("class", "question");
let options = document.createElement("div");
options.setAttribute("class", "options");
let option = document.createElement("div");
option.setAttribute("class", "option");
let radio = document.createElement("input");
radio.setAttribute("type", "radio");
let label = document.createElement("label");
let unsolved = document.createElement("div");
unsolved.classList.add("unsolved");

Questions.forEach((q, qid) => {
  //initialize user answer
  userAnswer[qid] = -1;
  question = question.cloneNode();
  card = card.cloneNode();
  question.innerText = q.title;
  card.appendChild(question);

  options = options.cloneNode();
  q.options.forEach((op, opid) => {
    radio = radio.cloneNode();
    label = label.cloneNode();
    option = option.cloneNode();

    radio.setAttribute("qid", qid);
    radio.setAttribute("name", qid);
    radio.setAttribute("value", opid);
    radio.addEventListener("change", optionCheckHandler);
    label.innerText = op;

    option.appendChild(radio);
    option.appendChild(label);
    options.appendChild(option);
  });
  card.appendChild(options);
  problemSet.appendChild(card);
});

//submit handler
let submited = false;
const submitHandler = () => {
  if (time == -1) {
    confirm("Time over!!");
  } else {
    time = 0;
    if (!confirm("Are your sure?")) return;
  }
  submited = true;
  // reset time
  Array.from(problemSet.children).forEach((card, idx) => {
    let options = card.querySelector(".options");
    let optionList = options.querySelectorAll(".option");

    //reset previously checked value
    optionList.forEach((option) => {
      option.classList.remove("incorrect");
      option.classList.remove("correct");
    });
    let correctOption =
      optionList[Questions[idx].correct].querySelector("input");

    let prevUnsolved = options.querySelector(".unsolved");
    if (prevUnsolved) options.removeChild(prevUnsolved);
    if (userAnswer[idx] < 0) {
      unsolved = unsolved.cloneNode();
      unsolved.innerHTML = "Not Submitted!";
      options.appendChild(unsolved);
      handleUserResult(false, correctOption);
      return;
    }
    let userOption = optionList[userAnswer[idx]].querySelector("input");

    if (userOption.value == correctOption.value) {
      handleUserResult(true, correctOption);
    } else {
      handleUserResult(false, correctOption, userOption);
    }
  });

  correctCountElem.innerText = correctCount;
  incorrectCountElem.innerText = Questions.length - correctCount;
  result_wraper.style.display = "flex";
};
submit.addEventListener("click", submitHandler);

//userResult handler
const handleUserResult = (result, correctOption, userOption = null) => {
  if (result) {
    correctCount++;
    correctOption.parentElement.classList.add("correct");
  } else {
    correctOption.parentElement.classList.add("correct");
    if (userOption) userOption.parentElement.classList.add("incorrect");
  }
};

const hour = document.querySelector(".timer .hour");
const minute = document.querySelector(".timer .minute");
const second = document.querySelector(".timer .second");

const timer = setInterval(() => {
  let tmp_time = time;
  let current_hour = Math.floor(tmp_time / 3600);
  current_hour = current_hour < 10 ? "0" + current_hour : current_hour;
  tmp_time = tmp_time % 3600;
  let current_minute = Math.floor(tmp_time / 60);
  current_minute = current_minute < 10 ? "0" + current_minute : current_minute;
  tmp_time = tmp_time % 60;
  let current_second = tmp_time;
  current_second = current_second < 10 ? "0" + current_second : current_second;

  hour.innerText = current_hour;
  minute.innerText = current_minute;
  second.innerText = current_second;
  time--;

  if (time < 0) {
    clearInterval(timer);
    if (!submited) submitHandler();
  }
}, 1000);
