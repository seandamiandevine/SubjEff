var nBackPracticeTrial = {
  timeline: [presentCue, fixation, feedback],
  loop_function: function() {
    if(tCount == cueList.cues[pCount].length-1) {
      tCount = 0;  // reset trial counter for next block
      return false
    } else {
      tCount ++;
      return true
    }
  }
};

var nBackPractice = {
  timeline: [levelRewardCue, nBackPracticeTrial],
  loop_function: function() {
    if(pCount >= numpractrials*levels.length-1) {
      isPractice = false;
      return false
    } else {
      pCount ++;
      return true
    }
  }
};

var rew2disp = 0;
var nBackTrial = {
  timeline: [presentCue, fixation],
  loop_function: function() {
    if(tCount == cueList.cues[bCount].length-1) {
      var thisperf = blockAcc/cueList.cues[bCount].length;
      if(thisperf >= localPerf) {
        var thisbonus = cueList.rew[bCount]/100;
      } else {
        var thisbonus = 0;
      }
      rew2disp+=thisbonus/100;
      $.ajax("add_bonus",{
                type: "GET",
                data: {
                  id: uniqueId,
                  bonus: thisbonus,
                  final: false
                },
                success: function (response) {
                    console.log(response)
                  }
                });
      blockAcc = 0;
      tCount = 0;  // reset trial counter for next block
      return false
    } else {
      tCount ++;
      return true
    }
  }
};

var nBackRun = {
  timeline: [levelRewardCue, nBackTrial, TLX],
  loop_function: function() {
    if( (bCount+1) % (cueList.rew.length/numruns) == 0 & bCount > 0) {
      bCount ++;
      rCount ++;
      return false
    } else {
      bCount ++;
      return true
    }
  }
};

var nBack = {
  timeline: [nBackRun, runTxt],
  loop_function: function() {
    if(rCount == numruns) {
      var nTrials =  numsubtrials*Object.keys(cueList.cues).length;
      var thisperf = taskAcc/nTrials;
      $.ajax("add_bonus",{
                type: "GET",
                data: {
                  id: uniqueId,
                  finalPerf: thisperf,
                  final: true
                },
                success: function (response) {
                    console.log(response)
                }
            });
      return false
    } else {
      return true
    }
  }
};
