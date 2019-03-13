import React, { Component } from "react";
import "./App.css";
import { Bar } from "react-chartjs-2";
import ReactTable from "react-table";
import "react-table/react-table.css";

// const AYLIENTextAPI = require("aylien_textapi");
const _ = require("lodash");
const axios = require("axios");
const Sentiment = require("sentiment");
const cheerio = require("cheerio");
const rp = require("request-promise");
const sentiment = new Sentiment()

export default class Analysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subreddit: "",
      comments0: 0,
      comments1: 0,
      comments2: 0,
      comments3: 0,
      comments4: 0,
      comments5: 0,
      comments6: 0,
      comments7: 0,
      azureScore0: 0,
      azureScore1: 0,
      azureScore2: 0,
      azureScore3: 0,
      azureScore4: 0,
      azureScore5: 0,
      azureScore6: 0,
      azureScore7: 0,
      textAPIScore0: 0,
      textAPIScore1: 0,
      textAPIScore2: 0,
      textAPIScore3: 0,
      textAPIScore4: 0,
      textAPIScore5: 0,
      textAPIScore6: 0,
      textAPIScore7: 0,
      post0: "",
      post1: "",
      post2: "",
      post3: "",
      post4: "",
      post5: "",
      post6: "",
      post7: "",
      postScore0: 0,
      postScore1: 0,
      postScore2: 0,
      postScore3: 0,
      postScore4: 0,
      postScore5: 0,
      postScore6: 0,
      postScore7: 0,
      words0: 0,
      words1: 0,
      words2: 0,
      words3: 0,
      words4: 0,
      words5: 0,
      words6: 0,
      words7: 0,
      finalUrl: ""
    };

    this.setState = this.setState.bind(this);
  }

  componentWillMount() {
    //Define 'getComments' method
    // console.log("hi");
    const getComments = elements => {
      let finalArr = [];
      elements.forEach(el => {
        if (el.data.replies) {
          finalArr.push(getComments(el.data.replies.data.children));
        }
        finalArr.push(el.data.body);
      });
      return finalArr;
    };

      let temp = this.props.url
      let update = temp.replace(/www.reddit.com/gi,"old.reddit.com")
      let final = update.replace(/^reddit.com/gi,"old.reddit.com")

    //Declare options for request-promise scraping call
    rp("https://cors-anywhere.herokuapp.com/" + final,{
      // "accept":
      //   "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      // "accept-encoding": "gzip, deflate, br",
      // "accept-language":
      //   "en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3",
      // "cache-control": "max-age=0",
      // "upgrade-insecure-requests": "1",
      // "user-agent":
      //   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
    })
    .then((response) => {
      let final = cheerio.load(response)
      return final
    })

    //Begins promise chain, returns array of comment URLs
    // rp(options)
      .then($ => {
        let linkArr = [];
        let scoreArr = [];
        $(`a.bylink.comments.may-blank`).attr(
          `href`,
          (i, val) => {
            linkArr.push(val);
          }
        );

        $(`.score.unvoted`).attr(`title`, (i, val) => {
          if (val === undefined){
            scoreArr.push("0")
          }
          else{
          scoreArr.push(val)
          }
        });

        scoreArr = scoreArr.slice(0, 8);
        scoreArr.forEach((score, index) => {
          let key = "postScore" + index;
          let stateObj = {};
          stateObj[key] = score;
          this.setState(stateObj);
        });
        return linkArr.slice(0, 8);
      })
      //For each post, returns .JSON of each link in the array, also sets title
      .then(arr => {
        arr.forEach((str, index) => {
          let strSplit = str.split("/");
          let keyTitle = "post" + index;
          let titleObj = {};
          let title = "/r/" + strSplit[4];
          titleObj["subreddit"] = title;
          let phrase = strSplit[7]
            .replace(/_/g, " ")
            .toLowerCase()
            .split(" ")
            .map(word => {
              return word[0].toUpperCase() + word.substr(1);
            })
            .join(" ");
          titleObj[keyTitle] = phrase;
          this.setState(titleObj);
          // Recursively unnests comments and sets state
                axios
                  .get(str + ".json")
                  .then(res => {
                    const elements = res.data[1].data.children;
                    let str = _.flattenDeep(getComments(elements));
                    str = str.join(" ");
                    let stateObj = {}
                    let commentKey = 'comments' + index
                    stateObj[commentKey] = str.slice(0, 75) + '...'
                    this.setState(stateObj)
                    return str;
                  })
                  //Finds Azure score
                  // .then((str) => {
                  //   let accessKey = "f420e632e0de48a3a32861c44ca66d5d";

                  //   let uri = "eastus.api.cognitive.microsoft.com";
                  //   let pathScore = "/text/analytics/v2.0/sentiment";
                  //   let pathPhrases = "/text/analytics/v2.0/keyPhrases";

                  //   let response_handler_score = response => {
                  //     let bodyScore = "";
                  //     response.on("data", d => {
                  //       bodyScore += d;
                  //       let strScore = bodyScore.substring(23, 30);
                  //       strScore = strScore.replace(/[^\d.-]/g, "");
                  //       let score = Math.round((+strScore - 0.5) * 2000) / 1000 + 0.0001;
                  //       let key = "azureScore" + index;
                  //       let stateObj = {};
                  //       stateObj[key] = score;
                  //       this.setState(stateObj);
                  //     });
                  //     response.on("error", e => {
                  //       console.log("Error: " + e.message);
                  //     });
                  //   };

                  //   let get_sentiments = documents => {
                  //     let bodyScore = JSON.stringify(documents);

                  //     let request_params_score = {
                  //       method: "POST",
                  //       hostname: uri,
                  //       path: pathScore,
                  //       headers: {
                  //         "Ocp-Apim-Subscription-Key": accessKey
                  //       }
                  //     };
                  //     let reqScore = https.request(
                  //       request_params_score,
                  //       response_handler_score
                  //     );
                  //     reqScore.write(bodyScore);
                  //     reqScore.end();
                  //   };
                  //   let documents = {
                  //     documents: [
                  //       { id: "1", language: "en", text: str.substring(0, 5000) }
                  //     ]
                  //   };
                  //   get_sentiments(documents);
                  //   return str;
                  // })
                  //Finds Sliwinski score
                  .then((str) => {
                    let r1 = sentiment.analyze(str)
                    let keyScore = "textAPIScore" + index;
                    let apiObj = {};
                    let score = Math.round(+r1.comparative * 8000) / 1000 + 0.000001;
                    if (Math.abs(score) > 1) {
                      if (score > 1) {
                        score = 1;
                      } else {
                        score = -1;
                      }
                    }
                    apiObj[keyScore] = score;
                    let keyWords = "words" + index;
                    apiObj[keyWords] = r1.tokens.length;
                    console.dir(r1)
                    this.setState(apiObj);
                  });
        });
      });
  }

  render() {
    // let azureAverage =
    //   +(
    //     +this.state.azureScore0 +
    //     +this.state.azureScore1 +
    //     +this.state.azureScore2 +
    //     +this.state.azureScore3 +
    //     +this.state.azureScore4 +
    //     +this.state.azureScore5 +
    //     +this.state.azureScore6 +
    //     +this.state.azureScore7
    //   ) / 8;

    let textAPIAverage =
      +(
        +this.state.textAPIScore0 +
        +this.state.textAPIScore1 +
        +this.state.textAPIScore2 +
        +this.state.textAPIScore3 +
        +this.state.textAPIScore4 +
        +this.state.textAPIScore5 +
        +this.state.textAPIScore6 +
        +this.state.textAPIScore7
      ) / 8;

    let chartData = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, "Average"],
      datasets: [
        // {
        //   label: "Microsoft Azure",
        //   data: [
        //     +this.state.azureScore0 - 0.0001,
        //     +this.state.azureScore1 - 0.0001,
        //     +this.state.azureScore2 - 0.0001,
        //     +this.state.azureScore3 - 0.0001,
        //     +this.state.azureScore4 - 0.0001,
        //     +this.state.azureScore5 - 0.0001,
        //     +this.state.azureScore6 - 0.0001,
        //     +this.state.azureScore7 - 0.0001,
        //     azureAverage
        //   ],
        //   backgroundColor: [
        //     "#00ffff",
        //     "#00ffff",
        //     "#00ffff",
        //     "#00ffff",
        //     "#00ffff",
        //     "#00ffff",
        //     "#00ffff",
        //     "#00ffff",
        //     "blue"
        //   ]
        // },
        {
          label: "Sliwinski / MIT Media Lab",

          data: [
            +this.state.textAPIScore0 - 0.000001,
            +this.state.textAPIScore1 - 0.000001,
            +this.state.textAPIScore2 - 0.000001,
            +this.state.textAPIScore3 - 0.000001,
            +this.state.textAPIScore4 - 0.000001,
            +this.state.textAPIScore5 - 0.000001,
            +this.state.textAPIScore6 - 0.000001,
            +this.state.textAPIScore7 - 0.000001,
            textAPIAverage
          ],
          backgroundColor: [
            "#ffaafa",
            "#ffaafa",
            "#ffaafa",
            "#ffaafa",
            "#ffaafa",
            "#ffaafa",
            "#ffaafa",
            "#ffaafa",
            "red"
          ]
        }
      ]
    };

    let tableColumns = [
      {
        Header: "Post Name",
        accessor: "postName"
      },
      {
        Header: "Karma Score",
        accessor: "karmaScore"
      },
      {
        Header: "Comment Word Count",
        accessor: "words"
      },
      // {
      //   Header: "Microsoft Azure Score",
      //   accessor: "azureScore"
      // },
      {
        Header: "Sliwinski / MIT Media Lab",
        accessor: "textScore"
      }
    ];

    let commentColumns = [
      {
        Header: "ID",
        accessor: "id",
        width: 100
      },
      {
        Header: "Post Title",
        accessor: "postTitle",
        minWidth: 200
      },
      {
        Header: "Beginning of Comment String",
        accessor: "comments",
        minWidth: 400
      }
    ];

    let commentData = [
      {
        id: 1,
        postTitle: this.state.post0,
        comments: this.state.comments0
      },
      {
        id: 2,
        postTitle: this.state.post1,
        comments: this.state.comments1
      },
      {
        id: 3,
        postTitle: this.state.post2,
        comments: this.state.comments2
      },
      {
        id: 4,
        postTitle: this.state.post3,
        comments: this.state.comments3
      },
      {
        id: 5,
        postTitle: this.state.post4,
        comments: this.state.comments4
      },
      {
        id: 6,
        postTitle: this.state.post5,
        comments: this.state.comments5
      },
      {
        id: 7,
        postTitle: this.state.post6,
        comments: this.state.comments6
      },
      {
        id: 8,
        postTitle: this.state.post7,
        comments: this.state.comments7
      }
    ];

    let tableData = [
      {
        postName: this.state.post0,
        karmaScore: this.state.postScore0,
        // words: this.state.words0,
        // azureScore: this.state.azureScore0 - 0.0001,
        textScore: Math.round(this.state.textAPIScore0 * 1000) / 1000
      },
      {
        postName: this.state.post1,
        karmaScore: this.state.postScore1,
        words: this.state.words1,
        // azureScore: this.state.azureScore1 - 0.0001,
        textScore: Math.round(this.state.textAPIScore1 * 1000) / 1000
      },
      {
        postName: this.state.post2,
        karmaScore: this.state.postScore2,
        words: this.state.words2,
        // azureScore: this.state.azureScore2 - 0.0001,
        textScore: Math.round(this.state.textAPIScore2 * 1000) / 1000
      },
      {
        postName: this.state.post3,
        karmaScore: this.state.postScore3,
        words: this.state.words3,
        // azureScore: this.state.azureScore3 - 0.0001,
        textScore: Math.round(this.state.textAPIScore3 * 1000) / 1000
      },
      {
        postName: this.state.post4,
        karmaScore: this.state.postScore4,
        words: this.state.words4,
        // azureScore: this.state.azureScore4 - 0.0001,
        textScore: Math.round(this.state.textAPIScore4 * 1000) / 1000
      },
      {
        postName: this.state.post5,
        karmaScore: this.state.postScore5,
        words: this.state.words5,
        // azureScore: this.state.azureScore5 - 0.0001,
        textScore: Math.round(this.state.textAPIScore5 * 1000) / 1000
      },
      {
        postName: this.state.post6,
        karmaScore: this.state.postScore6,
        words: this.state.words6,
        // azureScore: this.state.azureScore6 - 0.0001,
        textScore: Math.round(this.state.textAPIScore6 * 1000) / 1000
      },
      {
        postName: this.state.post7,
        karmaScore: this.state.postScore7,
        words: this.state.words7,
        // azureScore: this.state.azureScore7 - 0.0001,
        textScore: Math.round(this.state.textAPIScore7 * 1000) / 1000
      }
    ];

    return (
      <div className="App">
        {
        this.state.textAPIScore0 &&
        this.state.textAPIScore1 &&
        this.state.textAPIScore2 ? (
          <div>
            <h3>
              Titles and Comment Threads for Top Posts of {this.state.subreddit}
            </h3>
            <ReactTable
              data={commentData}
              columns={commentColumns}
              defaultPageSize={8}
            />
            <br />
            <h3>
              Sentiment Scores for Comments of Top Posts of{" "}
              {this.state.subreddit}
            </h3>
            <Bar
              data={chartData}
              type={"Bar"}
              className="-striped -highlight"
            />
            <br />
            <h3>
              Scores and Data for Comments of Top Posts of{" "}
              {this.state.subreddit}
            </h3>
            <ReactTable
              data={tableData}
              columns={tableColumns}
              defaultPageSize={8}
            />
          </div>
        ) : (
          <div className="centered">
            <h1>Hold On, We're Going Home...</h1>
            <img alt='snoo-gif' src="http://i0.kym-cdn.com/photos/images/original/000/919/288/57b.gif" />
          </div>
        )}
      </div>
    );
  }
}

