import {Injectable} from '@angular/core';
//import 'math-expression-evaluator' as s;
import * as mexp from 'math-expression-evaluator';
@Injectable()
export class WorkScreenService{

  public paddingLevel = [];
  public tabs = [];
  private pad1 = 0;
  private pad2 = 0;
  private pad3 = 0;

  constructor(){}

  public parseText(content:string, tabs:number[], index:number){


    let data = {
      raw:content,
      // content:content.innerText.replace(/<script>/g, "&lt;script&gt;"),//.replace(/</script>/g, "&lt;script&gt;/"),
      content:content,
          words:content.split(" "),
          lineNumber:0,
          vocab:-1,
          bulletPointLevel:0,
          url:[],
          headerSize:0,
          padding:"",
          tableColumn:-1,
          table:{},
          underline:[],
          bold:[],
          italic:[]};

    data.lineNumber = index;

    this.tabs = tabs;

    // if(content.childNodes.length > 1){
    //   let childLength = 0;
    //   Array.from(content.childNodes).map((child:any) => {
    //     switch(child.nodeName){
    //       case "STRONG":
    //         data.bold.push(childLength);
    //         data.bold.push(child.length);
    //         break;
    //       case "U":
    //         data.underline.push(childLength);
    //         data.underline.push(child.length);
    //         break;
    //       case "EM":
    //         data.italic.push(childLength);
    //         data.italic.push(child.length);
    //         break;
    //     }
    //     childLength += child.length;
    //
    //     // return {
    //     //   tag:child.nodeName,
    //     //   text:child.textContent
    //     // }
    //   });
    //
    // }

    data = this.isBulletPoint(data);

    data = this.isHeader(data);
    data = this.isVocab(data);

    data = this.isTitle(data);
    data = this.isMathExpression(data);

    let temp =  this.printParsed(data);
    //console.log(temp)
    return  temp;
  }

  //counts the number of trailing tildas to determine the size of the header (1=large, 6=small)
  public isHeader(data:any){
  	var headerSize = 0;
  	data.headerSize = 0;
  	var i = data.content.length-1;
  	while(data.content.charAt(i) == '`'){
  		headerSize++;
  		i--;
  	}
  	data.content = data.content.substring(0, data.content.length-headerSize);
  	if(headerSize > 6)
  		headerSize =  6;
  	data.headerSize = headerSize;
    return data;
  }

  public isTitle(data){
    //console.log(nextContent);
    var content, words,score;

    // if(false)
		//  words = nextContent.innerText.replace(/<script>/g, "&lt;script&gt;").split(" ");
		//  score = 0;
    // var nextIsHeader = false;
		// for(var i = 0; i < words.length; i++){
		// 	if(words[i].length > 0)
		// 		score = (this.isWordUperCase(words[i])|| this.containsIntegers(words[i]) ? score+1 : score);
		// }
		// if(score/words.length >= 0.6){
		// 	nextIsHeader = true;
		// }

	if(data.headerSize == 0 && data.vocab == -1){
		 content = data.content;
		 words = content.split(" ");
		 score = 0;
		for(var i = 0; i < words.length; i++){
			if(words[i].length > 0)
				score = (this.isWordUperCase(words[i])|| this.containsIntegers(words[i]) ? score+1 : score);
		}
		if(score/words.length >= 0.6){
      //if(nextIsHeader)
      // console.log(this.pad1, this.pad2, this.pad3)
			   //data.headerSize = 3;
    //  else
    if(this.tabs[0]){
      if(this.tabs[2])
        data.headerSize = 2;
      else
        data.headerSize = 3;

    }else
      data.headerSize = 4;


        //data.headerSize = 2;

		}

	}
  return data;

}

public findURL(data){
	var leftLength = 0;
	for(var i = 0; i < data.words.length; i++){
		if(data.words[i].length >= 9){
			if(this.isURL(data.words[i])){
				data.url.push(leftLength);
				data.url.push(leftLength+data.words[i].length);
			}
		}
		leftLength += data.words[i].length;
	}
	return data;
}

public isURL(s) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(s);
}

public isWordUperCase(input){
	if(input.charCodeAt(0) >= 65 && input.charCodeAt(0) <=  90)
		return true;
	else
		return false;
}

public containsIntegers(input){
	if(input.charCodeAt(0) >= 48 && input.charCodeAt(0) <=  57)
		return true;
	else
		return false;
}

public isBulletPoint(data){
	var level = 0;
	while(data.content.charAt(level) == '`'){
		level++;
	}
	data.content = data.content.substring(level);

	data.bulletPointLevel = level;
	data.vocab -= level;

  return data;
}

public isVocab(data){
	var text = data.content.trim();
	var dash = text.indexOf('-');
	var colin = text.indexOf(':');
	var equals = text.indexOf('=');
	var tilda = text.indexOf('`');
	var marks = [];

	if(dash > 0){
		if(data.url.length > 0){
			var t = false;
			for(var i = 0; i < data.url.length-1; i+=2){
				if(dash < data.url[i+1] && dash > data.url[i]){
					break;
				}else{
					t = true;
				}
			}
			if(t)
				marks.push(dash);
		}else
			marks.push(dash);
	}
	if(colin > 0){
		if(data.url.length > 0){
			var t = false;
			for(var i = 0; i < data.url.length-1; i+=2){
				if(colin < data.url[i+1] && colin > data.url[i]){
					break;
				}else{
					t = true;
				}

			}
			if(t)
				marks.push(colin);
		}else
			marks.push(colin);

	}
	if(equals > 0){
		if(data.url.length > 0){
			var t = false;

			for(var i = 0; i < data.url.length-1; i+=2){
				if(equals < data.url[i+1] && equals > data.url[i]){
					break;
				}else{
					t = true;
				}
			}
			if(t)
				marks.push(equals);
		}else
			marks.push(equals);

	}

	var maxLeftHandCharacters = 0;
	var w = 0;
	while(w < data.words.length && w < 5){
		maxLeftHandCharacters += data.words[w].length;
		w++;
	}

	if(marks.length > 0){
		//var split = text.length;
		var split = text.length;
		for(var i = 0 ; i < marks.length; i++){
			if(marks[i] < split && marks[i] <= maxLeftHandCharacters)
				split = marks[i];
		}
		if(split < text.length)
			data.vocab = split;


	}
  return data;
}



public isMathExpression(data){
  let a = data.content.trim();
	if(a.length >= 3){
		for(var i = 0; i < a.length; i++){
			if( (a.charAt(i) >= '0' && a.charAt(i) <= '9') || a.charAt(i) == '+' || a.charAt(i) == '-'  || a.charAt(i) == '*'  || a.charAt(i) == '/'  || a.charAt(i) == ' ' || a.charAt(i) == ')'  || a.charAt(i) == '('  ){

			}else{
				return data;
			}

		}
		var lastChar = a.charAt(a.length-1);
		if(lastChar != '+' && lastChar != '-' && lastChar != '*' && lastChar != '/' && lastChar != '(' && lastChar != '=' ){
        data.content += " = " + mexp.eval(a);
    }
	}

  return data;
	//var letterNumber = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
	//return a.match(letterNumber);

}

public printParsed(data):WorkingLine{
  // console.log(data.content);
  let temp:WorkingLine = {content : data.content, style:"", tabs:0, tabLevels:[0,0,0]};
  switch(data.headerSize){
    case 4:
    temp.style = "header1";
    break;
    case 3:
    temp.style = "header2";
    break;
    case 2:
    temp.style = "header3";
    break;
    case 1:
    temp.style = "header4";
    break;
    case 0:
    temp.style = "normal";
    break;
  }
  if(data.headerSize > 0){
    if(data.headerSize == 4){
      this.tabs[0] = 3;
      this.tabs[1] = 0;
      this.tabs[2] = 0;
    }
    if(data.headerSize == 3){
      this.tabs[2] = 2;
      this.tabs[1] = 0;
    }
    if(data.headerSize == 2){
      this.tabs[1] = 2;
    }
  }

  if(data.headerSize > 0){
    if(data.headerSize != 4)
      temp.tabs += this.tabs[0];
    if(data.headerSize != 3)
      temp.tabs  += this.tabs[2];
    if(data.headerSize != 2)
      temp.tabs  += this.tabs[1];
  }else
    temp.tabs  += (this.tabs[0]+this.tabs[1]+this.tabs[2]);
    // console.log("TABS",temp.tabs);
    temp.tabLevels = this.tabs
  return temp;
}

public print(data){
  var tagTypes = [ "p", "h4", "h3", "h2", "h1", "h1", "h1", "h1" ];
	//var tagTypes = [ "p", "p", "p", "p", "p", "p", "p" ];
	var fontSizeTypes = [ "20", "35", "26", "22", "18", "18", "18" ];
	var html = "";


		var openTag = tagTypes[data.headerSize] + ((data.headerSize > 0) ? " class='header-text'" : "");
		var color = '#444444';
		var opacity = 1;

		if(data.content.trim().length == 0){
			html += "<p><br></p>";
		}else{
      //this.paddingLevel.map(a => {
        //for(var i = 0; i < a; i++) data.padding += "&nbsp;&nbsp;";
      //});
			if(data.headerSize > 0){
				color = "#f00";
				opacity = 1-(0.1)*data.headerSize;

        if(data.headerSize == 4){
          //this.paddingLevel == [];
          //data.padding = "";
          this.pad3 = 5;
          this.pad2 = 0;
          this.pad1 = 0;
        }
        if(data.headerSize == 3){
          this.pad2 = 3;
          this.pad1 = 0;
        }
        if(data.headerSize == 2){
          this.pad1 = 2;
        }
        if(this.paddingLevel.length > 0 && data.headerSize == this.paddingLevel[this.paddingLevel.length-1]){
          //this.paddingLevel[this.paddingLevel.length-1] = data.headerSize;
          //data.padding = "";

        }

        //this.paddingLevel.push(data.headerSize);

        //for(var i = 0; i < data.headerSize; i++) this.paddingLevel += "&nbsp;&nbsp;";
			}
			var closeTag = tagTypes[data.headerSize];




			if(data.bulletPointLevel > 0){
				var type = "";

        let bulletLevelPlusPadding = data.bulletPointLevel-1;
        if(this.pad1+this.pad2+this.pad3 >= 5)
          bulletLevelPlusPadding += 1;
				if(bulletLevelPlusPadding == 0){
          type = "";
				}else{

          type = "ql-indent-"+(bulletLevelPlusPadding);
				}

				//if(openTag == "p"){
					html += "<ul><li class=\"" + type+";\">";
					closeTag = "li></ul";
				//}else{
					//html += "<" + openTag + " id=\""+ data.lineNumber + "\"";
					//html += ">" + "<ul><li style=\"list-style-type:" + type+";font-size:"+fontSizeTypes[data.headerSize] + "px;";
					//closeTag = "li><ul></"+closeTag;
					//}
			}else{
				html += "<" + openTag + " id=\""+ data.lineNumber + "\""+">";
        if(data.headerSize > 0){
          if(data.headerSize != 4)
            html += this.getSpacing(this.pad3);
          if(data.headerSize != 3)
            html += this.getSpacing(this.pad2);
          if(data.headerSize != 2)
            html += this.getSpacing(this.pad1);
        }else
          html += this.getSpacing((this.pad1+this.pad2+this.pad3)*1.5);
			}

			// html += ">";
      // if(data.headerSize > 0){
      //   if(data.headerSize != 3)
      //     html += this.getSpacing(this.pad3);
      //   if(data.headerSize != 2)
      //     html += this.getSpacing(this.pad2);
      //   if(data.headerSize != 1)
      //     html += this.getSpacing(this.pad1);
      // }else
      //   html += this.getSpacing((this.pad1+this.pad2+this.pad3)*2);


			//var html = "<" + openTag + "color:"+color+";opacity:"+opacity + ";margin-left:"+data.margin+"px;\" class=\"" + data.lineNumber + "\" onclick=\"onTextClicked(this)\"" + ">";




			var content = data.content;

			var mark = 0;
			var right = data.content;
			if(data.vocab > 0){
				var left = data.content.substring(0, data.vocab).replace(/ /g, "&nbsp;&nbsp;");
				right = data.content.substring(data.vocab+1);

				html += "<b>" + left + "</b> " + data.content.substring(data.vocab, data.vocab+1).replace(/  /g, "&nbsp;&nbsp;") + " ";
				//mark = left.length;
			}
      // else if(data.bold > 0){
      //   var left = data.content.substring(0, data.vocab).replace(/ /g, "&nbsp;&nbsp;");
			// 	right = data.content.substring(data.vocab+1);
      //
			// 	html += "<b>" + left + "</b> " + data.content.substring(data.vocab, data.vocab+1).replace(/  /g, "&nbsp;&nbsp;") + " ";
      // }

			if(data.url.length > 0){
				for(var i = 0; i < data.url.length-1; i+=2){
					if(data.url[i] > data.vocab){
						html += right.substring(mark, data.url[i]).replace(/  /g, "&nbsp;&nbsp;") + "<ins \"\">" + right.substring(data.url[i], data.url[i+1]) + "</ins>";
						mark = data.url[i+1];
					}
				}
				html += right.substring(mark);
			}else
				html += right.replace(/  /g, "&nbsp;&nbsp;");



			html += "</" + closeTag + ">";
		}

	return html;

}

private getSpacing(amount:number):string{
  let result = "";
  for(let i = 0; i < amount; i++)
    result += "&nbsp;";
  return result;
}

public restoreSpacing(){
  this.pad1 = 0;
  this.pad2 = 0;
  this.pad3 = 0;
}


}
