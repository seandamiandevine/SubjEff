
# Load data ---------------------------------------------------------------

rm(list=ls())
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

data <- do.call(rbind, lapply(paste0('data/', list.files('data/')), read.csv, stringsAsFactors=F)) 
data <- data[data$run!='practice', ]
data$gender <- ifelse(tolower(data$gender)=='male', 1, 0)
data$age <- ifelse(data$age > 1000, 2021-data$age, data$age)
Nsubs <- length(unique(data$subject)) # number of subjects
mAge  <- mean(data$age)               # average age
mGend <- mean(data$gender)            # gender split
tperSub <- table(data$subject)        # trials per subject
comments <- unique(data$comments)     # subject feedback
data$N <- factor(data$N)
data$reward <- factor(data$reward)

# Fix broken acc measure
for(i in 1:nrow(data)){
  thisN <- data$N[i]
  if(data$trial[i]<=thisN) {data[i,'isTarget'] = 0; next}
  data[i, 'isTarget'] <- ifelse(data[i,'cue']==data[i-thisN, 'cue'], 1, 0)
  
  if(is.na(data[i,'key_press'])) {data[i, 'acc']=0; next}
  if(data[i, 'isTarget']==1 & data[i, 'key_press']==69) {
    data[i, 'acc'] = 1
  } else if(data[i, 'isTarget']== 0 & data[i, 'key_press']==73) {
    data[i, 'acc'] = 1
  } else {
    data[i, 'acc'] = 0
  }
}

# Sanity checks -----------------------------------------------------------

# Tabulate N and rewards to double-check counterbalancing
aggregate(list(nTrial=data$trial), list(N=data$N, c=data$reward), length)

data.1 <- data[data$subject==data$subject[1], ]

aggregate(list(nTrial=data.1$trial), list(N=data.1$N, c=data.1$reward), function(x)
  length(x)/max(data.1$trial))


# Filter subjects ---------------------------------------------------------

# average acc. 
# crit=.5
# macc = tapply(data$acc, data$subject, mean)
# keep = names(macc)[macc>=crit]
# data <- data[data$subject %in% keep, ]

# Preliminary plots -------------------------------------------------------

se <- function(x) sd(x, na.rm=T)/sqrt(length(x))

# Overall accuracy
macc = tapply(data$acc, data$subject, mean)

hist(macc, main='', xlab='Mean Accuracy', xlim=c(0, 1))
abline(v=.75, lty='dashed', col='black')
text(.8, 10, 'Bonus\ncutoff')


# Accuracy per N and reward
acc <- tapply(data$acc, list(data$reward, data$N), mean, na.rm=T)
accse <- tapply(data$acc, list(data$reward, data$N), se)

plot(colnames(acc), acc[1,], type='n', xlab='N', ylab='p(Correct)', xaxt='n', 
     ylim=range(pretty(c(acc-accse, acc+accse))))
axis(1, at=1:3, labels=1:3)
ltypes=c('solid', 'dashed')
for(i in 1:nrow(acc)){
  lines(1:3, acc[i,], type='b', lty=ltypes[i], pch=16)
  arrows(1:3, acc[i,]-accse[i,], 1:3, acc[i,]+accse[i,], length=0)
}
legend('bottomleft', bty='n', lty=ltypes, legend=rownames(acc), title = 'Reward (¢)')


# RT per N and reward
data.acc <- data[data$acc==1,]
rt <- tapply(data.acc$rt, list(data.acc$reward, data.acc$N), mean, na.rm=T)
rtse <- tapply(data.acc$rt, list(data.acc$reward, data.acc$N), se)

plot(colnames(rt), rt[1,], type='n', xlab='N', ylab='Correct RT (in ms.)', xaxt='n', 
     ylim=range(pretty(c(rt-rtse, rt+rtse))))
axis(1, at=1:3, labels=1:3)
ltypes=c('solid', 'dashed')
for(i in 1:nrow(rt)){
  lines(1:3, rt[i,], type='b', lty=ltypes[i], pch=16)
  arrows(1:3, rt[i,]-rtse[i,], 1:3, rt[i,]+rtse[i,], length=0)
}
legend('bottomleft', bty='n', lty=ltypes, legend=rownames(rt), title = 'Reward (¢)')


# TLX per N and reward
tlxDims = c('performance', 'frustration', 'demand', 'temporal', 'effort')
TLXtable <- aggregate(list(data[,tlxDims]), 
                      by=list(id=data$subject, reward=data$reward, N=data$N), 
                      mean)
X11()
layout(matrix(1:(length(tlxDims)+1), nrow=3, ncol=2, byrow=T))
for(i in tlxDims){
  
  mVal = tapply(TLXtable[,i], list(TLXtable[,2], TLXtable[,3]), mean)
  seVal = tapply(TLXtable[,i], list(TLXtable[,2], TLXtable[,3]), se)
  
  plot(colnames(mVal), mVal[1,], type='n', xlab='N', ylab=i, xaxt='n', 
       ylim=range(pretty(c(mVal-seVal, mVal+seVal))))
  axis(1, at=1:3, labels=1:3)
  ltypes=c('solid', 'dashed')
  for(i in 1:nrow(mVal)){
    lines(1:3, mVal[i,], type='b', lty=ltypes[i], pch=16)
    arrows(1:3, mVal[i,]-seVal[i,], 1:3, mVal[i,]+seVal[i,], length=0)
  }
  
}
plot(0,type='n', xaxt='n', yaxt='n', xlab='', ylab='', bty='n')
legend('center', bty='n', lty=ltypes, legend=rownames(mVal), title = 'Reward (¢)', cex=2)


# Basic statistics --------------------------------------------------------

library(lme4)
library(lmerTest)

# contrasts(data$N) <- contr.treatment(3)
# contrasts(data$reward) <- contr.sum(2)

data$N <- as.numeric(as.character(data$N))
data$reward <- as.numeric(as.character(data$reward))

# Rt
data.acc <- data[data$acc==1,]
rt_model <- lmer(rt~N*reward + (1|subject), data=data.acc)
summary(rt_model)

# Acc
acc_model <- glmer(acc~N*reward + (1|subject), data=data, family='binomial')
summary(acc_model)

# ratings
mlmList <- sapply(tlxDims, function(v) lmer(data[,v]~data$N*data$reward + (1|data$subject)))

sjPlot::tab_model(mlmList[[1]], mlmList[[2]], mlmList[[3]], mlmList[[4]], mlmList[[5]], 
                  dv.labels = tlxDims, 
                  pred.labels = c('Intercept', 'N', 'reward', 'N*reward'))

out <- sapply(mlmList, function(m) summary(m), simplify = F)


