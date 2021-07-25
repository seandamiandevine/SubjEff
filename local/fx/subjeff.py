# Libraries
from psychopy import visual, core, gui, event, monitors
from psychopy.visual import ShapeStim, ImageStim
from psychopy.constants import (NOT_STARTED, STARTED, PLAYING, PAUSED,
                                STOPPED, FINISHED, PRESSED, RELEASED, FOREVER)
import numpy as np
import random
import os
import datetime as dt
import itertools as it

# My scripts
from fx.cueChooser import cueChooser
from fx.addOutput import addOutput, initCSV

def runTask(id, sex, age, _thisDir):
    """
    N-back with block-wise reward and demand manipulation 
    TLX questions are presented at the end of each block. 
    
    
    For question, contact Sean. 
    seandevine.org
    seandamiandevine@gmail.com
    """
    # Initialize datafile
    filename = _thisDir + os.sep + 'data/SubjEff_' + id+'_'+str(dt.datetime.now())+'.csv'
    initCSV(filename, ['id', 'age', 'sex', 'run', 'block', 'trial', 'N', 'reward', 
            'cue', 'isTarget', 'response', 'rt', 'acc', 'tstart', 'tend', 'localCor', 'globalCor',
            'mental', 'temporal', 'performance', 'effort', 'frustration'])

    # Window setup
    win = visual.Window(
        size=[1920, 1080], fullscr=True, screen=0,
        allowGUI=False, allowStencil=False,
        monitor='testMonitor', color=[0,0,0], colorSpace='rgb',
        blendMode='avg', useFBO=True,
        units='cm')

    # Set constants
    textCol = [-1, -1, -1]                   # font colour
    fontH = 1                                # font height
    numtrials = 12                           # number of trials per block
    numprac = 0 if id=='debug' else 1        # number of times subjects practice each N level
    Nlev = [1,2,3]                           # N-back levels
    rewards = [5,50]                         # possible rewards (in CAN cents)
    numruns = 3                              # number of runs of the full task
    nblocks = len(Nlev)*len(rewards)         # number of blocks per run
    cues = ['b','B','d','D','g','G','p',     # cues for nBack
            'P','t','T','v','V']
    choiceKeys = ['a', 'l']                  # keys to make choices
    iti = 0.5                                # time between cues (in s.)
    respTime = 0.5                           # maximum time to respond to cue (in s.)
    cueTime = 2                              # Time for which cues and reward stay on screen (in s.)
    pTarget = 1/3                            # proportion of cues that are target in a block
    localPerf = 0.75                         # required performance within a block 
    globalPerf = 0.75                        # required performance across blocks
    rewardEarned = 0                         # cum. reward tracker 
    localCor = 0                             # correct response counter within block
    globalCor = 0                            # correct response counter across blocks

    # initialize instructions
    instsA = [
    "Welcome to the study! Press SPACE to navigate through the instructions.", 
    
    "Today, we will ask you to play a game called the N-back. The game is simple. \
You will see a series of letters appear on the screen one at a time. \
Your job is to say whether the the same letter appeared N steps back or not.", 

    "For example, imagine you saw the following sequences of letters appear (one at a time):\n\n\
C g C D R \n\n\
As you can see, the 'C' appears twice in the sequence: once at the start and then again 2 letters later. \
Your job will be to keep track of the letters as they appear on the screen and respond appropriately when \
a letter shows up after a certain number of other letters.", 

    "The number of letters that you need to keep in mind is the N in the name of the game: N-back. \n\n\
If N = 1, you have to say whether the previous letter you saw is the same as the one that is currently on the screen. \n\n\
If N = 2, you have to remember 2 letters back.\n\n\
If N = 3, you have to remember 3 letters back.", 

    "If the letter on the screen appeared N letters back, you need to press the '"+choiceKeys[0]+"' key. \
Otherwise, you need to press the '"+choiceKeys[1]+"' key'\n\n\
It does not matter whether the letter is upper or lower case. If you see the letter 'B' N screens after the letter b, \
these count as the same letter.\n\n\
You will be reminded of the value of N during the N-back.", 

    "You will complete many rounds of the N-back today. Before each round, you will see a message appear on the screen. \
This message will tell you the N-back level. The N-back level can be one of the following: "+', '.join([str(i) for i in Nlev])+". \n\n\
The level tells you how many letters back you need to remember, like you learned on the previous instruction screen. \
For example, if the N-back level is 1, you have to respond whether the letter on the screen is the same as 1 letter ago.", 

    "Before moving on to the real N-back, you will now have the chance to practice. \
Just as you saw on the previous screen, you will see a series of a letters. The letters will only stay on the screen for a short time. \
Based on the rules you just saw, you have the make the correct response:\n\n\
'"+choiceKeys[0]+"' when the letter on the screen matches the letter N screens back\n\
'"+choiceKeys[1]+"' otherwise.\n\n\
When a letter appears on the screen, make your response.",

    "For the practice rounds, we will tell you whether you get each answer right or wrong and you will have unlimited time to respond.\n\n\
Remember:\n\n\
Press the '"+choiceKeys[0]+"' key when the letter matches N letters ago.\n\
If it did not, press the '"+choiceKeys[1]+"' key.\n\
Upper and lower case letters count as the same letter (B = b).\n\n\
Press SPACE to begin the practice round!"
    ]

    instsB = [
    "Good job! You should now be familiar with how the N-back works. For the rest of today,\
you will be able to earn extra money depending on how well you do on the N-back.\n\n\
Before each round, you will see a reward message. This message tells you how much extra money you can earn that round, on top of your base pay (or credits) from this esxperiment. \
Each round of the N-back, you can earn an additional "+str(rewards[0])+" cents or "+str(rewards[1])+" cents depending on how well you do.\n\n\
These bonuses have nothing to do with the N-back level. They are completely independent.",

    "To earn extra money, you have to meet two conditions.\n\n\
1) Make the correct response "+str(localPerf*100)+"% of the time during a round to earn the reward for that round.\n\n\
2) Make the correct response "+str(globalPerf*100)+"% of the time across every round of the entire experiment to earn any bonus money at all.\n\n\
That means that you will not make any bonus money unless you make the right response "+str(globalPerf*100)+"% of the time overall, regardless of your performance in a given round. \
We will not tell you how well you are doing until the end, so stay focused!",

    "After each round, you will be asked a series of questions about the round you just completed.\n\n\
Please answer these as honestly as possible.",

    "To recap, four things will be different from the practice round.\n\n\
First, we will no longer tell you whether you got the right or wrong answer.\n\n\
Second, you will be under time pressure to respond. The letters will only stay on the screen for a short time. \
'If you fail to respond within this time, the game will move on and we will count this as a mistake. \
Try your best to respond as quickly and accurately as possible.\n\n\
Third, you can now earn real money in the N-back. Pay attention to the reward message at the beginning of each round to know how much that round is worth. \
Remember, you only get to keep the money that round if you get "+str(localPerf*100)+"% of your answers right that round AND you get "+str(globalPerf*100)+"% of answers right overall.\n\n\
Finally, after each round, we will now ask you some questions about the round you just played. Please answer these questions honestly.", 

    "If you have ANY questions, stop now and ask the experiment to explain. \n\n\
When you are ready, press SPACE to begin!"
    ]
    instTxt = visual.TextStim(win=win, text="", pos=(0, 0), height=fontH, wrapWidth=30, ori=0, color=textCol)

    # initialize trial components
    tClock = core.Clock()
    Ntxt= visual.TextStim(win, text="", height=2*fontH, color=textCol, pos=[0, 3])
    Rtxt= visual.TextStim(win, text="", height=2*fontH, color=textCol, pos=[0, -3], wrapWidth=50)
    cue = visual.TextStim(win, text="", height=3*fontH, color=textCol, pos=[0, 0])
    Nreminder = visual.TextStim(win, text="", height=2*fontH, color=textCol, pos=[0, 12])
    feedback = visual.TextStim(win, text="", height=3*fontH, color=textCol, pos=[0, 0])
    brkTxt = visual.TextStim(win, text="You can take a short break now.\n\nPress SPACE when you are ready to continue.", height=3*fontH, color=textCol, pos=[0, 0])
    tlxPrompt = visual.TextStim(win, text="", height=fontH, color=textCol, pos=[0, 4], wrapWidth=30)
    tlxScale=visual.RatingScale(win=win, low=0, high=21, precision=1, skipKeys=None,
        marker='circle', markerColor = 'DarkRed',  showValue=False, pos=[0, 0], scale=None, 
        labels=['Low', 'High'])
    tlxQuestions={
    'mental_demand':'How much mental and perceptual activity was required when doing the task (e.g., thinking, deciding, calculating, remembering, looking, searching, etc.)? Was the task easy or demanding, simple of complex, exacting or forgiving?', 
    'temporal_demand':"How much time pressure did you feel due to the rate or pace at which task elements occured? Was the pace slow and leisurely or rapid and frantic?",
    'performance':"How hard did you have to work mentally to accomplish your level of performance?",
    'effort':"How successful do you think you were in accomplishing the goals of the task set by the experimenter (or yourself)? How satisfied were you with your performance in accomplishing these goals",
    'frustration':"How insecure, discouraged, irritated, stressed, and annoyed versus secure, gratified, content, relaxed, and complacent did you feel during the task?"}
    endScreen = visual.TextStim(win, text="", height=fontH, color=textCol, pos=[0, 0], wrapWidth=30)

    #--------------------------------------Start Task-----------------------------------------
    win.mouseVisible=False
    # Instructions A
    for i in instsA: 
        instTxt.text = i
        instTxt.draw()
        win.flip()
        event.waitKeys(keyList = ['space'])
    
    # Practice trials
    for pb in range(numprac):
        for thisN in Nlev:
            theseCues = cueChooser(cues, pTarget, thisN)
            Ntxt.text = 'N = ' + str(thisN)
            Nreminder.text = 'N = ' + str(thisN)
            Ntxt.draw()
            win.flip()
            core.wait(cueTime)
            win.flip()
            core.wait(iti)
            for t in range(numtrials):
                isTarget=0
                if t >= thisN:
                    if theseCues[t] == theseCues[t-thisN]:
                        isTarget=1
                start=tClock.getTime()
                cue.text=theseCues[t]
                Nreminder.draw()
                cue.draw()
                win.flip()
                response = event.waitKeys(keyList = choiceKeys)[0]
                tResp=tClock.getTime()
                RT=tResp-start
                Nreminder.draw()
                win.flip()
                core.wait(iti)
                end=tClock.getTime()
                if isTarget==1 and response == 'a':
                    acc=1
                elif isTarget==0 and response == 'l':
                    acc=1
                else: 
                    acc=0
                
                if acc==1:
                    feedback.text = 'Correct'
                    feedback.color= 'green'
                else:
                    feedback.text = 'Incorrect'
                    feedback.color= 'red'
                Nreminder.draw()
                feedback.draw()
                win.flip()
                core.wait(iti)
                out = [id, age, sex, 'practice', 'NA', t+1, thisN, 'NA', cue.text, isTarget, response, RT, acc, start, end, localCor, globalCor]+['NA']*len(tlxQuestions)
                addOutput(filename, out)

    # Instructions B
    for i in instsB: 
        instTxt.text = i
        instTxt.draw()
        win.flip()
        event.waitKeys(keyList = ['space'])

    # Test trials
    for r in range(numruns):
        combo = list(it.product(Nlev, rewards))
        random.shuffle(combo)
        if r != 0:
            brkTxt.draw()
            win.flip()
            event.waitKeys(keyList = ['space'])
        for b in range(nblocks): 
            win.mouseVisible=False
            thisN = combo[b][0]
            thisR = combo[b][1]
            theseCues = cueChooser(cues, pTarget, thisN)
            Ntxt.text = 'N = ' + str(thisN)
            Nreminder.text = 'N = ' + str(thisN)
            Rtxt.text = str(thisR)+' cents'
            Ntxt.draw()
            Rtxt.draw()
            win.flip()
            core.wait(cueTime)
            win.flip()
            core.wait(iti)
            # N-back
            out=[]
            for t in range(numtrials):
                isTarget=0
                if t >= thisN:
                    if theseCues[t] == theseCues[t-thisN]:
                        isTarget=1
                start=tClock.getTime()
                cue.text=theseCues[t]
                Nreminder.draw()
                cue.draw()
                win.flip()
                key_press = event.waitKeys(keyList = choiceKeys, maxWait=respTime)
                response = 'NA' if not key_press else key_press[0]
                tResp=tClock.getTime()
                RT=tResp-start
                Nreminder.draw()
                win.flip()
                core.wait(iti)
                end=tClock.getTime()
                if isTarget==1 and response=='a':
                    acc=1
                    localCor+=1
                    globalCor+=1
                elif isTarget==0 and response=='l':
                    acc=1
                    localCor+=1
                    globalCor+=1
                else: 
                    acc=0
                out.append([id, age, sex, r+1, b+1, t+1, thisN, thisR, cue.text, isTarget, response, RT, acc, start, end, localCor, globalCor])
            # TLX
            win.mouseVisible=True
            thisTLX = []
            for Q in tlxQuestions.keys():
                tlxPrompt.text=tlxQuestions[Q]
                tlxScale.reset()
                while tlxScale.noResponse:
                    tlxPrompt.draw()
                    tlxScale.draw()
                    win.flip()
                thisTLX.append(tlxScale.getRating())
                win.flip()
                core.wait(iti)
            # Local reward calculation 
            pCor = localCor/numtrials
            if pCor >= localPerf:
                rewardEarned+=thisR
            localCor = 0 # reset for next block
            # Store data from this block
            for row in range(len(out)):
                save = out[row]+thisTLX
                addOutput(filename, out)
    
    # Global reward calculation
    totaltrials = numtrials*nblocks*nruns
    pCor = globalCor/totaltrials
    if pCor < globalPerf:
        rewardEarned = 0
    
    # Show end screen
    endScreen.text='Thank you for completing our study!\n\n\
Throughout the experiment, you were '+str(pCor)+'% accurate.\n\n\
You earned an additional '+str(rewardEarned)+' dollars.\n\n\
See the experimenter to collect your winnings and for further details.'
    endScreen.draw()
    win.flip()
    event.waitKeys(keyList = ['escape'])




