var nodejieba = require( __dirname + "/build/Release/nodejieba.node");
nodejieba.DEFAULT_DICT = __dirname + "/dict/jieba.dict.utf8",
nodejieba.DEFAULT_HMM_DICT = __dirname + "/dict/hmm_model.utf8",
nodejieba.DEFAULT_USER_DICT = __dirname + "/dict/user.dict.utf8";
nodejieba.DEFAULT_IDF_DICT = __dirname + "/dict/idf.utf8";
nodejieba.DEFAULT_STOP_WORD_DICT = __dirname + "/dict/stop_words.utf8";

var isDictLoaded = false;

var someFunct = nodejieba.load;
nodejieba.load = function (dictJson) {
  if (!dictJson) {
    dictJson = {}
  }
  dict         = dictJson.dict       || nodejieba.DEFAULT_DICT;
  hmmDict      = dictJson.hmmDict    || nodejieba.DEFAULT_HMM_DICT;
  userDict     = dictJson.userDict   || nodejieba.DEFAULT_USER_DICT;
  idfDict      = dictJson.idfDict    || nodejieba.DEFAULT_IDF_DICT;
  stopWordDict = dictJson.stopWordDict || nodejieba.DEFAULT_STOP_WORD_DICT;

  isDictLoaded = true;
  return someFunct.call(this, dict, hmmDict, userDict, idfDict, stopWordDict);
}

//https://gist.github.com/luw2007/6016931
const entityConvert = function(entity) {
  const rtn = {word: entity.word};
  switch(entity.tag.charAt(0).toLowerCase()) {
    case("n"):
      rtn["pos_tag"]="NN";
      break;
    case("v"):
      rtn["pos_tag"]="VV";
      break;
    case("a"):
      rtn["pos_tag"]="JJ";
      break;
    default:
      rtn["pos_tag"]="NN";
  }
  return rtn;
};

/*[ { word: '我要', tag: 'N' },
  { word: '轉帳', tag: 'Nv' },
  { word: '100', tag: 'm' },
  { word: '元', tag: 'n' },
  { word: '給', tag: 'Vt' },
  { word: '我', tag: 'n' },
  { word: '媽媽', tag: 'N' }]
*/
nodejieba.query = function(sentence) {
  
  var rtn = [{input:sentence, output:[]}];
  nodejieba.tag(sentence).forEach((entity) => {
    rtn[0].output.push(entityConvert(entity));
  });
  return rtn;
}

function wrapWithDictLoad(obj, functName) {
  var someFunct = obj[functName];
  obj[functName] = function () {
    if (!isDictLoaded) {
      nodejieba.load();
    }
    return someFunct.apply(this, arguments);
  }
}

wrapWithDictLoad(nodejieba, "cut");
wrapWithDictLoad(nodejieba, "cutAll");
wrapWithDictLoad(nodejieba, "cutHMM");
wrapWithDictLoad(nodejieba, "cutForSearch");
wrapWithDictLoad(nodejieba, "cutSmall");
wrapWithDictLoad(nodejieba, "tag");
wrapWithDictLoad(nodejieba, "extract");
wrapWithDictLoad(nodejieba, "insertWord");

module.exports = nodejieba;
