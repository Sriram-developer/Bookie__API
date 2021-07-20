let books = [{
    ISBN: "12345ONE",
    title: "Getting started with NODE",
    authors: [1,2],
    language: "English",
    pubDate: "2021-07-09",
    numofpage: 307,
    category: ["DBMS","programming","web-dev","technologies"],
    publication: 1,

   },
   {
    ISBN: "12345TWO",
    title: "Getting started with REACT",
    authors: [1],
    language: "English",
    pubDate: "2021-07-09",
    numofpage: 307,
    category: ["DBMS","programming","web-dev","technologies"],
    publication: 1,

   },
];
const authors =[{
    id: 1,
    name: "sriram",
    books: ["12345ONE"],
   },
   {
    id: 2,
    name: "Raghul",
    books: ["12345ONE"],
   },
];
const publications =[{
    id:1,
    name: "jersy",
    books: ["12345ONE"],
    
   },
];

module.exports = {books,authors,publications};