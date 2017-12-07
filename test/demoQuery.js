var nodejieba = require("../index.js");

var sentence = "我要轉帳100元給我媽媽從薪資帳號，另外說一下，我喜歡基金與信用卡服務";

var result;

result = nodejieba.query(sentence);
console.log(JSON.stringify(result,null,2));
