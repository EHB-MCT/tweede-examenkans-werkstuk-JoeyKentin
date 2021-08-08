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
            method:'POST',
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

