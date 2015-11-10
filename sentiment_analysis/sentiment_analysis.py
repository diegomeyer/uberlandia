import re, math, collections, itertools, os
import nltk, nltk.classify.util
import pickle
from nltk.classify import NaiveBayesClassifier
from nltk.corpus import stopwords

POLARITY_DATA_DIR = os.path.join('polarityData', 'rt-polaritydata')
RT_POLARITY_POS_FILE = os.path.join(POLARITY_DATA_DIR, 'rt-polarity-pos.txt')
RT_POLARITY_NEG_FILE = os.path.join(POLARITY_DATA_DIR, 'rt-polarity-neg.txt')

stop = stopwords.words('english')
#this function takes a feature selection mechanism and returns its performance in a variety of metrics
def evaluate_features(feature_select):
	posFeatures = []
	negFeatures = []

	#http://stackoverflow.com/questions/367155/splitting-a-string-into-words-and-punctuation
	#breaks up the sentences into lists of individual words (as selected by the input mechanism) and appends 'pos' or 'neg' after each list
	with open(RT_POLARITY_POS_FILE, 'r') as posSentences:
		for i in posSentences:
			posWords = re.findall(r"[\w']+|[.,!?;]", i.rstrip())
			for i in posWords:
				if i in stop:
					posWords.remove(i)
			posWords = [feature_select(posWords), 'pos']
			posFeatures.append(posWords)

	with open(RT_POLARITY_NEG_FILE, 'r') as negSentences:
		for i in negSentences:
			negWords = re.findall(r"[\w']+|[.,!?;]", i.rstrip())
			for i in negWords:
				if i in stop:
					negWords.remove(i)
			negWords = [feature_select(negWords), 'neg']
			negFeatures.append(negWords)

	posCutoff = int(math.floor(len(posFeatures)))
	negCutoff = int(math.floor(len(negFeatures)))

	trainFeatures = posFeatures[:posCutoff] + negFeatures[:negCutoff]
	#testFeatures = testFeatures[len(testFeatures)]

	#trains a Naive Bayes Classifier
	classifier = NaiveBayesClassifier.train(trainFeatures)	

	bayes = open('obj/' + 'classifier.pickle', 'wb')
	pickle.dump(classifier, bayes)
	bayes.close()

#creates a feature selection mechanism that uses all words
def make_full_dict(words):
	word_dict = dict([(word, True) for word in words if word not in stop])	
	#print word_dict
	save_obj(word_dict, 'dict')
	return word_dict

def save_obj(obj, name ):
    	#with open('obj/'+ name + '.pkl', 'wb') as f:
        	pickle.dump(obj, f, 0)#pickle.HIGHEST_PROTOCOL

f = open('obj/'+ 'dict' + '.pkl', 'wb')

full_dict = make_full_dict

#tries using all words as the feature selection mechanism
print 'using all words as features'
evaluate_features(full_dict)

f.close()