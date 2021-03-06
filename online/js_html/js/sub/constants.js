const subject_id = uniqueId; //unique id number generated by psiTurk

jsPsych.data.addProperties({
  subject: subject_id
});

const debugmode = false;                                                 // skips practice trials and does some other things to debug
const basePay = 3;                                                       // how much participants earn without bonus (in USD)
const numpractrials = 1;                                                 // number of practice trials for n-back (per level)
const numsubtrials = 12;                                                 // number of subtrials (cues that appear)
const pTarget = 1/3;                                                     // proportion with which a target appears
const levels = [1, 2, 3];                                                // n-back levels
const rewards = [5, 50];                                                 // reward cues (low, high)
const localPerf = (debugmode) ? 0 : 0.75;                                // level of performance necessary at the block level to earn the reward
const globalPerf = (debugmode) ? 0 : 0.75;                               // overall level of performance necessary to get any reward
const numruns = 3;                                                       // number of runs for each reward/level combo
const stimtime = 1000;                                                   // n-back cue duration and response window (in ms.)
const rewlevtime = 3000;                                                 // reward/level cue duration
const rewleviti = 1500;                                                  // time between reward/n-back level cue and first trial (in ms.)
const iti = 500;                                                         // time after response until next cue (in ms)
const fontsize = 100;                                                    // font size for cue text (in px)
const levfontsize = 50;                                                  // font size for nback level text (in px.)
const rewfontsize = levfontsize-15;                                      // font size for reward text (in px.)
const choicekeys = ['e','i'];                                            // keys that subjects can use to make deck choices
const cues = ['b','B','d','D','g','G','p','P','t','T','v','V'];          // cues in n-back (from Harvey et al., 2005)
const fbMessage = ['Incorrect', 'Correct'];                              // messages for feedback during practice
const fbCol = ['red', 'green'];                                          // message colour for feedback during practice
var rCount = 0;                                                          // run counter
var bCount = 0;                                                          // block counter
var tCount = 0;                                                          // trial counter
var pCount = 0;                                                          // practice trial counter
var taskAcc = 0;                                                         // accuracy across the experiment
var blockAcc = 0;                                                        // accuracy within a block

const pracCueList = {'lev': Array(numpractrials).fill(levels).flat(), 'cues': {}};
for(i = 0; i < numpractrials*levels.length; i++) {
  pracCueList.cues[i] = [];
  var n = pracCueList.lev[i];
  var nTarget = numsubtrials*pTarget;
  var targetListStart = Array(n).fill(-1);
  var targetListTargs = Array(nTarget).fill(1);
  var targetListNonTargs = Array(numsubtrials-nTarget-n).fill(0);
  var targetList = targetListStart.concat(_.shuffle(targetListTargs.concat(targetListNonTargs)));
  var tmpCueList = _.sample(cues, numsubtrials);
  for(j = 0; j < numsubtrials; j++) {
    var nbackcue = tmpCueList[j - n];
    if(targetList[j]==-1){
      // pass
    } else if(targetList[j]==0) {
      var nonTargCues = cues.filter(nontarg => nontarg.toLowerCase() != nbackcue.toLowerCase());
      tmpCueList[j] = _.sample(nonTargCues);
    } else if(targetList[j]==1) {
      tmpCueList[j] = nbackcue;
    }
  }
  pracCueList.cues[i] = tmpCueList;
};

const totalN = levels.length*rewards.length*numruns;
randomList = _.shuffle(Array.from(Array(totalN).keys()));
var cueList = {'rew': Array(totalN).fill(0), 'lev': Array(totalN).fill(0), 'cues': {} };
for (var i = 0; i < totalN; i++) {
    var thisIdx = randomList[i];
    cueList.lev[thisIdx] = levels[i % levels.length];
    if(i < totalN/2) {
      cueList.rew[thisIdx] = rewards[0]
    } else {
      cueList.rew[thisIdx] = rewards[1]
    };

    var nTarget = numsubtrials*pTarget;
    var targetListStart = Array(cueList.lev[thisIdx]).fill(-1);
    var targetListTargs = Array(nTarget).fill(1);
    var targetListNonTargs = Array(numsubtrials-nTarget-cueList.lev[thisIdx]).fill(0);
    var targetList = targetListStart.concat(_.shuffle(targetListTargs.concat(targetListNonTargs)));
    var tmpCueList = _.sample(cues, numsubtrials);
    for(var j = 0; j < numsubtrials; j++) {
      var n = cueList.lev[thisIdx];
      var nbackcue = tmpCueList[j - n];
      if(targetList[j]==-1){
        // pass
      } else if(targetList[j]==0) {
        var nonTargCues = cues.filter(nontarg => nontarg.toLowerCase() != nbackcue.toLowerCase());
        tmpCueList[j] = _.sample(nonTargCues);
      } else if(targetList[j]==1) {
        tmpCueList[j] = nbackcue;
      }
    }
    cueList.cues[thisIdx] = tmpCueList;
  };


var fs = {
	type: 'fullscreen',
  fullscreen_mode: true,
  on_start: function(){
    document.body.style.background = "grey"; // set background to grey
   }
};
