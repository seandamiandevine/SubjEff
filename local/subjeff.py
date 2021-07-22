 # -*- coding: utf-8 -*-
"""
code for an N-back with block-wise reward and demand manipulation 
TLX questions are presented at the end of each block. 


For question, contact Sean. 
seandevine.org
seandamiandevine@gmail.com
"""

from psychopy import visual, core, gui, event, monitors
from psychopy.visual import ShapeStim, ImageStim
from psychopy.constants import (NOT_STARTED, STARTED, PLAYING, PAUSED,
                                STOPPED, FINISHED, PRESSED, RELEASED, FOREVER)
import numpy as np
import pandas as pd
import random
import pyglet
import csv
import os
import datetime as dt
import itertools as it

#Set directory
_thisDir = os.path.dirname(os.path.abspath(__file__))
os.chdir(_thisDir)

#Define functions
def addOutput(file, output):
    with open(file, 'a') as data:
        writer = csv.writer(data)
        writer.writerow(output)

def cueChooser(cues, pTarget, N):
    out=[]
    nTarget=int(pTarget*len(cues))
    targIdx=[1]*nTarget+[0]*(len(cues)-N-nTarget)
    random.shuffle(targIdx)
    targIdx=[0]*N+targIdx
    for c in range(len(cues)): 
        if c < N:
            out+=random.sample(cues,1)
        else:
            targ=out[c-N]
            if targIdx[c]==1:
                out.append(targ)
            else: 
                noTarg=[i for i in cues if i.lower()!=targ.lower()]
                out+=random.sample(noTarg,1)
    return(out)

def runTask(id, sex, age):
    # setup datafile
    filename = _thisDir + os.sep + 'data/SubjEff_' + id+'_'+str(dt.datetime.now())+'.csv'
    with open(filename, 'w') as csvFile:
        writer = csv.writer(csvFile)
        writer.writerow(['id', 'age', 'sex', 'block', 'trial', 'trialinblock', 
                        'N', 'reward', 'cue', 'isTarget', 'choice', 'rt', 'acc'])
    # Window setup
    win = visual.Window(
        size=[1920, 1080], fullscr=True, screen=0,
        allowGUI=False, allowStencil=False,
        monitor='testMonitor', color=[0,0,0], colorSpace='rgb',
        blendMode='avg', useFBO=True,
        units='cm')
    win.mouseVisible=False
    
    # Set constants
    textCol = [-1, -1, -1]                   # font colour
    fontH = 1                                # font height
    numtrials = 12                           # number of trials per block
    numprac = 1                              # number of times subjects practice each combo
    Nlev = [1,2,3]                           # N-back levels
    rewards = [5,50]                         # possible rewards (in CAN cents)
    numruns = 3                              # number of runs of the full task
    nblocks = len(Nlev)*len(rewards)         # number of blocks per run
    cues = ['b','B','d','D','g','G','p',     # cues for nBack
            'P','t','T','v','V']
    choiceKeys = ['a', 'l']                  # keys to make choices
    iti = 0.5                                # time between cues (in s.)
    cueTime = 2                              # Time for which cues and reward stay on screen (in s.)
    pTarget = 1/3                            # proportion of cues that are target in a block
    
    # initialize instructions 
    i1 = visual.TextStim(win=win, name='i1',
        text="Welcome to the study! Press SPACE to navigate through the instructions.", 
        pos=(0, 0), height=fontH, wrapWidth=30, ori=0, color=textCol)
        
    i2 = visual.TextStim(win=win, name='i1',
        text="Today, we will ask you to play a game called the N-back. The game is simple. \
You will see a series of letters appear on the screen one at a time.\
Your job is to say whether the the same letter appeared N steps back or not.", 
        pos=(0, 0), height=fontH, wrapWidth=30, ori=0, color=textCol)

    i3 = visual.TextStim(win=win, name='i1',
        text="For example, imagine you saw the following sequences of letters appear (one at a time):\n\n\
C g C D R \n\n\
As you can see, the 'C' appears twice in the sequence: once at the start and then again 2 letters later.\
Your job will be to keep track of the letters as they appear on the screen and respond appropriately when \
a letter shows up after a certain number of other letters.", 
        pos=(0, 0), height=fontH, wrapWidth=30, ori=0, color=textCol)

    instsA = [i1, i2, i3]
    
    # initialize trial components
    tClock = core.Clock()

    Ntxt= visual.TextStim(win, text="", height=3*fontH, color=textCol, pos=[0, 3])
    Rtxt= visual.TextStim(win, text="", height=3*fontH, color=textCol, pos=[0, -3])
    cue = visual.TextStim(win, text="", height=3*fontH, color=textCol, pos=[0, 0])
    
    #--------------------------------------Start Task-----------------------------------------
    # Instructions 
    for i in instsA: 
        i.draw()
        win.flip()
        event.waitKeys(keyList = ['space'])
    
    # Test trials
    for r in range(numruns):
        combo = list(it.product(Nlev, rewards))
        random.shuffle(combo)
        for b in range(nblocks): 
            thisN = combo[b][0]
            thisR = combo[b][1]
            theseCues = cueChooser(cues, pTarget, thisN)
            Ntxt.text = 'N = ' + str(thisN)
            Rtxt.text = str(thisR)+' cents'
            Ntxt.draw()
            Rtxt.draw()
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
                cue.draw()
                win.flip()
                response = event.waitKeys(keyList = choiceKeys)[0]
                tResp=tClock.getTime()
                RT=tResp-start
                win.flip()
                core.wait(iti)
                end=tClock.getTime()
                if isTarget==1 and response == 'a':
                    acc=1
                elif isTarget==0 and response == 'l':
                    acc=1
                else: 
                    acc=0
                out = [id, age, sex, r+1, b+1, t+1, thisN, thisR, cue.text, isTarget, response, RT, acc, start, end]
                # addOutput(filename, out)

                
runTask('debug', 0, 0)
#cues=['b','B','d','D','g','G','p',     # cues for nBack
#            'P','t','T','v','V']
#print(cueChooser(cues, 1/3, 1))

    



