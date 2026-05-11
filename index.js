import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev/joke/";

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs",{
        name: "Your name",
        content: "Waiting for input"
    });
})

const requestCheck = (filter, params) => {
    let endpoint = '';
     const obj = {
        params: {
             blacklistFlags: params
        }
    }

if (filter['jokeType'] === 'Any') {
  endpoint = filter['jokeType'];
  return axios.get(API_URL + endpoint, obj);
} else {
    endpoint = Array.isArray(filter['styles'])? filter['styles'].join(",") : filter['styles'];
    return axios.get(API_URL + endpoint, obj);
}
};

app.post("/submit", async (req, res) => {
    const filterStyle = req.body;
    const blackLists = req.body['blacklist'];
    const params = Array.isArray(blackLists)? blackLists.join(",") : blackLists;

    try{
        const response = await requestCheck(filterStyle, params);
        console.log(response.data);
         res.render("index.ejs", {
            name: "Hi, " + req.body['username'],
            content: response.data.joke || `${response.data.setup}...${response.data.delivery}`
        });
    } catch (error){
        console.error("Failed to make a request: ", error);
    }
});

app.listen(port, () => {
    console.log("http://localhost:3000/",);
});

