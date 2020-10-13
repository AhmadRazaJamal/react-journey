import React from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const List = () => (
  <div>
    {
      list.map((item) => {
        return (
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
          </div>
        );
      })
    }
  </div>
);

const handleChange = event => {
  console.log(event.target.value);
};

const App = () => (
    <div className="App">
      <h1>
        My React Journey
      </h1>

      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange}/>

      <hr />
     
      <List/>
    
    </div>
);

export default App;
