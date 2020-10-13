import React from 'react';
import './App.css';

const List = props => (
  <div>
    {
      props.list.map((item) => {
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

const Search = () => {

  const[searchTerm, setSearchTerm] = React.useState('');

  const handleChange = event => {
    setSearchTerm(event.target.value);
  };
  
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange} />

      <p>Searching for <strong>{searchTerm}</strong></p>
    </div>
  );

};

const App = () => {

  const creatorsList = [
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

  return (

    <div className="App">
      <h1>
        My React Journey
      </h1>
      <Search />

      <hr />

      <List list={creatorsList}/>

    </div>

  );
};

export default App;
