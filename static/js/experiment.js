const jsPsych = initJsPsych({
  extensions: [
    {type: jsPsychExtensionWebgazer}
  ],
  exclusions: {
    min_width: 800,
    min_height: 600
  },
  show_progress_bar: false,
  display_element: 'jspsych-target',
  on_finish: function() {
    console.log('on_finish')
    if (DEBUG) {
      return jsPsych.data.displayData();
    } else {
      return submitHit();
    }
  },
  on_data_update: function(data) {
    console.log('data', data);
    return psiturk.recordTrialData(data);
  }
});


/* ************************************ */
/* Define experimental variables */
/* ************************************ */

const numFrequency = 1;
const minPayment = 2;
const expectedMaxExpLength = 10;
const guaranteedPositive = true;
let lowEnd, highEnd, startingTotal, winningNumDenom, dimesOrDollars, wheelCondition, omission
let rotationsTime, wheelSpinTime, ballSpinTime;

const writingTimeLimit = 3;

if (condition == 0){
  wheelCondition = "vast_wheel";
} else if (condition == 1){
  wheelCondition = "confined_wheel";
}

if (counterbalance == 0){
  omission = "ball";
} else if (counterbalance == 1){
  omission = "numbers";
}


if (wheelCondition == "vast_wheel"){
  lowEnd = -10;
  highEnd = 25;
  winningNumDenom = 10;
  wheelSpinTime = 4;
} else if (wheelCondition == "confined_wheel"){
  lowEnd = -1;
  highEnd = 4;
  winningNumDenom = 1;
  wheelSpinTime = 9;
}

if (winningNumDenom == 10){
  dimesOrDollars =  "dimes";
} else if (winningNumDenom == 1){
  dimesOrDollars = "dollars";
}

startingTotal = minPayment - (lowEnd / winningNumDenom);

let numorder;
let numorderSorted = [];
let numred = [];
let numblack = [];
for (var i = lowEnd; i <= highEnd; i+= numFrequency) {
  numorderSorted.push(i);
}
if (omission == "numbers"){
  numorder = jsPsych.randomization.shuffle(numorderSorted);
} else if (omission == "ball"){
  numorder = numorderSorted
}

numorder.forEach(function (value, i) {
  if (i % 2 == 0){
    numred.push(value)
  } else{
    numblack.push(value)
  }
});

let numOrderAssignments = [numorderSorted, numorder];


let winningNum;
if (guaranteedPositive) {
  winningNum = Math.floor(Math.random() * highEnd + 0);                    
} else {
  winningNum = numorder[Math.floor(Math.random() * numorder.length)];
}


async function initializeExperiment() {
  LOG_DEBUG('initializeExperiment');


  /* ************************************ */
  /* Set up jsPsych blocks */
  /* ************************************ */

  let inclusionCheck = {
    type: jsPsychBrowserCheck,
    inclusion_function: (data) => {
      return ['chrome'].includes(data.browser);
    },
    exclusion_message: (data) => {
      return `<p>You must use Chrome to complete this experiment.</p>`
    },
    minimum_height: 600,
    minimum_width: 800
  };

  let introInstructions = {
    type: jsPsychInstructions,
    pages: [
    '<p>Hello, and welcome! Our study is interested in introspection and the associated eye correlates. Your task today will be to sit in front of your webcam, get calibrated, write for ' + expectedMaxExpLength + ' minutes in response to an open ended question, get re-calibrated so we know your eye-movements were accurate, and complete a short post-experiment survey.</p>',
    '<p>You\'ll earn a minimum of $' + minPayment + ' for participating today, since the task isn\'t expected to take longer than ' + expectedMaxExpLength + ' minutes.<br><br>Let\'s first get you calibrated (and don\'t worry, we never access the feed of you, just the x, y coordinates of where your eyes were looking).</p>',
    ],
    show_clickable_nav: true
  }

  let initEyeTracking = {
    type: jsPsychWebgazerInitCamera
  }

  let instruct_eyeTracking_light = {
    type: jsPsychHtmlButtonResponse,
    stimulus:
        '<div style="width: 45%; text-align: left; margin: auto;">' +
        "<p><strong>For a preliminary adjustment, please consider the following instructions: </strong></p>" +
        "<ol>" +
        "<li>Sit at a table and make sure that you could later rest your elbows on it. </li>" +
        "<li>Sit towards a window or lamp so that there are no shadows on your face. " +
        "You might additionally turn on a desk lamp for that. <u>Avoid</u> having a window behind you. </li>" +
        "</ol>" +
        "</div>" +
        '<img src="static/images/lightInstruct.png" alt="[Eye-Tracking-Instructions]" style="width: 70%;">',
    choices: ['Click to continue'],
    on_start: () => {
        webgazer.resume();
    },
    on_finish: () => {
        webgazer.pause();
        webgazer.clearData();
    }
  }

  let enter_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true,
    message:
        "<p>This experiment has to be conducted in <strong>full screen mode</strong>. It will end automatically at " +
        "the end of the study.</p><br>",
  }

  let calibration_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>Now you'll calibrate the eye tracking, so that the software can use the image of your eyes to predict where you are looking.</p>
    <p>You\'ll see a series of dots appear on the screen. Look at each dot and click on it.</p>
    `,
    choices: ['Got it'],
  }

  let calibration = {
    type: jsPsychWebgazerCalibrate,
    calibration_points: [
        [20, 20],
        [20, 50],
        [20, 80],
        [35, 35],
        [35, 65],
        [50, 20],
        [50, 50],
        [50, 80],
        [65, 35],
        [65, 65],
        [80, 20],
        [80, 50],
        [80, 80],
    ],
    repetitions_per_point: 4,
    randomize_calibration_order: true,
  }

  let writingInstructions = {
    type: jsPsychInstructions,
    pages: [
    "<p>Great. Now it\'s time for the main task. On the next page write for " + writingTimeLimit + " minutes in response to the prompt, 'What happened in the last month?'. Answer it however you see fit. It is just important that you stay writing for the entire time and stay on task. You can start whenever you\'re ready by advancing to the next screen. The writing screen will then disappear after " + writingTimeLimit + " minutes, automatically advancing you to the end of the study.</p>"
    ],
    show_clickable_nav: true
  }

  let writingTask = {
    type: jsPsychWriting,
    is_html: true,
    initial_text: 'Write here for ' + writingTimeLimit + ' minutes about what happened in the last month',
    timing_response: writingTimeLimit * 60000
  }

  let preWheelInstructions = {
    type: jsPsychInstructions,
    pages: [
    '<p>Great. Right now you are projected to earn $' + startingTotal + '. We also need to re-calibrate you once more to validate the data.</p>'
    ],
    show_clickable_nav: true
  }

  let learnNow = false;
  let choiceAboutInfo = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p>The $' + startingTotal + ' amount you will earn will be slightly different by the time you finish the calibration. It could be as much as $' + -1 * lowEnd + ' less or $' + highEnd + ' more. Do you want to learn about how much the bonus will be now, or do you want to advance directly to the re-calibration screen?</p>',
    choices: ['Learn about how much the bonus will be now', 'Advance directly to the re-calibration screen'],
    on_finish: function(data){
        if (data.response == 0){
            learnNow = true;
        }
    }
  }

  let wheelSpin = {
    type: jsPsychRoulette,
    // numbersFacing: "upright",
    wheelSpinTime: wheelSpinTime,
  }

  let if_node = {
    timeline: [wheelSpin],
    conditional_function: function(){
        // if (learnNow) {
            return true
        // } else {
            // return false
        // }
    }
  }

  let recalibration_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>Now we\'ll re-calibrate you. Once again, you\'ll see a series of dots appear on the screen. Look at each dot and click on it.</p>
    `,
    choices: ['Got it'],
  }

  let recalibration = {
    type: jsPsychWebgazerCalibrate,
    calibration_points: [
        [20, 20],
        [20, 50],
        [20, 80],
        [35, 35],
        [35, 65],
        [50, 20],
        [50, 50],
        [50, 80],
        [65, 35],
        [65, 65],
        [80, 20],
        [80, 50],
        [80, 80],
    ],
    repetitions_per_point: 2,
    randomize_calibration_order: true,
  }

  let postTaskStarterQs = {
    type: jsPsychSurvey,
    pages: [
      [
        {
          type: 'html',
            prompt: `Great. Your bonus was $${winningNum / winningNumDenom}, resulting in a grand total earnings of $${startingTotal + (winningNum / winningNumDenom)}. To get paid, please answer a few questions on the next few pages.`
        },
      ],
      [
            {
                type: 'text',
                name: 'age',
                prompt: 'What is your age?',
                input_type: 'number',
                required: true,
            },
      ],
      [
        {
            type: 'text',
            prompt: 'What is your gender?',
            name: 'gender',
            required: true,
        }
      ]
    ],
    button_label_finish: 'Continue',
  }

  postQAboutWheel = {
    type: jsPsychSurvey,
    pages: [
        [
            {
                type: 'html',
                  prompt: "We\'d like to verify that we properly conveyed the instructions about the roulette wheel.",
              },      

            {
                type: 'text',
                prompt: 'As you were making your choice about which numbers to highlight, did you find it confusing what the highlighting would do, or did you understand that it would leave you with a subset of values that we would subsequently reveal after recalibration?',
                required: true,
                textbox_rows: 2,
                textbow_columns: 25,
            }
        ],
        [
            {
                type: 'text',
                prompt: 'How did you make your choice about the numbers you highlighted? Did you think at all about it, or did you choose hastily without any thought? (Your answer won\'t affect your payment or HIT rating. It\'s for us to better understand the data.)',
                required: true,
                textbox_rows: 2,
                textbow_columns: 25,
            }
        ]
    ]
  }

  function checkIfSpun(){
    jsPsych.data.get().filterCustom(function(trial){
        if (trial.stimulus){
            return trial.stimulus.startsWith(`<p>The ${startingTotal} amount`)
        }
    }).select('response').values[0] == 1;
  }

  let if_spun_wheel = {
    timeline: [postQAboutWheel],
    conditional_function: function(){
        if (checkIfSpun) {
            return true
        } else {
            return false
        }
    }
  }

  let exit_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: false,
    delay_after: 0
  }


  /* create timeline */
  var timeline = [
    // inclusionCheck,
    // introInstructions,
    // initEyeTracking,
    // instruct_eyeTracking_light,
    // enter_fullscreen,
    // calibration_instructions,
    // calibration,
    // writingInstructions,
    // writingTask,
    // preWheelInstructions,
    // choiceAboutInfo,
    if_node,
    recalibration_instructions,
    recalibration,
    postTaskStarterQs,
    if_spun_wheel,
    exit_fullscreen
  ]

  /* start the experiment */
  return jsPsych.run(timeline);



};
