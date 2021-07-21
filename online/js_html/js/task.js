
var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);

if(debugmode) {
  var timeline = [fs, i1, i2, nBack, toQs, demographics, nfc, debrief];
} else {
  var timeline = [fs, i1, nBackPractice, i2, nBack, toQs, demographics, nfc, debrief];
};

// run and preload images
jsPsych.init({
    timeline: timeline,
    preload_images: ['static/images/50USC.png', 'static/images/5USC.png'],
    show_preload_progress_bar: true,
    on_data_update: function(data) {
      psiturk.recordTrialData(data)
    },
    on_finish: function() {
      psiturk.saveData({
            success: function(){
            	psiturk.completeHIT();
            },
            error: prompt_resubmit});
      //setTimeout(function(){psiturk.completeHIT();}, 2000); // add short delay so data saves right
    }
});

prompt_resubmit = function() {
  document.body.innerHTML = error_message;
  $("#resubmit").click(resubmit);
};
resubmit = function() {
  document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
  reprompt = setTimeout(prompt_resubmit, 10000);
  psiturk.saveData({
    success: function() {
        clearInterval(reprompt);
        psiturk.completeHIT();
    },
    error: prompt_resubmit
  });
};
