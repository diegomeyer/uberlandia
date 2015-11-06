import re, math, collections, itertools, os
import nltk, nltk.classify.util, nltk.metrics
import pickle
from nltk.classify import NaiveBayesClassifier
from nltk.metrics import BigramAssocMeasures
from nltk.probability import FreqDist, ConditionalFreqDist

POLARITY_DATA_DIR = os.path.join('polarityData', 'rt-polaritydata')
RT_POLARITY_TEST_FILE = os.path.join(POLARITY_DATA_DIR, 'test.txt')

# def load_obj(name ):
#     with open('obj/' + name + '.pkl', 'rb') as f:
#         return pickle.load(f)
def load_obj(name):
	objs = dict()
	with open('obj/' + name + '.pkl', 'rb') as f:
		while 1:
			try:
				objs.update(pickle.load(f))
			except EOFError:
				break
	f.close()
	#print objs
	return objs

def classifyTweets():
	feature_select = load_obj('dict')

	testFeatures = []

	f = open('classifier.pickle', 'rb')
	classifier = pickle.load(f)
	f.close()

	with open(RT_POLARITY_TEST_FILE, 'r') as testSentences:
		for i in testSentences:
			testSentences = re.findall(r"[\w']+|[.,!?;]", i.rstrip())
			testFeatures = {word: (word in testSentences) for word in feature_select}
			#testSentences = [feature_select(testSentences), 'neg']
			#testFeatures.append(testSentences)	

			predicted = classifier.classify(testFeatures)
			print predicted
			#print 'accuracy:', nltk.classify.util.accuracy(classifier, testFeatures)


	# #initiates referenceSets and testSets
	# referenceSets = collections.defaultdict(set)
	# testSets = collections.defaultdict(set)	

	# #puts correctly labeled sentences in referenceSets and the predictively labeled version in testsets
	# for i, (features) in enumerate(testFeatures):
	# 	#referenceSets[label].add(i)
	# 	predicted = classifier.classify(features)
	# 	testSets[predicted].add(i)

classifyTweets()