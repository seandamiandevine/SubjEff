from psychopy import gui
import os 
from fx.subjeff import runTask

def taskStartUp(): 
    # Set directory
    _thisDir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(_thisDir)
    
    # Open dlg
    dlgInfo = {'id':"enter subject's id number", 'age':"enter subject's age", 'sex':"enter subject's sex"}
    dlgBox = gui.DlgFromDict(dictionary=dlgInfo, title='SubjEff Study', order = ['id', 'age', 'sex'])
    if dlgBox.OK: 
        runTask(dlgInfo['id'], dlgInfo['sex'], dlgInfo['age'], _thisDir)

taskStartUp()