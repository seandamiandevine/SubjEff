var TLXlabels = ['Low', 'High'];
var min = 1;
var max = 21;
var start = Math.round((min+max)/2);
var step = 1;

var TLX = {
    type: 'multiple-slider',
    questions: [
      {prompt: "How much mental and perceptual activity was required when doing the task (e.g., thinking, deciding, calculating, remembering, looking, searching, etc.)? Was the task easy or demanding, simple of complex, exacting or forgiving?",
      name: 'mental_demand',
      labels: TLXlabels, slider_start: start, min: min, max: max, step: step},
      {prompt: "How much time pressure did you feel due to the rate or pace at which task elements occured? Was the pace slow and leisurely or rapid and frantic?",
      name: 'temporal_demand',
      labels: TLXlabels, slider_start: start, min: min, max: max, step: step},
      {prompt: "How hard did you have to work mentally to accomplish your level of performance?",
      name: 'effort',
      labels: TLXlabels, slider_start: start, min: min, max: max, step: step},
      {prompt: "How successful do you think you were in accomplishing the goals of the task set by the experimenter (or yourself)? How satisfied were you with your performance in accomplishing these goals",
      name: 'performance',
      labels: ['Poor', 'Good'], slider_start: start, min: min, max: max, step: step},
      {prompt: "How insecure, discouraged, irritated, stressed, and annoyed versus secure, gratified, content, relaxed, and complacent did you feel during the task?",
      name: 'frustration',
      labels: TLXlabels, slider_start: start, min: min, max: max, step: step},
    ],
    require_movement: false,
    slider_width: 400,
    on_finish: function(data) {
      data.run = rCount+1;
      data.block = bCount+1;
      data.reward = cueList.rew[bCount];
      data.N = cueList.lev[bCount];
      var ratings = JSON.parse(data.responses);
      data.demand = ratings.mental_demand;
      data.temporal = ratings.temporal_demand;
      data.effort = ratings.effort;
      data.performance = ratings.performance;
      data.frustration = ratings.frustration;
      console.log(data);
    }
  };
