import re, math
import nltk, nltk.classify.util
from nltk.classify import NaiveBayesClassifier
import cPickle as pickle
import json
import os
import copy_reg


def load_dict(name):
    relativepath = "obj/" + name + ".pkl"
    objs = dict()
    objs = pickle.load(open(os.path.abspath(relativepath), 'rb'))

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

    outfile.close()


def classifyTweets(feature_select):
    testSentences, data = load_tweets()

    with open('tweets.json') as tt:
        classifier = json.load(tt)
    classifier = pickle.loads(os.path.abspath('obj/classifier.pickle'))


    j = 0

    for i in testSentences:
        testSentences = re.findall(r"[\w']+|[.,!?;]", i.rstrip())
        testFeatures = {word: (word in testSentences) for word in feature_select}
        predicted = classifier.classify(testFeatures)
        data["tweets"][j]["sentiment"] = predicted
        j += 1

    # print data
    print json.dumps(data)
    save_json(data)


feature_select = load_dict('dict')
classifyTweets(feature_select)
