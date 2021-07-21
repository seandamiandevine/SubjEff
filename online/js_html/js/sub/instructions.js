var i1 = {
    type: 'instructions',
    pages: [
      '<p>Welcome to this study!</p>'+
      '<p>To navigate through the instructions, click on the buttons below with your mouse.</p>',

      '<p>Today, we will ask you to play a game called the <b>N-back</b>.</p>'+
      '<p>The game is simple. You will see a series of letters appear on the screen one at a time.'+
      ' Your job is to say whether the the same letter appeared <b>N</b> steps back or not.</p>'+
      '<p>Click NEXT to learn more.</p>',

      '<p>For example, you may see the following sequences of letters appear (one at a time): </p>'+
      '<br>' +
      '<img src="static/images/i1_letterSeq.png"></img>'+
      '<br>'+
      '<p>As you can see, the <b>C</b> appears twice in the sequence: once at the start and then again 2 letters later.</p>'+
      '<p>Your job will be to keep track of the letters as they appear on the screen and respond appropriately when a letter shows up after a certain number of other letters.</p>',

      '<p>The number of letters that you need to keep in mind is the <b>N</b> in the name of the game: <b>N</b>-back.</p>'+
      '<p>If <b>N</b> is 1, you have to say whether the previous letter you saw is the same as the one that is currently on the screen.</p>'+
      '<p>If <b>N</b> is 2, you have to remember 2 letters back. If <b>N</b> is 3, you have to remember 3 letters back.</p>'+
      '<br>'+
      '<p>If the letter on the screen appeared <b>N</b> letters back, you need to press the <b>'+choicekeys[0]+'</b> key. Otherwise, you need to press the <b>'+choicekeys[1]+'</b> key.</p>' +
      '<p><b>It does not matter whether the letter is upper or lower case</b>. If you see the letter <b>B</b> N screens after the letter <b>b</b>, these count as the same letter.<p>.' +
      '<p>You will be reminded of the value of <b>N</b> in the top-right corner of the screen during the N-back.</p>',

      '<p>You will complete many rounds of the N-back today. Before each round, you will see a message appear on the screen.</p>'+
      '<p>This message will tell you the <b>N-back level</b>. The N-back level can be one of the following: '+levels.join(', ')+'. The level tells you how many letters back you need to remember, like you learned on the previous instruction screen.</p>'+
      '<p>For example, if the N-back level is 1, you have to respond whether the letter on the screen is the same as 1 letter ago.</p>',

      '<p>Before moving on to the real N-back, now you will have the chance to practice.</p>'+
      '<p>Just as you saw on the previous screen, you will see a series of a letters. The letters will only stay on the screen for a short time.</p>'+
      '<p>Based on the rules you just saw, you have the make the correct response.</p>'+
      '<p>When a letter appears on the screen, make your response. Each letter will be followed by a cross in the middle of the screen before the next letter appears.</p>.',
      //'<p>After each letter, a cross will appear in the center of the screen before the next letter appears. <b>Make your response only when this cross appears</b>.</p>',

      '<p>For the practice rounds, we will tell you whether you get each answer right or wrong and you will have unlimited time to respond.</p>'+
      '<p><b>Remember</b>:</p>'+
      '<br>'+
      '<ol>'+
        '<li>Press the <b>'+choicekeys[0]+'</b> key when the letter on the screen showed up <b>N</b> screens ago.</li>'+
        '<li>If it did not, press the <b>'+choicekeys[1]+'</b> key.</li>'+
        '<li>Make your response when the cross appears, after the letter appears on the screen.</li>'+
        '<li>Upper and lower case letters count as the same letter (<b>B</b> is the same as <b>b</b>).</li>'+
        '</ol>'+
        '<br>'+
      '<p>When you click NEXT, you will begin practicing the N-back.</p>',
    ],
    show_clickable_nav: true,
    on_finish: function() {
      if(debugmode) {
         isPractice = false;
      } else {
        isPractice = true;
      }
    }
};

var i2 = {
    type: 'instructions',
    pages: [
      '<p>Good job! You should now be familiar with how the N-back works. For rest of this HIT, you will be able to earn extra money depending on how well you do on the N-back.</p>'+
      '<p>Before each round, you will see a reward message. This message tells you how much extra money you can earn that round, on top of your base pay from this HIT.</p>'+
      '<p>Each round of the N-back, you can earn an additional <b>'+rewards[0]+' cents</b> or <b>'+rewards[1]+' cents</b>, depending on how well you do</p>.'+
      '<p><b>These bonuses have nothing to do with the N-back level.</b> They are completely independent.</p>',

      '<p>To earn extra money, you have to meet two conditions.<p>'+
      '<ol>'+
        '<li>You have to make the correct response '+localPerf*100+'% of the time during a round to earn the reward for that round.</li>'+
        '<li>You have to make the correct response '+globalPerf*100+'% of the time <b>across every round of the entire experiment to earn any bonus money at all </b>.</li>'+
        '</ol>'+
      '<br>' +
      '<p>That means that you will not make any bonus money unless you make the right response '+globalPerf*100+'% of the time overall, regardless of your performance in a given round.</p>'+
      '<p>We will not tell you how well you are doing until the end, so stay focused!</p>',

      '<p>After each round, you will be asked a series of questions about the round you just completed.</p>'+
      '<p>Please answer these as honestly as possible.</p>',

      '<p>Those are all the instructions. If you feel like you do not understand something, use the PREVIOUS button to go back.</p>' +
      '<p>Now you are ready to start the real N-back and earn extra money.</p>',

      '<p>Compared to the practice phase, four things will be different.</p>'+
      '<p>First, we will no longer tell you whether you got the right or wrong answer.</p>'+
      '<p>Second, you will be under <b>time pressure</b> to respond. The letters will only stay on the screen for a short time. '+
      'If you fail to respond within this time, the game will move on and we will count this as a mistake. Try your best to respond as quickly and accurately as possible.</p>'+
      '<p>Third, you can now earn <b>real money</b> in the N-back. Pay attention to the reward message at the beginning of each round to know how much that round is worth. ' +
      '<b>Remember</b>, you only get to keep the money that round if you get '+localPerf*100+'% of your answers right that round <b>and</b> you get '+globalPerf*100+'% of answers right overall.</p>'+
      '<p>Finally, after each round, we will now ask you some questions about the round you just played. Please answer these questions honestly.</p>'+
      '<p>When you are ready to start, press NEXT.</p>'
    ],
    show_clickable_nav: true,
};
