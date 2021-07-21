var blockText = {
  type: "html-keyboard-response",
  stimulus: "You finished this round! You can take a short break. Press SPACE when you're ready to continue",
  choices: ['space'],
  post_trial_gap: iti
};

levelRewardCue = {
  type: "html-keyboard-response",
  stimulus: function() {
    if(isPractice) {
      var thislev =  '<p style="font-size:'+levfontsize+'px">N-back level: <b>'+pracCueList.lev[pCount]+"</b></p>";
      var h = thislev;
    } else {
      var thislev = '<p style="font-size:'+levfontsize+'px">N-back level: <b>'+cueList.lev[bCount]+"</b></p>";
      var thisrew = '<p style="font-size:'+rewfontsize+'px">If you are '+localPerf*100+' % accurate, you can earn: <br><br><b>'+cueList.rew[bCount]+"c</b></p>";
      var thisimg = '<img src="static/images/'+cueList.rew[bCount]+'USC.png" height=396></img>';
      var h = '<br><br><br><br>'+thislev+'<br><br>'+thisrew+thisimg;
    }
    return(h)
  },
  choice: jsPsych.NO_KEYS,
  response_ends_trial: false,
  trial_duration: rewlevtime,
  post_trial_gap: rewleviti
};

var presentCue = {
  type: "html-keyboard-response",
  stimulus: function() {
    if(isPractice) {
      var thiscue = '<p style="font-size:'+fontsize+'px"><b>'+pracCueList.cues[pCount][tCount]+"</b></p>";
      thiscue += '<p style="position: absolute; top: 30px; right: 30px; text-align:right; font-size:50px"">N = '+pracCueList.lev[pCount]+'</p>';

    } else {
      var thiscue = '<p style="font-size:'+fontsize+'px"><b>'+cueList.cues[bCount][tCount]+"</b></p>";
      thiscue += '<p style="position: absolute; top: 30px; right: 30px; text-align:right; font-size:50px"">N = '+cueList.lev[bCount]+'</p>';
    }
    return(thiscue)
  },
  choices: choicekeys,
  response_ends_trial: function(){
    if(isPractice){
      return(true)
    }
    return(false)
  },
  trial_duration: function(){
    if(!isPractice) {
      return(stimtime)
    }
  },
  on_finish: function(data) {
    data.response = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(data.key_press);
    if(isPractice) {
      data.run = 'practice';
      data.block = pCount+1;
      data.trial = tCount+1;
      data.reward = 'NA';
      data.N = pracCueList.lev[pCount];
      data.cue = pracCueList.cues[pCount][tCount];
      if(tCount < data.N) {
        data.isTarget = 0;
      }else if(pracCueList.cues[pCount][tCount].toLowerCase() == pracCueList.cues[pCount][tCount-data.N].toLowerCase()) {
        data.isTarget = 1;
      } else {
        data.isTarget = 0;
      }
      if(data.response==choicekeys[0] && data.isTarget == 1) {
        acc = 1;
      } else if(data.response==choicekeys[1] && data.isTarget == 0) {
        acc = 1;
      } else {
        acc = 0;
      }
    } else {
      data.run = rCount+1;
      data.block = bCount+1;
      data.trial = tCount+1;
      data.reward = cueList.rew[bCount];
      data.N = cueList.lev[bCount];
      data.cue = cueList.cues[bCount][tCount];
      if(tCount < data.N) {
        data.isTarget = 0;
      } else if(cueList.cues[bCount][tCount].toLowerCase() == toString(cueList.cues[bCount][tCount-data.N]).toLowerCase()) {
        data.isTarget = 1;
      } else {
        data.isTarget = 0;
      }

      if(data.response==choicekeys[0] && data.isTarget == 1) {
        acc = 1;
      } else if(data.response==choicekeys[1] && data.isTarget == 0) {
        acc = 1;
      } else {
        acc = 0;
      }
      taskAcc = taskAcc+acc;
      blockAcc = blockAcc+acc;
    }
    data.acc = acc;
  }
};

var acc = 'NA';
var fixation = {
  type: "html-keyboard-response",
  stimulus: function() {
    var thisfix = '<p style="font-size:'+fontsize+'px">+</p>';
    if(isPractice) {
      thisfix += '<p style="position: absolute; top: 30px; right: 30px; text-align:right; font-size:50px"">N = '+pracCueList.lev[pCount]+'</p>';
    } else {
      thisfix += '<p style="position: absolute; top: 30px; right: 30px; text-align:right; font-size:50px"">N = '+cueList.lev[bCount]+'</p>';
    }
    return(thisfix)
  },
  choice: jsPsych.NO_KEYS,
  trial_duration: iti
};

var feedback = {
  type: "html-keyboard-response",
  stimulus: function() {
    var thisfb = '<p style="font-size:'+fontsize+'px; color:'+fbCol[acc]+'"><b>'+fbMessage[acc]+"</b></p>";
    thisfb += '<p style="position: absolute; top: 30px; right: 30px; text-align:right; font-size:50px"">N = '+pracCueList.lev[pCount]+'</p>';
    return(thisfb)
  },
  choice: jsPsych.NO_KEYS,
  response_ends_trial: false,
  trial_duration: 1000,
};

var runTxt = {
    type: 'instructions',
    pages: [
      '<p>You can take a small break now. When you are ready to continue, press NEXT.<p>'+
      '<p><b>REMEMBER</b>: Press "'+choicekeys[0]+'" if the letter on the screen appeared N screens back. Otherwise, press "'+choicekeys[1]+'".</p>'
    ],
    show_clickable_nav: true,
};
