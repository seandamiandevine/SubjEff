import random
import itertools as it


def cueChooser(cues, pTarget, N):
    '''
    Chooses Nback cues based on 1) the available cues, 
    2) the proportion of cues that must be targets, and 
    3) the N level
    '''
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