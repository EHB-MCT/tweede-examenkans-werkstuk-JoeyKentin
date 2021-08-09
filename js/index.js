"use strict";

class Article {
	constructor(article) {
		this.UUID = article.UUID;
		this.title = article.title;
		this.content = article.content;
		this.imageURI = article.imageURI;
		this.linkTo = article.linkTo;
		this.publicationDate = article.publicationDate;
		this.likes = article.likes;
	}
}

class Articles {
    Render(){
        async function postData(url='',data ={}) {
            const response = await fetch(url, {
            method:'GET',
            });
        
            return response.json();
        }

        return postData('https://thecrew.cc/news/read.php')
            .then(data => {
				return data.news.map(element => {
					return new Article(element);
				});
            }) 
            .catch((error) => {
                console.log(new Error(error));
            });
    }   
    
    like(uuid) {
		
        let ID = {
            "UUID": [uuid]
        };
		console.log(ID);
		async function postData(url='',data ={}) {
            const response = await fetch(url, {
            method:'POST',// *GET, POST, PUT, DELETE, etc.
			body: JSON.stringify(ID)
            });
			console.log(response);
            return response;
        }
		
		return postData('https://thecrew.cc/news/create.php') 
            .catch((error) => {
                console.log(new Error(error));
            });
    }
}

const articles = new Articles();
console.log(articles.Render());
let articleList = [];
let originalArticleList = [];
let sort = 'desc';
articles.Render().then(
	data => {
		originalArticleList = data;
		articleList = data;
		sortLikes();
		console.log(data);
		renderList(data);		
	}
);

document.getElementById('sortLikes').addEventListener('click', sortLikes);
document.getElementById('search').addEventListener('input', searchArticles);

function renderList(data) {
	let articlesTable = document.getElementById('articlesTable');
	if (articlesTable.childNodes.length > 2) {
		let tBodyToRemove = articlesTable.childNodes[2];
		articlesTable.removeChild(tBodyToRemove);
	}
	let tBody = document.createElement('tbody');
	for (let i = 0; i < data.length; i++) {
		let row = document.createElement('tr');
		let cell = document.createElement('td');
		cell.className = 'title';
		cell.id = data[i].UUID;
		let cellText = document.createTextNode(data[i].title);		
		cell.appendChild(cellText);
		row.appendChild(cell);
		let cell5 = document.createElement('td');
		cell.className = 'publicationDate';
		let cell5Text = document.createTextNode(unixConverter(data[i].publicationDate));		
		cell5.appendChild(cell5Text);
		row.appendChild(cell5);
		let cell2 = document.createElement('td');
		if (data[i].imageURI !== "") {
			let cellImg = document.createElement('img');
			cellImg.src = data[i].imageURI.replace(/"/g,"");
			console.log(data[i].imageURI.replace(/"/g,""));
			cellImg.height = 100;
			cellImg.width = 150;
			cell2.appendChild(cellImg);
		}
		row.appendChild(cell2);
		let cell3 = document.createElement('td');
		let intro = data[i].content.match(/<p>(.*?)<\/p>/)[0];			
		intro =  intro.replace(/<[^>]*>?/gm, '');
		let cellText3 = document.createTextNode(intro);
		cell3.appendChild(cellText3);
		row.appendChild(cell3);		
		let cell4 = document.createElement('td');
		let cellText4 = document.createTextNode(data[i].likes);
		cell4.appendChild(cellText4);
		row.appendChild(cell4);
		tBody.appendChild(row);
	}
	articlesTable.appendChild(tBody);
	document.querySelectorAll('#articlesTable tr td.title')
		.forEach(e => e.addEventListener("click", likeArticle));
}

//https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript

function unixConverter(pubDate) {
    let unix_timestamp = pubDate;
    var date = new Date(unix_timestamp * 1000);
    var day = "0" + date.getDay();
    var month = "0" + monthNumber(date.getMonth());
    var year = "0" + date.getFullYear();
    var formattedTime = day + '/' + month.substr(-2) + '/' + year.substr(-4);
    return formattedTime;
}

//https://www.w3schools.com/jsref/jsref_getmonth.asp
function monthNumber(i) {
    var month = new Array();
month[0] = "01";
month[1] = "02";
month[2] = "03";
month[3] = "04";
month[4] = "05";
month[5] = "06";
month[6] = "07";
month[7] = "08";
month[8] = "09";
month[9] = "10";
month[10] = "11";
month[11] = "12";
var n = month[i];
return n;

}


function sortLikes() {
	if (sortLikes === 'desc') {
		articleList = articleList.sort((a, b) => parseFloat(a.likes) - parseFloat(b.likes));
		originalArticleList = originalArticleList.sort((a, b) => parseFloat(a.likes) - parseFloat(b.likes));
		sortLikes = 'asc';
	} else {
		articleList = articleList.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes));
		originalArticleList = originalArticleList.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes));
		sortLikes = 'desc';
	}
	renderList(articleList);	
}

function searchArticles(event) {
	console.log(event);
	console.log(event.target.value);
	let searchKeyword = event.target.value;
	console.log(searchKeyword);
	articleList = originalArticleList.filter(element => element.title.includes( searchKeyword) || element.content.includes( searchKeyword));
	console.log(articleList);
	renderList(articleList);
}

function likeArticle(event) {
	console.log(event);
	console.log(event.target.id);
	let articleUUID = event.target.id; 
	articles.like(articleUUID);
	 articleList = articleList.map(element => {
		 if (element.UUID == articleUUID) {
			element.likes++;
		 }
		 return element;
	 });
	if (sortLikes = 'asc') {
		articleList = articleList.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes));
	} else {
		articleList = articleList.sort((a, b) => parseFloat(a.likes) - parseFloat(b.likes));
	}
	renderList(articleList);
}
