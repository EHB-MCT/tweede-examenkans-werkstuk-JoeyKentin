"use strict";

class Articles {
    Render(){
        async function postData(url='',data ={}) {
            const response = await fetch(url, {
            method:'GET',// *GET, POST, PUT, DELETE, etc.
            });
        
            return response.json();// parses JSON response into native JavaScript objects
        }
        
        postData('https://thecrew.cc/news/read.php')
            .then(data => {
                 console.log(data);// JSON data parsed by `data.json()` call
            }) 
            .catch((error) => {
                console.log(new Error(error));
            });
    }   
    
    like() {
        
    }
} 