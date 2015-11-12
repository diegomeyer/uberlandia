import re, math
import nltk, nltk.classify.util
from nltk.classify import NaiveBayesClassifier
import pickle
import json

def load_dict(name):
	objs = dict()
	with open('obj/' + name + '.pkl', 'rb') as f:
		while 1:
			try:
				objs.update(pickle.load(f))
			except EOFError:
				break
	f.close()
	return objs

def load_tweets():
	with open('tweets.json') as tt:    
    		data = json.load(tt)

    	testSentences = []

    	for i in data["tweets"]:
		testSentences.append(i["text"])

	return testSentences, data

def save_json(data):
	with open('data.json', 'w') as outfile:
    		json.dump(data, outfile)

def classifyTweets(feature_select):

	testSentences, data = load_tweets()

	f = open('obj/classifier.pickle', 'rb')
	classifier = pickle.load(f)
	f.close()

	j = 0

	for i in testSentences:
	 	testSentences = re.findall(r"[\w']+|[.,!?;]", i.rstrip())
		testFeatures = {word: (word in testSentences) for word in feature_select}
		predicted = classifier.classify(testFeatures)
		data["tweets"][j]["sentiment"] = predicted
		j += 1

	#print data
	print json.dumps(data)
	save_json(data)

feature_select = load_dict('dict')
classifyTweets(feature_select)