import React from 'react';
import './App.css';

const List = ({ list }) =>
  list.map(item => <Item key={item.objectID} item={item} />);

const Item = ({ item }) => (
  <div>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </div>
);

const Search = (props) => {
  const {onSearch, searchTerm} = props ; 
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={onSearch} value={searchTerm}/>
    </div>
  );
};

const App = () => {

  const[searchTerm, setSearchTerm] = React.useState('React');

  const creatorsList = [
    {
      title: 'React ',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux ',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const searchedCreatorList = creatorsList.filter(creator =>
    creator.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    <div className="App">
      <h1>
        My React Journey
      </h1>
      <Search onSearch={handleSearch} searchTerm={searchTerm} />

      <hr />

      <List list={searchedCreatorList}/>

    </div>

  );
};

export default App;
